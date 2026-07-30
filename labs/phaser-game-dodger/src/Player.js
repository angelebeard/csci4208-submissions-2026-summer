// src/Player.js
// Defines the Player character: handles keyboard movement, firing projectiles,
// its custom hitbox, and its walk animation.

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, 300, 200, 'player');
        this.depth = 2;
        this.speed = 200;
        this.last_fired = 0;
        this.projectileScale = 1;               // grows via ProjectilePowerUp (max 3)
        this.projectiles = scene.player_projectiles;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);        // don't leave the map

        // Enhancement 1: shrink the hitbox so grazes feel fair
        this.body.setSize(this.width - 16, this.height - 16, true);

        this.buttons = scene.input.keyboard.addKeys('up,down,left,right,space');

        // Enhancement 3: play the registered walk animation
        this.anims.play('player-move', true);
    }

    // move player based on arrow key input
    move() {
        // reset velocity
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        // take care of character movement
        if (this.buttons.up.isDown) {
            this.body.velocity.y = -this.speed;
        }
        if (this.buttons.down.isDown) {
            this.body.velocity.y = this.speed;
        }
        if (this.buttons.left.isDown) {
            this.body.velocity.x = -this.speed;
        }
        if (this.buttons.right.isDown) {
            this.body.velocity.x = this.speed;
        }
    }

    // fire a projectile when spacebar is held, respecting a firing-rate cooldown
    // (Enhancement 5, Milestones 3 & 4)
    attack(time) {
        if (this.buttons.space.isDown && time - this.last_fired > 400) {
            const position = { x: this.x, y: this.y };
            const velocity = { x: 300, y: 0 };
            const projectile = new Projectile(this.scene, position, velocity);

            // scale the sprite to match power-up level (Enhancement 7)
            projectile.setScale(this.projectileScale);
            projectile.body.setSize(projectile.displayWidth, projectile.displayHeight, true);

            this.projectiles.push(projectile);
            this.last_fired = time;
        }

        // releasing the key resets the cooldown so the next tap fires instantly
        if (this.buttons.space.isUp) {
            this.last_fired = 0;
        }
    }
}
