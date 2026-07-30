# Sprint 2 — Definition of Done (MVP Vertical Slice)

## A. Acceptance checklist
- [x] From a fresh clone, `npm run dev` (or `npx http-server .`) serves the app; opens straight to the title screen.
- [x] Vertical slice runs end-to-end: keyboard/pointer input → `GameState` update → Canvas render → `GET` daily config (loading/error/fallback shown) → `PUT` run to the JSONBin leaderboard.
- [x] Local-first boot: `localStore.js` restores settings/profile/high score before any network call fires; app is playable with the network disabled.
- [x] ≥ 3 classes implemented with clear responsibilities: `GameState`, `Player`, `Enemy`, `CollisionSystem`, `GameEngine`, `Router`, `ApiClient`.
- [x] ≥ 6 ES modules at the top level of `src/`: `state/`, `services/`, `engine/`, `ui/`, `routes/`, `utils/`.
- [x] Resilience basics: retry-with-backoff in `ApiClient.request`; `AbortController` created per view by `Router` and passed through to every fetch.
- [x] Console is free of uncaught errors during a normal play session; loading/empty/error toasts are visible for network actions.

## B. Evidence
- Demo GIF: `docs/media/mvp.gif` — **record locally after first run** (not generated in this file tree).
- Run instructions: see `README.md` → "Live Demo / Install & Run".

## C. Notes
This repo ships the MVP and the Sprint-3 polish items together as a single finished deliverable; see `docs/roadmap.md` for which pieces map to which sprint.
