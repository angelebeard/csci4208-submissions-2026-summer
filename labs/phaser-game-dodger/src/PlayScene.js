// src/PlayScene.js
// The heart of the game: manages all game objects, spawning, collisions,
// the HUD/score, and the main game loop (preload, create, update).

class PlayScene extends Phaser.Scene {
    // construct new scene
    constructor() {
        super('play'); // set this scene's id within superclass constructor
        // NOTE: top_score / winner now live in the Registry (Enhancement 8),
        // not as instance properties here, so they persist across restarts
        // and are shared with TitleScene.
    }

    // preload external game assets
    preload() {
        this.load.path = 'assets/';                          // Define file path

        this.load.image('background', 'background.png');    // Load background image
        this.load.image('player', 'player.png');             // Load player image
        this.load.image('enemy', 'enemy.png');                // Load enemy image

        this.load.image('player-0', 'player-0.png');          // Load walk frame 0
        this.load.image('player-1', 'player-1.png');          // Load walk frame 1
        this.load.image('enemy-0', 'enemy-0.png');             // Load walk frame 0
        this.load.image('enemy-1', 'enemy-1.png');             // Load walk frame 1

        this.load.image('projectile', 'projectile.png');      // Load projectile image

        this.load.image('powerup-projectile', 'powerup-1.png'); // Load power-up image
        this.load.image('powerup-slay', 'powerup-2.png');        // Load power-up image
    }

    // create game data
    create() {
        this.create_map();          // create scrolling background
        this.create_animations();   // register walk animations
        this.create_projectiles();  // set up player/enemy projectile tracking
        this.create_player();       // create player
        this.create_enemies();      // create enemy spawner
        this.create_powerups();     // create power-up spawner
        this.create_collisions();   // create physics-related behaviors
        this.create_hud();          // create score HUD

        // Enhancement 8: return to the title screen
        this.input.keyboard.on('keydown-ESC', () => { this.scene.start('title'); });
    }

    // Update game data
    update(time) {
        this.update_player(time);
        this.update_enemies(time);
        this.update_background();
        this.update_score();
    }

    // ---------------------------------------------------------------
    // Map / Background (Enhancement 2: scrolling background)
    // ---------------------------------------------------------------
    create_map() {
        this.background = this.add.tileSprite(640 / 2, 480 / 2, 640, 480, 'background');
    }

    update_background() {
        this.background.tilePositionX += 3;
    }

    // ---------------------------------------------------------------
    // Animations (Enhancement 3)
    // ---------------------------------------------------------------
    create_animations() {
        if (!this.anims.exists('player-move')) {
            const anim_player_move = new Object();
            anim_player_move.key = 'player-move';
            anim_player_move.frames = [{ key: 'player-0' }, { key: 'player-1' }];
            anim_player_move.frameRate = 6;
            anim_player_move.repeat = -1;
            this.anims.create(anim_player_move);
        }

        if (!this.anims.exists('enemy-move')) {
            const anim_enemy_move = new Object();
            anim_enemy_move.key = 'enemy-move';
            anim_enemy_move.frames = [{ key: 'enemy-0' }, { key: 'enemy-1' }];
            anim_enemy_move.frameRate = 6;
            anim_enemy_move.repeat = -1;
            this.anims.create(anim_enemy_move);
        }
    }

    // ---------------------------------------------------------------
    // Player
    // ---------------------------------------------------------------
    create_player() {
        this.player = new Player(this);
    }

    update_player(time) {
        this.player.move();
        this.player.attack(time);
    }

    // ---------------------------------------------------------------
    // Enemies
    // ---------------------------------------------------------------
    create_enemies() {
        this.enemies = [];

        const event = new Object();
        event.delay = 200;
        event.callback = this.spawn_enemy;
        event.callbackScope = this;
        event.loop = true;
        this.time.addEvent(event, this);
    }

    spawn_enemy() {
        const config = {};
        config.x = 640 + 32;
        config.y = Phaser.Math.Between(0, 480);

        const monster = new Enemy(this, config);
        this.enemies.push(monster);

        this.score += 1;
    }

    update_enemies(time) {
        this.enemies.forEach(enemy => enemy.attack(time));
    }

    // ---------------------------------------------------------------
    // Projectiles (Enhancement 5 & 6)
    // ---------------------------------------------------------------
    create_projectiles() {
        this.player_projectiles = [];
        this.enemy_projectiles = [];
    }

    // ---------------------------------------------------------------
    // Power-ups (Enhancement 7)
    // ---------------------------------------------------------------
    create_powerups() {
        this.powerups = [];

        const event = new Object();
        event.delay = 3000;
        event.callback = this.spawn_powerup;
        event.callbackScope = this;
        event.loop = true;
        this.time.addEvent(event, this);
    }

    spawn_powerup() {
        const powerup_types = [ProjectilePowerUp, SlayPowerUp];

        if (Phaser.Math.Between(0, 4) !== 0) return; // 1-in-5 chance

        const PowerUpClass = Phaser.Utils.Array.GetRandom(powerup_types);
        const position = {
            x: 640 + 32,
            y: Phaser.Math.Between(50, 430)
        };

        const powerup = new PowerUpClass(this, position.x, position.y);
        this.powerups.push(powerup);
    }

    // ---------------------------------------------------------------
    // Collisions
    // ---------------------------------------------------------------
    create_collisions() {
        this.physics.add.overlap(this.player, this.enemies, this.game_over, null, this);
        this.physics.add.overlap(this.player_projectiles, this.enemies, this.slay_enemy, null, this);
        this.physics.add.overlap(this.enemy_projectiles, this.player, this.game_over, null, this);
        this.physics.add.overlap(this.player, this.powerups, this.collect_powerup, null, this);
    }

    slay_enemy(projectile, enemy) {
        enemy.destroy();
        projectile.destroy();
    }

    // Polymorphic power-up collection callback: the scene doesn't need to
    // know which power-up type this is, it just asks it to apply itself.
    collect_powerup(player, powerup) {
        powerup.applyEffect(player);
        powerup.destroy();
    }

    game_over() {
        const { top_score } = this.registry.values;

        if (this.score >= top_score) {
            this.registry.set('top_score', this.score);

            this.physics.pause(); // freeze gameplay
            const name = prompt('New High Score! Enter your name:');
            this.registry.set('winner', name || 'Top Score');
            this.input.keyboard.keys = []; // reset phaser keys stream
        }

        this.cameras.main.flash();
        this.scene.restart();
    }

    // ---------------------------------------------------------------
    // HUD / Score (Enhancement 4, refactored in Enhancement 8 to use Registry)
    // ---------------------------------------------------------------
    create_hud() {
        this.score = 0;
        this.score_text = this.add.text(32, 32, '');
        this.score_text.depth = 3;
        this.score_text.setColor('rgb(255,255,255)');

        const { winner, top_score } = this.registry.values;
        this.top_score_text = this.add.text(600, 32, `${winner}: ${top_score}`);
        this.top_score_text.depth = 3;
        this.top_score_text.setColor('rgb(255,255,255)');
        this.top_score_text.setOrigin(1, 0);
    }

    update_score() {
        this.score_text.setText(`Score: ${this.score}`);

        const { winner, top_score } = this.registry.values;
        this.top_score_text.setText(`${winner}: ${top_score}`);
    }
}
