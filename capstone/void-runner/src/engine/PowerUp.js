// src/engine/PowerUp.js
// Base PowerUp class plus two subclasses, demonstrating the inheritance
// half of the "OO structure" requirement: shared drift/draw behavior,
// distinct apply() effects.

import { rand } from "../utils/mathUtils.js";

let nextId = 1;

export class PowerUp {
  constructor(bounds) {
    this.id = nextId++;
    this.radius = 10;
    this.x = rand(bounds.width * 0.15, bounds.width * 0.85);
    this.y = rand(bounds.height * 0.15, bounds.height * 0.85);
    this.driftAngle = rand(0, Math.PI * 2);
    this.ttl = 9000; // ms before it despawns unpicked
    this.color = "#8b7fd1";
    this.label = "?";
  }

  update(dt) {
    this.ttl -= dt * 1000;
    this.y += Math.sin(this.driftAngle + performance.now() / 600) * 6 * dt;
  }

  isExpired() {
    return this.ttl <= 0;
  }

  /** Override in subclasses. Receives (player, gameState). */
  apply(player, _gameState) {
    void player;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0b0e14";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.label, 0, 1);
    ctx.restore();
  }
}

export class ShieldPowerUp extends PowerUp {
  constructor(bounds) {
    super(bounds);
    this.color = "#8b7fd1";
    this.label = "S";
  }
  apply(player) {
    player.applyShield(4500);
  }
}

export class SlowFieldPowerUp extends PowerUp {
  constructor(bounds) {
    super(bounds);
    this.color = "#5ce1e6";
    this.label = "T";
  }
  apply(player) {
    player.slowMs = 3500;
  }
}
