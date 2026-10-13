# One Ummah Quran Learning

A responsive Quran-learning website for One Ummah Quran Learning, built with React, Vite, Express and MongoDB. Home, Courses (`/courses`), Teachers (`/teachers`), About (`/about`), Fees (`/fees`) and Contact (`/contact`) each have their own page. The site includes regional monthly pricing, language-filtered teacher profiles, a Quran recitation video, WhatsApp contact links and a free-trial enquiry form.

## Getting started

1. Install [Node.js](https://nodejs.org/) (version 18 or newer).
2. In the project folder, run `npm install`.
3. Open `.env` and paste your MongoDB connection string after `MONGODB_URI=`. For example:

   ```env
   MONGODB_URI=mongodb+srv://your-user:your-password@your-cluster.mongodb.net/hussain_quran_academy
   PORT=5000
   ```

   Set `ADMIN_EMAIL` to the address you will use to sign in and `ADMIN_PASSWORD` to a long, unique password in `.env`. The current local `.env` has a randomly generated 64-character admin password; open that private file locally to use it. Never share it or commit `.env`.

4. Run `npm run dev` and open the local Vite URL shown in the terminal.

The frontend and Express API run together in development. Without a MongoDB URI, the courses and teacher browsing still work, but trial requests cannot be saved; visitors can still contact the academy using the WhatsApp link. Admin sign-in checks `ADMIN_EMAIL` and `ADMIN_PASSWORD` on the server and protects admin API requests with an expiring, HttpOnly session cookie. `VITE_ADMIN_PATH` is the URL of the private sign-in page; it is not a substitute for the email and password. Changing `.env` requires restarting the server; changing `VITE_ADMIN_PATH` also requires restarting the frontend in development or rebuilding for production.

The unlinked admin sign-in path is configured with `VITE_ADMIN_PATH` (currently `/academy-admin-7f4c92`). Set it in the build and server environment so the frontend and API use the same path. For production, configure `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `VITE_ADMIN_PATH` in your hosting provider; do not add credentials to frontend code or commit `.env`. Set `SITE_URL` to the public HTTPS origin (for example, `https://your-domain.com`) so the sitemap and crawler directives use the canonical site address.

## Production

Run `npm run build` to create the frontend in `dist/`, then `npm start` to serve the built site and API. Set `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `VITE_ADMIN_PATH` and, if needed, `PORT` in the deployment environment. Use HTTPS in production so the admin session cookie is sent securely.

## API

- `GET /api/health` — API and database readiness.
- `GET /api/courses` — available courses.
- `GET /api/teachers` — teacher profiles and languages.
- `POST /api/inquiries` — validates and stores a trial request in MongoDB.
- `POST /api/admin/login`, `GET /api/admin/session`, `POST /api/admin/logout` and `GET /api/admin/inquiries` — admin session and enquiry endpoints; inquiry data requires a valid admin session.
- `DELETE /api/admin/:collection/:id` — permanently deletes a disapproved inquiry or teacher application; requires a valid admin session.

Course enquiries begin with a required class choice (`Private Class` or `Family Class`) and package choice (`Premium Package` or `Golden Package`), then collect `name`, `email`, `phone`, `country` (country of residence), `course`, `language` (`English`, `Urdu` or `Pashto`), and optional `message`. Private classes are one-to-one and last 30–45 minutes; family classes are for 3–6 members and last 1–1.5 hours. Premium includes four classes each week (Monday–Thursday); Golden includes six (Monday–Saturday). The admin panel shows each learner's selected class type and package alongside their name.
