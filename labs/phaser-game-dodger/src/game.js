// src/game.js
// Entry point: builds the Phaser.Game configuration and launches the game.

const config = new Object();

config.width = 640;                       // Width of viewport
config.height = 480;                      // Height of viewport
config.scene = [ TitleScene, PlayScene ];  // Scenes for this game (first = starting scene)
config.physics = { default: 'arcade' };    // Physics for collisions

const game = new Phaser.Game(config);      // New game with configs
