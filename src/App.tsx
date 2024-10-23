import React, { useEffect, useRef } from 'react';
import { Beer } from 'lucide-react';
import Game from './game/Game';
import { GameUI } from './components/GameUI';

function App() {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameContainerRef.current) return;

    const game = new Game(gameContainerRef.current);
    return () => {
      game.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="bg-slate-800/50 p-4 shadow-lg">
        <div className="container mx-auto flex items-center gap-2">
          <Beer className="h-8 w-8 text-amber-400" />
          <h1 className="text-2xl font-bold text-amber-400">MixMaster: The Bartender's Adventure</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div 
              ref={gameContainerRef} 
              className="bg-slate-700 rounded-lg shadow-xl overflow-hidden"
              style={{ aspectRatio: '4/3' }}
            />
          </div>
          <div className="space-y-4">
            <GameUI />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;