# BrokeLads Frontend

Frontend for a sports betting app built with Next.js, React, Redux Toolkit, and AWS Amplify authentication.

## Stack

- Next.js 16
- React 19
- TypeScript
- Redux Toolkit + RTK Query
- AWS Amplify Auth
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

Create a local env file and set the values required by Amplify and the backend API:

```bash
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_AMPLIFY_USER_POOL_ID=
NEXT_PUBLIC_AMPLIFY_USER_POOL_CLIENT_ID=
NEXT_PUBLIC_AMPLIFY_REGION=
```

These are read from:

- [`lib/services/betting-api.ts`](/Users/joshrobbins/me/bl-fe/lib/services/betting-api.ts)
- [`lib/amplify-config.ts`](/Users/joshrobbins/me/bl-fe/lib/amplify-config.ts)

## Scripts

- `npm run dev` starts the local dev server
- `npm run build` builds the production app
- `npm run start` runs the production build
- `npm run lint` runs ESLint

## App Structure

- [`app`](/Users/joshrobbins/me/bl-fe/app) contains routes and layouts
- [`components`](/Users/joshrobbins/me/bl-fe/components) contains auth, fixture, bet, layout, and shared UI components
- [`lib`](/Users/joshrobbins/me/bl-fe/lib) contains API, store, and Amplify configuration
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
