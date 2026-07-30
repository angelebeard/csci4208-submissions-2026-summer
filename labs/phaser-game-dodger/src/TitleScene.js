// src/TitleScene.js
// The game's main menu. Initializes the shared Registry state (Enhancement 8)
// and displays the title, instructions, and current leaderboard.

class TitleScene extends Phaser.Scene {
    constructor() {
        super('title'); // Register scene with key 'title'
    }

    create() {
        this.create_game_data();
        this.create_title();
        this.create_topscore();

        this.input.keyboard.on('keydown-SPACE', () => { this.scene.start('play'); });
    }

    // TitleScene is the game's entry point, so it is responsible for
    // establishing the Registry as the single source of truth for
    // persistent state.
    create_game_data() {
        this.registry.set('top_score', this.registry.get('top_score') || 100);
        this.registry.set('winner', this.registry.get('winner') || 'Top Score');
    }

    create_title() {
        const width = this.game.config.width;
        const height = this.game.config.height;

        // Game Title
        this.add.text(width / 2, height / 3, 'DODGER GAME', {
            fontSize: '48px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(width / 2, height / 2, 'Arrow Keys to Move\nSpacebar to Fire', {
            fontSize: '24px',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        // Start prompt
        this.add.text(width / 2, height * 2 / 3, 'Press SPACE to Start', {
            fontSize: '24px',
            fill: '#FFFF00'
        }).setOrigin(0.5);
    }

    create_topscore() {
        const topScore = this.registry.get('top_score');
        const winner = this.registry.get('winner');

        const x = this.game.config.width / 2;
        const y = this.game.config.height - 50;

        this.add.text(x, y, `Leader: ${winner} - ${topScore}`, {
            fontSize: '20px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);
    }
}
