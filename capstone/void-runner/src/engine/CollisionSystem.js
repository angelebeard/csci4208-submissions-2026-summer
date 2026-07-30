// src/engine/CollisionSystem.js
// System/controller class: pure hit-testing + effect application. Keeps
// this logic out of GameEngine's render loop so it stays testable in
// isolation.

import { circleIntersect } from "../utils/mathUtils.js";

export class CollisionSystem {
  /**
   * @returns {{hit: boolean, dodged: Enemy[], collected: PowerUp[]}}
   */
  resolve(player, enemies, powerUps, gameState) {
    const dodged = [];
    let hit = false;

    for (const enemy of enemies) {
      const colliding = circleIntersect(player.x, player.y, player.radius, enemy.x, enemy.y, enemy.radius);
      if (colliding && !player.isProtected()) {
        hit = true;
      }
    }

    const collected = [];
    for (const p of powerUps) {
      if (circleIntersect(player.x, player.y, player.radius, p.x, p.y, p.radius)) {
        p.apply(player, gameState);
        collected.push(p);
      }
    }

    return { hit, dodged, collected };
  }
}
