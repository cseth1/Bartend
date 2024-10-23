import { Recipe } from './data/recipes';

export interface GameState {
  score: number;
  timeLeft: number;
  currentRecipe: Recipe | null;
  streak: number;
}

type Subscriber = (state: GameState) => void;

class GameStateManager {
  private state: GameState = {
    score: 0,
    timeLeft: 120,
    currentRecipe: null,
    streak: 0
  };

  private subscribers: Set<Subscriber> = new Set();

  getState(): GameState {
    return { ...this.state };
  }

  update(newState: Partial<GameState>): void {
    this.state = {
      ...this.state,
      ...newState
    };
    this.notifySubscribers();
  }

  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    callback(this.getState());

    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    const currentState = this.getState();
    this.subscribers.forEach(callback => callback(currentState));
  }
}

export const gameState = new GameStateManager();
export const { subscribe, update: updateGameState } = gameState;
