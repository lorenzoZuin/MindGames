import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface EncuentraElIgualBoardProps {
  level: number;
  isInfinite: boolean;
  onGameComplete: (stars: number, timeTaken: number) => void;
  onExit: () => void;
}

interface Tile {
  id: number;
  symbol: string;
  isTarget: boolean;
  found: boolean;
}

type TileFeedback = 'success' | 'error';
type RoundStatus = 'playing' | 'won' | 'lost';

const SYMBOL_POOL = ['🍌', '🧸', '🍎', '🚗', '🍓', '🪀', '🍍', '🚕', '🍒', '🛹', '🍇', '🚙'];
const MAX_ERRORS = 3;

const getRoundConfig = (level: number) => {
  if (level <= 10) {
    return { totalTiles: 9, targetCount: 3 };
  }
  if (level <= 20) {
    return { totalTiles: 12, targetCount: 4 };
  }
  if (level <= 35) {
    return { totalTiles: 16, targetCount: 5 };
  }
  return { totalTiles: 20, targetCount: 6 };
};

const shuffle = <T,>(items: T[]) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const EncuentraElIgualBoard: React.FC<EncuentraElIgualBoardProps> = ({
  level,
  isInfinite,
  onGameComplete,
  onExit,
}) => {
  const [currentLevel, setCurrentLevel] = useState(level);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [targetSymbol, setTargetSymbol] = useState('🍌');
  const [mistakes, setMistakes] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [targetCount, setTargetCount] = useState(0);
  const [status, setStatus] = useState<RoundStatus>('playing');
  const [feedbackMode, setFeedbackMode] = useState<'neutral' | 'success' | 'error'>('neutral');
  const [tileFeedback, setTileFeedback] = useState<Record<number, TileFeedback>>({});
  const [infiniteScore, setInfiniteScore] = useState(0);

  const roundStartRef = useRef<number>(Date.now());
  const sessionStartRef = useRef<number>(Date.now());
  const timeoutsRef = useRef<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const activeConfig = useMemo(() => getRoundConfig(currentLevel), [currentLevel]);

  const clearTimers = () => {
    timeoutsRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timeoutsRef.current = [];
  };

  const registerTimeout = (callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timeoutsRef.current.push(id);
  };

  const getAudioContext = () => {
    if (typeof window === 'undefined') return null;
    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    return audioContextRef.current;
  };

  const playTone = (
    frequency: number,
    durationMs: number,
    delaySeconds = 0,
    type: OscillatorType = 'sine',
    gainValue = 0.06,
  ) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startAt = audioContext.currentTime + delaySeconds;
    const endAt = startAt + durationMs / 1000;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startAt);

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(gainValue, startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(startAt);
    oscillator.stop(endAt + 0.02);
  };

  const playSuccessSound = () => {
    playTone(620, 110, 0, 'triangle', 0.07);
    playTone(860, 140, 0.12, 'triangle', 0.07);
  };

  const playErrorSound = () => {
    playTone(280, 150, 0, 'sawtooth', 0.06);
    playTone(220, 170, 0.1, 'sawtooth', 0.06);
  };

  const prepareRound = useCallback((lvl: number) => {
    clearTimers();

    const { totalTiles, targetCount: totalTargetTiles } = getRoundConfig(lvl);
    const shuffledPool = shuffle(SYMBOL_POOL);
    const nextTarget = shuffledPool[0];
    const fillerPool = shuffledPool.filter((symbol) => symbol !== nextTarget);

    const fillerCount = totalTiles - totalTargetTiles;
    const symbols = [
      ...Array.from({ length: totalTargetTiles }, () => nextTarget),
      ...Array.from({ length: fillerCount }, (_, i) => fillerPool[i % fillerPool.length]),
    ];

    const shuffledSymbols = shuffle(symbols);
    const nextTiles: Tile[] = shuffledSymbols.map((symbol, index) => ({
      id: index,
      symbol,
      isTarget: symbol === nextTarget,
      found: false,
    }));

    setTiles(nextTiles);
    setTargetSymbol(nextTarget);
    setMistakes(0);
    setFoundCount(0);
    setTargetCount(totalTargetTiles);
    setStatus('playing');
    setFeedbackMode('neutral');
    setTileFeedback({});
    roundStartRef.current = Date.now();
  }, []);

  useEffect(() => {
    sessionStartRef.current = Date.now();
    setCurrentLevel(level);
    setInfiniteScore(0);
    prepareRound(level);

    return () => {
      clearTimers();
    };
  }, [level, prepareRound]);

  const handleSuccess = () => {
    setStatus('won');
    setFeedbackMode('success');
    playSuccessSound();

    const elapsed = Number(((Date.now() - roundStartRef.current) / 1000).toFixed(1));

    if (!isInfinite) {
      registerTimeout(() => onGameComplete(3, elapsed), 850);
      return;
    }

    registerTimeout(() => {
      setInfiniteScore((prevScore) => {
        const nextScore = prevScore + 1;
        setCurrentLevel((prevLevel) => {
          const nextLevel = prevLevel + 1;
          prepareRound(nextLevel);
          return nextLevel;
        });
        return nextScore;
      });
    }, 700);
  };

  const handleFailure = (nextMistakes: number) => {
    setStatus('lost');
    setFeedbackMode('error');
    playErrorSound();

    if (!isInfinite) {
      registerTimeout(() => onGameComplete(0, 0), 900);
      return;
    }

    const elapsedSession = Number(((Date.now() - sessionStartRef.current) / 1000).toFixed(1));
    registerTimeout(() => onGameComplete(infiniteScore, elapsedSession), 900);
  };

  const handleTileClick = (tileId: number) => {
    if (status !== 'playing') return;

    const tile = tiles.find((item) => item.id === tileId);
    if (!tile || tile.found) return;

    if (tile.isTarget) {
      setTiles((prev) => prev.map((item) => (item.id === tileId ? { ...item, found: true } : item)));
      setTileFeedback((prev) => ({ ...prev, [tileId]: 'success' }));
      setFeedbackMode('success');
      playSuccessSound();

      registerTimeout(() => {
        setTileFeedback((prev) => {
          const next = { ...prev };
          delete next[tileId];
          return next;
        });
      }, 300);

      const updatedFoundCount = foundCount + 1;
      setFoundCount(updatedFoundCount);

      if (updatedFoundCount >= targetCount) {
        handleSuccess();
      } else {
        registerTimeout(() => setFeedbackMode('neutral'), 260);
      }

      return;
    }

    setTileFeedback((prev) => ({ ...prev, [tileId]: 'error' }));
    setFeedbackMode('error');
    playErrorSound();

    registerTimeout(() => {
      setTileFeedback((prev) => {
        const next = { ...prev };
        delete next[tileId];
        return next;
      });
      if (status === 'playing') {
        setFeedbackMode('neutral');
      }
    }, 360);

    const nextMistakes = mistakes + 1;
    setMistakes(nextMistakes);

    if (nextMistakes >= MAX_ERRORS) {
      handleFailure(nextMistakes);
    }
  };

  const getColumnsClass = () => {
    if (activeConfig.totalTiles <= 9) return 'grid-cols-3';
    if (activeConfig.totalTiles <= 12) return 'grid-cols-4';
    if (activeConfig.totalTiles <= 16) return 'grid-cols-4';
    return 'grid-cols-5';
  };

  const panelClasses =
    feedbackMode === 'success'
      ? 'border-emerald-400 bg-emerald-50'
      : feedbackMode === 'error'
      ? 'border-red-400 bg-red-50'
      : 'border-slate-200 bg-white';

  return (
    <div className={`w-full max-w-4xl rounded-[2.5rem] border-4 p-6 md:p-8 shadow-2xl transition-colors ${panelClasses}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight">
          Encuentra el Igual
        </h2>
        <div className="flex items-center gap-3 text-lg font-bold text-slate-600">
          <span className="px-4 py-2 rounded-xl bg-slate-100">Nivel {currentLevel}</span>
          {isInfinite && <span className="px-4 py-2 rounded-xl bg-amber-100 text-amber-700">Aciertos: {infiniteScore}</span>}
        </div>
      </div>

      <div className="rounded-3xl border-2 border-slate-200 p-4 md:p-6 bg-slate-50 mb-6">
        <p className="text-sm md:text-base font-bold uppercase tracking-widest text-slate-500 mb-3">Objetivo</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-inner flex items-center justify-center text-4xl md:text-5xl">
              {targetSymbol}
            </div>
            <p className="text-xl md:text-2xl font-black text-slate-700">Toca todas las iguales</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 font-bold">Encontradas: {foundCount}/{targetCount}</p>
            <p className={`font-black ${mistakes === MAX_ERRORS ? 'text-red-600' : 'text-slate-700'}`}>
              Errores: {mistakes}/{MAX_ERRORS}
            </p>
          </div>
        </div>
      </div>

      <div className={`grid ${getColumnsClass()} gap-3 md:gap-4`}>
        {tiles.map((tile) => {
          const feedback = tileFeedback[tile.id];
          const tileClasses = tile.found
            ? 'bg-emerald-100 border-emerald-400'
            : feedback === 'success'
            ? 'bg-emerald-200 border-emerald-500'
            : feedback === 'error'
            ? 'bg-red-200 border-red-500'
            : 'bg-white border-slate-200 hover:border-orange-400';

          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile.id)}
              disabled={status !== 'playing' || tile.found}
              className={`aspect-square rounded-2xl border-4 text-4xl md:text-5xl shadow-sm transition-all active:scale-95 ${tileClasses}`}
            >
              {tile.symbol}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6">
        <p className="text-slate-600 font-bold uppercase tracking-wide text-sm md:text-base">
          {status === 'playing' && 'Encuentra todos los iguales sin llegar a 3 errores'}
          {status === 'won' && 'Perfecto: nivel completado'}
          {status === 'lost' && 'Fallaste el nivel: llegaste a 3 errores'}
        </p>

        <button
          onClick={onExit}
          className="px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-black uppercase tracking-wide transition-colors"
        >
          Salir
        </button>
      </div>
    </div>
  );
};

export default EncuentraElIgualBoard;
