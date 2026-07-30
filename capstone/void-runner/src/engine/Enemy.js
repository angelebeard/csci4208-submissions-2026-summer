// src/engine/Enemy.js
// A drifting asteroid. Spawns off-screen and moves in a straight line
// toward/past the player's side of the field.

import { rand, randInt } from "../utils/mathUtils.js";

let nextId = 1;

export class Enemy {
  constructor(bounds, speedMultiplier = 1) {
    this.id = nextId++;
    this.radius = randInt(10, 26);
    const edge = randInt(0, 3); // 0 top,1 right,2 bottom,3 left
    if (edge === 0) { this.x = rand(0, bounds.width); this.y = -this.radius; }
    else if (edge === 1) { this.x = bounds.width + this.radius; this.y = rand(0, bounds.height); }
    else if (edge === 2) { this.x = rand(0, bounds.width); this.y = bounds.height + this.radius; }
    else { this.x = -this.radius; this.y = rand(0, bounds.height); }

    const targetX = rand(bounds.width * 0.2, bounds.width * 0.8);
    const targetY = rand(bounds.height * 0.2, bounds.height * 0.8);
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const len = Math.hypot(dx, dy) || 1;
    const baseSpeed = rand(60, 130) * speedMultiplier;
    this.vx = (dx / len) * baseSpeed;
    this.vy = (dy / len) * baseSpeed;
    this.spin = rand(-2, 2);
    this.angle = 0;
    this.scored = false; // has this asteroid been counted as a "dodge" yet
  }

  update(dt, slowFactor = 1) {
    this.x += this.vx * dt * slowFactor;
    this.y += this.vy * dt * slowFactor;
    this.angle += this.spin * dt;
  }

  isOffscreen(bounds, margin = 80) {
    return (
      this.x < -margin ||
      this.x > bounds.width + margin ||
      this.y < -margin ||
      this.y > bounds.height + margin
    );
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.strokeStyle = "#ff6b5e";
    ctx.fillStyle = "rgba(255,107,94,0.12)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const points = 7;
    for (let i = 0; i < points; i++) {
      const a = (i / points) * Math.PI * 2;
      const r = this.radius * (0.8 + (i % 2 === 0 ? 0.2 : 0));
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}
