import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, Clock3,
  Globe2, GraduationCap, Heart, Mail, Menu, Play, ShieldCheck, Sparkles, Volume2, VolumeX,
  Trash2, UsersRound, Video, X,
} from 'lucide-react';
import heroVideo from '../shiekh zayid mosque video.mp4';

const EMAIL = 'oneummahquranlearning@gmail.com';
const PHONE = '+92 308 2688883';
const WHATSAPP_NUMBER = '923082688883';
const STUDENT_WHATSAPP = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('I want more details. Thanks.')}`;
const TEACHER_WHATSAPP = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('I wanna join as a teacher. Thanks.')}`;
const ADMIN_PATH = (import.meta.env.VITE_ADMIN_PATH || '/academy-admin-7f4c92').replace(/\/+$/, '') || '/academy-admin-7f4c92';
const BASE_LANGUAGES = ['English', 'Urdu', 'Arabic', 'Pashto'];
const ADDITIONAL_TEACHING_OPTIONS = ['Quran Reading', 'Islamic Studies / Hadith'];
const COUNTRY_CODES = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
const COUNTRIES = COUNTRY_CODES
  .map((code) => countryNames.of(code))
  .sort((left, right) => left.localeCompare(right));
const PAKISTAN_TIME_ZONE = 'Asia/Karachi';
const JOINING_DATE_OPTIONS = [
  { value: '1', label: '1st of the month' },
  { value: '10', label: '10th of the month' },
  { value: '20', label: '20th of the month' },
];
const CLASS_TIME_SLOTS = [
  { value: '12pm-3pm', label: '12 PM–3 PM', startHour: 12, endHour: 15 },
  { value: '3pm-6pm', label: '3 PM–6 PM', startHour: 15, endHour: 18 },
  { value: '6pm-9pm', label: '6 PM–9 PM', startHour: 18, endHour: 21 },
  { value: '9pm-1am', label: '9 PM–1 AM', startHour: 21, endHour: 1 },
];
const USD_TO_GBP_RATE = 0.75641;
const USD_TO_GBP_RATE_DATE = '9 October 2026';
const FEE_CLASS_TYPES = [
  { id: 'Private Class', title: 'Private Class', detail: 'One-on-one with a teacher' },
  { id: 'Family Class', title: 'Family Class', detail: 'For 3–6 family members' },
];
const FEE_PACKAGES = [
  { id: 'Premium Package', title: 'Premium Package', detail: '4 classes per week · Monday through Thursday' },
  { id: 'Golden Package', title: 'Golden Package', detail: '6 classes per week · Monday through Saturday' },
];
const FEE_COURSES = [
  {
    id: 'qaida-nazra',
    label: 'Noorani Qaida & Nazra',
    title: 'Noorani Qaida and Nazra Quran',
    prices: {
      'Private Class': { 'Premium Package': { sale: 45, regular: 60 }, 'Golden Package': { sale: 55, regular: 75 } },
      'Family Class': { 'Premium Package': { sale: 65, regular: 80 }, 'Golden Package': { sale: 85, regular: 110 } },
    },
  },
  {
    id: 'hifz',
    label: 'Hifz',
    title: 'Hifz-ul-Quran',
    prices: {
      'Private Class': { 'Premium Package': { sale: 60, regular: 80 }, 'Golden Package': { sale: 70, regular: 90 } },
      'Family Class': { 'Premium Package': { sale: 90, regular: 130 }, 'Golden Package': { sale: 110, regular: 160 } },
    },
  },
  {
    id: 'studies',
    label: 'Islamic Studies / Hadith',
    title: 'Islamic Studies / Hadith',
    prices: {
      'Private Class': { 'Premium Package': { sale: 45, regular: 60 }, 'Golden Package': { sale: 55, regular: 75 } },
      'Family Class': { 'Premium Package': { sale: 60, regular: 85 }, 'Golden Package': { sale: 70, regular: 100 } },
    },
  },
  {
    id: 'tafsir',
    label: 'Tafsir Quran',
    title: 'Tafsir Quran',
    prices: {
      'Private Class': { 'Premium Package': { sale: 55, regular: 85 }, 'Golden Package': { sale: 70, regular: 100 } },
      'Family Class': { 'Premium Package': { sale: 70, regular: 100 }, 'Golden Package': { sale: 90, regular: 120 } },
    },
  },
  {
    id: 'languages',
    label: 'Language',
    title: 'Language Classes',
    subjects: 'Arabic · English · Urdu · Pashto',
    prices: {
      'Private Class': { 'Premium Package': { sale: 60, regular: 80 }, 'Golden Package': { sale: 70, regular: 90 } },
      'Family Class': { 'Premium Package': { sale: 90, regular: 130 }, 'Golden Package': { sale: 110, regular: 160 } },
    },
  },
  {
    id: 'tajweed-recitation',
    label: 'Tajweed & Recitation',
    title: 'Tajweed & Recitation',
    prices: {
      'Private Class': { 'Premium Package': { sale: 55, regular: 75 }, 'Golden Package': { sale: 65, regular: 90 } },
      'Family Class': { 'Premium Package': { sale: 80, regular: 120 }, 'Golden Package': { sale: 100, regular: 140 } },
    },
  },
];
function convertUsdToGbp(amount) {
  return Math.round(amount * USD_TO_GBP_RATE);
}
function getClassDuration(courseTitle, classType) {
  const courseName = courseTitle.toLowerCase();
  const isFamily = classType === 'Family Class';

  if (isFamily) {
    if (courseName.includes('qaida') || courseName.includes('nazra')) return '1 hour–1 hour 15 minutes';
    if (courseName.includes('hifz')) return '1 hour–1 hour 30 minutes';
    if (courseName.includes('islamic studies') || courseName.includes('hadith') || courseName.includes('tafsir') || courseName.includes('tafseer')) return '30–45 minutes';
    if (courseName.includes('language')) return '30–60 minutes';
    return '1 hour–1 hour 30 minutes';
  }

  if (courseName.includes('hifz')) return '1 hour–1 hour 15 minutes';
  if (courseName.includes('language')) return '30 minutes–1 hour';
  return '30–45 minutes';
}
function getClassTypeDetail(courseTitle, classType) {
  const classOption = FEE_CLASS_TYPES.find((option) => option.id === classType);
  if (!classOption) throw new Error(`Unknown class type: ${classType}`);
  return `${classOption.detail} · ${getClassDuration(courseTitle, classType)}`;
}
function getNextPakistanDate(dayOfMonth) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: PAKISTAN_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(parts.map(({ type, value }) => [type, Number(value)]));
  let year = dateParts.year;
  let month = dateParts.month;
  if (dayOfMonth <= dateParts.day) {
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return { year, month, day: dayOfMonth };
}
function getUtcDateForZonedTime(date, hour, timeZone) {
  const desiredWallTime = Date.UTC(date.year, date.month - 1, date.day, hour);
  let timestamp = desiredWallTime;
  const formatter = new Intl.DateTimeFormat('en', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  });

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(timestamp)).map(({ type, value }) => [type, Number(value)]));
    const representedWallTime = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
    const difference = desiredWallTime - representedWallTime;
    if (difference === 0) break;
    timestamp += difference;
  }
  return new Date(timestamp);
}
function getLocalTimeSlotLabel(slot, joiningDay, timeZone) {
  const pakistanDate = getNextPakistanDate(Number(joiningDay) || 1);
  const start = getUtcDateForZonedTime(pakistanDate, slot.startHour, timeZone);
  const endDate = slot.endHour <= slot.startHour
    ? new Date(Date.UTC(pakistanDate.year, pakistanDate.month - 1, pakistanDate.day + 1))
    : new Date(Date.UTC(pakistanDate.year, pakistanDate.month - 1, pakistanDate.day));
  const end = getUtcDateForZonedTime({
    year: endDate.getUTCFullYear(),
    month: endDate.getUTCMonth() + 1,
    day: endDate.getUTCDate(),
  }, slot.endHour, timeZone);
  const localDateFormatter = new Intl.DateTimeFormat('en', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const localTimeFormatter = new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  });
  const timeZoneFormatter = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'short' });
  const dateKey = (value) => {
    const parts = Object.fromEntries(localDateFormatter.formatToParts(value).map(({ type, value: partValue }) => [type, partValue]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  };
  const shiftLabel = (value, expectedDate) => {
    const difference = Math.round((Date.parse(`${dateKey(value)}T00:00:00Z`) - Date.parse(`${expectedDate}T00:00:00Z`)) / 86400000);
    if (difference === -1) return ' (previous day)';
    if (difference === 1) return ' (next day)';
    return '';
  };
  const pakistanDateKey = `${pakistanDate.year}-${String(pakistanDate.month).padStart(2, '0')}-${String(pakistanDate.day).padStart(2, '0')}`;
  const pakistanEndDate = `${endDate.getUTCFullYear()}-${String(endDate.getUTCMonth() + 1).padStart(2, '0')}-${String(endDate.getUTCDate()).padStart(2, '0')}`;
  const timeZoneName = timeZoneFormatter.formatToParts(start).find(({ type }) => type === 'timeZoneName')?.value || timeZone;
  return `${localTimeFormatter.format(start)}${shiftLabel(start, pakistanDateKey)}–${localTimeFormatter.format(end)}${shiftLabel(end, pakistanEndDate)} (${timeZoneName})`;
}
const fallbackCourses = [
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
const fallbackTeachers = [
  { name: 'Ustadh Abdullah Khan', experience: '7+ years', languages: ['English', 'Urdu'], credentials: 'Ijazah in Quran · Tajweed certified', image: 'photo-1500648767791-00dcc994a43e', initials: 'AK' },
  { name: 'Ustadh Muhammad Ali', experience: '6+ years', languages: ['English', 'Pashto'], credentials: 'Hafiz-e-Quran · Tajweed certified', image: 'photo-1506794778202-cad84cf45f1d', initials: 'MA' },
  { name: 'Ustadh Ibrahim Siddiqui', experience: '8+ years', languages: ['Urdu', 'Pashto'], credentials: 'Ijazah in Quran · Islamic studies', image: 'photo-1531384441138-2736e62e0919', initials: 'IS' },
];
const photo = (id, width = 520) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const HOME_COURSE_ARTWORK = {
  'noorani-qaida': { src: photo('photo-1634630487525-84df162e5305', 180), alt: 'Arabic-script page for Noorani Qaida practice' },
  hifz: { src: photo('photo-1596125160970-6f02eeba00d3', 180), alt: 'Quran on a wooden stand for memorization' },
  nazra: { src: photo('photo-1616422840391-fa670d4b2ae7', 180), alt: 'Open Quran with prayer beads for Nazra reading' },
  tajweed: { src: photo('photo-1575645513913-c002ea3b2e01', 180), alt: 'Muslim reading Quran for Tajweed practice' },
  arabic: { src: photo('photo-1624357824434-27d181804b20', 180), alt: 'Arabic Quran text for Arabic language study' },
  'english-language': { src: photo('photo-1455390582262-044cdead277a', 180), alt: 'Pen and lined paper for English writing practice' },
  'urdu-language': { src: photo('photo-1725108590884-5a9d69f20b96', 180), alt: 'Notebooks with Urdu-style Arabic-script writing' },
  'pashto-language': { src: photo('photo-1710010966055-da0bcafdbd8c', 180), alt: 'Handwriting practice for Pashto lessons' },
  'islamic-studies-hadith': { src: photo('photo-1720873160840-d5934323bb23', 180), alt: 'Book and prayer beads for Islamic studies and Hadith' },
  'tafsir-quran': { src: photo('photo-1609599006353-e629aaabfeae', 180), alt: 'Open Quran for Tafsir study' },
};
const COURSE_ICON_OVERRIDES = { 'noorani-qaida': '﷽', nazra: 'ا', 'tafsir-quran': '☾' };

function Brand({ light = false }) {
  return <a className={`brand${light ? ' brand-light' : ''}`} href="/" aria-label="One Ummah Quran Learning home">
    <span className="brand-mark"><BookOpen size={26} strokeWidth={1.45} /><span>✦</span></span>
    <span className="brand-name"><span className="brand-title">One Ummah</span><span className="brand-subtitle">Quran Learning</span></span>
  </a>;
}

function CourseEnrollmentModal({ open, onClose, course, initialClassType = '', initialPackage = '' }) {
  const [classType, setClassType] = useState(initialClassType);
  const [classPackage, setClassPackage] = useState(initialPackage);
  const [preferredJoiningDate, setPreferredJoiningDate] = useState('');
  const [timeZone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || PAKISTAN_TIME_ZONE);
  const courseName = course.toLowerCase();
  const learningLanguages = courseName.includes('tafsir')
    ? ['Urdu', 'Pashto']
    : /noorani qaida|hifz|nazra|tajweed|recitation/.test(courseName)
      ? ['English', 'Urdu', 'Pashto', 'Arabic']
      : ['English', 'Urdu', 'Pashto'];
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (open) {
      setClassType(initialClassType);
      setClassPackage(initialPackage);
      setPreferredJoiningDate('');
      setShowForm(false);
      setStatus('idle');
      setFeedback('');
    }
  }, [open, course, initialClassType, initialPackage]);

  async function submit(event) {
    event.preventDefault();
    setStatus('loading');
    setFeedback('');
    const form = new FormData(event.currentTarget);
    const selectedClassTime = CLASS_TIME_SLOTS.find((slot) => slot.value === form.get('preferredClassTime'));
    const payload = {
      name: form.get('name')?.toString().trim(),
      email: form.get('email')?.toString().trim(),
      phone: form.get('phone')?.toString().trim(),
      whatsappNumber: form.get('whatsappNumber')?.toString().trim(),
      country: form.get('country')?.toString().trim(),
      city: form.get('city')?.toString().trim(),
      course,
      language: form.get('language')?.toString(),
      classType,
      classPackage,
      preferredJoiningDate: form.get('preferredJoiningDate')?.toString(),
      preferredClassTime: selectedClassTime?.value,
      preferredClassTimeLocal: selectedClassTime
        ? getLocalTimeSlotLabel(selectedClassTime, preferredJoiningDate, timeZone)
        : '',
      preferredClassTimeZone: timeZone,
      message: form.get('message')?.toString().trim() || '',
    };

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('The enquiry service returned an unexpected response. Please refresh the page and try again.');
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We could not submit your request.');
      setStatus('success');
      setFeedback(result.message);
    } catch (error) {
      setStatus('error');
      setFeedback(error.message || 'Unable to reach the academy right now. Please try again.');
    }
  }

  if (!open) return null;

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="trial-modal course-enrollment-modal" role="dialog" aria-modal="true" aria-labelledby="course-enrollment-title">
      <button className="icon-button modal-close" onClick={onClose} aria-label="Close course enquiry"><X size={21} /></button>
      {status === 'success' ? <div className="success-state">
        <span className="success-icon"><Check size={30} /></span>
        <span className="eyebrow">REQUEST RECEIVED</span>
        <h2 id="course-enrollment-title">Thank you for your interest.</h2>
        <p>{feedback}</p>
      </div> : <>
        <span className="eyebrow">YOUR LEARNING PLAN</span>
        <h2 id="course-enrollment-title">{showForm ? 'Tell us about yourself.' : course}</h2>
        {showForm ? <>
          <p className="modal-intro">Requesting: {classType} · {classPackage}. Share your details and our team will be in touch.</p>
          <form className="trial-form" onSubmit={submit}>
            <label>Your name<input name="name" autoComplete="name" placeholder="Full name" required maxLength="100" /></label>
            <div className="form-row">
              <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength="254" /></label>
              <label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="0308 2688883" required maxLength="30" /></label>
            </div>
            <div className="form-row">
              <label>WhatsApp number<input name="whatsappNumber" type="tel" autoComplete="tel" placeholder="+1 555 123 4567" required maxLength="30" /></label>
              <label>Country of residence<select name="country" autoComplete="country-name" defaultValue="" required>
              <option value="" disabled>Select country</option>{COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
              </select></label>
            </div>
            <label>City<input name="city" autoComplete="address-level2" placeholder="City" required maxLength="100" /></label>
            <label>Learning language<select name="language" defaultValue="" required>
              <option value="" disabled>Select language</option>{learningLanguages.map((language) => <option key={language}>{language}</option>)}
            </select></label>
            <div className="form-row">
              <label>Preferred joining date<select name="preferredJoiningDate" value={preferredJoiningDate} onChange={(event) => setPreferredJoiningDate(event.target.value)} required>
                <option value="" disabled>Choose a date</option>{JOINING_DATE_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select></label>
              <label>Preferred class time<select name="preferredClassTime" defaultValue="" required>
                <option value="" disabled>Choose a time</option>{CLASS_TIME_SLOTS.map((slot) => <option key={slot.value} value={slot.value}>{getLocalTimeSlotLabel(slot, preferredJoiningDate, timeZone)}</option>)}
              </select><span className="optional">Shown in your local time ({timeZone}); schedule times are based on Pakistan time.</span></label>
            </div>
            <label>Additional information <span className="optional">(optional)</span><textarea name="message" rows="3" placeholder="Anything else you would like us to know?" maxLength="1000" /></label>
            {feedback && <p className={`form-feedback ${status}`} role="alert">{feedback}</p>}
            <button className="button button-primary submit-button" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending your request…' : 'Send my request'} <ArrowRight size={17} />
            </button>
            <p className="form-privacy"><ShieldCheck size={14} /> Your details are kept private and only reviewed by the academy admin team.</p>
          </form>
          <button className="course-selection-back" type="button" onClick={() => { setShowForm(false); setStatus('idle'); setFeedback(''); }}>Back to class and package choices</button>
        </> : <>
          <p className="modal-intro">Choose your class type and weekly package to continue.</p>
          <fieldset className="course-choice-group">
            <legend>1. Choose a class type</legend>
            <label className={`course-choice${classType === 'Private Class' ? ' selected' : ''}`}>
              <input type="radio" name="classType" value="Private Class" checked={classType === 'Private Class'} onChange={(event) => setClassType(event.target.value)} />
              <span><strong>Private Class</strong><small>{getClassTypeDetail(course, 'Private Class')}</small></span>
            </label>
            <label className={`course-choice${classType === 'Family Class' ? ' selected' : ''}`}>
              <input type="radio" name="classType" value="Family Class" checked={classType === 'Family Class'} onChange={(event) => setClassType(event.target.value)} />
              <span><strong>Family Class</strong><small>{getClassTypeDetail(course, 'Family Class')}</small></span>
            </label>
          </fieldset>
          {classType && <fieldset className="course-choice-group">
            <legend>2. Choose a weekly package</legend>
            <label className={`course-choice${classPackage === 'Premium Package' ? ' selected' : ''}`}>
              <input type="radio" name="classPackage" value="Premium Package" checked={classPackage === 'Premium Package'} onChange={(event) => setClassPackage(event.target.value)} />
              <span><strong>Premium Package</strong><small>4 classes per week · Monday through Thursday</small></span>
            </label>
            <label className={`course-choice${classPackage === 'Golden Package' ? ' selected' : ''}`}>
              <input type="radio" name="classPackage" value="Golden Package" checked={classPackage === 'Golden Package'} onChange={(event) => setClassPackage(event.target.value)} />
              <span><strong>Golden Package</strong><small>6 classes per week · Monday through Saturday</small></span>
            </label>
          </fieldset>}
          <button className="button button-primary submit-button" type="button" disabled={!classType || !classPackage} onClick={() => setShowForm(true)}>
            Fill the form <ArrowRight size={17} />
          </button>
        </>}
      </>}
    </section>
  </div>;
}

function TeacherApplicationModal({ open, onClose, courses }) {
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState('details');
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState(['English']);
  const [selectedTeachingOptions, setSelectedTeachingOptions] = useState(['Quran Reading']);
  const formRef = useRef(null);
  const teachingOptions = [...new Set([...courses.map((course) => course.title), ...ADDITIONAL_TEACHING_OPTIONS])];

  useEffect(() => {
    if (open) {
      setStatus('idle');
      setFeedback('');
      setStep('details');
      setAgreementAccepted(false);
      setSelectedLanguages(['English']);
      setSelectedTeachingOptions(['Quran Reading']);
    }
  }, [open]);

  function toggleArrayItem(list, item, setter) {
    setter(list.includes(item) ? list.filter((value) => value !== item) : [...list, item]);
  }

  function continueToAgreement(event) {
    event.preventDefault();
    setStep('agreement');
    setFeedback('');
  }

  async function submitApplication() {
    if (!agreementAccepted) return;
    const form = formRef.current;
    if (!form) {
      setStatus('error');
      setFeedback('The teacher application form is unavailable. Please refresh the page and try again.');
      return;
    }

    setStatus('loading');
    setFeedback('');

    const formData = new FormData(form);
    const photoFile = formData.get('photo');

    const readAsDataUrl = (file) => new Promise((resolve, reject) => {
      if (!file || !(file instanceof File) || file.size === 0) return resolve('');
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Could not read your photo. Please try another image.'));
      reader.readAsDataURL(file);
    });

    try {
      if (photoFile instanceof File && photoFile.size > 5 * 1024 * 1024) {
        throw new Error('Please choose an image smaller than 5 MB.');
      }
      const photo = await readAsDataUrl(photoFile);
      const payload = {
        name: formData.get('name')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        phone: formData.get('phone')?.toString().trim(),
        whatsappNumber: formData.get('whatsappNumber')?.toString().trim(),
        country: formData.get('country')?.toString().trim(),
        city: formData.get('city')?.toString().trim(),
        address: formData.get('address')?.toString().trim(),
        citizenCardNo: formData.get('citizenCardNo')?.toString().trim(),
        languages: selectedLanguages,
        teachingOptions: selectedTeachingOptions,
        photo,
        message: formData.get('message')?.toString().trim() || '',
        agreementAccepted: true,
      };

      const response = await fetch('/api/teachers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('The application service returned an unexpected response. Please refresh the page and try again.');
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We could not submit your application.');
      setStatus('success');
      setFeedback(result.message);
    } catch (error) {
      setStatus('error');
      setFeedback(error.message || 'Unable to reach the academy right now. Please try again.');
    }
  }

  if (!open) return null;

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="trial-modal teacher-modal" role="dialog" aria-modal="true" aria-labelledby="teacher-title">
      <button className="icon-button modal-close" onClick={onClose} aria-label="Close teacher form"><X size={21} /></button>
      {status === 'success' ? <div className="success-state">
        <span className="success-icon"><Check size={30} /></span>
        <span className="eyebrow">APPLICATION RECEIVED</span>
        <h2 id="teacher-title">Thank you for joining us.</h2>
        <p>{feedback}</p>
        <a className="button button-primary" href={TEACHER_WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp <ArrowRight size={17} /></a>
      </div> : <>
        <span className="eyebrow">JOIN OUR TEAM</span>
        <h2 id="teacher-title">Become a teacher</h2>
        <p className="modal-intro">{step === 'details' ? 'Share your details so we can review your application and match you with students.' : 'Please read the information below and confirm your agreement before sending your application.'}</p>
        <form ref={formRef} className="trial-form teacher-form" onSubmit={continueToAgreement}>
          <div hidden={step !== 'details'}>
          <label>Your name<input name="name" autoComplete="name" placeholder="Full name" required maxLength="100" /></label>
          <div className="form-row">
            <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength="254" /></label>
            <label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="0308 2688883" required maxLength="30" /></label>
          </div>
          <div className="form-row">
            <label>WhatsApp number<input name="whatsappNumber" type="tel" autoComplete="tel" placeholder="0308 2688883" required maxLength="30" /></label>
            <label>Citizen card no.<input name="citizenCardNo" autoComplete="off" placeholder="CNIC / ID number" required maxLength="30" /></label>
          </div>
          <div className="form-row">
            <label>Country<select name="country" autoComplete="country-name" defaultValue="" required>
              <option value="" disabled>Select country</option>{COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
            </select></label>
            <label>City<input name="city" autoComplete="address-level2" placeholder="City" required maxLength="100" /></label>
          </div>
          <label>Address<textarea name="address" rows="3" placeholder="Street / area / full address" required maxLength="500" /></label>
          <div className="checkbox-group">
            <span className="section-label">Select languages you can teach</span>
            <details className="multi-select">
              <summary>{selectedLanguages.length ? `${selectedLanguages.length} selected: ${selectedLanguages.join(', ')}` : 'Choose languages'} <ChevronDown size={15} /></summary>
              <div className="multi-select-options">{BASE_LANGUAGES.map((language) => <label key={language}><input type="checkbox" checked={selectedLanguages.includes(language)} onChange={() => toggleArrayItem(selectedLanguages, language, setSelectedLanguages)} /> <span>{language}</span></label>)}</div>
            </details>
          </div>
          <div className="checkbox-group">
            <span className="section-label">Teaching courses</span>
            <details className="multi-select">
              <summary>{selectedTeachingOptions.length ? `${selectedTeachingOptions.length} selected: ${selectedTeachingOptions.join(', ')}` : 'Choose teaching courses'} <ChevronDown size={15} /></summary>
              <div className="multi-select-options">{teachingOptions.map((option) => <label key={option}><input type="checkbox" checked={selectedTeachingOptions.includes(option)} onChange={() => toggleArrayItem(selectedTeachingOptions, option, setSelectedTeachingOptions)} /> <span>{option}</span></label>)}</div>
            </details>
          </div>
          <label>Upload your picture<input name="photo" type="file" accept="image/*" /></label>
          <label>Tell us what you want to teach <span className="optional">(optional)</span><textarea name="message" rows="3" placeholder="Describe your teaching experience, availability, and what you would like to teach..." maxLength="1000" /></label>
          </div>
          {step === 'agreement' && <section className="teacher-agreement" aria-labelledby="teacher-agreement-title">
            <h3 id="teacher-agreement-title">Teacher Rules and Policies</h3>
            <p>Please read and agree to the following rules before submitting your application:</p>
            <ul>
              <li><strong>Female teachers — no recording or uploading class videos:</strong> Female teachers must not record or upload student class videos. A violation will result in permanent account termination, no future interviews, and a lifetime ban from teaching on the website. The company may take any additional action it considers necessary.</li>
              <li><strong>Profit sharing:</strong> Profit earned from classes is divided as follows: 30% to the website and 70% to the teacher.</li>
              <li><strong>No direct deals with students:</strong> Teachers must not ask students to cancel website classes, take lessons directly at a lower price, or arrange off-platform classes for students’ friends or relatives. If a violation is reported or confirmed, the teacher’s account will be permanently banned. The company may also withhold the teacher’s entire payment for classes taught that month, impose additional financial penalties, or take further action it considers necessary.</li>
              <li><strong>Male teachers — class recordings and complaints:</strong> Male teachers are encouraged to record every class and send recordings to the official WhatsApp number, either as video files or directly as videos. Sending recordings is optional. If a student files a complaint and no recording is available, management may consider the complaint based on available evidence. Depending on the circumstances, the company may issue a penalty, terminate classes before the course ends, permanently suspend the teacher’s website account, deduct an appropriate amount from the teacher’s payment, or take other reasonable action deemed necessary by management.</li>
              <li><strong>Advance payment and teacher payment:</strong> Students must pay 50% of the total course fee in advance before classes begin. If a student pays only the 50% advance, attends classes, then discontinues without paying the remaining balance, the teacher will receive only the amount actually collected from that student. No additional payment will be made for the unpaid balance.</li>
              <li><strong>Punctuality and absences:</strong> Teachers who fail to start classes on time or miss scheduled classes may face a deduction of $2–$5 per day, depending on company policy.</li>
            </ul>
            <label className="teacher-agreement-check">
              <input type="checkbox" checked={agreementAccepted} onChange={(event) => setAgreementAccepted(event.target.checked)} />
              <span>I agree</span>
            </label>
            <button className="teacher-agreement-back" type="button" onClick={() => setStep('details')}>Back to application</button>
          </section>}
          {feedback && <p className={`form-feedback ${status}`} role="alert">{feedback}</p>}
          {step === 'details'
            ? <button className="button button-primary submit-button" type="submit">Continue <ArrowRight size={17} /></button>
            : <button className="button button-primary submit-button" type="button" onClick={submitApplication} disabled={status === 'loading' || !agreementAccepted}>
              {status === 'loading' ? 'Submitting your request…' : 'Submit Request'} <ArrowRight size={17} />
            </button>}
          <p className="form-privacy"><ShieldCheck size={14} /> Your details are kept private and only reviewed by the academy admin team.</p>
        </form>
      </>}
    </section>
  </div>;
}

function AdminReviewCard({ record, collection, expanded, onToggle, onReview, onDelete, reviewing, deleting }) {
  const isTeacher = collection === 'teachers';
  const status = record.status || 'pending';
  const submittedAt = new Date(record.createdAt).toLocaleString();

  return <article className={`admin-inquiry admin-review-record ${isTeacher ? 'teacher-application' : ''}`}>
    <div className="admin-inquiry-summary">
      <div className="admin-review-summary-main">
        {isTeacher && (record.photo ? <img src={record.photo} alt={`${record.name} teacher application`} className="admin-teacher-photo" /> : <div className="admin-teacher-photo admin-teacher-photo-empty">No photo</div>)}
        <div>
          <span className="admin-inquiry-course">{isTeacher ? 'Teacher application' : `Admission · ${record.course}`}</span>
          {!isTeacher && <span className="admin-inquiry-options">{record.classType || 'Class choice not recorded'} · {record.classPackage || 'Package choice not recorded'}</span>}
          <h2>{record.name}</h2>
          <span className="admin-inquiry-contact">{record.email} · {record.phone}{!isTeacher && record.whatsappNumber ? ` · WhatsApp: ${record.whatsappNumber}` : ''}</span>
        </div>
      </div>
      <div className="admin-review-meta">
        <span className={`admin-review-status status-${status}`}>{status}</span>
        <time dateTime={record.createdAt}>{submittedAt}</time>
        <button type="button" className="admin-details-toggle" aria-expanded={expanded} onClick={onToggle}>{expanded ? 'Hide details' : 'Show all information'} <ChevronDown size={15} /></button>
        <div className="admin-review-actions">
          <button type="button" className={`admin-decision approve${status === 'approved' ? ' current' : ''}`} disabled={reviewing || status === 'approved'} onClick={() => onReview('approved')}>{reviewing ? 'Saving…' : 'Approve'}</button>
          <button type="button" className={`admin-decision disapprove${status === 'disapproved' ? ' current' : ''}`} disabled={reviewing || status === 'disapproved'} onClick={() => onReview('disapproved')}>{reviewing ? 'Saving…' : 'Disapprove'}</button>
          {status === 'disapproved' && <button type="button" className="admin-decision delete" disabled={reviewing || deleting} onClick={onDelete}>{deleting ? 'Deleting…' : <><Trash2 size={14} /> Delete entry</>}</button>}
        </div>
      </div>
    </div>
    {expanded && <dl className="admin-inquiry-details admin-review-details">
      {isTeacher ? <>
        <div><dt>Name</dt><dd>{record.name}</dd></div>
        <div><dt>Email</dt><dd><a href={`mailto:${record.email}`}>{record.email}</a></dd></div>
        <div><dt>Phone</dt><dd><a href={`tel:${record.phone}`}>{record.phone}</a></dd></div>
        <div><dt>WhatsApp</dt><dd><a href={`https://wa.me/${(record.whatsappNumber || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer">{record.whatsappNumber || 'Not provided'}</a></dd></div>
        <div><dt>Country</dt><dd>{record.country || 'Not provided'}</dd></div>
        <div><dt>City</dt><dd>{record.city || 'Not provided'}</dd></div>
        <div><dt>Address</dt><dd>{record.address || 'Not provided'}</dd></div>
        <div><dt>Citizen card no.</dt><dd>{record.citizenCardNo || 'Not provided'}</dd></div>
        <div><dt>Teaching languages</dt><dd>{record.languages?.join(', ') || 'Not provided'}</dd></div>
        <div><dt>Teaching courses</dt><dd>{record.teachingOptions?.join(', ') || 'Not provided'}</dd></div>
        <div className="admin-message"><dt>Message</dt><dd>{record.message || 'No additional details provided.'}</dd></div>
        <div><dt>Submission date</dt><dd>{submittedAt}</dd></div>
        <div className="admin-teacher-image-detail"><dt>Teacher photo</dt><dd>{record.photo ? <a href={record.photo} target="_blank" rel="noreferrer"><img src={record.photo} alt={`${record.name} submitted photo`} /></a> : 'No photo provided'}</dd></div>
      </> : <>
        <div><dt>Student name</dt><dd>{record.name}</dd></div>
        <div><dt>Email</dt><dd><a href={`mailto:${record.email}`}>{record.email}</a></dd></div>
        <div><dt>Phone</dt><dd><a href={`tel:${record.phone}`}>{record.phone}</a></dd></div>
        <div><dt>WhatsApp</dt><dd>{record.whatsappNumber ? <a href={`https://wa.me/${record.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">{record.whatsappNumber}</a> : 'Not provided'}</dd></div>
        <div><dt>Country</dt><dd>{record.country || 'Not provided'}</dd></div>
        <div><dt>City</dt><dd>{record.city || 'Not provided'}</dd></div>
        <div><dt>Course</dt><dd>{record.course}</dd></div>
        <div><dt>Class type</dt><dd>{record.classType || 'Not recorded on this request'}</dd></div>
        <div><dt>Package</dt><dd>{record.classPackage || 'Not recorded on this request'}</dd></div>
        <div><dt>Learning language</dt><dd>{record.language}</dd></div>
        <div><dt>Preferred joining date</dt><dd>{JOINING_DATE_OPTIONS.find(({ value }) => value === record.preferredJoiningDate)?.label || 'Not recorded'}</dd></div>
        <div><dt>Preferred class time</dt><dd>{record.preferredClassTimeLocal || 'Not recorded'}{record.preferredClassTimeZone && <small className="admin-time-source">Time zone: {record.preferredClassTimeZone}; Pakistan schedule: {CLASS_TIME_SLOTS.find(({ value }) => value === record.preferredClassTime)?.label || 'Not recorded'}</small>}</dd></div>
        <div><dt>Submission date</dt><dd>{submittedAt}</dd></div>
        <div className="admin-message"><dt>Additional information</dt><dd>{record.message || 'No additional details provided.'}</dd></div>
      </>}
    </dl>}
  </article>;
}

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [teacherApplications, setTeacherApplications] = useState([]);
  const [expandedInquiry, setExpandedInquiry] = useState('');
  const [expandedTeacher, setExpandedTeacher] = useState('');
  const [activeTab, setActiveTab] = useState('admissions');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviewingRecord, setReviewingRecord] = useState('');
  const [deletingRecord, setDeletingRecord] = useState('');
  const [expandedRecord, setExpandedRecord] = useState('');

  async function loadInquiries() {
    const response = await fetch('/api/admin/inquiries', { credentials: 'same-origin' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to load enquiries.');
    setInquiries(result);
  }

  async function loadTeacherApplications() {
    const response = await fetch('/api/admin/teachers', { credentials: 'same-origin' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to load teacher applications.');
    setTeacherApplications(result);
  }

  useEffect(() => {
    let active = true;
    fetch('/api/admin/session', { credentials: 'same-origin' })
      .then(async (response) => {
        if (!response.ok) return false;
        const result = await response.json();
        return result.authenticated === true;
      })
      .then(async (isAuthenticated) => {
        if (!active) return;
        setAuthenticated(isAuthenticated);
        if (isAuthenticated) {
          await Promise.all([loadInquiries(), loadTeacherApplications()]);
        }
      })
      .catch((sessionError) => {
        if (active) setError(sessionError.message || 'Unable to check the admin session.');
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });
    return () => { active = false; };
  }, []);

  async function logIn(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to log in.');
      setAuthenticated(true);
      setPassword('');
      await Promise.all([loadInquiries(), loadTeacherApplications()]);
    } catch (loginError) {
      setError(loginError.message || 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function refreshData() {
    setLoading(true);
    setError('');
    try {
      await Promise.all([loadInquiries(), loadTeacherApplications()]);
    } catch (refreshError) {
      setError(refreshError.message || 'Unable to load data.');
    } finally {
      setLoading(false);
    }
  }

  async function updateReviewStatus(collection, id, status) {
    const recordKey = `${collection}:${id}`;
    setReviewingRecord(recordKey);
    setError('');
    try {
      const response = await fetch(`/api/admin/${collection}/${id}/status`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to update this review decision.');
      const updateRecords = collection === 'teachers' ? setTeacherApplications : setInquiries;
      updateRecords((records) => records.map((record) => record.id === id ? { ...record, status: result.status } : record));
      setActiveTab(result.status);
    } catch (reviewError) {
      setError(reviewError.message || 'Unable to update this review decision.');
    } finally {
      setReviewingRecord('');
    }
  }

  async function deleteDisapprovedRecord(collection, id) {
    if (!window.confirm('Permanently delete this disapproved entry? This cannot be undone.')) return;
    const recordKey = `${collection}:${id}`;
    setDeletingRecord(recordKey);
    setError('');
    try {
      const response = await fetch(`/api/admin/${collection}/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to delete this entry.');
      const updateRecords = collection === 'teachers' ? setTeacherApplications : setInquiries;
      updateRecords((records) => records.filter((record) => record.id !== id));
      setExpandedRecord('');
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete this entry.');
    } finally {
      setDeletingRecord('');
    }
  }

  async function logOut() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to log out.');
      setAuthenticated(false);
      setInquiries([]);
      setTeacherApplications([]);
    } catch (logoutError) {
      setError(logoutError.message || 'Unable to log out.');
    } finally {
      setLoading(false);
    }
  }

  const pendingAdmissions = inquiries.filter((record) => (record.status || 'pending') === 'pending');
  const pendingTeachers = teacherApplications.filter((record) => (record.status || 'pending') === 'pending');
  const approvedCount = inquiries.filter((record) => record.status === 'approved').length + teacherApplications.filter((record) => record.status === 'approved').length;
  const disapprovedCount = inquiries.filter((record) => record.status === 'disapproved').length + teacherApplications.filter((record) => record.status === 'disapproved').length;
  const reviewedRecords = [
    ...inquiries.map((record) => ({ record, collection: 'inquiries' })),
    ...teacherApplications.map((record) => ({ record, collection: 'teachers' })),
  ].filter(({ record }) => record.status === activeTab);
  const visibleRecords = activeTab === 'admissions'
    ? pendingAdmissions.map((record) => ({ record, collection: 'inquiries' }))
    : activeTab === 'teacher-applications'
      ? pendingTeachers.map((record) => ({ record, collection: 'teachers' }))
      : reviewedRecords;

  if (checkingSession) return <main className="admin-page"><p className="admin-loading">Checking secure session…</p></main>;

  if (!authenticated) return <main className="admin-page">
    <section className="admin-login-card">
      <span className="eyebrow">PRIVATE ADMIN AREA</span>
      <h1>Admin <em>sign in.</em></h1>
      <p>Sign in to view academy enquiries and teacher applications.</p>
      <form className="admin-login-form" onSubmit={logIn}>
        <label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="button button-primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} /></button>
      </form>
    </section>
  </main>;

  return <main className="admin-page admin-dashboard">
    <header className="admin-dashboard-header">
      <div><span className="eyebrow">ONE UMMAH QURAN LEARNING</span><h1>Admin <em>panel.</em></h1><p>Private admin view</p></div>
      <div className="admin-header-actions"><button className="button button-outline" type="button" onClick={refreshData} disabled={loading}>{loading ? 'Loading…' : 'Refresh'} <ArrowRight size={15} /></button><button className="button button-primary" type="button" onClick={logOut} disabled={loading}>Log out</button></div>
    </header>
    {error && <p className="admin-error" role="alert">{error}</p>}
    <div className="admin-tabs" role="tablist" aria-label="Admin sections">
      <button type="button" role="tab" aria-selected={activeTab === 'admissions'} className={activeTab === 'admissions' ? 'selected' : ''} onClick={() => setActiveTab('admissions')}>Admissions <span>{pendingAdmissions.length}</span></button>
      <button type="button" role="tab" aria-selected={activeTab === 'teacher-applications'} className={activeTab === 'teacher-applications' ? 'selected' : ''} onClick={() => setActiveTab('teacher-applications')}>Teachers <span>{pendingTeachers.length}</span></button>
      <button type="button" role="tab" aria-selected={activeTab === 'approved'} className={activeTab === 'approved' ? 'selected' : ''} onClick={() => setActiveTab('approved')}>Approved <span>{approvedCount}</span></button>
      <button type="button" role="tab" aria-selected={activeTab === 'disapproved'} className={activeTab === 'disapproved' ? 'selected' : ''} onClick={() => setActiveTab('disapproved')}>Disapproved <span>{disapprovedCount}</span></button>
    </div>
    <section className="admin-review-list" aria-label={`${activeTab} records`}>
      {visibleRecords.length === 0 ? <div className="admin-empty"><BookOpen size={26} /><h2>{activeTab === 'admissions' ? 'No pending admissions' : activeTab === 'teacher-applications' ? 'No pending teacher applications' : `No ${activeTab} records`}</h2><p>New submissions will appear in the pending sections.</p></div> : visibleRecords.map(({ record, collection }) => {
        const recordKey = `${collection}:${record.id}`;
        return <AdminReviewCard key={recordKey} record={record} collection={collection} expanded={expandedRecord === recordKey} onToggle={() => setExpandedRecord(expandedRecord === recordKey ? '' : recordKey)} onReview={(status) => updateReviewStatus(collection, record.id, status)} onDelete={() => deleteDisapprovedRecord(collection, record.id)} reviewing={reviewingRecord === recordKey} deleting={deletingRecord === recordKey} />;
      })}
    </section>
    {activeTab === 'inquiries' && (inquiries.length === 0 ? <section className="admin-empty"><BookOpen size={26} /><h2>No enquiries yet</h2><p>New trial requests will appear here once submitted.</p></section> : <section className="admin-inquiry-list" aria-label="Trial enquiries">{inquiries.map((inquiry) => <article className="admin-inquiry" key={inquiry.id}><div className="admin-inquiry-summary"><div><span className="admin-inquiry-course">{inquiry.course}</span><span className="admin-inquiry-options">{inquiry.classType || 'Class choice not recorded'} · {inquiry.classPackage || 'Package choice not recorded'}</span><h2>{inquiry.name}</h2><span className="admin-inquiry-contact">{inquiry.email} · {inquiry.phone}</span></div><div className="admin-inquiry-meta"><span>{inquiry.language}</span><time dateTime={inquiry.createdAt}>{new Date(inquiry.createdAt).toLocaleString()}</time><button type="button" className="admin-details-toggle" aria-expanded={expandedInquiry === inquiry.id} onClick={() => setExpandedInquiry(expandedInquiry === inquiry.id ? '' : inquiry.id)}>{expandedInquiry === inquiry.id ? 'Hide details' : 'Show all information'} <ChevronDown size={15} /></button></div></div>{expandedInquiry === inquiry.id && <dl className="admin-inquiry-details"><div><dt>Student name</dt><dd>{inquiry.name}</dd></div><div><dt>Email</dt><dd><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a></dd></div><div><dt>Phone / WhatsApp</dt><dd><a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a></dd></div><div><dt>Country of residence</dt><dd>{inquiry.country || 'Not provided'}</dd></div><div><dt>Course</dt><dd>{inquiry.course}</dd></div><div><dt>Class type</dt><dd>{inquiry.classType || 'Not recorded on this request'}</dd></div><div><dt>Package</dt><dd>{inquiry.classPackage || 'Not recorded on this request'}</dd></div><div><dt>Learning language</dt><dd>{inquiry.language}</dd></div><div><dt>Request date & time</dt><dd>{new Date(inquiry.createdAt).toLocaleString()}</dd></div><div className="admin-message"><dt>Additional information</dt><dd>{inquiry.message || 'No additional details provided.'}</dd></div></dl>}</article>)}</section>)}
    {activeTab === 'teachers' && (teacherApplications.length === 0 ? <section className="admin-empty"><UsersRound size={26} /><h2>No teacher applications yet</h2><p>New teacher forms will appear here once submitted.</p></section> : <section className="admin-inquiry-list" aria-label="Teacher applications">{teacherApplications.map((teacher) => <article className="admin-inquiry teacher-application" key={teacher.id}><div className="admin-inquiry-summary"><div className="admin-teacher-summary"><div>{teacher.photo && <img src={teacher.photo} alt={teacher.name} className="admin-teacher-photo" />}</div><div><span className="admin-inquiry-course">Teacher application</span><h2>{teacher.name}</h2><span className="admin-inquiry-contact">{teacher.email} · {teacher.phone}</span></div></div><div className="admin-inquiry-meta"><span>{teacher.languages.join(', ') || 'Languages not selected'}</span><time dateTime={teacher.createdAt}>{new Date(teacher.createdAt).toLocaleString()}</time><button type="button" className="admin-details-toggle" aria-expanded={expandedTeacher === teacher.id} onClick={() => setExpandedTeacher(expandedTeacher === teacher.id ? '' : teacher.id)}>{expandedTeacher === teacher.id ? 'Hide details' : 'Show all information'} <ChevronDown size={15} /></button></div></div>{expandedTeacher === teacher.id && <dl className="admin-inquiry-details"><div><dt>Name</dt><dd>{teacher.name}</dd></div><div><dt>Email</dt><dd><a href={`mailto:${teacher.email}`}>{teacher.email}</a></dd></div><div><dt>Phone</dt><dd><a href={`tel:${teacher.phone}`}>{teacher.phone}</a></dd></div><div><dt>WhatsApp</dt><dd><a href={`https://wa.me/${teacher.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">{teacher.whatsappNumber}</a></dd></div><div><dt>Country</dt><dd>{teacher.country}</dd></div><div><dt>City</dt><dd>{teacher.city}</dd></div><div><dt>Address</dt><dd>{teacher.address}</dd></div><div><dt>Citizen card no.</dt><dd>{teacher.citizenCardNo}</dd></div><div><dt>Teaching languages</dt><dd>{teacher.languages.join(', ')}</dd></div><div><dt>Teaching options</dt><dd>{teacher.teachingOptions.join(', ')}</dd></div><div><dt>Message</dt><dd>{teacher.message || 'No additional details provided.'}</dd></div><div><dt>Submission date</dt><dd>{new Date(teacher.createdAt).toLocaleString()}</dd></div></dl>}</article>)}</section>)}
  </main>;
}

function FeesPage({ beginCourseEnrollment }) {
  const [courseId, setCourseId] = useState(FEE_COURSES[0].id);
  const [classType, setClassType] = useState(FEE_CLASS_TYPES[0].id);
  const course = FEE_COURSES.find((item) => item.id === courseId) || FEE_COURSES[0];

  return <div className="fees-page page-section">
    <section className="fees-hero">
      <span className="eyebrow">CLEAR, CARING & AFFORDABLE</span>
      <h1>One Ummah Quran Learning.<br /><em>Choose your class and package.</em></h1>
      <p>Learn with a qualified teacher in a private one-to-one class or together with your family.</p>
      <div className="fees-highlights">
        <span><Check size={16} /> Private and family classes</span>
        <span><Check size={16} /> Premium and Golden packages</span>
        <span><Check size={16} /> Live online learning</span>
      </div>
    </section>

    <section className="fees-content">
      <div className="fees-heading">
        <span className="eyebrow">FIND THE RIGHT FIT</span>
        <h2>Choose your <em>class and package.</em></h2>
        <p>Select a course and class type to see monthly pricing for private or family classes.</p>
      </div>
      <div className="fee-course-tabs" role="group" aria-label="Choose a course">
        {FEE_COURSES.map((item) => <button key={item.id} type="button" aria-pressed={course.id === item.id} className={course.id === item.id ? 'selected' : ''} onClick={() => setCourseId(item.id)}>{item.label}</button>)}
      </div>

      <div className="fee-plan-panel">
        <div className="fee-plan-heading">
          <div><span className="eyebrow">MONTHLY TUITION</span><h3>{course.title}</h3>{course.subjects && <p className="fee-course-subjects">{course.subjects}</p>}</div>
        </div>
        <fieldset className="fee-class-types">
          <legend>Choose your class type</legend>
          <div className="fee-class-type-options">
            {FEE_CLASS_TYPES.map((option) => <label className={`fee-class-type${classType === option.id ? ' selected' : ''}`} key={option.id}>
              <input type="radio" name="feeClassType" value={option.id} checked={classType === option.id} onChange={() => setClassType(option.id)} />
              <span><strong>{option.title}</strong><small>{getClassTypeDetail(course.title, option.id)}</small></span>
            </label>)}
          </div>
        </fieldset>
        <div className="fee-plans">
          {FEE_PACKAGES.map((packageOption) => {
            const prices = course.prices && course.prices[classType] && course.prices[classType][packageOption.id];
            return <article className={`fee-plan${packageOption.id === 'Premium Package' ? ' recommended' : ''}`} key={packageOption.id}>
            {packageOption.id === 'Premium Package' && <span className="fee-popular">POPULAR</span>}
            <span className="fee-frequency">{packageOption.title}</span>
            <span className="fee-classes">{packageOption.detail}</span>
            <span className="fee-class-summary">{getClassTypeDetail(course.title, classType)}</span>
            {prices
              ? <><span className="fee-regular-price"><del>${prices.regular} / £{convertUsdToGbp(prices.regular).toLocaleString()}</del></span><strong className="fee-price">${prices.sale} / £{convertUsdToGbp(prices.sale).toLocaleString()}<small>/ month</small></strong><span className="fee-discount">{Math.round(((prices.regular - prices.sale) / prices.regular) * 100)}% discount</span></>
              : <p className="fee-unavailable">Rates coming soon</p>}
            <button className="button button-outline fee-cta" onClick={() => beginCourseEnrollment(course.title, classType, packageOption.id)}>
              {classType === 'Family Class' ? 'Ask about family rates' : 'Ask about this plan'} <ArrowRight size={15} />
            </button>
          </article>;
          })}
        </div>
        <p className="fee-note">GBP prices are converted from the supplied USD rates at 1 USD = £{USD_TO_GBP_RATE} (9 October 2026).</p>
      </div>
      <div className="fees-bottom">
        <div><span className="eyebrow">A GOOD PLACE TO BEGIN</span><h2>Not sure which plan <em>is right for you?</em></h2><p>We’ll learn about your goals and help you choose a course, schedule and plan that feels right.</p></div>
        <button className="button button-primary" onClick={() => beginCourseEnrollment(course.title, classType)}>Ask us about classes <ArrowRight size={16} /></button>
      </div>
    </section>
  </div>;
}

function App() {
  const getPage = () => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return ['/', '/courses', '/teachers', '/about', '/fees', '/contact', ADMIN_PATH].includes(path) ? path : '/';
  };
  const [page, setPage] = useState(getPage);
  const [selectedCourseId, setSelectedCourseId] = useState(() => new URLSearchParams(window.location.search).get('course') || '');
  const [courses, setCourses] = useState(fallbackCourses);
  const [teachers, setTeachers] = useState(fallbackTeachers);
  const [language, setLanguage] = useState('English');
  const [trialOpen, setTrialOpen] = useState(false);
  const [trialCourse, setTrialCourse] = useState('');
  const [courseEnrollmentOpen, setCourseEnrollmentOpen] = useState(false);
  const [enrollmentCourse, setEnrollmentCourse] = useState('');
  const [enrollmentClassType, setEnrollmentClassType] = useState('');
  const [enrollmentPackage, setEnrollmentPackage] = useState('');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/courses').then((response) => response.ok ? response.json() : Promise.reject()).then((apiCourses) => {
      const mergedCourses = new Map(fallbackCourses.map((course) => [course.id, course]));
      apiCourses.forEach((course) => {
        const isLegacyCourse = ['tafsir', 'islamic-studies', 'hadith'].includes(course.id)
          || /^(?:hadith\s*(?:&|and)\s*tafsir|islamic studies|hadith)$/i.test(course.title?.trim() ?? '');
        if (!isLegacyCourse) mergedCourses.set(course.id, course);
      });
      setCourses([...mergedCourses.values()]);
    }).catch(() => {});
    fetch('/api/teachers').then((response) => response.ok ? response.json() : Promise.reject()).then(setTeachers).catch(() => {});
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPage());
      setSelectedCourseId(new URLSearchParams(window.location.search).get('course') || '');
      setMenuOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (page !== '/courses' || !selectedCourseId) return;
    document.getElementById(`course-${selectedCourseId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [page, selectedCourseId, courses]);

  useEffect(() => {
    const pageMetadata = {
      '/': {
        title: 'One Ummah Quran Learning | Online Quran Academy',
        description: 'Learn the Holy Quran online with caring teachers at One Ummah Quran Learning. Explore Quran reading, Hifz, Tajweed, Tafsir, Arabic and Islamic studies in private online classes.',
      },
      '/courses': {
        title: 'Online Quran Courses | Quran, Tajweed, Hifz & Arabic',
        description: 'Explore online Quran courses at One Ummah Quran Learning, including Quran reading (Nazra), Hifz, Tajweed, Tafsir, Arabic and Islamic studies.',
      },
      '/teachers': {
        title: 'Teach with One Ummah | Online Quran Academy',
        description: 'Apply to teach Quran, Arabic and Islamic studies online with One Ummah Quran Learning.',
      },
      '/about': {
        title: 'About One Ummah | Online Islamic Learning',
        description: 'Learn about One Ummah Quran Learning and our welcoming, private online Quran and Islamic education classes for learners around the world.',
      },
      '/fees': {
        title: 'Online Quran Class Fees & Packages | One Ummah',
        description: 'Compare online Quran class fees, private and family classes, and weekly packages at One Ummah Quran Learning.',
      },
      '/contact': {
        title: 'Contact One Ummah | Online Quran Academy',
        description: 'Contact One Ummah Quran Learning to ask about online Quran classes, courses, fees and learning options.',
      },
      [ADMIN_PATH]: {
        title: 'Private Admin | One Ummah Quran Learning',
        description: 'Private academy administration.',
        noIndex: true,
      },
    };
    const metadata = pageMetadata[page] || pageMetadata['/'];
    document.title = metadata.title;

    function setMeta(attribute, key, content) {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    }

    setMeta('name', 'description', metadata.description);
    setMeta('name', 'robots', metadata.noIndex ? 'noindex, nofollow, noarchive' : 'index, follow');
    setMeta('property', 'og:title', metadata.title);
    setMeta('property', 'og:description', metadata.description);
    setMeta('property', 'og:url', `${window.location.origin}${page}`);
    setMeta('name', 'twitter:title', metadata.title);
    setMeta('name', 'twitter:description', metadata.description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${page}`;

    const structuredData = [
      {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        '@id': `${window.location.origin}/#academy`,
        name: 'One Ummah Quran Learning',
        url: window.location.origin,
        description: 'An online Quran and Islamic education academy offering Quran reading, Hifz, Tajweed, Tafsir, Arabic and Islamic studies classes.',
        email: EMAIL,
        telephone: PHONE,
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Urdu', 'Pashto'],
        knowsAbout: ['Online Quran classes', 'Quran reading', 'Hifz-ul-Quran', 'Tajweed', 'Quran Tafsir', 'Arabic language', 'Islamic studies'],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'One Ummah Quran Learning',
        url: window.location.origin,
        inLanguage: 'en',
      },
    ];
    if (page === '/courses') {
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Online Quran and Islamic Studies Courses',
        itemListElement: courses.map((course, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Course',
            name: course.title,
            description: course.short,
            provider: { '@id': `${window.location.origin}/#academy` },
          },
        })),
      });
    }

    let schemaScript = document.head.querySelector('script[data-site-structured-data]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.dataset.siteStructuredData = 'true';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(structuredData);
  }, [page, courses]);

  function navigate(event, path) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (window.location.pathname !== path || window.location.search) window.history.pushState({}, '', path);
    setPage(path);
    setSelectedCourseId('');
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }

  function navigateToCourse(event, courseId) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState({}, '', `/courses?course=${encodeURIComponent(courseId)}`);
    setPage('/courses');
    setSelectedCourseId(courseId);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }

  function beginTrial(courseName = '') {
    setTrialCourse(courseName);
    setTrialOpen(true);
  }
  function beginCourseEnrollment(courseName, classType = '', packageName = '') {
    setEnrollmentCourse(courseName);
    setEnrollmentClassType(classType);
    setEnrollmentPackage(packageName);
    setCourseEnrollmentOpen(true);
  }
  const homeCourses = courses;

  if (page === ADMIN_PATH) return <AdminPage />;

  return <>
    <div className="topline"><span>“Indeed, in the remembrance of Allah do hearts find rest.”</span><span className="topline-arabic" lang="ar" dir="rtl">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</span></div>
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <button className="mobile-menu icon-button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={`main-nav${menuOpen ? ' nav-open' : ''}`} aria-label="Main navigation">
          <a className={page === '/' ? 'active' : ''} href="/" onClick={(event) => navigate(event, '/')}>Home</a>
          <a className={page === '/courses' ? 'active' : ''} href="/courses" onClick={(event) => navigate(event, '/courses')}>Courses</a>
          <a className={page === '/teachers' ? 'active' : ''} href="/teachers" onClick={(event) => navigate(event, '/teachers')}>Become a Teacher</a>
          <a className={page === '/about' ? 'active' : ''} href="/about" onClick={(event) => navigate(event, '/about')}>About</a>
          <a className={page === '/fees' ? 'active' : ''} href="/fees" onClick={(event) => navigate(event, '/fees')}>Fees</a>
          <a className={page === '/contact' ? 'active' : ''} href="/contact" onClick={(event) => navigate(event, '/contact')}>Contact</a>
          <button className="nav-trial" type="button" onClick={() => beginTrial()}>Become a teacher <ArrowUpRight size={15} /></button>
        </nav>
      </div>
    </header>

    <main>
      {page === '/' && <>
        <section className="hero">
          <div className="hero-image" role="img" aria-label="Sunlit mosque courtyard, an inviting place to begin learning" />
          {videoPlaying && <video className="hero-video" src={heroVideo} autoPlay playsInline muted={videoMuted} onEnded={() => setVideoPlaying(false)} onError={() => { setVideoPlaying(false); setVideoError(true); }} aria-label="Mosque courtyard video" />}
          <div className={`hero-shade${videoPlaying ? ' playing' : ''}`} />
          {videoPlaying && <button className="hero-volume" type="button" aria-label={videoMuted ? 'Unmute video' : 'Mute video'} aria-pressed={videoMuted} onClick={() => setVideoMuted(!videoMuted)}>{videoMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>}
          <div className="hero-inner">
            <div className="hero-copy">
              {!videoPlaying && <button className="hero-play" onClick={() => { setVideoError(false); setVideoPlaying(true); }} aria-label="Play mosque video"><Play size={28} fill="currentColor" /></button>}
              <h1>Learn Quran Online,<br />Anytime, Anywhere.</h1>
              <p>Learn Quran, Arabic, Hadith, and Islamic studies with qualified teachers in English, Urdu, and Pashto.</p>
              <div className="hero-actions"><a className="button button-primary" href="/courses" onClick={(event) => navigate(event, '/courses')}>Start Learning <ArrowRight size={17} /></a><button className="button button-glass" onClick={() => beginTrial()}>Become a Teacher <ArrowRight size={17} /></button></div>
              {videoError && <p className="hero-video-error" role="alert">The video could not be played. <button onClick={() => { setVideoError(false); setVideoPlaying(true); }}>Try again</button></p>}
            </div>
          </div>
          <aside className="female-classes-note" aria-label="Female student classes">
            <span className="female-classes-icon"><UsersRound size={22} /></span>
            <span><strong>A welcoming space for sisters</strong><small>Separate classes for female students, with female teachers available.</small></span>
            <span className="female-classes-flourish" aria-hidden="true">✦</span>
          </aside>
        </section>

        <section className="home-course-teasers" aria-label="Popular courses">
          {homeCourses.map((course, index) => {
            const artwork = HOME_COURSE_ARTWORK[course.id];
            return <a className="home-course-card" href={`/courses?course=${encodeURIComponent(course.id)}`} onClick={(event) => navigateToCourse(event, course.id)} key={course.id}>
              <span className={`home-course-icon${index % 2 === 0 ? ' dark' : ''}`}>{artwork ? <img src={artwork.src} alt={artwork.alt} loading="lazy" /> : course.icon}</span>
              <span><strong>{course.title}{course.title.toLowerCase().includes('classes') ? '' : ' classes'}</strong><small>{course.short}</small><i><b /></i></span>
            </a>;
          })}
        </section>

        <section className="academy-information" aria-labelledby="academy-information-title">
          <div className="academy-information-inner">
            <span className="eyebrow">WELCOME TO ONE UMMAH QURAN LEARNING</span>
            <h2 id="academy-information-title">Information</h2>
            <p className="academy-information-greeting">Assalamu Alaikum wa Rahmatullahi wa Barakatuh.</p>
            <ul className="academy-information-list">
              <li>One Ummah Quran Learning is an online Islamic education platform helping Muslims around the world learn the Holy Quran and understand Islam from the comfort of home.</li>
              <li className="academy-information-female"><h3>Female</h3><p>We offer private one-to-one Quran classes for female students who prefer not to appear on camera, with a comfortable, respectful, and private learning environment.</p></li>
              <li>We welcome children, females, teenagers, and adults. Learn Quran reading (Nazra), memorize the Holy Quran, improve Tajweed, study Quran Tafsir and Hadith, or learn Arabic and Islamic Studies.</li>
              <li><strong>Private One-to-One Classes:</strong> Individual attention and lessons shaped around each student.</li>
              <li><strong>Family Classes:</strong> Convenient packages for multiple members of one family.</li>
              <li><strong>Premium Package:</strong> Four classes per week, Monday through Thursday. <strong>Golden Package:</strong> Six classes per week, Monday through Saturday.</li>
              <li>Courses include Quran Reading (Nazra), Hifz-ul-Quran, Tajweed, Quran Tafsir, Hadith, Arabic, English, Urdu, Pashto, and Islamic Studies/Hadith.</li>
              <li>Join One Ummah Quran Learning and take the next step in your journey of learning the Holy Quran.</li>
            </ul>
            <div className="academy-language-info">
              <h3>Classes &amp; Languages</h3>
              <ul className="academy-information-list"><li>Classes are available in English, Urdu, and Pashto, subject to availability. Join online from anywhere, including the UK, USA, Canada, Europe, Australia, and Pakistan.</li></ul>
            </div>
          </div>
        </section>
      </>}

      {page === '/about' && <>
        <section className="intro-section section-wrap page-section">
          <div className="intro-label"><span className="eyebrow">WELCOME TO ONE UMMAH QURAN LEARNING</span><span className="section-number">01 / OUR PROMISE</span></div>
          <div className="intro-content">
            <h2>Rooted in tradition.<br /><em>Made for your life.</em></h2>
            <div className="intro-description"><p>We believe every learner deserves a warm welcome to the words of the Quran. Our thoughtful, one-to-one online classes make space for real questions, steady progress and a love of learning that lasts.</p><a className="text-link" href="#approach">A little about our approach <ArrowRight size={16} /></a></div>
          </div>
          <div className="promise-strip"><div><BookOpen /><span><strong>Learn at your pace</strong><small>Personal, one-to-one lessons</small></span></div><div><Globe2 /><span><strong>In your language</strong><small>English, Urdu or Pashto</small></span></div><div><Heart /><span><strong>A welcoming space</strong><small>For learners of every age</small></span></div></div>
        </section>
        <section className="method-section" id="approach">
          <div className="method-image"><img src={photo('photo-1609599006353-e629aaabfeae', 1100)} alt="An open Quran resting on a wooden stand" loading="lazy" /><span className="image-caption"><span>01</span> A gentler way to grow</span></div>
          <div className="method-copy"><span className="eyebrow">LEARNING THAT FEELS PERSONAL</span><h2>Every learner.<br />A <em>different story.</em></h2><p>There is no one-size-fits-all way to learn the Quran. Your teacher gets to know your goals, finds your pace and makes each class feel like it's made just for you.</p>
            <div className="method-list"><div><span className="method-icon"><Video size={17} /></span><span><strong>Live, face-to-face classes</strong><small>Personal attention, wherever you are.</small></span></div><div><span className="method-icon"><Clock3 size={17} /></span><span><strong>A schedule that works for you</strong><small>Find a time that fits your family and your day.</small></span></div><div><span className="method-icon"><ShieldCheck size={17} /></span><span><strong>Patient, qualified teachers</strong><small>A supportive teacher by your side.</small></span></div></div>
            <button className="button button-outline" onClick={() => beginTrial()}>Apply to teach with us <ArrowRight size={16} /></button>
          </div>
        </section>
        <section className="steps-section">
          <div className="steps-heading"><span className="eyebrow">YOUR FIRST STEP IS A SMALL ONE</span><h2>Three steps. A world of <em>meaning.</em></h2></div>
          <div className="steps-grid"><article><span>01 <i><ArrowUpRight size={14} /></i></span><h3>Say salaam</h3><p>Tell us what you'd like to learn. We'll listen, answer your questions and find the right class.</p></article><article><span>02 <i><ArrowUpRight size={14} /></i></span><h3>Meet your teacher</h3><p>Settle into a relaxed first lesson and discover just how personal online learning can feel.</p></article><article><span>03 <i><ArrowUpRight size={14} /></i></span><h3>Grow, at your pace</h3><p>Continue with a learning plan shaped around you, one beautiful step at a time.</p></article></div>
        </section>
      </>}

      {page === '/courses' && <section className="courses-section section-wrap page-section">
        <div className="section-heading"><div><span className="eyebrow">A PATH FOR EVERY LEARNER</span><h2>Find your <em>beginning.</em></h2></div><p>Whether you're learning your first letters or deepening a lifelong practice, there's a place for you here.</p></div>
        <div className="courses-grid">{courses.map((course, index) => {
          const isSelected = selectedCourseId === course.id;
          return <article className={`course-card${isSelected ? ' selected' : ''}`} id={`course-${course.id}`} aria-current={isSelected ? 'true' : undefined} key={course.id}>
            <div className="course-card-top"><span className="course-icon">{COURSE_ICON_OVERRIDES[course.id] || course.icon}</span><span className="course-number">{isSelected ? 'SELECTED' : `0${index + 1}`}</span></div>
            <span className="course-tag">{course.tag}</span><h3>{course.title}</h3><p>{course.short}</p>
            <button className="course-link" onClick={() => beginCourseEnrollment(course.title)}>Explore this course <ArrowUpRight size={16} /></button>
          </article>;
        })}</div>
        <div className="course-footnote"><Sparkles size={15} /><span>Not sure where to begin? We'll help find the right path together.</span><button onClick={() => beginTrial()}>Let's talk <ArrowRight size={15} /></button></div>
      </section>}

      {page === '/teachers' && <section className="teachers-section section-wrap page-section">
        <div className="section-heading teacher-heading"><div><span className="eyebrow">JOIN OUR ACADEMY</span><h2>Become a <em>teacher.</em></h2></div></div>
        <div className="teacher-apply-card">
          <p>Share your details and we will review your application for teaching opportunities in Quran, Arabic, Islamic studies and other languages.</p>
          <button className="button button-primary" type="button" onClick={() => beginTrial()}>Apply now <ArrowRight size={16} /></button>
        </div>
      </section>}

      {page === '/fees' && <FeesPage beginCourseEnrollment={beginCourseEnrollment} />}

      {page === '/contact' && <section className="contact-page page-section">
        <div className="closing-ornament" lang="ar" dir="rtl">نُورٌ عَلَىٰ نُورٍ</div>
        <span className="eyebrow">CONTACT ONE UMMAH QURAN LEARNING</span><h2>We'd love to <em>hear from you.</em></h2><p>Ask a question, tell us what you'd like to learn, or apply to teach with us.</p>
        <div className="closing-actions"><button className="button button-cream" onClick={() => beginTrial()}>Become a teacher <ArrowRight size={17} /></button><a className="closing-whatsapp" href={STUDENT_WHATSAPP} target="_blank" rel="noreferrer">Or just say salaam on WhatsApp <ArrowUpRight size={15} /></a></div>
        <div className="contact-details"><a href={`mailto:${EMAIL}`}><Mail size={18} />{EMAIL}</a><a href={`tel:+923082688883`}>{PHONE}</a></div>
      </section>}
    </main>

    <footer id="contact">
      <div className="footer-main"><div className="footer-about"><Brand light /><p>Helping hearts find their way to the Quran, wherever they call home.</p><a className="footer-contact-link" href={STUDENT_WHATSAPP} target="_blank" rel="noreferrer"><span className="whatsapp-dot">↗</span> Say salaam on WhatsApp</a></div>
        <div className="footer-column"><span className="footer-label">FIND YOUR WAY</span><a href="/courses" onClick={(event) => navigate(event, '/courses')}>Our courses</a><a href="/teachers" onClick={(event) => navigate(event, '/teachers')}>Become a teacher</a><a href="/about" onClick={(event) => navigate(event, '/about')}>Our approach</a><a href="/fees" onClick={(event) => navigate(event, '/fees')}>Fees & plans</a><button onClick={() => beginTrial()}>Become a teacher</button></div>
        <div className="footer-column"><span className="footer-label">WE'RE HERE FOR YOU</span><a href={`mailto:${EMAIL}`}><Mail size={15} /> {EMAIL}</a><a href={`tel:${PHONE.replace(/\s+/g, '')}`}>{PHONE}</a><a href={STUDENT_WHATSAPP} target="_blank" rel="noreferrer">WhatsApp us <ArrowUpRight size={14} /></a></div>
      </div><div className="footer-bottom"><span>© {new Date().getFullYear()} One Ummah Quran Learning. Made with care.</span><span>Learn with purpose. Grow with light. <span className="footer-star">✦</span></span></div>
    </footer>
    <a className="whatsapp-float" href={STUDENT_WHATSAPP} target="_blank" rel="noreferrer" aria-label="Ask us anything on WhatsApp: I want more details. Thanks."><span className="whatsapp-icon">◔</span><span>Ask us anything</span><ArrowUpRight size={15} /></a>
    <CourseEnrollmentModal open={courseEnrollmentOpen} onClose={() => setCourseEnrollmentOpen(false)} course={enrollmentCourse} initialClassType={enrollmentClassType} initialPackage={enrollmentPackage} />
    <TeacherApplicationModal open={trialOpen} onClose={() => setTrialOpen(false)} courses={courses} />
  </>;
}

export default App;
