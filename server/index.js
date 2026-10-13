import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const startPort = Number(process.env.PORT) || 5001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adminPath = (process.env.VITE_ADMIN_PATH || '/academy-admin-7f4c92').replace(/\/+$/, '') || '/academy-admin-7f4c92';
const adminSessionCookie = 'hqa_admin_session';
const adminSessionDuration = 8 * 60 * 60 * 1000;
const adminSessions = new Map();
const adminLoginAttempts = new Map();

app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use((req, res, next) => {
  if (req.path === adminPath || req.path.startsWith('/api/admin/')) {
    res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.set('Cache-Control', 'no-store');
  }
  next();
});

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    whatsappNumber: { type: String, required: true, trim: true, maxlength: 30 },
    country: { type: String, required: true, trim: true, maxlength: 100 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    course: { type: String, required: true, trim: true, maxlength: 100 },
    language: { type: String, required: true, enum: ['English', 'Urdu', 'Pashto'] },
    classType: { type: String, required: true, enum: ['Private Class', 'Family Class'] },
    classPackage: { type: String, required: true, enum: ['Premium Package', 'Golden Package'] },
    preferredJoiningDate: { type: String, required: true, enum: ['1', '10', '20'] },
    preferredClassTime: { type: String, required: true, enum: ['12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-1am'] },
    preferredClassTimeLocal: { type: String, required: true, trim: true, maxlength: 120 },
    preferredClassTimeZone: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, trim: true, maxlength: 1000, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'disapproved'], default: 'pending' },
  },
  { timestamps: true },
);

const teacherApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    whatsappNumber: { type: String, required: true, trim: true, maxlength: 30 },
    country: { type: String, required: true, trim: true, maxlength: 100 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    address: { type: String, required: true, trim: true, maxlength: 500 },
    citizenCardNo: { type: String, required: true, trim: true, maxlength: 30 },
    languages: { type: [String], required: true, validate: (value) => value.length > 0 },
    teachingOptions: { type: [String], required: true, validate: (value) => value.length > 0 },
    photo: { type: String, default: '' },
    message: { type: String, trim: true, maxlength: 1000, default: '' },
    agreementAcceptedAt: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'approved', 'disapproved'], default: 'pending' },
  },
  { timestamps: true },
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
const TeacherApplication = mongoose.model('TeacherApplication', teacherApplicationSchema);

function digest(value) {
  return createHash('sha256').update(value).digest();
}

function safeEqual(left, right) {
  return timingSafeEqual(digest(left), digest(right));
}

