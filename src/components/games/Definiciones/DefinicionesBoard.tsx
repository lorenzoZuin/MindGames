import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getRoundByLevel, getRoundForInfinite } from './constants';

type FeedbackMode = 'neutral' | 'success' | 'error';
type RoundStatus = 'playing' | 'won' | 'lost';

interface DefinicionesBoardProps {
  level: number;
  isInfinite: boolean;
  onGameComplete: (stars: number, timeTaken: number) => void;
  onExit: () => void;
}

const MAX_ERRORS_INFINITE = 3;

const DefinicionesBoard: React.FC<DefinicionesBoardProps> = ({
  level,
  isInfinite,
  onGameComplete,
  onExit,
}) => {
  const [currentLevel, setCurrentLevel] = useState(level);
  const [definition, setDefinition] = useState('');
  const [correctWord, setCorrectWord] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>('neutral');
  const [status, setStatus] = useState<RoundStatus>('playing');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [infiniteScore, setInfiniteScore] = useState(0);

  const roundStartRef = useRef<number>(Date.now());
  const sessionStartRef = useRef<number>(Date.now());
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timeoutsRef.current = [];
  };

  const registerTimeout = (callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
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
    playTone(560, 100, 0, 'triangle', 0.07);
    playTone(740, 120, 0.1, 'triangle', 0.07);
  };

  const playErrorSound = () => {
    playTone(260, 150, 0, 'sawtooth', 0.06);
    playTone(190, 180, 0.1, 'sawtooth', 0.06);
  };

  const setupRound = useCallback((roundLevel: number) => {
    clearTimers();

    const round = isInfinite ? getRoundForInfinite(roundLevel) : getRoundByLevel(roundLevel);

    setDefinition(round.target.definition);
    setCorrectWord(round.target.word);
    setOptions(round.options);
    if (!isInfinite) {
      setMistakes(0);
    }
    setSelectedWord(null);
    setFeedbackMode('neutral');
    setStatus('playing');
    roundStartRef.current = Date.now();
  }, [isInfinite]);

  useEffect(() => {
    sessionStartRef.current = Date.now();
    setCurrentLevel(level);
    setInfiniteScore(0);
    setupRound(level);

    return () => {
      clearTimers();
    };
  }, [level, setupRound]);

  const panelClasses = useMemo(() => {
    if (feedbackMode === 'success') {
      return 'border-emerald-400 bg-emerald-50';
    }

    if (feedbackMode === 'error') {
      return 'border-red-400 bg-red-50';
    }

    return 'border-slate-200 bg-white';
  }, [feedbackMode]);

  const calculateStars = (elapsedSeconds: number, errorsCount: number, optionsCount: number): number => {
    const threeStarsThreshold = 7 + optionsCount;
    const twoStarsThreshold = 12 + optionsCount;

    if (errorsCount === 0 && elapsedSeconds <= threeStarsThreshold) {
      return 3;
    }

    if (errorsCount <= 1 && elapsedSeconds <= twoStarsThreshold) {
      return 2;
    }

    return 1;
  };

  const resolveSuccess = () => {
    setStatus('won');
    setFeedbackMode('success');
    playSuccessSound();

    if (isInfinite) {
      registerTimeout(() => {
        setInfiniteScore((prevScore) => {
          const nextScore = prevScore + 1;
          setCurrentLevel((prevLevel) => {
            const nextLevel = prevLevel + 1;
            setupRound(nextLevel);
            return nextLevel;
          });
          return nextScore;
        });
      }, 700);
      return;
    }

    const elapsedSeconds = Number(((Date.now() - roundStartRef.current) / 1000).toFixed(1));
    const stars = calculateStars(elapsedSeconds, mistakes, options.length);
    registerTimeout(() => onGameComplete(stars, elapsedSeconds), 800);
  };

  const resolveFailure = () => {
    setStatus('lost');
    setFeedbackMode('error');
    playErrorSound();

    if (!isInfinite) {
      registerTimeout(() => onGameComplete(0, 0), 850);
      return;
    }

    const elapsedSession = Number(((Date.now() - sessionStartRef.current) / 1000).toFixed(1));
    registerTimeout(() => onGameComplete(infiniteScore, elapsedSession), 900);
  };

  const handleSelectWord = (word: string) => {
    if (status !== 'playing') return;

    setSelectedWord(word);

    if (word === correctWord) {
      resolveSuccess();
      return;
    }

    const nextMistakes = mistakes + 1;
    setMistakes(nextMistakes);
    setFeedbackMode('error');
    playErrorSound();

    if (!isInfinite) {
      resolveFailure();
      return;
    }

    if (nextMistakes >= MAX_ERRORS_INFINITE) {
      resolveFailure();
      return;
    }

    registerTimeout(() => {
      setSelectedWord(null);
      setFeedbackMode('neutral');
    }, 350);
  };

  const buttonMinWidthClass =
    options.length <= 2
      ? 'min-w-[calc(50%-0.5rem)]'
      : options.length <= 4
      ? 'min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.75rem)]'
      : 'min-w-[calc(50%-0.5rem)] md:min-w-[calc(33.333%-0.75rem)]';

  return (
    <div className={`w-full max-w-4xl rounded-[2.5rem] border-4 p-4 sm:p-6 md:p-8 mx-3 sm:mx-4 md:mx-0 shadow-2xl transition-colors ${panelClasses}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight">
          Definiciones
        </h2>
        <div className="flex items-center gap-3 text-lg font-bold text-slate-600">
          <span className="px-4 py-2 rounded-xl bg-slate-100">Nivel {currentLevel}</span>
          {isInfinite && (
            <span className="px-4 py-2 rounded-xl bg-cyan-100 text-cyan-700">Aciertos: {infiniteScore}</span>
          )}
        </div>
      </div>

      <div className="rounded-3xl border-2 border-slate-200 p-5 md:p-6 bg-slate-50 mb-6">
        <p className="text-sm md:text-base font-bold uppercase tracking-widest text-slate-500 mb-3">
          Definicion
        </p>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-slate-700 leading-snug">{definition}</p>
      </div>

      <div className="flex flex-wrap gap-3 md:gap-4">
        {options.map((word) => {
          const isCorrectChoice = selectedWord === word && word === correctWord;
          const isWrongChoice = selectedWord === word && word !== correctWord;

          const buttonClass = isCorrectChoice
            ? 'bg-emerald-500 text-white border-emerald-600'
            : isWrongChoice
            ? 'bg-red-500 text-white border-red-600'
            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400';

          return (
            <button
              key={word}
              onClick={() => handleSelectWord(word)}
              disabled={status !== 'playing'}
              className={`flex-1 ${buttonMinWidthClass} min-h-16 sm:min-h-20 px-3 sm:px-4 py-3 sm:py-4 rounded-2xl border-4 text-base sm:text-lg md:text-xl lg:text-2xl font-black shadow-sm transition-all active:scale-95 ${buttonClass}`}
            >
              {word}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6">
        <p className="text-slate-600 font-bold tracking-wide text-sm md:text-base">
          {status === 'playing' && isInfinite && `Errores totales: ${mistakes}/${MAX_ERRORS_INFINITE}`}
          {status === 'playing' && !isInfinite && ''}
          {status === 'won' && 'Correcto: definicion resuelta'}
          {status === 'lost' && 'Ronda finalizada: alcanzaste el limite de errores'}
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

export default DefinicionesBoard;
