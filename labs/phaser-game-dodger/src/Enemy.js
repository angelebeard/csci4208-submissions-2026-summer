// src/Enemy.js
// Defines a single Enemy: spawns off-screen, flies left, animates, and
// occasionally fires a projectile back at the player (Enhancement 6).

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, position) {
        super(scene, position.x, position.y, 'enemy');
        this.depth = 1;
        this.last_fired = 0;
        this.projectiles = scene.enemy_projectiles;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.velocity.x = -Phaser.Math.Between(120, 300);

        // randomized cooldown so enemies don't all fire in sync
        this.attack_duration = Phaser.Math.Between(2000, 4000);

        // Enhancement 3: play the registered walk animation
        this.anims.play('enemy-move', true);
    }

    // fires a projectile leftwards (slightly slower than the enemy's own speed)
    // on a randomized timer
    attack(time) {
        if (!this.active || !this.body || !this.scene) return;

        if (time - this.last_fired > this.attack_duration) {
            const position = { x: this.x, y: this.y };
            const velocity = { x: this.body.velocity.x - 100, y: 0 };
            const projectile = new Projectile(this.scene, position, velocity);

            this.projectiles.push(projectile);
            this.last_fired = time;
            this.attack_duration = Phaser.Math.Between(2000, 4000);
        }
    }
}
