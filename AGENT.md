Project: EcoConnect Ekiti, a hackathon app where students and residents of Ikole and Oye in Ekiti, Nigeria report community problems with text, a photo and optional audio. Gemma 4 analyses each report. I am the backend developer. Stack: Node.js with Express, [TypeScript or JavaScript], Supabase (Postgres and Storage). The frontend is a separate React app (Vite) in the frontend folder; I only edit the backend folder. All code must be written fresh in this repo now.

Shared contract (exact strings, never change them):
category: waste | drainage | road | water | streetlight | power_outage | hostel_facility | other
severity: low | medium | high | urgent
status: pending | forwarded | in_progress | resolved
language: en | yo | pcm
AI result fields: category, severity, location_text, summary, language, needs_review, detected_issue, reason, review_reason, forward_message

Path parameters written as [reference] or [id] mean :reference and :id in Express. Rules: read secrets only from environment variables; never hardcode secrets and never expose the Supabase service role key to the browser; validate all input; return errors as JSON in the form { error: string } with a correct status code; keep the code simple and readable; do not add features I did not ask for; after each task list the files you changed and tell me how to run and test it.