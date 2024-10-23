import { useState, useEffect } from 'react';
import { gameState, subscribe } from './gameState';
import type { GameState } from './gameState'; // Import the GameState type

export function useGameState() {
  const [state, setState] = useState<GameState>(gameState.getState());

  useEffect(() => {
    return subscribe((newState: GameState) => {
      setState(newState);
    });
  }, []);

  return state;
}
