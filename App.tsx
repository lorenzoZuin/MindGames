
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, LevelProgress } from './types';
import MainMenu from './components/MainMenu';
import LevelSelector from './components/LevelSelector';
import GameBoard from './components/GameBoard';
import ResultScreen from './components/ResultScreen';
import { TOTAL_LEVELS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levelHistory, setLevelHistory] = useState<LevelProgress[]>(() => {
    const saved = localStorage.getItem('mente_agil_progress');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
      levelNumber: i + 1,
      stars: 0,
      timeTaken: 0,
      completed: false,
    }));
  });
  const [lastResult, setLastResult] = useState<LevelProgress | null>(null);

  useEffect(() => {
    localStorage.setItem('mente_agil_progress', JSON.stringify(levelHistory));
  }, [levelHistory]);

  const handleLevelComplete = (scoreOrStars: number, timeTaken: number) => {
    const isInfinite = gameState === 'INFINITE';
    
    if (!isInfinite) {
      const updatedHistory = levelHistory.map(level => {
        if (level.levelNumber === currentLevel) {
          // Keep the best score
          const betterStars = Math.max(level.stars, scoreOrStars);
          return {
            ...level,
            stars: betterStars,
            timeTaken: level.stars > scoreOrStars ? level.timeTaken : timeTaken,
            completed: true
          };
        }
        return level;
      });
      setLevelHistory(updatedHistory);
    }

    setLastResult({
      levelNumber: isInfinite ? -1 : currentLevel,
      stars: scoreOrStars,
      timeTaken,
      completed: true
    });
    setGameState('RESULT');
  };

  const startLevel = (lvl: number) => {
    setCurrentLevel(lvl);
    setGameState('PLAYING');
  };

  const startInfinite = () => {
    setGameState('INFINITE');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {gameState === 'MENU' && (
        <MainMenu 
          onPlay={() => setGameState('LEVEL_SELECTOR')} 
          onInfinite={startInfinite}
        />
      )}

      {gameState === 'LEVEL_SELECTOR' && (
        <LevelSelector 
          levels={levelHistory} 
          onSelectLevel={startLevel} 
          onBack={() => setGameState('MENU')} 
        />
      )}

      {(gameState === 'PLAYING' || gameState === 'INFINITE') && (
        <GameBoard 
          level={currentLevel}
          isInfinite={gameState === 'INFINITE'}
          onComplete={handleLevelComplete}
          onQuit={() => setGameState('MENU')}
        />
      )}

      {gameState === 'RESULT' && lastResult && (
        <ResultScreen 
          result={lastResult}
          isInfinite={lastResult.levelNumber === -1}
          onNext={() => {
            if (currentLevel < TOTAL_LEVELS) {
              startLevel(currentLevel + 1);
            } else {
              setGameState('LEVEL_SELECTOR');
            }
          }}
          onRetry={() => {
            if (lastResult.levelNumber === -1) {
              startInfinite();
            } else {
              startLevel(currentLevel);
            }
          }}
          onMenu={() => setGameState('MENU')}
        />
      )}
    </div>
  );
};

export default App;
