import React, { memo } from 'react';
import { Clock, Trophy, GlassWater, Flame, Star } from 'lucide-react';
import { useGameState } from '../game/useGameState';
import { motion, AnimatePresence } from 'framer-motion';

export const GameUI = memo(() => {
  const { score, timeLeft, currentRecipe, streak } = useGameState();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="bg-slate-800/90 backdrop-blur rounded-lg p-4 shadow-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="flex items-center gap-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
            >
              <Trophy className="h-6 w-6 text-yellow-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 text-transparent bg-clip-text">
                {score}
              </span>
            </motion.div>
            <div className="flex items-center gap-2">
              <Clock className={`h-6 w-6 ${timeLeft <= 30 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
              <span className="text-xl font-bold">{timeLeft}s</span>
            </div>
          </div>
          {streak > 0 && (
            <motion.div 
              className="flex items-center gap-2 text-orange-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Flame className="h-5 w-5" />
              <span className="font-bold">Streak: {streak}x</span>
            </motion.div>
          )}
        </div>

        {currentRecipe && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-800/90 backdrop-blur rounded-lg p-4 shadow-lg border border-slate-700"
          >
            <div className="flex items-center gap-2 mb-4">
              <GlassWater className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-bold">{currentRecipe.name}</h2>
            </div>
            <ul className="space-y-2">
              {currentRecipe.ingredients.map((ingredient, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-700/50 p-2 rounded-lg flex items-center gap-2 backdrop-blur"
                >
                  <Star className="h-4 w-4 text-amber-400" />
                  <span className="font-medium">{ingredient}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
});