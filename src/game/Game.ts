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
          gravity: { y: 0, x: 0 }, // Add x: 0 to satisfy the Vector2Like type
          debug: false,
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
      }
    };

    super(config);

    // Start audio context on first user interaction
    parent.addEventListener('pointerdown', () => {
      if (this.sound && 'context' in this.sound && this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }
    }, { once: true });

    this.loop.targetFps = 60;

    let lastTime = performance.now();
    const timer = setInterval(() => {
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        if (gameState.getState().timeLeft > 0) {
          updateGameState({ timeLeft: gameState.getState().timeLeft - 1 });
          if (gameState.getState().timeLeft === 0) {
            clearInterval(timer);
            const mainScene = this.scene.getScene('MainScene');
            if (mainScene) {
              mainScene.events.emit('gameOver');
            }
          }
        }
        lastTime = currentTime;
      }
    }, 100);
  }
}
