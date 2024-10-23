import Phaser from 'phaser';
import { updateGameState, gameState } from '../gameState';
import { recipes } from '../data/recipes';
import { SPRITE_SCALE, PLAYER_SPEED, CUSTOMER_POINTS } from '../constants';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private customers!: Phaser.Physics.Arcade.Group;
  private mixingStation!: Phaser.Physics.Arcade.Sprite;
  private currentCustomer: Phaser.Physics.Arcade.Sprite | null = null;
  private particleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private streak: number = 0;
  private unsubscribe: (() => void) | null = null;

  constructor() {
    super({ key: 'MainScene' });
  }

  init() {
    this.unsubscribe = gameState.subscribe(state => {
      this.streak = state.streak;
      if (state.currentRecipe && this.currentCustomer) {
        this.currentCustomer.setData('recipe', state.currentRecipe);
      }
    });
  }

  preload() {
    this.load.atlas('gameSprites', 
      'https://cdn.jsdelivr.net/gh/photonstorm/phaser3-examples@master/public/assets/sprites/atlas/arcade-sprites.png',
      'https://cdn.jsdelivr.net/gh/photonstorm/phaser3-examples@master/public/assets/sprites/atlas/arcade-sprites.json'
    );
    this.load.image('bar-tiles', 'https://images.unsplash.com/photo-1538488881038-e252a119ace7?w=512&q=80');
    this.load.image('particle', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjU1NjQ0Q0M5RjE4MTFFNjk4RTBGRkY5QjAzMEY2RTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjU1NjQ0Q0Q5RjE4MTFFNjk4RTBGRkY5QjAzMEY2RTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGNTU2NDRDQTlGMTgxMUU2OThFMEZGRjlCMDMwRjZFMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNTU2NDRDQjlGMTgxMUU2OThFMEZGRjlCMDMwRjZFMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkdL7JwAAAA7SURBVHjaYvz//z8DPvDv3z8GPDIMTAyEAH4FLMQqwKaABV8g4VPAhM8J2BQw4goZbAoYCcU4QIABAKNXBv/QhLmTAAAAAElFTkSuQmCC');
  }

  private createOptimizedAnimations() {
    // Player animations
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('gameSprites', {
        prefix: 'player_idle_',
        start: 0,
        end: 3
      }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_down',
      frames: this.anims.generateFrameNames('gameSprites', {
        prefix: 'player_walk_down_',
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_up',
      frames: this.anims.generateFrameNames('gameSprites', {
        prefix: 'player_walk_up_',
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_left',
      frames: this.anims.generateFrameNames('gameSprites', {
        prefix: 'player_walk_left_',
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_right',
      frames: this.anims.generateFrameNames('gameSprites', {
        prefix: 'player_walk_right_',
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'customer_idle',
      frames: this.anims.generateFrameNames('gameSprites', {
        prefix: 'customer_idle_',
        start: 0,
        end: 3
      }),
      frameRate: 6,
      repeat: -1
    });
  }

  private setupGameObjects() {
    this.add.tileSprite(0, 0, 800, 600, 'bar-tiles')
      .setOrigin(0)
      .setScrollFactor(0)
      .setAlpha(0.3);

    this.particleEmitter = this.add.particles(0, 0, 'particle', {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000
    });

    this.player = this.physics.add.sprite(400, 300, 'gameSprites', 'player_idle_0')
      .setScale(SPRITE_SCALE)
      .setCollideWorldBounds(true)
      .setBounce(0.1);

    this.customers = this.physics.add.group({
      maxSize: 5,
      collideWorldBounds: true
    });

    this.mixingStation = this.physics.add.sprite(600, 100, 'gameSprites', 'mixing_station')
      .setScale(SPRITE_SCALE)
      .setImmovable(true);
  }

  private setupCollisions() {
    this.physics.add.collider(this.player, this.customers);
    this.physics.add.overlap(this.player, this.mixingStation, this.handleMixingStation, undefined, this);
    this.physics.add.collider(this.customers, this.customers);
  }

  create() {
    this.createOptimizedAnimations();
    this.setupGameObjects();
    this.setupCollisions();
    this.startNewOrder();

    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(1.2);
  }

  update() {
    this.handlePlayerMovement();
    this.updateCustomerBehavior();
  }

  private handlePlayerMovement() {
    const cursors = this.input.keyboard.createCursorKeys();
    const speed = PLAYER_SPEED;

    const moveX = (cursors.left.isDown ? -1 : 0) + (cursors.right.isDown ? 1 : 0);
    const moveY = (cursors.up.isDown ? -1 : 0) + (cursors.down.isDown ? 1 : 0);
    const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);

    if (magnitude !== 0) {
      const normalizedX = (moveX / magnitude) * speed;
      const normalizedY = (moveY / magnitude) * speed;

      this.player.setVelocity(normalizedX, normalizedY);
      this.player.anims.play(this.getDirectionAnimation(moveX, moveY), true);
    } else {
      this.player.setVelocity(0, 0);
      this.player.anims.play('idle', true);
    }
  }

  private getDirectionAnimation(moveX: number, moveY: number): string {
    if (Math.abs(moveX) > Math.abs(moveY)) {
      return moveX > 0 ? 'walk_right' : 'walk_left';
    }
    return moveY > 0 ? 'walk_down' : 'walk_up';
  }

  private updateCustomerBehavior() {
    this.customers.getChildren().forEach((customer: Phaser.Physics.Arcade.Sprite) => {
      if (!customer.getData('hasOrder')) {
        customer.setData('hasOrder', true);
        customer.play('customer_idle');
      }
    });
  }

  private handleMixingStation(player: Phaser.Physics.Arcade.Sprite, station: Phaser.Physics.Arcade.Sprite) {
    if (this.currentCustomer && !this.scene.isActive('MixingScene')) {
      this.scene.launch('MixingScene', { recipe: this.currentCustomer.getData('recipe') });
      this.scene.pause();
    }
  }

  private startNewOrder() {
    const recipe = Phaser.Utils.Array.GetRandom(recipes);
    if (this.currentCustomer) {
      this.currentCustomer.setData('recipe', recipe);
      updateGameState({ currentRecipe: recipe });
    }
  }

  private handleSuccessfulOrder() {
    this.streak++;
    const points = CUSTOMER_POINTS * (1 + (this.streak * 0.1));
    updateGameState({ score: gameState.getState().score + points });
    
    this.particleEmitter.setPosition(this.player.x, this.player.y);
    this.particleEmitter.explode(20);
    
    if (this.streak >= 3) {
      updateGameState({ timeLeft: gameState.getState().timeLeft + 5 });
    }
  }

  shutdown() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}