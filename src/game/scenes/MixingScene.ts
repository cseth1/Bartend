import Phaser from 'phaser';
import { gameState, updateGameState } from '../gameState';

export class MixingScene extends Phaser.Scene {
  private selectedIngredients: string[] = [];

  constructor() {
    super({ key: 'MixingScene' });
  }

  create() {
    const { currentRecipe } = gameState;
    if (!currentRecipe) return;

    // Create background
    this.add.rectangle(400, 300, 700, 500, 0x000000, 0.8);
    this.add.text(400, 100, 'Mix the Drink!', { 
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Create ingredient buttons
    const ingredientSpacing = 600 / (currentRecipe.ingredients.length + 1);
    currentRecipe.ingredients.forEach((ingredient, index) => {
      const x = 100 + ingredientSpacing * (index + 1);
      const button = this.add.rectangle(x, 300, 80, 80, 0x666666)
        .setInteractive();
      
      this.add.text(x, 300, ingredient, { 
        fontSize: '16px',
        color: '#ffffff'
      }).setOrigin(0.5);

      button.on('pointerdown', () => {
        this.selectedIngredients.push(ingredient);
        button.setFillStyle(0x00ff00);

        if (this.selectedIngredients.length === currentRecipe.ingredients.length) {
          this.checkRecipe();
        }
      });
    });
  }

  private checkRecipe() {
    const { currentRecipe } = gameState;
    if (!currentRecipe) return;

    const success = currentRecipe.ingredients.every(
      (ingredient, index) => ingredient === this.selectedIngredients[index]
    );

    if (success) {
      updateGameState({ 
        score: gameState.score + 100,
        currentRecipe: null
      });
    }

    this.scene.resume('MainScene');
    this.scene.stop();
  }
}