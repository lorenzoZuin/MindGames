import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ORDEN_PASOS_LEVELS, SequenceTask, TOTAL_LEVELS_ORDEN } from './constants';

type FeedbackMode = 'neutral' | 'success' | 'error';
type RoundStatus = 'playing' | 'won' | 'lost';

interface OrdenPasosBoardProps {
  level: number;
  isInfinite: boolean;
  onGameComplete: (stars: number, timeTaken: number) => void;
  onExit: () => void;
}

const MAX_ERRORS = 3;

interface StepItem {
  id: string;
  text: string;
}

const OrdenPasosBoard: React.FC<OrdenPasosBoardProps> = ({
  level,
  isInfinite,
  onGameComplete,
  onExit,
}) => {
  const [currentLevel, setCurrentLevel] = useState(level);
  const [currentTask, setCurrentTask] = useState<SequenceTask | null>(null);
  
  const [availableSteps, setAvailableSteps] = useState<StepItem[]>([]);
  const [placedSteps, setPlacedSteps] = useState<StepItem[]>([]);
  
  const [mistakes, setMistakes] = useState(0);
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>('neutral');
  const [status, setStatus] = useState<RoundStatus>('playing');
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
  
  const playClickSound = () => {
    playTone(400, 50, 0, 'sine', 0.02);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const setupRound = useCallback((roundLevel: number) => {
    clearTimers();

    let taskRef: SequenceTask;

    if (isInfinite) {
      const idx = Math.floor(Math.random() * ORDEN_PASOS_LEVELS.length);
      taskRef = ORDEN_PASOS_LEVELS[idx];
    } else {
      const safeLevel = Math.min(Math.max(1, roundLevel), TOTAL_LEVELS_ORDEN);
      taskRef = ORDEN_PASOS_LEVELS[safeLevel - 1];
      setMistakes(0);
    }

    const stepItems: StepItem[] = taskRef.steps.map((text, idx) => ({ id: `step-${idx}`, text }));
    let shuffled: StepItem[] = shuffleArray(stepItems);
    
    // Prevent accidentally giving it already ordered
    let attempt = 0;
    while (
      shuffled.every((s, i) => s.id === `step-${i}`) &&
      attempt < 10
    ) {
      shuffled = shuffleArray(stepItems);
      attempt++;
    }

    setCurrentTask(taskRef);
    setAvailableSteps(shuffled);
    setPlacedSteps([]);
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

  const calculateStars = (elapsedSeconds: number, errorsCount: number, stepsCount: number): number => {
    const perfectTime = 4 * stepsCount; 
    const goodTime = 8 * stepsCount;

    if (errorsCount === 0 && elapsedSeconds <= perfectTime) return 3;
    if (errorsCount <= 1 && elapsedSeconds <= goodTime) return 2;
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
      }, 1000);
      return;
    }

    const elapsedSeconds = Number(((Date.now() - roundStartRef.current) / 1000).toFixed(1));
    const stars = calculateStars(elapsedSeconds, mistakes, currentTask?.steps.length || 5);
    registerTimeout(() => onGameComplete(stars, elapsedSeconds), 1200);
  };

  const resolveFailure = () => {
    setStatus('lost');
    setFeedbackMode('error');
    playErrorSound();

    if (!isInfinite) {
      registerTimeout(() => onGameComplete(0, 0), 1200);
      return;
    }

    const elapsedSession = Number(((Date.now() - sessionStartRef.current) / 1000).toFixed(1));
    registerTimeout(() => onGameComplete(infiniteScore, elapsedSession), 1500);
  };

  const handleVerify = () => {
    if (status !== 'playing' || !currentTask) return;

    // Only allow verifying if all steps are placed
    if (availableSteps.length > 0) return;

    // Check sequence
    const isCorrect = placedSteps.every((step, index) => step.id === `step-${index}`);

    if (isCorrect) {
      resolveSuccess();
    } else {
      const updatedMistakes = mistakes + 1;
      setMistakes(updatedMistakes);

      if (updatedMistakes >= MAX_ERRORS) {
        resolveFailure();
      } else {
        setFeedbackMode('error');
        playErrorSound();
      }
    }
  };

  // Add step to the placed list (from the available pool)
  const addStep = (step: StepItem) => {
    if (status !== 'playing') return;
    if (feedbackMode === 'error') setFeedbackMode('neutral');
    playClickSound();
    setAvailableSteps(availableSteps.filter(s => s.id !== step.id));
    setPlacedSteps([...placedSteps, step]);
  };

  // Remove step from placed list and return it to available pool
  const removeStep = (step: StepItem) => {
    if (status !== 'playing') return;
    if (feedbackMode === 'error') setFeedbackMode('neutral');
    playClickSound();
    setPlacedSteps(placedSteps.filter(s => s.id !== step.id));
    setAvailableSteps([...availableSteps, step]);
  };

  const isComplete = availableSteps.length === 0;

  const panelClasses = useMemo(() => {
    if (feedbackMode === 'success') return 'border-emerald-400 bg-emerald-50';
    if (feedbackMode === 'error') return 'border-red-400 bg-red-50';
    return 'border-indigo-200 bg-white';
  }, [feedbackMode]);

  if (!currentTask) return null;

  return (
    <div className="flex flex-col h-[90vh] bg-slate-50 w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-200">
      {/* HEADER */}
      <div className="flex-none flex items-center justify-between p-3 md:p-4 bg-white border-b border-slate-200">
        <button
          onClick={onExit}
          className="text-slate-400 hover:text-slate-600 font-medium px-4 py-2 rounded-xl transition-colors active:bg-slate-100"
        >
          Abandonar
        </button>

        <div className="flex items-center gap-6">
          {isInfinite && (
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Puntos</span>
              <span className="text-xl font-bold text-indigo-500">{infiniteScore}</span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Errores
            </span>
            <span className={`text-xl font-bold ${mistakes >= MAX_ERRORS - 1 ? 'text-red-500' : 'text-slate-700'}`}>
              {mistakes}/{MAX_ERRORS}
            </span>
          </div>
          {!isInfinite && (
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Nivel
              </span>
              <span className="text-xl font-bold text-slate-700">
                {currentLevel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center">
        
        <div className="mb-4 text-center w-full px-2">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-1">
            Reorganiza los pasos
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">
            {currentTask.title}
          </h2>
        </div>

        {/* CONTAINER FOR PLACED ITEMS */}
        <div className={`
          w-full max-w-2xl border-2 rounded-2xl p-4 md:p-6 mb-6 flex flex-col gap-2 min-h-[300px] transition-colors
          ${panelClasses}
          ${feedbackMode === 'error' ? 'animate-shake' : ''}
        `}>
          {placedSteps.length === 0 && availableSteps.length > 0 && (
            <div className="h-full w-full flex items-center justify-center text-slate-300 font-bold text-lg border-2 border-dashed border-indigo-100 rounded-xl py-10">
              Toca un paso debajo para agregarlo aquí
            </div>
          )}

          {placedSteps.map((step, idx) => {
            let stepClass = "bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100";
            if (feedbackMode === 'error') {
              if (step.id === `step-${idx}`) {
                 stepClass = "bg-emerald-50 border-emerald-300 text-emerald-800";
              } else {
                 stepClass = "bg-red-50 border-red-300 text-red-800 animate-shake";
              }
            } else if (feedbackMode === 'success') {
              stepClass = "bg-emerald-50 border-emerald-300 text-emerald-800";
            }

            return (
              <button
                key={step.id}
                onClick={() => removeStep(step)}
                disabled={status !== 'playing'}
                className={`
                  w-full text-left border-2
                  font-bold text-lg md:text-xl py-3 px-5 rounded-xl flex items-center gap-4
                  transition-transform active:scale-[0.98] cursor-pointer
                  ${stepClass}
                  ${status !== 'playing' ? 'opacity-80' : ''}
                `}
              >
                <span className="bg-white/60 w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0">
                  {idx + 1}
                </span>
                <span>{step.text}</span>
              </button>
            );
          })}
        </div>

        {/* CONTAINER FOR AVAILABLE ITEMS */}
        <div className="w-full max-w-2xl mt-auto">
          <div className="flex flex-col gap-2 w-full">
            {availableSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => addStep(step)}
                disabled={status !== 'playing'}
                className={`
                  w-full text-center bg-white border-2 border-slate-200 text-slate-600 border-b-4 
                  font-bold text-lg md:text-xl py-3 px-5 rounded-xl
                  transition-transform active:translate-y-1 active:border-b-2 cursor-pointer hover:bg-slate-50
                `}
              >
                {step.text}
              </button>
            ))}
          </div>

          {/* VERIFY BUTTON */}
          <div className="mt-6 flex justify-center h-16">
            {isComplete && status === 'playing' && (
              <button
                onClick={handleVerify}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xl md:text-2xl px-10 py-4 rounded-full shadow-lg hover:-translate-y-1 transition-transform w-[80%] uppercase tracking-widest"
              >
                ¡Comprobar!
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrdenPasosBoard;
