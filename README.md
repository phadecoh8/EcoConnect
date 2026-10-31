# EcoConnect Ekiti

> Report a community problem in Ikole and Oye. Gemma 4 sorts it, rates it and drafts the message to the right office, and everyone can track what happens next.

**Live demo:** [add URL] · **Demo video:** [add URL] · **Built at:** [HacktoberFest 2026], 31 October 2026

---

## The problem

Students and residents of Ikole-Ekiti and Oye-Ekiti meet community problems every day: blocked drainage, uncollected waste, damaged roads, water shortages, broken streetlights, power outages and hostel faults. People often do not know which office to contact, and informal complaints have no reference number, no owner and no way to see what happened next.

## Our solution

EcoConnect Ekiti is a mobile-first web app.

1. A citizen submits a report with text, a photo and a location (and optionally a voice note).
2. Gemma 4 analyses it: category, severity, language, an English summary and a reason.
3. The backend saves it with a reference number such as `ECO-0001`, and the citizen can track its status at any time.
4. Admins review reports on a dashboard, see the AI analysis and a suggested office, copy a ready-to-send message (email or WhatsApp) and update the status. Every status change is recorded.

## How Gemma 4 is used

| What Gemma does | How it helps |
| --- | --- |
| Reads the uploaded photo | Identifies the visible problem, so a photo alone is enough to file a report |
| Understands English, Yoruba and Nigerian Pidgin | Detects the language and writes an English summary for the office |
| Classifies and rates | Picks one of 8 categories and 4 severity levels and explains why |
| Returns strict JSON | The backend validates every field before anything is saved |
| Drafts the forwarding message | A ready-to-send note for the right office; it never claims the office has received the report |
| Knows when it is unsure | Sets `needs_review` so a human checks it; if Gemma fails, the report is still saved |

**Why an open model:** [one or two sentences, for example cost, privacy, ability to run locally. Fill in after the hosted-or-local decision.]

**Test results:** [add the results from the test set, for example: category correct on X of 10 photos, valid JSON on Y of Z calls, average seconds per request. Details in `docs/ai-test-results.md`.]

## Features

Tick what is finished before submitting.

- [ ] Report a problem with text, photo and location
- [ ] Reference number and public status tracking
- [ ] AI analysis (category, severity, language, summary, reason)
- [ ] Needs-review flag and a safe fallback when the AI fails
- [ ] Admin login, dashboard with filters and stats
- [ ] Report detail with AI panel, forward message (copy, email, WhatsApp) and status updates with history
- [ ] Voice notes (optional)

## Architecture

```
Browser (React)  ──►  Express API  ──►  Supabase (Postgres + Storage)
                          │
                          └──►  Gemma 4 (analyseReport)
```

In production, Express serves the built React app and the API from one address. In development, the Vite dev server forwards `/api` requests to Express.

## Tech stack

- **Frontend:** React, Vite, React Router, Tailwind CSS
- **Backend:** Node.js, Express
- **Database and files:** Supabase (Postgres and Storage)
- **AI:** Gemma 4 via [Ollama or hosted endpoint]
- **Hosting:** [host]

## File structure

This is the target layout. Use `.jsx` and `.js` instead of `.tsx` and `.ts` if the team chose JavaScript, and update the tree to match the real files before you submit.

```
ecoconnect-ekiti/
├── README.md
├── .gitignore                       # must list .env files
├── docs/
│   ├── api-contract.md              # request and response shapes
│   ├── ai-test-results.md           # Gemma test set and scores
│   └── design/                      # page designs (images)
├── frontend/                        # React app (Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts               # proxies /api to Express in development
│   ├── .env.example                 # VITE_USE_MOCK
│   ├── public/                      # favicon and static images
│   └── src/
│       ├── main.tsx                 # starts the app
│       ├── App.tsx                  # route list (7 pages)
│       ├── index.css                # Tailwind and theme colours
│       ├── api/
│       │   ├── index.ts             # one function per API call
│       │   └── mock.ts              # fake data used when VITE_USE_MOCK=true
│       ├── components/              # Button, TextInput, TextArea, StatusBadge,
│       │                            # SeverityChip, CategoryCard, ReportCard,
│       │                            # StatusTimeline, StatCard, Modal, Toast,
│       │                            # Skeleton, GemmaPanel
│       └── pages/
│           ├── Home.tsx                 # /
│           ├── Report.tsx               # /report
│           ├── ReportSuccess.tsx        # /report/success
│           ├── Track.tsx                # /track and /track/:reference
│           ├── AdminLogin.tsx           # /admin/login
│           ├── AdminDashboard.tsx       # /admin
│           └── AdminReportDetail.tsx    # /admin/reports/:id
└── backend/                         # Express API
    ├── package.json
    ├── .env.example                 # names of all environment variables
    ├── server.ts                    # starts Express, serves frontend/dist in production
    ├── db/
    │   └── schema.sql               # tables, sequence, constraints, row level security
    ├── scripts/
    │   ├── seed-demo.ts             # demo reports labelled [DEMO]
    │   └── smoke-test.ts            # end-to-end checks against a running URL
    ├── lib/
    │   ├── config.ts                # reads and validates environment variables
    │   ├── supabase.ts              # server-only Supabase client
    │   ├── storage.ts               # uploadMedia (type and size checks)
    │   └── ai/
    │       ├── analyseReport.ts         # Gemma 4 call
    │       ├── validateAnalysis.ts      # checks AI output against allowed values
    │       ├── analyseWithFallback.ts   # timeout and safe fallback
    │       ├── prompts.ts               # system prompt and examples
    │       └── forwardMessage.ts        # drafts the message to the office
    ├── middleware/
    │   ├── requireAdmin.ts          # signed cookie check
    │   └── upload.ts                # multipart parsing and limits
    └── routes/
        ├── reports.ts               # public routes
        └── admin.ts                 # login, list, detail, status, stats, agencies, forward message
```

