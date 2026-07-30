// src/engine/Player.js
// Domain class (#3): the player's ship. Owns its own position/physics and
// drawing; GameEngine just calls update()/draw() each frame.

import { clamp } from "../utils/mathUtils.js";

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 12;
    this.speed = 260; // px/sec
    this.dashCooldown = 0;
    this.shieldMs = 0;
    this.slowMs = 0;
    this.invulnMs = 0;
  }

  update(dt, input, bounds) {
    let vx = 0;
    let vy = 0;
    if (input.left) vx -= 1;
    if (input.right) vx += 1;
    if (input.up) vy -= 1;
    if (input.down) vy += 1;

    const len = Math.hypot(vx, vy) || 1;
    this.x += (vx / len) * this.speed * dt;
    this.y += (vy / len) * this.speed * dt;

    if (input.pointer) {
      // Touch/mouse drag steers directly toward the pointer for reachable
      // on-screen control without a virtual joystick.
      const dx = input.pointer.x - this.x;
      const dy = input.pointer.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 4) {
        const step = Math.min(dist, this.speed * dt);
        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
      }
    }

    this.x = clamp(this.x, this.radius, bounds.width - this.radius);
    this.y = clamp(this.y, this.radius, bounds.height - this.radius);

    this.dashCooldown = Math.max(0, this.dashCooldown - dt * 1000);
    this.shieldMs = Math.max(0, this.shieldMs - dt * 1000);
    this.slowMs = Math.max(0, this.slowMs - dt * 1000);
    this.invulnMs = Math.max(0, this.invulnMs - dt * 1000);

    if (input.dashRequested && this.dashCooldown <= 0) {
      this.dashCooldown = 900;
      this.invulnMs = 220;
      return { dashed: true };
    }
    return { dashed: false };
  }

  applyShield(ms = 4000) {
    this.shieldMs = ms;
  }

  isProtected() {
    return this.shieldMs > 0 || this.invulnMs > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.isProtected() ? "#8b7fd1" : "#5ce1e6";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    if (this.shieldMs > 0) {
      ctx.strokeStyle = "rgba(139,127,209,0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}
