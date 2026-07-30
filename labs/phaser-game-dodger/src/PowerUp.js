// src/PowerUp.js
// Base PowerUp class (Enhancement 7) plus two concrete subclasses.
// Each power-up moves left like everything else, and defines its own
// applyEffect() that runs when the player collects it (polymorphism).

class PowerUp extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.depth = 1;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.velocity.x = -300;
    }

    // Placeholder for subclasses to override.
    applyEffect(player) {
        console.warn('applyEffect not implemented for this power-up type.');
    }
}

// Destroys all enemies and their projectiles currently on screen.
class SlayPowerUp extends PowerUp {
    constructor(scene, x, y) {
        super(scene, x, y, 'powerup-slay');
    }

    applyEffect(player) {
        const scene = this.scene;
        scene.enemies.forEach(monster => monster.destroy());
        scene.enemy_projectiles.forEach(bullet => bullet.destroy());
        scene.cameras.main.flash();
    }
}

// Increases the player's projectile size, up to a cap of 3.
class ProjectilePowerUp extends PowerUp {
    constructor(scene, x, y) {
        super(scene, x, y, 'powerup-projectile');
    }

    applyEffect(player) {
        player.projectileScale = Math.min(player.projectileScale + 1, 3);
    }
}
