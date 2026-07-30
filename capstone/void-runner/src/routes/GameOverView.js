// src/routes/GameOverView.js
// Recaps the run and lets the player submit it to the shared leaderboard
// (cloud write). Local high score / run history is already saved by
// PlayView before this view mounts (local-first first, cloud second).

import { submitScore } from "../services/cloudApi.js";
import { localStore } from "../services/localStore.js";
import { makeId } from "../utils/idUtils.js";
import { toast } from "../ui/Toast.js";
import { showHud } from "../ui/Hud.js";
import { isCloudConfigured } from "../services/config.js";

export const GameOverView = {
  async mount(root, params, ctx) {
    showHud(false);
    const score = params.score ?? 0;
    const best = params.best ?? score;
    const profile = localStore.loadProfile();

    root.innerHTML = `
      <section class="screen">
        <p class="eyebrow">Run ended</p>
        <h1 class="title-lockup">${score}<span> pts</span></h1>
        <p class="subtitle">Personal best: ${best}</p>
        <div class="form-row">
          <input id="name-input" maxlength="16" placeholder="Callsign for the leaderboard" value="${profile.playerName || ""}" />
          <button class="btn" id="btn-submit">Submit score</button>
        </div>
        <div class="btn-row">
          <button class="btn btn--ghost" id="btn-retry">Run again</button>
          <button class="btn btn--ghost" id="btn-board">Leaderboard</button>
          <button class="btn btn--ghost" id="btn-title">Title</button>
        </div>
      </section>
    `;

    root.querySelector("#btn-retry").addEventListener("click", () => ctx.navigate("#/play"));
    root.querySelector("#btn-board").addEventListener("click", () => ctx.navigate("#/leaderboard"));
    root.querySelector("#btn-title").addEventListener("click", () => ctx.navigate("#/title"));

    const submitBtn = root.querySelector("#btn-submit");
    if (!isCloudConfigured()) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Leaderboard not configured";
    }

    submitBtn.addEventListener("click", async () => {
      const input = root.querySelector("#name-input");
      const name = (input.value || "Runner").trim().slice(0, 16);
      localStore.saveProfile({ ...profile, playerName: name });

      submitBtn.disabled = true;
      const dismiss = toast("Submitting to leaderboard…", "loading");
      try {
        const result = await submitScore(
          { id: makeId("run"), name, score, ts: Date.now() },
          { signal: ctx.signal }
        );
        dismiss();
        if (result.ok) {
          toast("Score submitted!", "success");
          submitBtn.textContent = "Submitted";
        } else {
          toast("Leaderboard isn't configured yet — saved locally only.", "empty");
        }
      } catch (err) {
        dismiss();
        submitBtn.disabled = false;
        if (err?.name !== "AbortError") toast("Couldn't reach the leaderboard. Try again.", "error");
      }
    });

    return () => {};
  },
};
