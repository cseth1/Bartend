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
    this.load.image('player', 'https://via.placeholder.com/32');
    this.load.image('customer', 'https://via.placeholder.com/32');
    this.load.image('mixing_station', 'https://via.placeholder.com/64');
    this.load.image('bar-tiles', 'https://via.placeholder.com/64');
    this.load.image('particle', 'https://via.placeholder.com/8');
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
    this.physics.add.overlap(
      this.player,
      this.mixingStation,
      this.handleMixingStation as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
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
    const cursors = this.input.keyboard?.createCursorKeys();
    if (!cursors) return;

    const speed = PLAYER_SPEED;

    const moveX = (cursors.left?.isDown ? -1 : 0) + (cursors.right?.isDown ? 1 : 0);
    const moveY = (cursors.up?.isDown ? -1 : 0) + (cursors.down?.isDown ? 1 : 0);
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
    this.customers.getChildren().forEach((customer) => {
      if (customer instanceof Phaser.Physics.Arcade.Sprite) {
        if (!customer.getData('hasOrder')) {
          customer.setData('hasOrder', true);
          customer.play('customer_idle');
        }
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