## Getting started

**Prerequisites:** Node.js [version], a Supabase project, and access to Gemma 4 ([Ollama locally or a hosted endpoint]).

1. **Clone and install**
   ```
   git clone [repo-url]
   cd ecoconnect-ekiti/backend && npm install
   cd ../frontend && npm install
   ```
2. **Environment variables:** copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env`, then fill in the values (table below). Never commit these files.
3. **Database:** run `backend/db/schema.sql` in the Supabase SQL editor, then create a public storage bucket named `report-media`.
4. **Run in development** (two terminals; adjust the script names if yours differ)
   ```
   cd backend && npm run dev      # API on http://localhost:3001
   cd frontend && npm run dev     # app on the Vite address; /api is proxied to Express
   ```
5. **Run in production mode**
   ```
   cd frontend && npm run build
   cd ../backend && npm start     # serves the API and the built app on one address
   ```
6. **Demo data (optional):** `cd backend && npm run seed` adds reports labelled `[DEMO]`.

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | backend | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | backend | Server-only database key. Never expose it to the browser |
| `ADMIN_PIN` | backend | PIN for the admin login |
| `SESSION_SECRET` | backend | Signs the admin session cookie |
| `GEMMA_API_URL` | backend | Gemma 4 endpoint |
| `GEMMA_API_KEY` | backend | Key for the Gemma endpoint, if needed |
| `GEMMA_MODEL` | backend | Model name |
| `AI_FORCE_FAIL` | backend | Set to `true` to test the AI fallback |
| `PORT` | backend | API port (default 3001) |
| `VITE_USE_MOCK` | frontend | `true` uses fake data, `false` calls the real API |

## API reference

Errors are always returned as `{ "error": "message" }`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/reports` | public | Submit a report (text, photo, optional audio) |
| GET | `/api/reports/:reference` | public | Public status, history and AI summary for one report |
| POST | `/api/admin/login` | public | Sign in with the admin PIN |
| POST | `/api/admin/logout` | admin | Sign out |
| GET | `/api/admin/reports` | admin | List reports with filters and paging |
| GET | `/api/admin/reports/:id` | admin | Full report with AI analysis and recommended office |
| PATCH | `/api/admin/reports/:id` | admin | Update status with a note (writes history) |
| GET | `/api/admin/stats` | admin | Counts by status, severity and category |
| GET | `/api/admin/agencies` | admin | List offices |
| POST | `/api/admin/reports/:id/forward-message` | admin | Drafted message for the responsible office |

## Data model

- **reports:** every complaint, with its AI analysis, status and media links. The reference (`ECO-0001`, `ECO-0002`, …) is generated by a database sequence, so simultaneous submissions never collide.
- **status_history:** one row for every status change, with who changed it and a note.
- **agencies:** offices that handle each category, with a `verified` flag. Unverified contacts are clearly marked in the app.

Row level security is on for all tables with no public policies. Only the server, using the service role key, reads and writes data.

## Shared values

```
category: waste | drainage | road | water | streetlight | power_outage | hostel_facility | other
severity: low | medium | high | urgent
status:   pending | forwarded | in_progress | resolved
language: en | yo | pcm

AI result: category, severity, location_text, summary, language, needs_review,
           detected_issue, reason, review_reason, forward_message
```

## Testing

- **Smoke test:** `cd backend && npm run smoke-test` runs the full journey against a running URL and prints PASS or FAIL per check.
- **AI test set:** [10 photos and 10 written complaints in English, Yoruba and Pidgin, scored in `docs/ai-test-results.md`].
- **Failure drill:** start the backend with `AI_FORCE_FAIL=true`, submit a report, and confirm it still saves with `needs_review` set.

## Demo notes

- Admin PIN: [provided in the submission notes, not stored in this repository].
- Demo reports are labelled `[DEMO]`. Demo photos are stored in a public bucket for the demo only.

## Team

| Name | Role |
| --- | --- |
| [Ololade] | Frontend |
| [Phadecoh] | Backend |
| [Spectra] | AI, demo data and pitch |

## Limitations and next steps

- Agency contacts are placeholders until verified; forwarding is a drafted message, not an integration with any office.
- Yoruba and Pidgin accuracy needs more testing before real use.
- Photos are public in the demo; a real launch would use private links and rate limiting.
- Next: pilot with the student union and local offices, voice notes, a map view, and an option to run a smaller Gemma model locally for weak connections.

## Acknowledgements

Built with Gemma 4, Supabase, React and Express. [AI coding assistants (opencode, Codex) were used to help write code, and the team reviewed it. Keep or remove this line to match what actually happened.]