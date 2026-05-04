import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LECTO_TEXTS, TOTAL_LEVELS_LECTO, LectoQuestion, ReadingText } from './constants';

type FeedbackMode = 'neutral' | 'success' | 'error';
type RoundStatus = 'playing' | 'won' | 'lost';

interface LectoComprensionBoardProps {
  level: number;
  isInfinite: boolean;
  onGameComplete: (stars: number, timeTaken: number) => void;
  onExit: () => void;
}

const MAX_ERRORS_INFINITE = 3;

const LectoComprensionBoard: React.FC<LectoComprensionBoardProps> = ({
  level,
  isInfinite,
  onGameComplete,
  onExit,
}) => {
  const [currentLevel, setCurrentLevel] = useState(level);
  
  const [currentText, setCurrentText] = useState<ReadingText | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<LectoQuestion | null>(null);
  
  const [mistakes, setMistakes] = useState(0);
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>('neutral');
  const [status, setStatus] = useState<RoundStatus>('playing');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
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

    let textObj: ReadingText;
    let questionObj: LectoQuestion;

    if (isInfinite) {
      const textIndex = Math.floor(Math.random() * LECTO_TEXTS.length);
      textObj = LECTO_TEXTS[textIndex];
      const qIndex = Math.floor(Math.random() * textObj.questions.length);
      questionObj = textObj.questions[qIndex];
    } else {
      const safeLevel = Math.min(Math.max(1, roundLevel), TOTAL_LEVELS_LECTO);
      const textIndex = Math.floor((safeLevel - 1) / 5);
      const questionIndex = (safeLevel - 1) % 5;
      textObj = LECTO_TEXTS[textIndex];
      questionObj = textObj.questions[questionIndex];
      setMistakes(0);
    }

    setCurrentText(textObj);
    setCurrentQuestion(questionObj);
    setSelectedOptionIndex(null);
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
    if (feedbackMode === 'success') return 'border-emerald-400 bg-emerald-50';
    if (feedbackMode === 'error') return 'border-red-400 bg-red-50';
    return 'border-amber-200 bg-white';
  }, [feedbackMode]);

  const calculateStars = (elapsedSeconds: number, errorsCount: number): number => {
    // texts are long, give plenty of time to read
    const threeStarsThreshold = 60; 
    const twoStarsThreshold = 120;

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
      }, 1000);
      return;
    }

    const elapsedSeconds = Number(((Date.now() - roundStartRef.current) / 1000).toFixed(1));
    const stars = calculateStars(elapsedSeconds, mistakes);
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

  const handleSelectOption = (index: number) => {
    if (status !== 'playing' || !currentQuestion) return;

    setSelectedOptionIndex(index);
    const isCorrect = index === currentQuestion.correctAnswer;

    if (isCorrect) {
      resolveSuccess();
    } else {
      const updatedMistakes = mistakes + 1;
      setMistakes(updatedMistakes);

      if (!isInfinite && updatedMistakes >= 1) {
        resolveFailure();
      } else if (isInfinite && updatedMistakes >= MAX_ERRORS_INFINITE) {
        resolveFailure();
      } else {
        setFeedbackMode('error');
        playErrorSound();
        registerTimeout(() => {
          if (status === 'playing') {
            setFeedbackMode('neutral');
            setSelectedOptionIndex(null);
          }
        }, 500);
      }
    }
  };

  if (!currentText || !currentQuestion) return null;

  return (
    <div className="flex flex-col h-[90vh] bg-slate-50 w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-200">
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
              <span className="text-xl font-bold text-amber-500">{infiniteScore}</span>
            </div>
          )}

          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
              {isInfinite ? 'Errores' : 'Nivel'}
            </span>
            <span className={`text-xl font-bold ${isInfinite && mistakes >= MAX_ERRORS_INFINITE - 1 ? 'text-red-500' : 'text-slate-700'}`}>
              {isInfinite ? `${mistakes}/${MAX_ERRORS_INFINITE}` : currentLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col">
        <div className="mb-4 md:mb-6 text-center w-full px-2 md:px-6 mx-auto">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-4 font-serif">
            {currentText.title}
          </h2>
          <div className="space-y-3 text-left text-slate-700 text-base md:text-lg leading-snug">
            {currentText.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <div
          className={`
            border-2 rounded-2xl p-4 md:p-6 transition-colors duration-300 w-full mx-auto flex-1 flex flex-col justify-center
            ${panelClasses}
          `}
        >
          <div className="text-center mb-6">
            <p className="text-lg md:text-xl font-bold text-slate-800">
              {currentQuestion.question}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {currentQuestion.options.map((option, index) => {
              let btnClass = "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 border-b-4 hover:-translate-y-1";
              
              if (selectedOptionIndex === index) {
                if (status === 'playing' && feedbackMode === 'error') {
                  btnClass = "bg-red-50 border-red-200 text-red-600 translate-y-1 border-b-0";
                } else if (status === 'won') {
                  btnClass = index === currentQuestion.correctAnswer 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 -translate-y-1 border-b-4"
                    : "bg-white border-slate-200 text-slate-400 opacity-50";
                } else if (status === 'lost') {
                  btnClass = index === currentQuestion.correctAnswer
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 -translate-y-1 border-b-4"
                    : "bg-red-50 border-red-200 text-red-600 translate-y-1 border-b-0";
                }
              } else if (status !== 'playing') {
                btnClass = index === currentQuestion.correctAnswer
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 -translate-y-1 border-b-4"
                  : "bg-white border-slate-200 text-slate-400 opacity-50 translate-y-1 border-b-0";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  disabled={status !== 'playing'}
                  className={`
                    w-full py-3 px-4 rounded-xl font-bold text-base md:text-lg border-2
                    transition-all duration-200 shadow-sm active:translate-y-1 active:border-b-0
                    flex items-center justify-center text-center
                    ${btnClass}
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectoComprensionBoard;
