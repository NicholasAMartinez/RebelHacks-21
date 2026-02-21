# RebelHacks-21

Full-stack trading demo built with a Next.js client and an Express server.

## Tech stack

- Client: Next.js, React, TypeScript, Supabase
- Server: Node.js, Express

## Project structure

- `client/`: Next.js app (UI + API routes)
- `server/`: Express service used by the client
- `client/supabase/`: SQL setup scripts (RLS + onboarding/trades logic)

## Prerequisites

- Node.js 18+
- npm

## 1) Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

## 2) Configure environment variables

Create `client/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SPIN_PROOF_SECRET=replace-with-a-long-random-secret
```

Create `server/.env`:

```env
PORT=3001
SPIN_PROOF_SECRET=replace-with-the-same-secret-as-client
```

Important: `SPIN_PROOF_SECRET` must match in both `client/.env.local` and `server/.env`.

## 3) Set up database (Supabase SQL)

Run these scripts in your Supabase SQL editor:

1. `client/supabase/onboarding.sql`
2. `client/supabase/profiles-rls.sql`
3. `client/supabase/trades-rls.sql`

Optional helper scripts (if needed):

- `client/supabase/fix-auth-profile-trigger.sql`
- `client/supabase/seed.sql`
- `client/supabase/remove-demo-items.sql`

## 4) Run locally

Start backend:

```bash
cd server
npm run dev
```

Start frontend in a second terminal:

```bash
cd client
npm run dev
```

App URLs:

- Client: `http://localhost:3000`
- Server health check: `http://localhost:3001/health`

## Production-like run

Client:

```bash
cd client
npm run build
npm run start
```

Server:

```bash
cd server
npm start
```

## Demo account for judges

Use a test account (or create one quickly in-app):

- Email: `judgex@test.com`
- Password: `password123`

## Screenshots / Pictures

Add your screenshots to this repository and keep this section updated before final judging.

Suggested files:

- `docs/screenshots/home.png`
- `docs/screenshots/profile.png`
- `docs/screenshots/trades.png`

Example embed format:

```md
![Home screen](docs/screenshots/home.png)
![Profile screen](docs/screenshots/profile.png)
![Trades screen](docs/screenshots/trades.png)
```
