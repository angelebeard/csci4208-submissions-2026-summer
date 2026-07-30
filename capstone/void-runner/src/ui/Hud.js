// src/ui/Hud.js
// Pure DOM/canvas rendering for the persistent instrument cluster defined
// in index.html. No game logic lives here — it just reflects state.

const els = {
  hud: () => document.getElementById("hud"),
  score: () => document.getElementById("hud-score"),
  best: () => document.getElementById("hud-best"),
  combo: () => document.getElementById("hud-combo"),
  lives: () => document.getElementById("hud-lives"),
  radar: () => document.getElementById("radar-canvas"),
};

export function showHud(visible) {
  const hud = els.hud();
  if (hud) hud.hidden = !visible;
}

export function updateHud(state, highScore) {
  const score = els.score();
  const best = els.best();
  const combo = els.combo();
  const lives = els.lives();
  if (score) score.textContent = String(Math.floor(state.score));
  if (best) best.textContent = String(Math.floor(Math.max(highScore, state.score)));
  if (combo) combo.textContent = `x${state.combo.toFixed(1)}`;
  if (lives) lives.textContent = "●".repeat(Math.max(state.lives, 0)) + "○".repeat(Math.max(3 - state.lives, 0));
}

/** Draws a simple radial blip map of nearby enemies relative to the player. */
export function drawRadar(player, enemies, bounds) {
  const canvas = els.radar();
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(92,225,230,0.35)";
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2);
  ctx.stroke();

  const scale = (w / 2 - 6) / Math.max(bounds.width, bounds.height);
  ctx.fillStyle = "#ff6b5e";
  for (const e of enemies) {
    const dx = (e.x - player.x) * scale;
    const dy = (e.y - player.y) * scale;
    const dist = Math.hypot(dx, dy);
    if (dist > w / 2 - 6) continue;
    ctx.beginPath();
    ctx.arc(w / 2 + dx, h / 2 + dy, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#5ce1e6";
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 3, 0, Math.PI * 2);
  ctx.fill();
}
