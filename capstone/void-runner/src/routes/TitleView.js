// src/routes/TitleView.js
// Landing screen: shows best score (local-first, instant), then fetches
// today's daily-challenge config over the network with loading/error UI.

import { fetchDailyConfig } from "../services/publicApi.js";
import { localStore } from "../services/localStore.js";
import { toast } from "../ui/Toast.js";
import { showHud } from "../ui/Hud.js";

export const TitleView = {
  async mount(root, _params, ctx) {
    showHud(false);
    const highScore = localStore.loadHighScore();

    root.innerHTML = `
      <section class="screen">
        <p class="eyebrow">Void Runner // Games Track</p>
        <h1 class="title-lockup">DODGE THE <span>VOID</span></h1>
        <p class="subtitle">Steer clear of drifting asteroids, ride the combo streak, and bank a run to the shared leaderboard. Arrow keys / WASD to move, Space to dash, P to pause.</p>
        <div class="daily-strip" id="daily-strip">
          <span>loading today's modifiers…</span>
        </div>
        <div class="btn-row">
          <button class="btn" id="btn-play">Launch run</button>
          <button class="btn btn--ghost" id="btn-board">Leaderboard</button>
        </div>
        <p class="subtitle" style="font-family: var(--font-mono); font-size: 12px;">Personal best: <strong style="color: var(--signal)">${highScore}</strong></p>
      </section>
    `;

    root.querySelector("#btn-play").addEventListener("click", () => ctx.navigate("#/play"));
    root.querySelector("#btn-board").addEventListener("click", () => ctx.navigate("#/leaderboard"));

    const dismissLoading = toast("Fetching daily challenge…", "loading");
    try {
      const { value, source } = await fetchDailyConfig({ signal: ctx.signal });
      dismissLoading();
      const strip = root.querySelector("#daily-strip");
      if (strip) {
        strip.innerHTML = `
          <span>seed <strong>${value.seedDate}</strong></span>
          <span>spawn <strong>x${value.spawnRateMultiplier.toFixed(2)}</strong></span>
          <span>speed <strong>x${value.speedMultiplier.toFixed(2)}</strong></span>
        `;
      }
      ctx.store.setState({ dailyConfig: value });
      if (source === "fallback") {
        toast("Playing with default modifiers (no daily bin configured yet).", "empty");
      }
    } catch (err) {
      dismissLoading();
      if (err?.name !== "AbortError") {
        toast("Couldn't reach the daily challenge feed — using defaults.", "error");
        ctx.store.setState({ dailyConfig: { spawnRateMultiplier: 1, speedMultiplier: 1, seedDate: "offline" } });
      }
    }

    return () => {}; // nothing to tear down beyond the abort signal
  },
};
