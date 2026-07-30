# Architecture Sketch

## View composition / routing

`Router` (`src/routes/Router.js`) is a hand-rolled hash-based view manager. Each route is an object with a `mount(rootEl, params, ctx)` method that returns an optional cleanup function. On every navigation the router:

1. Runs the previous view's cleanup function (tears down engine/input listeners).
2. Aborts the previous view's in-flight fetches via a fresh `AbortController`.
3. Clears `#view-root` and mounts the new view.

```
index.html (#view-root, #hud, #toast-stack)
        │
        ▼
   Router.start("#/title")
        │
 ┌──────┼───────────┬───────────────┐
 ▼      ▼            ▼               ▼
Title  Play      GameOver        Leaderboard
View   View      View            View
        │
        ▼
   GameEngine (owns <canvas>, RAF loop)
   ├─ Player
   ├─ Enemy[]
   ├─ PowerUp[] (Shield | SlowField)
   └─ CollisionSystem
```

## Top-level module map (≥ 6)

```
src/
├─ state/      Store, GameState, schema        (app + run state)
├─ services/   localStore, publicApi, cloudApi, ApiClient, config   (persistence + REST)
├─ engine/     GameEngine, Player, Enemy, PowerUp, CollisionSystem, Starfield
├─ ui/         Hud, Toast, InputManager         (DOM-facing, no game rules)
├─ routes/     Router, TitleView, PlayView, GameOverView, LeaderboardView
└─ utils/      mathUtils, idUtils, timeUtils
```

## Core classes (≥ 3) and responsibilities

| Class | Responsibility |
|---|---|
| `GameState` | Model — score, combo, lives, difficulty ramp, pause/game-over rules. |
| `Player` | Model/entity — position, movement, dash/shield timers, self-draw. |
| `Enemy` | Model/entity — spawn geometry, drift motion, self-draw. |
| `PowerUp` (+ `ShieldPowerUp`, `SlowFieldPowerUp`) | Model/entity with inheritance — shared drift/draw, distinct `apply()` effects. |
| `CollisionSystem` | System — pure hit-testing between player/enemies/power-ups. |
| `GameEngine` | Controller — owns the canvas, the RAF loop, and orchestrates the above each frame. |
| `Router` | Controller — view lifecycle, hash routing, per-view abort signal. |
| `ApiClient` | Service — fetch wrapper with retry/backoff, reused by both REST services. |
| `Store` | Controller — tiny observable app-state container. |

## Rendering stack

HTML Canvas 2D, hand-rolled render loop (no game engine/library) — chosen so the code visibly owns the render loop, entity lifecycle, and layering (starfield → power-ups → enemies → player → DOM HUD overlay on top).
