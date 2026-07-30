// src/state/GameState.js
// Domain model (class #1): the rules and mutable state of a single run.
// GameEngine drives it; nothing here touches the canvas or DOM.

export class GameState {
  constructor({ spawnRateMultiplier = 1, speedMultiplier = 1 } = {}) {
    this.score = 0;
    this.combo = 1;
    this.lives = 3;
    this.elapsed = 0;
    this.difficulty = 1;
    this.spawnRateMultiplier = spawnRateMultiplier;
    this.speedMultiplier = speedMultiplier;
    this.gameOver = false;
    this.paused = false;
  }

  tick(dt) {
    if (this.gameOver || this.paused) return;
    this.elapsed += dt;
    // Difficulty ramps every 8 seconds, applied to spawn rate + enemy speed.
    this.difficulty = 1 + Math.floor(this.elapsed / 8) * 0.18;
  }

  registerDodge(points = 10) {
    this.combo = Math.min(this.combo + 0.1, 6);
    this.score += Math.round(points * this.combo);
  }

  registerHit() {
    this.combo = 1;
    this.lives -= 1;
    if (this.lives <= 0) this.gameOver = true;
  }

  togglePause() {
    if (this.gameOver) return;
    this.paused = !this.paused;
  }
}
