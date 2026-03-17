
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, LevelProgress } from './types';
import MainMenu from './components/games/Colores/MenuColores';
import CoinGameMenu from './components/games/SeguirLaMoneda/MenuSeguirLaMoneda';
import RecordarNombresMenu from './components/games/RecordarNombres/MenuRecordarNombres';
import MenuOrdenaLaFrase from './components/games/OrdenaLaFrase/MenuOrdenaLaFrase';
import MenuEncuentraElIgual from './components/games/EncuentraElIgual/MenuEncuentraElIgual';
import MenuDefiniciones from './components/games/Definiciones/MenuDefiniciones';
import GameSelectionMenu from './components/shared/GameSelectionMenu';
import LevelSelector from './components/games/Colores/LevelSelector';
import CoinLevelSelector from './components/games/SeguirLaMoneda/LevelSelector';
import RecordarNombresLevelSelector from './components/games/RecordarNombres/LevelSelector';
import OrdenaLaFraseLevelSelector from './components/games/OrdenaLaFrase/LevelSelector';
import EncuentraElIgualLevelSelector from './components/games/EncuentraElIgual/LevelSelector';
import DefinicionesLevelSelector from './components/games/Definiciones/LevelSelector';
import GameBoard from './components/games/Colores/GameBoard';
import CoinGameBoard from './components/games/SeguirLaMoneda/CoinGameBoard';
import RecordarNombresBoard from './components/games/RecordarNombres/RecordarNombresBoard';
import OrdenaLaFraseBoard from './components/games/OrdenaLaFrase/OrdenaLaFraseBoard';
import EncuentraElIgualBoard from './components/games/EncuentraElIgual/EncuentraElIgualBoard';
import DefinicionesBoard from './components/games/Definiciones/DefinicionesBoard';
import ResultScreen from './components/shared/ResultScreen';
import { TOTAL_LEVELS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('HOME');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const [coloresHistory, setColoresHistory] = useState<LevelProgress[]>(() => {
    const saved = localStorage.getItem('mente_agil_progress');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
      levelNumber: i + 1,
      stars: 0,
      timeTaken: 0,
      completed: false,
    }));
  });

  const [monedaHistory, setMonedaHistory] = useState<LevelProgress[]>(() => {
    const saved = localStorage.getItem('seguirmoneda_progress');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
      levelNumber: i + 1,
      stars: 0,
      timeTaken: 0,
      completed: false,
    }));
  });

  const [nombresHistory, setNombresHistory] = useState<LevelProgress[]>(() => {
    const saved = localStorage.getItem('recordarnombres_progress');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
      levelNumber: i + 1,
      stars: 0,
      timeTaken: 0,
      completed: false,
    }));
  });

  const [fraseHistory, setFraseHistory] = useState<LevelProgress[]>(() => {
    const saved = localStorage.getItem('ordenafrase_progress');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
      levelNumber: i + 1,
      stars: 0,
      timeTaken: 0,
      completed: false,
    }));
  });

  const [encuentraIgualHistory, setEncuentraIgualHistory] = useState<LevelProgress[]>(() => {
    const saved = localStorage.getItem('encuentraigual_progress');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
      levelNumber: i + 1,
      stars: 0,
      timeTaken: 0,
      completed: false,
    }));
  });

  const [definicionesHistory, setDefinicionesHistory] = useState<LevelProgress[]>(() => {
    const saved = localStorage.getItem('definiciones_progress');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
      levelNumber: i + 1,
      stars: 0,
      timeTaken: 0,
      completed: false,
    }));
  });

  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [lastResult, setLastResult] = useState<LevelProgress | null>(null);

  useEffect(() => {
    localStorage.setItem('mente_agil_progress', JSON.stringify(coloresHistory));
  }, [coloresHistory]);

  useEffect(() => {
    localStorage.setItem('seguirmoneda_progress', JSON.stringify(monedaHistory));
  }, [monedaHistory]);

  useEffect(() => {
    localStorage.setItem('recordarnombres_progress', JSON.stringify(nombresHistory));
  }, [nombresHistory]);

  useEffect(() => {
    localStorage.setItem('ordenafrase_progress', JSON.stringify(fraseHistory));
  }, [fraseHistory]);

  useEffect(() => {
    localStorage.setItem('encuentraigual_progress', JSON.stringify(encuentraIgualHistory));
  }, [encuentraIgualHistory]);

  useEffect(() => {
    localStorage.setItem('definiciones_progress', JSON.stringify(definicionesHistory));
  }, [definicionesHistory]);

  const handleLevelComplete = (metric1: number, metric2: number) => {
    const isInfinite = gameState === 'INFINITE';
    
    // Identify current game history
    let currentHistory = coloresHistory;
    let setHistory = setColoresHistory;

    if (selectedGame === 'moneda') {
      currentHistory = monedaHistory;
      setHistory = setMonedaHistory;
    } else if (selectedGame === 'nombres') {
      currentHistory = nombresHistory;
      setHistory = setNombresHistory;
    } else if (selectedGame === 'frase') {
      currentHistory = fraseHistory;
      setHistory = setFraseHistory;
    } else if (selectedGame === 'igual') {
      currentHistory = encuentraIgualHistory;
      setHistory = setEncuentraIgualHistory;
    } else if (selectedGame === 'definiciones') {
      currentHistory = definicionesHistory;
      setHistory = setDefinicionesHistory;
    }

    // Determine what the metrics mean
    // All games pass 'stars' as first argument now based on call sites
    const stars = metric1;
    const secondaryMetric = metric2; // Time or Score

    if (!isInfinite) {
      const updatedHistory = currentHistory.map(level => {
        if (level.levelNumber === currentLevel) {
          // Keep the best stars
          const betterStars = Math.max(level.stars, stars);
          
          // For time, lower is better. For score, higher is better.
          // Colores/Moneda use time (lower is better). Nombres uses score (higher is better).
          let bestSecondary = level.timeTaken;
          
          if (selectedGame === 'nombres') {
             // For Nombres, metric2 is score. Keep highest score.
             bestSecondary = Math.max(level.timeTaken, secondaryMetric);
          } else {
             // For others, metric2 is time. Keep lowest time (if > 0, else take new time)
             if (level.timeTaken === 0) bestSecondary = secondaryMetric;
             else bestSecondary = Math.min(level.timeTaken, secondaryMetric);
          }

          return {
            ...level,
            stars: betterStars,
            timeTaken: bestSecondary, // Storing score in timeTaken field for Nombres implies field rename or reuse
            completed: level.completed || stars > 0
          };
        }
        return level;
      });
      setHistory(updatedHistory);
    }

    setLastResult({
      levelNumber: isInfinite ? -1 : currentLevel,
      stars: stars,
      timeTaken: secondaryMetric,
      completed: true
    });
    setGameState('RESULT');
  };


  const startLevel = (lvl: number) => {
    setCurrentLevel(lvl);
    setGameState('PLAYING');
  };

  const startInfinite = () => {
    setCurrentLevel(1);
    setGameState('INFINITE');
  };

  const handleSelectGame = (gameId: string) => {
    setSelectedGame(gameId);
    if (gameId === 'colores' || gameId === 'moneda' || gameId === 'nombres' || gameId === 'frase' || gameId === 'igual' || gameId === 'definiciones') {
      setGameState('MENU');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
      {(gameState !== 'HOME') && (
          <button 
          onClick={() => {
            if (gameState === 'MENU') setGameState('HOME');
            else if (gameState === 'LEVEL_SELECTOR') setGameState('MENU');
            else if (gameState === 'PLAYING' || gameState === 'INFINITE') setGameState('MENU');
            else if (gameState === 'RESULT') setGameState('MENU');
          }}
          className="absolute top-4 left-4 p-3 text-slate-400 hover:text-slate-600 transition-colors z-50 text-2xl font-bold bg-white/50 backdrop-blur rounded-full shadow-sm"
        >
          <i className={gameState === 'MENU' ? "fas fa-house text-4xl" : "fas fa-arrow-left text-4xl"}></i>
        </button>
      )}

      {gameState === 'HOME' && (
        <GameSelectionMenu onSelectGame={handleSelectGame} />
      )}

      {/* Menus */}
      {gameState === 'MENU' && selectedGame === 'colores' && (
        <MainMenu 
          onPlay={() => setGameState('LEVEL_SELECTOR')} 
          onInfinite={startInfinite}
        />
      )}

      {gameState === 'MENU' && selectedGame === 'moneda' && (
        <CoinGameMenu 
          onPlay={() => setGameState('LEVEL_SELECTOR')} 
          onInfinite={startInfinite}
        />
      )}

      {gameState === 'MENU' && selectedGame === 'nombres' && (
        <RecordarNombresMenu
          onPlay={() => setGameState('LEVEL_SELECTOR')}
          onInfinite={startInfinite}
        />
      )}

      {gameState === 'MENU' && selectedGame === 'frase' && (
        <MenuOrdenaLaFrase
          onPlay={() => setGameState('LEVEL_SELECTOR')}
          onInfinite={startInfinite}
        />
      )}

      {gameState === 'MENU' && selectedGame === 'igual' && (
        <MenuEncuentraElIgual
          onPlay={() => setGameState('LEVEL_SELECTOR')}
          onInfinite={startInfinite}
        />
      )}

      {gameState === 'MENU' && selectedGame === 'definiciones' && (
        <MenuDefiniciones
          onPlay={() => setGameState('LEVEL_SELECTOR')}
          onInfinite={startInfinite}
        />
      )}

      {/* Level Selectors */}
      {gameState === 'LEVEL_SELECTOR' && selectedGame === 'colores' && (
        <LevelSelector 
          levels={coloresHistory} 
          onSelectLevel={startLevel} 
          onBack={() => setGameState('MENU')} 
        />
      )}

      {gameState === 'LEVEL_SELECTOR' && selectedGame === 'moneda' && (
        <CoinLevelSelector 
          levels={monedaHistory} 
          onSelectLevel={startLevel} 
          onBack={() => setGameState('MENU')} 
        />
      )}

      {gameState === 'LEVEL_SELECTOR' && selectedGame === 'nombres' && (
        <RecordarNombresLevelSelector
          levels={nombresHistory}
          onSelectLevel={startLevel}
          onBack={() => setGameState('MENU')}
        />
      )}

      {gameState === 'LEVEL_SELECTOR' && selectedGame === 'frase' && (
        <OrdenaLaFraseLevelSelector
          levels={fraseHistory}
          onSelectLevel={startLevel}
          onBack={() => setGameState('MENU')}
        />
      )}

      {gameState === 'LEVEL_SELECTOR' && selectedGame === 'igual' && (
        <EncuentraElIgualLevelSelector
          levels={encuentraIgualHistory}
          onSelectLevel={startLevel}
          onBack={() => setGameState('MENU')}
        />
      )}

      {gameState === 'LEVEL_SELECTOR' && selectedGame === 'definiciones' && (
        <DefinicionesLevelSelector
          levels={definicionesHistory}
          onSelectLevel={startLevel}
          onBack={() => setGameState('MENU')}
        />
      )}

      {/* Game Boards */}
      {(gameState === 'PLAYING' || gameState === 'INFINITE') && selectedGame === 'colores' && (
        <GameBoard 
          level={currentLevel}
          isInfinite={gameState === 'INFINITE'}
          onComplete={handleLevelComplete}
          onQuit={() => setGameState('MENU')}
        />
      )}

      {(gameState === 'PLAYING' || gameState === 'INFINITE') && selectedGame === 'moneda' && (
        <CoinGameBoard 
          initialLevel={currentLevel}
          isInfiniteMode={gameState === 'INFINITE'}
          onGameEnd={handleLevelComplete}
        />
      )}

      {(gameState === 'PLAYING' || gameState === 'INFINITE') && selectedGame === 'nombres' && (
        <RecordarNombresBoard
          level={currentLevel}
          isInfinite={gameState === 'INFINITE'}
          onGameComplete={(stars, score) => handleLevelComplete(stars, score)} 
          onExit={() => setGameState('MENU')}
        />
      )}

      {(gameState === 'PLAYING' || gameState === 'INFINITE') && selectedGame === 'frase' && (
        <OrdenaLaFraseBoard
          level={currentLevel}
          isInfinite={gameState === 'INFINITE'}
          onGameComplete={(stars, timeTaken) => handleLevelComplete(stars, timeTaken)}
          onExit={() => setGameState('MENU')}
        />
      )}

      {(gameState === 'PLAYING' || gameState === 'INFINITE') && selectedGame === 'igual' && (
        <EncuentraElIgualBoard
          level={currentLevel}
          isInfinite={gameState === 'INFINITE'}
          onGameComplete={(stars, timeTaken) => handleLevelComplete(stars, timeTaken)}
          onExit={() => setGameState('MENU')}
        />
      )}

      {(gameState === 'PLAYING' || gameState === 'INFINITE') && selectedGame === 'definiciones' && (
        <DefinicionesBoard
          level={currentLevel}
          isInfinite={gameState === 'INFINITE'}
          onGameComplete={(stars, timeTaken) => handleLevelComplete(stars, timeTaken)}
          onExit={() => setGameState('MENU')}
        />
      )}

      {gameState === 'RESULT' && lastResult && (
        <ResultScreen 
          result={lastResult}
          isInfinite={lastResult.levelNumber === -1}
          gameType={selectedGame}
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
