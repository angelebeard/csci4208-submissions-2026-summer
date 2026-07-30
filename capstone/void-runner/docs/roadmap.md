# Roadmap

## MVP (Sprint 2)
- SPA skeleton: single `index.html` shell, hash `Router`, four registered views.
- `GameEngine` render loop on `<canvas>`: player movement (keyboard + pointer), asteroid spawning, difficulty ramp.
- `CollisionSystem` resolves hits/dodges; `GameState` tracks score/combo/lives.
- Public GET (`publicApi.js`) to a daily-challenge JSON bin, with TTL cache, loading/error toast, and an offline fallback.
- Cloud write (`cloudApi.js`) posting a finished run to a JSONBin leaderboard bin.
- Local-first boot: `localStore.js` restores settings/profile/high score before any network call; app is fully playable offline.
- Vertical slice path: input → state update → canvas render → GET daily config → PUT run to leaderboard.

## Full (Sprint 3)
- Power-ups with inheritance (`ShieldPowerUp`, `SlowFieldPowerUp` extending `PowerUp`).
- Radar/minimap HUD instrument (signature visual element) showing nearby asteroids.
- Pause overlay (P / Esc), dash-with-cooldown mechanic, i-frames on dash.
- Leaderboard view: merges cloud standings with local run history; Export JSON / Import JSON backup flow.
- "Not supported" requirements screen for viewports under 340×420.
- Resize handling for the canvas (devicePixelRatio-aware) and responsive layout down to tablet width.
- Retry-with-backoff + `AbortController` wired through the shared `ApiClient` class for both services.

## Risks & Mitigations (Top 3)
1) **Third-party API flakiness/CORS** for the public GET → mitigated by hosting the daily config as a small public JSONBin bin (predictable CORS, no key needed for GET) and always falling back to sane local defaults if the fetch fails or the bin isn't configured yet.
2) **Concurrent leaderboard writes clobbering each other** → mitigated by a documented last-write-wins merge policy (fetch-merge-PUT, de-dupe by run id, keep top 20) — acceptable at class-project traffic; documented as a known tradeoff in `docs/jsonbin_schema.md`.
3) **Canvas performance degrading as asteroid count grows** → mitigated by offscreen culling every frame and capping practical enemy count via the spawn-interval floor (`Math.max(260, …)` in `GameEngine`).
