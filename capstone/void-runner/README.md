# Void Runner

A browser-native asteroid dodger. No install, no account — open the page and you're flying. Dodge drifting asteroids, ride the combo streak, and bank your run to a shared leaderboard. **Track: Games / Entertainment.**

## Features

- **Canvas-driven dodge loop** — keyboard (arrows/WASD) or pointer/touch drag to steer, Space to dash with a short cooldown and i-frames.
- **Rising difficulty** — spawn rate and asteroid speed ramp the longer you survive; a combo multiplier rewards clean streaks.
- **Power-ups** — grab a drifting shield or time-slow field mid-run.
- **Daily challenge** — the title screen pulls a small published JSON each day to vary spawn/speed modifiers.
- **Shared leaderboard** — submit a finished run to a public JSONBin-backed leaderboard, or just play offline.
- **Local-first** — settings, profile name, run history, and personal best all persist to `localStorage` and restore instantly, with an Export/Import JSON backup flow.

## Screenshots / Demo

_Add a screenshot or short GIF at `docs/media/mvp.gif` after your first local run — referenced here once captured._

## Live Demo / Install & Run

- **Live demo (GitHub Pages):** `https://<your-org>.github.io/<repo>/` — add once deployed. Hash-based routing (`#/title`, `#/play`, …) means deep links work without a `404.html` redirect.
- **Local:**
  ```bash
  npm run dev
  # or, with no install at all:
  npx http-server . -p 8080 -c-1
  ```
  Then open `http://localhost:8080`. No build step — it's plain ES modules loaded straight by the browser.
- **Requirements:** a viewport of at least 340×420 (the play screen shows a "not supported" notice below that); keyboard or a pointer/touchscreen for controls.

## How It Works (High-Level)

- **Rendering stack:** hand-rolled HTML Canvas 2D render loop (`src/engine/GameEngine.js`) — chosen so the app's own code owns the entity lifecycle, layering, and resize handling rather than delegating to a game framework.
- **Architecture in brief:** a hash-based `Router` (`src/routes/Router.js`) swaps between four views (title, play, game-over, leaderboard) into `#view-root`. Each view mounts, does its own data fetching, and returns a cleanup function; the router aborts in-flight fetches on navigation. Game state flows one way: input → `GameState`/`Player`/`Enemy` update → Canvas re-render → DOM HUD reflects the same state object.
- **Local-first behavior:** `src/services/localStore.js` is the only module that touches `localStorage`. Settings, profile, run history, and high score are read synchronously on boot so the app renders before any network call resolves, and it stays fully playable offline.

Full breakdown: [`docs/architecture_sketch.md`](docs/architecture_sketch.md).

## Data & Networking (High-Level)

- **Public GET** — a small published JSON document ("today's daily challenge modifiers") fetched with `fetch`/`async-await`, cached for 10 minutes, with a hardcoded offline fallback if unreachable or unconfigured:
  ```json
  { "seedDate": "2026-07-27", "spawnRateMultiplier": 1.15, "speedMultiplier": 1.05, "theme": "signal" }
  ```
- **Cloud write (JSONBin)** — a finished run is merged into a shared leaderboard array and written back with `PUT`:
  ```json
  { "entries": [{ "id": "run_9f01", "name": "NOVA", "score": 4210, "ts": 1753500000000 }] }
  ```
- Reads are cached with a short TTL; only non-sensitive, public run data is written. Full schema, merge policy, and endpoint table: [`docs/jsonbin_schema.md`](docs/jsonbin_schema.md), [`docs/endpoints.md`](docs/endpoints.md).

## Configuration

Void Runner ships **unconfigured** by design — no keys are committed to the repo. The app still boots and is fully playable (daily config falls back to defaults; leaderboard submission is disabled with a clear message) until you point it at your own bins:

1. Create two bins at [jsonbin.io](https://jsonbin.io): one public "daily config" bin, one "leaderboard" bin (see shapes above).
2. In the browser console on this app's page, run:
   ```js
   localStorage.setItem('voidrunner:cfg:dailyConfigBinId', '<your daily-config bin id>');
   localStorage.setItem('voidrunner:cfg:leaderboardBinId', '<your leaderboard bin id>');
   localStorage.setItem('voidrunner:cfg:apiKey', '<your JSONBin X-Master-Key>');
   ```
3. Reload. This keeps real ids out of source control while still being fully gradeable end-to-end. Editing the defaults in `src/services/config.js` works too if you prefer to commit a demo-only key.

## License / Credits

Fonts: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk), [Inter](https://fonts.google.com/specimen/Inter), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts. No other third-party runtime dependencies — the render loop, routing, and REST client are all hand-written for this project.

## Developer Docs

- [`docs/pitch.md`](docs/pitch.md) — track, product, core loop
- [`docs/roadmap.md`](docs/roadmap.md) — MVP vs Full, risks
- [`docs/architecture_sketch.md`](docs/architecture_sketch.md) — modules, classes, data flow
- [`docs/endpoints.md`](docs/endpoints.md) — REST endpoint table
- [`docs/jsonbin_schema.md`](docs/jsonbin_schema.md) — schema + merge policy
- [`docs/dod-sprint1.md`](docs/dod-sprint1.md) · [`dod-sprint2.md`](docs/dod-sprint2.md) · [`dod-sprint3.md`](docs/dod-sprint3.md)

_Project board: add your GitHub Projects link here once created (see `docs/dod-sprint1.md`)._
