import { useState, useEffect } from 'react';
import { gameState, subscribe } from './gameState';

export function useGameState() {
  const [state, setState] = useState(gameState);

  useEffect(() => {
    return subscribe(() => {
      setState({ ...gameState });
    });
  }, []);

  return state;
}