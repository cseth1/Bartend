import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';
import { MixingScene } from './scenes/MixingScene';
import { gameState, updateGameState } from './gameState';

export default class Game extends Phaser.Game {
  constructor(parent: HTMLElement) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS, // Force CANVAS for better compatibility
      parent,
      width: 800,
      height: 600,
      backgroundColor: '#1a1a1a',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
          fps: 60
        }
      },
      scene: [MainScene, MixingScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
      },
      audio: {
        disableWebAudio: false,
        noAudio: false
      }
    };

    super(config);

    // Optimize game loop
    this.loop.targetFps = 60;

    // Start the game timer with optimized interval
    let lastTime = performance.now();
    const timer = setInterval(() => {
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        if (gameState.timeLeft > 0) {
          updateGameState({ timeLeft: gameState.timeLeft - 1 });
          if (gameState.timeLeft === 0) {
            clearInterval(timer);
            this.scene.getScene('MainScene').events.emit('gameOver');
          }
        }
        lastTime = currentTime;
      }
    }, 100);
  }
}