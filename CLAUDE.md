# bl-fe — frontend

Next.js 16 (App Router) + React 19 + TypeScript frontend for the BrokeLads sports-betting demo. Talks to the `brokelads_cloud` backend over REST; auth is AWS Cognito via Amplify. See `../CLAUDE.md` for how the two run together.

**Package manager is npm** (`package-lock.json` is real; `pnpm-lock.yaml` is a 92-byte stub — ignore it).

## Layout

- `app/` — App Router. Route groups: `(auth)/` (login, signup) wrapped by `AuthRedirect`; `(protected)/` (fixtures, my-bets) wrapped by `RouteGuard`. `app/page.tsx` redirects `/` → `/fixtures`. Root `layout.tsx` mounts the Amplify + Redux providers and the toaster.
- `components/` — `auth/`, `fixtures/` (incl. `bet-dialog.tsx`), `bets/`, `layout/app-nav.tsx`, `providers/`, and `ui/` (shadcn/ui, new-york style, Radix primitives).
- `lib/` — `services/betting-api.ts` (RTK Query API slice — the data boundary), `store.ts`, `amplify-config.ts`, `utils.ts` (`cn()`).
- `hooks/` — `use-auth.ts` (Amplify session), `use-toast.ts`, `use-debounced-value.ts`, `use-mobile.ts`.

## Data layer

All backend access goes through the single RTK Query slice in `lib/services/betting-api.ts`. Add new endpoints there, not ad-hoc `fetch`. It maps 1:1 to the backend:
- `getMe` → `GET /client/me`, `getFixtures` → `GET /client/fixture?search=`, `getUserBets` → `GET /client/bet?outcome=&search=`, `createBet` → `POST /client/bet`.

`prepareHeaders` attaches `Authorization: Bearer <idToken>` from Amplify's `fetchAuthSession()`. Money fields (balance/stake/returns) are **strings** end-to-end — backend sends `Decimal` as string; don't coerce to `number` for display/math without care.

State: RTK Query cache only — no Redux feature slices, no Context/Zustand. Auth state comes from `useAuth()`.

## Commands

```bash
npm ci               # install (Node 25 locally; CI uses package.json's node version)
npm run dev          # dev server on http://localhost:3000
npm run lint         # eslint 9 (flat config, eslint-config-next) — CI gate, clean
npm run typecheck    # tsc --noEmit — CI gate, clean
npm run build        # next build
```

## Conventions & gotchas

- Path alias `@/*` → repo root (`tsconfig.json`). Import as `@/components/...`, `@/lib/...`.
- `next.config.mjs` sets `typescript.ignoreBuildErrors: true` — **builds won't fail on type errors**. Always run `npm run typecheck` yourself before considering a change done; the build won't catch it. `images.unoptimized: true` too.
- `npm run lint` works (eslint 9 flat config in `eslint.config.mjs`, extending `eslint-config-next`) and gates CI alongside typecheck. Note `eslint-config-next` 16 ships a native flat config — spread its default export; do **not** wrap it in `FlatCompat` (circular-JSON crash). react-hooks v7 rules are strict (React Compiler); `useAuth`'s mount-time fetch carries one inline `eslint-disable` with a reason — prefer fixing at the source over muting the rule.
- No test framework at all (no Jest/Vitest/Playwright). Verify changes by running the app.
- Tailwind v4 (CSS-first config in `app/globals.css`, OKLch theme vars). No `tailwind.config.js`.
- shadcn components in `components/ui/` are generated — extend via `components.json` / the CLI rather than hand-editing where possible.
- Amplify env vars use non-null assertions (`amplify-config.ts`) — a missing `NEXT_PUBLIC_AMPLIFY_*` throws at runtime, not build.

## Env

Create `.env.local` (none committed):

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AMPLIFY_USER_POOL_ID=...
NEXT_PUBLIC_AMPLIFY_USER_POOL_CLIENT_ID=...
NEXT_PUBLIC_AMPLIFY_REGION=eu-west-2
```

The Cognito pool/client must match the backend's (`COGNITO_CLIENT_ID` / `USER_POOL_ID`) or token verification fails.

## Branches

Default branch `main`. Feature branches: `feature/<slug>`. Deploy is not codified in this repo (no deploy workflow) — almost certainly Vercel via git integration (`@vercel/analytics` is wired in). Confirm before assuming.
