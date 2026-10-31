# EcoConnect Ekiti

EcoConnect Ekiti is a mobile-first app for reporting community problems in Ikole and Oye, tracking their status, and helping admins route reports to the right office. The frontend uses React, Vite, React Router and Tailwind CSS; the API uses Express, Supabase and Gemma 4.

## Workspace layout

```text
apps/
  web/   React + Vite frontend
  api/   Express API, Supabase schema, scripts and AI helpers
  docs/  API contract, AI evaluation notes and design assets
pnpm-workspace.yaml
```

The repository is a pnpm workspace. Each app is a separate workspace package (`@ecoconnect/web`, `@ecoconnect/api`).

## Install and run

Install dependencies from the repository root:

```sh
pnpm install
```

Run the web app and API in separate terminals:

```sh
pnpm dev:web
pnpm dev:api
```

Vite forwards `/api` requests to `http://localhost:3001`. Build the web app with `pnpm build:web`; run workspace builds with `pnpm build`.

## Environment and database

Copy `apps/api/.env.example` to `apps/api/.env` and `apps/web/.env.example` to `apps/web/.env`, then configure the variables described in the environment section below. Never commit `.env` files. Apply `apps/api/db/schema.sql` in Supabase and create a `report-media` storage bucket.

| Variable | App | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | API | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | API | Server-only database key |
| `ADMIN_PIN` | API | Admin login PIN |
| `SESSION_SECRET` | API | Signs the admin session cookie |
| `GEMMA_API_URL` | API | Gemma endpoint |
| `GEMMA_API_KEY` | API | Optional endpoint key |
| `GEMMA_MODEL` | API | Model identifier |
| `AI_FORCE_FAIL` | API | Forces AI fallback when `true` |
| `PORT` | API | API port (default 3001) |
| `VITE_USE_MOCK` | Web | Use mock API data when `true` |

## Changes in this workspace migration

- Moved `frontend/` to `apps/web/` and named its workspace package `@ecoconnect/web`.
- Moved `backend/` to `apps/api/` and defined its scripts and runtime/development dependencies there.
- Moved `docs/` to `apps/docs/` and added a docs index.
- Added root `package.json` scripts for installing, developing and building the workspace, plus `pnpm-workspace.yaml`.
- Kept the existing README architecture, feature list, API behavior, data model, shared values, testing notes and limitations as the project specification. Implementation remains a starter scaffold.

## Project specification

The app should accept reports with text, photos, locations and optional voice notes; use Gemma 4 to classify category and severity, detect language, summarize and draft a forwarding message; preserve reports and status history in Supabase; and let citizens track report references. Admins review reports and update status. See [API contract](apps/docs/api-contract.md) and [AI test results](apps/docs/ai-test-results.md).