function readSessionToken(req) {
  const cookieHeader = req.headers.cookie || '';
  const entry = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${adminSessionCookie}=`));
  return entry ? entry.slice(adminSessionCookie.length + 1) : '';
}

function adminSession(req, res, next) {
  const token = readSessionToken(req);
  if (!token) return res.status(401).json({ error: 'Please log in to access the admin panel.' });
  const sessionId = digest(token).toString('hex');
  const expiresAt = adminSessions.get(sessionId);
  if (!expiresAt || expiresAt <= Date.now()) {
    adminSessions.delete(sessionId);
    return res.status(401).json({ error: 'Your admin session has expired. Please log in again.' });
  }
  return next();
}

function getLoginAttemptState(ip) {
  const now = Date.now();
  let state = adminLoginAttempts.get(ip);
  if (!state || state.resetAt <= now) {
    state = { count: 0, resetAt: now + 15 * 60 * 1000 };
    adminLoginAttempts.set(ip, state);
  }
  return state;
}

app.post('/api/admin/login', (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return res.status(503).json({ error: 'Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD on the server.' });
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const attempts = getLoginAttemptState(ip);
  if (attempts.count >= 10) {
    return res.status(429).json({ error: 'Too many login attempts. Please wait 15 minutes and try again.' });
  }

  const { email, password } = req.body ?? {};
  const validEmail = typeof email === 'string' && safeEqual(email.trim().toLowerCase(), adminEmail.toLowerCase());
  const validPassword = typeof password === 'string' && safeEqual(password, adminPassword);
  if (!validEmail || !validPassword) {
    attempts.count += 1;
    return res.status(401).json({ error: 'Invalid admin email or password.' });
  }

  adminLoginAttempts.delete(ip);
  const token = randomBytes(32).toString('hex');
  const sessionId = digest(token).toString('hex');
  const expiresAt = Date.now() + adminSessionDuration;
  adminSessions.set(sessionId, expiresAt);
  for (const [id, expiry] of adminSessions) {
    if (expiry <= Date.now()) adminSessions.delete(id);
  }
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.set('Set-Cookie', `${adminSessionCookie}=${token}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${adminSessionDuration / 1000}${secure}`);
  return res.json({ authenticated: true });
});

app.get('/api/admin/session', adminSession, (_req, res) => res.json({ authenticated: true }));

app.post('/api/admin/logout', adminSession, (req, res) => {
  const token = readSessionToken(req);
  adminSessions.delete(digest(token).toString('hex'));
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.set('Set-Cookie', `${adminSessionCookie}=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0${secure}`);
  return res.json({ authenticated: false });
});

app.get('/api/admin/inquiries', adminSession, async (_req, res) => {
  if (!process.env.MONGODB_URI?.trim() || mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'The inquiry database is not connected. Configure MONGODB_URI and check the database connection.' });
  }
  try {
    const inquiries = await Inquiry.find({})
      .sort({ createdAt: -1 })
      .select('name email phone whatsappNumber country city course language classType classPackage preferredJoiningDate preferredClassTime preferredClassTimeLocal preferredClassTimeZone message status createdAt')
      .lean();
    return res.json(inquiries.map((inquiry) => ({
      id: inquiry._id.toString(),
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      whatsappNumber: inquiry.whatsappNumber || '',
      country: inquiry.country,
      city: inquiry.city || '',
      course: inquiry.course,
      language: inquiry.language,
      classType: inquiry.classType || '',
      classPackage: inquiry.classPackage || '',
      preferredJoiningDate: inquiry.preferredJoiningDate || '',
      preferredClassTime: inquiry.preferredClassTime || '',
      preferredClassTimeLocal: inquiry.preferredClassTimeLocal || '',
      preferredClassTimeZone: inquiry.preferredClassTimeZone || '',
      message: inquiry.message,
      status: inquiry.status || 'pending',
      createdAt: inquiry.createdAt,
    })));
  } catch (error) {
    console.error('Unable to load admin enquiries:', error);
    return res.status(500).json({ error: 'We could not load enquiries right now. Please try again.' });
  }
});

app.get('/api/admin/teachers', adminSession, async (_req, res) => {
  if (!process.env.MONGODB_URI?.trim() || mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'The teacher database is not connected. Configure MONGODB_URI and check the database connection.' });
  }
  try {
    const teachers = await TeacherApplication.find({})
      .sort({ createdAt: -1 })
      .lean();
    return res.json(teachers.map((teacher) => ({
      id: teacher._id.toString(),
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      whatsappNumber: teacher.whatsappNumber,
      country: teacher.country,
      city: teacher.city,
      address: teacher.address,
      citizenCardNo: teacher.citizenCardNo,
      languages: teacher.languages,
      teachingOptions: teacher.teachingOptions,
      photo: teacher.photo || '',
      message: teacher.message,
      status: teacher.status || 'pending',
      createdAt: teacher.createdAt,
    })));
  } catch (error) {
    console.error('Unable to load admin teacher applications:', error);
    return res.status(500).json({ error: 'We could not load teacher applications right now. Please try again.' });
  }
});

app.patch('/api/admin/:collection/:id/status', adminSession, async (req, res) => {
  const model = { inquiries: Inquiry, teachers: TeacherApplication }[req.params.collection];
  const { status } = req.body ?? {};
  if (!model) return res.status(404).json({ error: 'That admin section was not found.' });
  if (!['pending', 'approved', 'disapproved'].includes(status)) {
    return res.status(400).json({ error: 'Choose pending, approved, or disapproved.' });
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'That record could not be found.' });
  }
  try {
    const record = await model.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }).select('_id status');
    if (!record) return res.status(404).json({ error: 'That record could not be found.' });
    return res.json({ id: record._id.toString(), status: record.status });
  } catch (error) {
    console.error('Unable to update admin review status:', error);
    return res.status(500).json({ error: 'We could not update that review decision.' });
  }
});

app.delete('/api/admin/:collection/:id', adminSession, async (req, res) => {
  const model = { inquiries: Inquiry, teachers: TeacherApplication }[req.params.collection];
  if (!model) return res.status(404).json({ error: 'That admin section was not found.' });
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'That record could not be found.' });
  }
  if (!process.env.MONGODB_URI?.trim() || mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'The admin database is not connected. Please try again when the database is available.' });
  }
  try {
    const record = await model.findOneAndDelete({ _id: req.params.id, status: 'disapproved' }).select('_id');
    if (record) return res.json({ id: record._id.toString(), deleted: true });
    const exists = await model.exists({ _id: req.params.id });
    if (!exists) return res.status(404).json({ error: 'That record could not be found.' });
    return res.status(409).json({ error: 'Only disapproved entries can be deleted from this section.' });
  } catch (error) {
    console.error('Unable to delete disapproved admin entry:', error);
    return res.status(500).json({ error: 'We could not delete that entry right now. Please try again.' });
  }
});

const courses = [
  { id: 'noorani-qaida', title: 'Noorani Qaida', short: 'Learn Arabic letters and Quran reading foundations step by step with a patient teacher.', icon: '﷽', tag: 'QURAN FOUNDATIONS' },
  { id: 'hifz', title: 'Hifz-ul-Quran', short: 'Memorize the Holy Quran with a personal, structured learning plan.', icon: '✦', tag: 'MEMORISATION' },
  { id: 'nazra', title: 'Nazra Quran', short: 'Build confident Quran reading from your very first letter.', icon: 'ا', tag: 'QURAN READING' },
  { id: 'tajweed', title: 'Tajweed & Recitation', short: 'Beautify your recitation with clear, practical Tajweed guidance.', icon: '﷽', tag: 'RECITATION' },
  { id: 'arabic', title: 'Arabic Language', short: 'Understand the language of the Quran, one step at a time.', icon: 'ا', tag: 'LANGUAGE' },
  { id: 'english-language', title: 'English Language Classes', short: 'Build confidence in spoken and written English with supportive lessons.', icon: 'A', tag: 'LANGUAGE' },
  { id: 'urdu-language', title: 'Urdu Language Classes', short: 'Learn to speak, read, and write Urdu at your own pace.', icon: 'ا', tag: 'LANGUAGE' },
  { id: 'pashto-language', title: 'Pashto Language Classes', short: 'Develop your Pashto speaking, reading, and writing skills.', icon: 'پ', tag: 'LANGUAGE' },
  { id: 'islamic-studies-hadith', title: 'Islamic Studies / Hadith', short: 'Explore Islamic beliefs, seerah, duas, and the teachings of Prophet Muhammad (peace be upon him).', icon: '☾', tag: 'FOUNDATIONS' },
  { id: 'tafsir-quran', title: 'Tafsir Quran', short: 'Explore the meanings of the Quran through thoughtful, guided study.', icon: '☾', tag: 'DEEPER STUDY' },
];

const teachers = [
  { name: 'Ustadh Abdullah Khan', experience: '7+ years', languages: ['English', 'Urdu'], credentials: 'Ijazah in Quran · Tajweed certified', image: 'photo-1500648767791-00dcc994a43e', initials: 'AK' },
  { name: 'Ustadh Muhammad Ali', experience: '6+ years', languages: ['English', 'Pashto'], credentials: 'Hafiz-e-Quran · Tajweed certified', image: 'photo-1506794778202-cad84cf45f1d', initials: 'MA' },
  { name: 'Ustadh Ibrahim Siddiqui', experience: '8+ years', languages: ['Urdu', 'Pashto'], credentials: 'Ijazah in Quran · Islamic studies', image: 'photo-1531384441138-2736e62e0919', initials: 'IS' },
];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'not connected' });
});

app.get('/api/courses', (_req, res) => res.json(courses));
app.get('/api/teachers', (_req, res) => res.json(teachers));

app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, whatsappNumber, country, city, course, language, classType, classPackage, preferredJoiningDate, preferredClassTime, preferredClassTimeLocal, preferredClassTimeZone, message = '' } = req.body ?? {};
  if (![name, email, phone, whatsappNumber, country, city, course, language, classType, classPackage, preferredJoiningDate, preferredClassTime, preferredClassTimeLocal, preferredClassTimeZone].every((value) => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ error: 'Please complete all required fields.' });
  }
  if (typeof message !== 'string') {
    return res.status(400).json({ error: 'Please enter valid additional information.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!['English', 'Urdu', 'Pashto'].includes(language)) {
    return res.status(400).json({ error: 'Please choose one of the available learning languages.' });
  }
  if (!['Private Class', 'Family Class'].includes(classType)) {
    return res.status(400).json({ error: 'Please choose Private Class or Family Class.' });
  }
  if (!['Premium Package', 'Golden Package'].includes(classPackage)) {
    return res.status(400).json({ error: 'Please choose Premium Package or Golden Package.' });
  }
  if (!['1', '10', '20'].includes(preferredJoiningDate)) {
    return res.status(400).json({ error: 'Please choose a preferred joining date.' });
  }
  if (!['12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-1am'].includes(preferredClassTime)) {
    return res.status(400).json({ error: 'Please choose a preferred class time.' });
  }
  if (preferredClassTimeLocal.length > 120 || preferredClassTimeZone.length > 100) {
    return res.status(400).json({ error: 'Please choose a valid local time zone.' });
  }
  try {
    new Intl.DateTimeFormat('en', { timeZone: preferredClassTimeZone });
  } catch {
    return res.status(400).json({ error: 'Please choose a valid local time zone.' });
  }
  if (!process.env.MONGODB_URI?.trim()) {
    return res.status(503).json({ error: 'The academy enquiry form is not connected yet. Please contact us on WhatsApp or add your MongoDB connection string to .env.' });
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'The enquiry service cannot reach its database right now. Please try again shortly or contact us on WhatsApp.' });
  }
  try {
    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim(),
      country: country.trim(),
      city: city.trim(),
      course: course.trim(),
      language,
      classType,
      classPackage,
      preferredJoiningDate,
      preferredClassTime,
      preferredClassTimeLocal: preferredClassTimeLocal.trim(),
      preferredClassTimeZone: preferredClassTimeZone.trim(),
      message: message.trim(),
    });
    return res.status(201).json({ message: 'Your trial request has been received. We will be in touch soon.', id: inquiry.id });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: 'Please check your details and try again.' });
    }
    console.error('Unable to save trial enquiry:', error);
    return res.status(500).json({ error: 'We could not save your request right now. Please try again or contact us on WhatsApp.' });
  }
});

app.post('/api/teachers/apply', async (req, res) => {
  const { name, email, phone, whatsappNumber, country, city, address, citizenCardNo, languages, teachingOptions, photo, message = '', agreementAccepted } = req.body ?? {};
  const requiredValues = [name, email, phone, whatsappNumber, country, city, address, citizenCardNo];
  if (!requiredValues.every((value) => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ error: 'Please complete all required teacher details.' });
  }
  if (!Array.isArray(languages) || languages.length === 0 || !Array.isArray(teachingOptions) || teachingOptions.length === 0) {
    return res.status(400).json({ error: 'Please select at least one language and one teaching option.' });
  }
  if (agreementAccepted !== true) {
    return res.status(400).json({ error: 'Please agree to the academy information before submitting your application.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!process.env.MONGODB_URI?.trim()) {
    return res.status(503).json({ error: 'The teacher application form is not connected yet. Please add your MongoDB connection string to .env.' });
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'The teacher service cannot reach its database right now. Please try again shortly.' });
  }

  try {
    const teacher = await TeacherApplication.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim(),
      country: country.trim(),
      city: city.trim(),
      address: address.trim(),
      citizenCardNo: citizenCardNo.trim(),
      languages: languages.map((item) => String(item).trim()).filter(Boolean),
      teachingOptions: teachingOptions.map((item) => String(item).trim()).filter(Boolean),
      photo: typeof photo === 'string' ? photo : '',
      message: message.trim(),
      agreementAcceptedAt: new Date(),
    });

    return res.status(201).json({ message: 'Your teacher application has been received. We will contact you shortly.', id: teacher.id });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: 'Please check your details and try again.' });
    }
    console.error('Unable to save teacher application:', error);
    return res.status(500).json({ error: 'We could not save your application right now. Please try again.' });
  }
});

app.use((error, req, res, next) => {
  if (!req.path.startsWith('/api/')) return next(error);
  const status = Number.isInteger(error.status) ? error.status : 400;
  const message = status === 413
    ? 'The submitted data is too large. Please use an image smaller than 5 MB.'
    : 'We could not read the submitted data. Please check the form and try again.';
  return res.status(status).json({ error: message });
});

function getPublicSiteOrigin(req) {
  const configuredSiteUrl = process.env.SITE_URL?.trim();
  const origin = new URL(configuredSiteUrl || `${req.protocol}://${req.get('host')}`);
  if (!['http:', 'https:'].includes(origin.protocol) || origin.username || origin.password) {
    throw new Error('SITE_URL must be a valid public HTTP or HTTPS origin.');
  }
  return origin.origin;
}

