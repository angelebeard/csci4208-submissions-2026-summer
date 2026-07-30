// src/main.js
// Boot sequence: read local state first and render immediately (local-first),
// then let each view layer in network data in the background. This file
// only wires things together — no game or rendering logic lives here.

import { Store } from "./state/Store.js";
import { Router } from "./routes/Router.js";
import { localStore } from "./services/localStore.js";
import { TitleView } from "./routes/TitleView.js";
import { PlayView } from "./routes/PlayView.js";
import { GameOverView } from "./routes/GameOverView.js";
import { LeaderboardView } from "./routes/LeaderboardView.js";

const store = new Store({
  settings: localStore.loadSettings(),
  profile: localStore.loadProfile(),
  dailyConfig: { spawnRateMultiplier: 1, speedMultiplier: 1, seedDate: "local" },
});

const root = document.getElementById("view-root");
const router = new Router(root, { store });

router
  .register("#/title", TitleView)
  .register("#/play", PlayView)
  .register("#/game-over", GameOverView)
  .register("#/leaderboard", LeaderboardView);

router.start("#/title");
