// src/routes/LeaderboardView.js
// Displays the shared cloud leaderboard (GET) alongside the player's own
// local run history, and offers the Export/Import JSON backup flow the
// spec recommends for local-first data.

import { fetchLeaderboard } from "../services/cloudApi.js";
import { localStore } from "../services/localStore.js";
import { toast } from "../ui/Toast.js";
import { showHud } from "../ui/Hud.js";

function renderList(entries, emptyMessage) {
  if (!entries.length) return `<p class="subtitle">${emptyMessage}</p>`;
  return `
    <ul class="leaderboard-list">
      ${entries
        .map(
          (e, i) => `
        <li>
          <span class="rank">${i + 1}</span>
          <span class="name">${e.name ?? "run"}</span>
          <span class="score">${e.score}</span>
        </li>`
        )
        .join("")}
    </ul>`;
}

export const LeaderboardView = {
  async mount(root, _params, ctx) {
    showHud(false);
    const localRuns = localStore.loadRuns().entries;

    root.innerHTML = `
      <section class="screen">
        <p class="eyebrow">Standings</p>
        <h1 class="title-lockup" style="font-size: clamp(28px,6vw,44px)">Leaderboard</h1>
        <div id="cloud-board">
          <p class="subtitle">loading global standings…</p>
        </div>
        <p class="eyebrow" style="margin-top:8px">Your recent runs (local)</p>
        <div id="local-board">${renderList(localRuns.slice(0, 8), "No runs yet — play one!")}</div>
        <div class="btn-row">
          <button class="btn btn--ghost" id="btn-export">Export JSON</button>
          <button class="btn btn--ghost" id="btn-import">Import JSON</button>
          <input type="file" id="file-import" accept="application/json" hidden />
          <button class="btn" id="btn-title">Back to title</button>
        </div>
      </section>
    `;

    root.querySelector("#btn-title").addEventListener("click", () => ctx.navigate("#/title"));

    root.querySelector("#btn-export").addEventListener("click", () => {
      const bundle = localStore.exportAll();
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "void-runner-backup.json";
      a.click();
      URL.revokeObjectURL(url);
      toast("Backup downloaded.", "success");
    });

    const fileInput = root.querySelector("#file-import");
    root.querySelector("#btn-import").addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        localStore.importAll(JSON.parse(text));
        toast("Backup restored. Reopen the leaderboard to see it reflected.", "success");
      } catch {
        toast("That file didn't look like a Void Runner backup.", "error");
      }
    });

    const dismiss = toast("Fetching global standings…", "loading");
    try {
      const { entries, source } = await fetchLeaderboard({ signal: ctx.signal });
      dismiss();
      const board = root.querySelector("#cloud-board");
      if (source === "unconfigured") {
        board.innerHTML = `<p class="subtitle">Global leaderboard isn't configured for this deployment yet (see README).</p>`;
      } else if (!entries.length) {
        board.innerHTML = `<p class="subtitle">No global scores yet — be the first!</p>`;
      } else {
        board.innerHTML = renderList(entries, "No global scores yet.");
      }
    } catch (err) {
      dismiss();
      if (err?.name !== "AbortError") {
        toast("Couldn't reach the leaderboard right now.", "error");
        const board = root.querySelector("#cloud-board");
        if (board) board.innerHTML = `<p class="subtitle">Global standings unavailable offline.</p>`;
      }
    }

    return () => {};
  },
};
