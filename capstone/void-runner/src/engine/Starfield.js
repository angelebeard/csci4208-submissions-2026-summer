// src/engine/Starfield.js
// Lightweight parallax background layer, drawn behind entities each frame.

import { rand } from "../utils/mathUtils.js";

export class Starfield {
  constructor(bounds, count = 90) {
    this.stars = Array.from({ length: count }, () => ({
      x: rand(0, bounds.width),
      y: rand(0, bounds.height),
      r: rand(0.4, 1.8),
      speed: rand(6, 40),
    }));
  }

  update(dt, bounds) {
    for (const s of this.stars) {
      s.y += s.speed * dt;
      if (s.y > bounds.height) {
        s.y = 0;
        s.x = rand(0, bounds.width);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#e7e9ee";
    for (const s of this.stars) {
      ctx.globalAlpha = 0.35 + s.r / 3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
