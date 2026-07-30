# Sprint 3 — Definition of Done (Full + Polish)

## A. Acceptance checklist
- [x] Full feature set from `docs/roadmap.md` delivered:
  - [x] `ShieldPowerUp` / `SlowFieldPowerUp` (inheritance from `PowerUp`)
  - [x] Radar/minimap HUD instrument (`ui/Hud.js` → `drawRadar`)
  - [x] Pause overlay (P / Esc) + dash-with-cooldown + i-frames
  - [x] Leaderboard view merging cloud standings with local run history
  - [x] Export JSON / Import JSON backup flow
  - [x] "Not supported" requirements screen under 340×420 viewports
  - [x] devicePixelRatio-aware canvas resize handling
- [x] Interactivity depth: keyboard (arrows/WASD + space + P/Esc), pointer/touch drag-to-steer, tap-to-dash — all wired into `Player`/`GameState`, not cosmetic.
- [x] Responsiveness: title/game-over/leaderboard screens usable at laptop (≥1280×720) and tablet (≥768px) widths; canvas resizes on window resize; requirements screen shown below the supported minimum.
- [x] Final README: architecture overview, class roles, module map, routing/state flow, endpoint snippets, JSONBin schema, TTLs, merge policy, run/deploy instructions.
- [ ] Deployment: GitHub Pages URL — **add after pushing to your own repo** (SPA uses hash routing, so Pages deep links work with no extra `404.html`).
- [ ] Demo video (60–120s) — **record after your own JSONBin bins are wired up** so the leaderboard write is visible live.

## B. Notes
- Deferred: server-side leaderboard merge (see `docs/jsonbin_schema.md` known tradeoff) — descoped as out of scope for a class-project JSONBin backend.
- Lesson: keeping `GameEngine` framework-free (no Phaser/Pixi) made the render-loop ownership requirement unambiguous to satisfy, at the cost of writing collision/parallax code by hand.
