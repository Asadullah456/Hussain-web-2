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

The unlinked admin sign-in path is configured with `VITE_ADMIN_PATH` (currently `/academy-admin-7f4c92`). Set it in the build and server environment so the frontend and API use the same path. For production, configure `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `VITE_ADMIN_PATH` in your hosting provider; do not add credentials to frontend code or commit `.env`. `SITE_URL` is set in `render.yaml` to `https://www.oneummahquranlearning.com`, the canonical site address used for redirects, sitemap and crawler directives.

## Deploying with Vercel and Render

Deploy the Vite frontend to Vercel and the Express API to Render. Vercel proxies `/api/*`, `/robots.txt` and `/sitemap.xml` to Render so browser requests and the admin session cookie stay on the Vercel site origin.

First, commit and push `render.yaml`, `vercel.json` and the README changes to GitHub. Import the repository root on both platforms; the video is bundled into the Vercel build from the checked-in project file.

### 1. Create the API service on Render

1. In Render, choose **New > Blueprint** and connect this GitHub repository. Render reads [`render.yaml`](./render.yaml) to create the API service.
2. The Blueprint uses an always-on Starter instance. Render's free web services spin down after inactivity and cause cold starts; use an always-on paid instance to avoid that behavior. Review Render's current pricing before creating it.
3. Add the prompted secret environment values in Render:
   - `MONGODB_URI`: your MongoDB Atlas connection string. In Atlas, allow connections from Render (Render may use changing outbound IPs).
   - `ADMIN_EMAIL`: the private admin login email.
   - `ADMIN_PASSWORD`: a long, unique password.
   - `SITE_URL`: already set in `render.yaml` to `https://www.oneummahquranlearning.com`. This makes visits to the Render URL redirect to the custom domain.
4. Wait for the Render service to deploy and confirm its `/api/health` endpoint returns JSON with `"status":"ok"`.

Visits to the Render URL redirect to the custom domain, except for `/api/*`, `/robots.txt` and `/sitemap.xml`, which remain available for Vercel's proxy.

### 2. Connect Vercel to the API

1. In Vercel, import the same GitHub repository as a project. Use the repository root, the `npm run build` build command, and `dist` as the output directory.
2. In **Project Settings > Environment Variables**, add `VITE_ADMIN_PATH` with the same private sign-in path configured in Render (the default is `/academy-admin-7f4c92`). Apply it to Production, Preview, and Development as appropriate.
3. `vercel.json` redirects requests on Vercel-hosted `*.vercel.app` domains to `https://www.oneummahquranlearning.com`, preserving the requested path. Its API destination is set to `https://hussain-web-2.onrender.com`; if Render assigned your service a different hostname, replace that hostname in each destination in this file.
4. Redeploy Vercel after setting the environment variable or changing the rewrite hostname. The frontend and API must use the same `VITE_ADMIN_PATH`.

### 3. Verify production

- Open `https://www.oneummahquranlearning.com` and check `/api/health`, `/robots.txt` and `/sitemap.xml`. Confirm the Render URL and the Vercel `*.vercel.app` URL redirect to the custom domain.
- Submit a trial enquiry and confirm it appears in MongoDB and the admin panel.
- Open the admin path directly, sign in, refresh the page, and sign out to verify the session cookie.
- Keep `.env` out of GitHub. Configure production secrets in Render, not Vercel or source files. If `.env` was ever committed or shared, rotate its MongoDB credential and admin password.

The frontend is static on Vercel and does not have a server cold start. The API runs continuously on Render's paid instance. MongoDB must be reachable for enquiries and admin data to work; public course and teacher pages remain available if the database is disconnected.

For a single-host deployment instead, `npm run build` creates `dist/` and `npm start` serves the built site and API together. Configure the server environment variables described above.

## API

- `GET /api/health` — API and database readiness.
- `GET /api/courses` — available courses.
- `GET /api/teachers` — teacher profiles and languages.
- `POST /api/inquiries` — validates and stores a trial request in MongoDB.
- `POST /api/admin/login`, `GET /api/admin/session`, `POST /api/admin/logout` and `GET /api/admin/inquiries` — admin session and enquiry endpoints; inquiry data requires a valid admin session.
- `DELETE /api/admin/:collection/:id` — permanently deletes a disapproved inquiry or teacher application; requires a valid admin session.

Course enquiries begin with a required class choice (`Private Class` or `Family Class`) and package choice (`Premium Package` or `Golden Package`), then collect `name`, `email`, `phone`, `country` (country of residence), `course`, `language` (`English`, `Urdu` or `Pashto`), and optional `message`. Private classes are one-to-one and last 30–45 minutes; family classes are for 3–6 members and last 1–1.5 hours. Premium includes four classes each week (Monday–Thursday); Golden includes six (Monday–Saturday). The admin panel shows each learner's selected class type and package alongside their name.