app.get('/robots.txt', (req, res) => {
  try {
    const origin = getPublicSiteOrigin(req);
    return res.type('text/plain').send([
      'User-agent: *',
      'Allow: /',
      'Disallow: /api/',
      `Disallow: ${adminPath}`,
      `Sitemap: ${origin}/sitemap.xml`,
      '',
    ].join('\n'));
  } catch (error) {
    console.error('Unable to generate robots.txt:', error);
    return res.status(500).type('text/plain').send('Unable to generate crawler directives.');
  }
});

app.get('/sitemap.xml', (req, res) => {
  try {
    const origin = getPublicSiteOrigin(req);
    const publicPaths = ['/', '/courses', '/teachers', '/about', '/fees', '/contact'];
    const urls = publicPaths.map((pathname) => `  <url><loc>${origin}${pathname}</loc></url>`).join('\n');
    return res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
  } catch (error) {
    console.error('Unable to generate sitemap.xml:', error);
    return res.status(500).type('text/plain').send('Unable to generate the sitemap.');
  }
});

const clientDist = path.resolve(__dirname, '../dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path === adminPath) res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  if (req.path.startsWith('/api/')) return next();
  return res.sendFile(path.join(clientDist, 'index.html'), (error) => {
    if (error) next();
  });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`One Ummah Quran Learning API listening on http://localhost:${port}`);
    if (process.env.MONGODB_URI?.trim()) {
      mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB connected'))
        .catch((error) => console.error('MongoDB connection failed:', error.message));
    } else {
      console.warn('MONGODB_URI is empty. Trial enquiries will not be stored until it is configured.');
    }
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
      return;
    }
    throw error;
  });
}

startServer(startPort);
