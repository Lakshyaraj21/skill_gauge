# SkillGauge — AI Mock Interview Platform

> **One-line:** SkillGauge is an AI-powered mock-interview web app built with Next.js (App Router), TypeScript, TailwindCSS and Firebase. It generates role-specific interview questions using a large language model, runs a voice-driven interview assistant (via Vapi.ai / 11Labs / Deepgram), captures the transcript, and stores interview records & feedback in Firestore.

---

## Demo / Live demo

Visit the deployed app: https://skill-gauge.vercel.app/


---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [How it works](#how-it-works)
- [Repository structure](#repository-structure)
- [Requirements & environment variables](#requirements--environment-variables)
- [Local setup](#local-setup)
- [Important internals](#important-internals)
- [Deployment (recommended)](#deployment-recommended)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License & credits](#license--credits)

---

## Features

- Generate role- and level-specific interview questions using a cloud LLM (Gemini / OpenAI-style model via the `ai` + `@ai-sdk/google` packages).
- Create voice-first interview sessions using the Vapi.ai web SDK for real-time call, transcription (Deepgram), and TTS (11Labs).
- Save interviews and feedback to Firebase Firestore.
- Authentication + user profiles (Firebase)
- Feedback generation workflow (server action) that summarizes the transcript into strengths, weaknesses and suggestions.
- Tech icon resolution for provided tech stacks and visually rich interview cards.

---

## Tech stack

- Frontend: Next.js (App Router, TypeScript), React 19, Tailwind CSS
- Voice & AI: `@vapi-ai/web` (Vapi) for call & speech events; `ai` + `@ai-sdk/google` for server-side text generation
- Backend / data: Firebase (Firestore + Admin SDK) for storage and user management
- Utilities: dayjs, react-hook-form, sonner (notifications), lucide-react icons

---

## How it works (high level)

1. User requests an interview outline (role, level, tech stack, question count).  
2. Frontend calls `/api/vapi/generate` which uses the `ai` package + Google model to generate a JSON array of questions and stores the interview document in Firestore.  
3. The user starts a voice session powered by Vapi.ai — Vapi emits call, transcript and speech events to the client.  
4. Client collects the transcript, displays interviewer UI and when finished calls server action to create generated feedback (summarization/assessment) which is stored alongside the interview.

---

## Repository structure (key files)

```
/ (root)
├─ app/                     # Next.js App Router pages & api
│  ├─ api/vapi/generate/     # server route that calls the LLM and saves interview
│  ├─ (auth)/                # sign-in / sign-up pages
│  └─ (root)/interview/      # interview listing and interview session pages
├─ components/               # UI components (Agent, InterviewCard, etc.)
├─ firebase/                 # firebase client & admin setup
├─ lib/                      # actions (server), utils, vapi SDK wrapper
├─ constants/                # assistant config, mappings, covers, dummy data
├─ public/                   # covers, images, tech icons (if any)
├─ package.json
└─ README.md                 # original; this file replaces and expands it
```

> See `app/api/vapi/generate/route.ts` for the exact prompt logic used to generate questions.

---

## Requirements & environment variables

Required env variables for local development and production (example names used in the code):

```bash
# Firebase Admin (server)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Vapi (client integration)
NEXT_PUBLIC_VAPI_WEB_TOKEN=
NEXT_PUBLIC_VAPI_WORKFLOW_ID=

# (Optional) Any other provider tokens if you replace the defaults:
# - VAPI workflows can use Deepgram / 11Labs / OpenAI internally — configure them in your Vapi dashboard.
# - If you use Google/AI SDK server keys instead of built-in env handling, add those here.

NODE_ENV=development
```

**Important security note:** Never commit `FIREBASE_PRIVATE_KEY` or other sensitive secrets to the repo. Use environment variables in Vercel, Netlify or GitHub Actions for production.

---

## Local setup

1. Clone the repository

```bash
git clone <repo-url>
cd skill_gauge-main
```

2. Install dependencies

```bash
# npm
npm install
# or pnpm
pnpm install
# or yarn
yarn
```

3. Create a `.env.local` file in the project root and add the required environment variables (see above).

4. Run the dev server

```bash
npm run dev
# then open http://localhost:3000
```

---

## Important internals / notes for maintainers

- **LLM prompt & generation**: The generation endpoint (`app/api/vapi/generate/route.ts`) crafts a prompt and calls `generateText` with `google('gemini-2.0-flash-001')`. The returned string is expected to be a JSON array of questions — the code `JSON.parse(questions)` assumes the model returns strict JSON. Consider adding validation or fallback parsing if the model returns stray text.

- **Realtime voice & events**: `components/Agent.tsx` subscribes to `vapi` events (`call-start`, `message`, `speech-start`, etc.) and collects final transcripts. The `lib/vapi.sdk.ts` file initializes Vapi using `NEXT_PUBLIC_VAPI_WEB_TOKEN`. Ensure the Vapi dashboard workflow references the interviewer config (Deepgram, 11Labs) you intend to use.

- **Feedback generation**: The current code wires `createFeedback` server action to store transcript and metadata, and expects another server-side LLM call to generate strengths/weaknesses. There is a `TODO` placeholder in `Agent.tsx` indicating where feedback-generation server action should be implemented/extended.

- **Tech icons**: The repo maps common tech names to devicon icons. When passing `techstack` strings to the generation endpoint, normalize values (comma-separated) to match `constants/mappings`.

- **Firebase**: `firebase/admin.ts` expects the Admin service account credentials from env vars. `firebase/client.ts` currently contains a hard-coded config for the demo project — replace with your own Firebase client config in production.

---

## Deployment

1. Deploy to Vercel (recommended) or any Node-compatible host.
2. In Vercel project settings, add the environment variables listed above.
3. If using Vapi.ai workflows, set up the workflow on the Vapi dashboard and add the workflow ID and web token into environment variables.

---

## Contributing

- Open an issue for bugs or feature requests.
- For changes: fork → branch → PR. Add tests and update README when behavior changes.

---

## Roadmap / Ideas

- Add robust input validation for model outputs and a safer parser for questions lists.
- Add automated tests for server actions and the generation endpoint.
- Expand interviewer personalities and multiple voice presets.
- Add analytics on user progress & strengths over time.

---

## License & credits

This project is open for modification — add a proper `LICENSE` file if you plan to publish.  
Credits: built on top of Next.js, Vapi.ai, Firebase, and the `ai`/Google model ecosystem.

---

*Generated README — if you want, I can:*
- produce a shorter README (one-page quickstart),
- add deployment instructions for a specific host (Vercel / Netlify),
- generate environment variable `.env.example`, or
- create screenshot placeholders and a `docs/` folder.
