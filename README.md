# BrokeLads Frontend

Frontend for a sports betting app built with Next.js, React, Redux Toolkit, and Firebase (GCP Identity Platform) authentication.

## Stack

- Next.js 16
- React 19
- TypeScript
- Redux Toolkit + RTK Query
- Firebase Auth (GCP Identity Platform); Auth emulator for local dev
- Tailwind CSS

## Getting Started

Install dependencies with your preferred package manager:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The app will start on `http://localhost:3000`.

## Environment Variables

Create a local env file (`.env.local`) with the backend URL and the Firebase config. Local auth runs against the Firebase Auth emulator, so these Firebase values are placeholders it accepts:

```bash
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=http://localhost:9099
```

See `CLAUDE.md` for exact local values. These are read from:

- [`lib/services/betting-api.ts`](lib/services/betting-api.ts)
- [`lib/firebase.ts`](lib/firebase.ts)

## Scripts

- `npm run dev` starts the local dev server
- `npm run build` builds the production app
- `npm run start` runs the production build
- `npm run lint` runs ESLint

## App Structure

- [`app`](/Users/joshrobbins/me/bl-fe/app) contains routes and layouts
- [`components`](/Users/joshrobbins/me/bl-fe/components) contains auth, fixture, bet, layout, and shared UI components
- [`lib`](lib) contains API, store, and Firebase configuration
- [`public`](/Users/joshrobbins/me/bl-fe/public) contains static assets including the favicon and Apple icon

## Main Routes

- `/login`
- `/signup`
- `/fixtures`
- `/my-bets`

## Notes

- Protected routes live under `app/(protected)`.
- Auth pages live under `app/(auth)`.
- The favicon setup is defined in [`app/layout.tsx`](/Users/joshrobbins/me/bl-fe/app/layout.tsx).
