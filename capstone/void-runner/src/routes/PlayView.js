// src/routes/PlayView.js
// Hosts the canvas and wires GameEngine + InputManager + Hud together.
// Shows a "not supported" screen on viewports too small to play on.

import { GameEngine } from "../engine/GameEngine.js";
import { InputManager } from "../ui/InputManager.js";
import { showHud, updateHud, drawRadar } from "../ui/Hud.js";
import { localStore } from "../services/localStore.js";

const MIN_WIDTH = 340;
const MIN_HEIGHT = 420;

export const PlayView = {
  async mount(root, _params, ctx) {
    if (window.innerWidth < MIN_WIDTH || window.innerHeight < MIN_HEIGHT) {
      showHud(false);
      root.innerHTML = `
        <section class="screen">
          <div class="panel unsupported">
            <p class="eyebrow">Requirements</p>
            <p>Void Runner needs at least a ${MIN_WIDTH}×${MIN_HEIGHT}px viewport (phone landscape, tablet, or laptop) to render the play field.</p>
          </div>
          <button class="btn btn--ghost" id="btn-back">Back to title</button>
        </section>
      `;
      root.querySelector("#btn-back").addEventListener("click", () => ctx.navigate("#/title"));
      return () => {};
    }

    root.innerHTML = `
      <div class="play-stage">
        <canvas id="game-canvas"></canvas>
        <div class="pause-overlay panel" id="pause-overlay" hidden>
          <div style="text-align:center">
            <p class="eyebrow">Paused</p>
            <p>Press P or Esc to resume</p>
          </div>
        </div>
      </div>
    `;
    showHud(true);

    const canvas = root.querySelector("#game-canvas");
    const dailyConfig = ctx.store.getState().dailyConfig ?? { spawnRateMultiplier: 1, speedMultiplier: 1 };
    const highScore = localStore.loadHighScore();

    const engine = new GameEngine(canvas, dailyConfig, {
      onTick: (state) => {
        updateHud(state, highScore);
        drawRadar(engine.player, engine.enemies, engine.bounds);
        root.querySelector("#pause-overlay").hidden = !state.paused;
      },
      onGameOver: (state) => {
        const newBest = localStore.saveHighScoreIfBetter(Math.floor(state.score));
        localStore.addRun({ id: `run_${Date.now()}`, score: Math.floor(state.score), combo: Number(state.combo.toFixed(1)), ts: Date.now() });
        ctx.navigate("#/game-over", { score: Math.floor(state.score), best: newBest });
      },
    });

    const input = new InputManager(canvas, engine);
    engine.start();

    return () => {
      engine.stop();
      input.destroy();
    };
  },
};
