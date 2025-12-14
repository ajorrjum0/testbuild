Purpose
-------
These short instructions help an AI coding agent become productive in this repo quickly. They focus on the app's architecture, developer workflows, important files, and project-specific patterns you should know before making changes.

Big picture
-----------
- Single-page React + TypeScript app scaffolded with Vite. Entry: [src/main.tsx](src/main.tsx).
- UI uses Tailwind CSS ([tailwind.config.js](tailwind.config.js)) and small reusable components in [src/components](src/components).
- Data is fetched client-side from third-party APIs (Dexscreener). Key data consumers:
  - Token price: [src/components/TokenPrice.tsx](src/components/TokenPrice.tsx)
  - FDV: [src/ZoraData.tsx](src/ZoraData.tsx)
- Static assets (images/icons) live in `public/` (used by [src/ArtCarousel.tsx](src/ArtCarousel.tsx)).

Developer workflows
-------------------
- Install & run locally:
  - `npm install`
  - `npm run dev` (Vite dev server)
  - `npm run build` (production build)
  - `npm run preview` (serve build locally)
- Lint/typecheck:
  - `npm run lint` (ESLint)
  - `npm run typecheck` (TypeScript, `tsconfig.app.json`)
- There are no test scripts in package.json. Add tests under `src/` and a test runner (e.g., Vitest) if you need CI coverage.

Patterns & conventions (project-specific)
-----------------------------------------
- Small, focused React function components exported as defaults (see `TokenPrice`, `ZoraData`, `ArtCarousel`).
- Network code often uses polling + local state with manual cleanup via `clearInterval` and a `mounted` flag. Example: [src/components/TokenPrice.tsx](src/components/TokenPrice.tsx) and [src/ZoraData.tsx](src/ZoraData.tsx).
- Shared network helper exists: [src/utils/fetchWithRetry.ts](src/utils/fetchWithRetry.ts). Prefer it for flaky endpoints (has retry and delay semantics), but note current components still call `fetch` directly and implement their own retry/timeout logic.
- UI and accessibility:
  - Buttons use `aria-label` when icon-only (see [src/ArtCarousel.tsx](src/ArtCarousel.tsx)).
  - Tailwind utility classes are used liberally — prefer adding classes over inline CSS when possible.

Integration points & external dependencies
-----------------------------------------
- Dexscreener is the active data source for token price and FDV (see the two components above). Network calls are logged to console for debugging.
- `@supabase/supabase-js` is present in package.json but not yet used — likely planned integration point. If you add Supabase usage, follow the Vite environment variable patterns (e.g., `import.meta.env`).

What to watch out for
---------------------
- Components poll remotely on intervals; be careful when increasing frequency (rate-limits) and always clear timers on unmount.
- `AbortSignal.timeout` is used for fetch timeouts — keep cross-environment compatibility in mind if running Node-based tests/SSR.
- The token contract is now provided through an environment variable: `VITE_TOKEN_CONTRACT`. See `.env.example` for a template. Components gracefully skip network calls when the value is not set.

Where to look first (quick links)
--------------------------------
- App shell & routing: [src/App.tsx](src/App.tsx)
- Token/price fetching: [src/components/TokenPrice.tsx](src/components/TokenPrice.tsx)
- FDV fetching: [src/ZoraData.tsx](src/ZoraData.tsx)
- Carousel & static art: [src/ArtCarousel.tsx](src/ArtCarousel.tsx)
- Fetch utilities: [src/utils/fetchWithRetry.ts](src/utils/fetchWithRetry.ts)
- Build & scripts: [package.json](package.json)

If something's unclear
----------------------
- Ask what the intended data source is (Dexscreener vs Zora APIs). If adding new data sources, prefer centralizing fetch logic in `src/utils/` and reuse `fetchWithRetry`.
- If you add tests, wire `npm run test` into `package.json` and document the command in `README.md`.

Next steps (for maintainers)
---------------------------
- Consider centralizing the `TOKEN_CONTRACT` value and consolidating fetch logic to `fetchWithRetry`.
- Add a short `CONTRIBUTING.md` or expand `README.md` with setup/CI details if this repo will accept outside contributions.

---
If you'd like, I can open a PR adding this file and follow up by centralizing the token constant and updating components to use `fetchWithRetry`.
