import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getInfinitePhraseWords, getPhraseWordsByLevel } from './constants';

interface OrdenaLaFraseBoardProps {
  level: number;
  isInfinite?: boolean;
  onGameComplete: (stars: number, timeTaken: number) => void;
  onExit: () => void;
}

const shuffleWords = (words: string[]): string[] => {
  if (words.length <= 1) {
    return [...words];
  }

  const shuffled = [...words].sort(() => 0.5 - Math.random());
  const sameOrder = shuffled.every((word, index) => word === words[index]);

  if (sameOrder) {
    return [...words.slice(1), words[0]];
  }

  return shuffled;
};

const calculateStars = (seconds: number, wordsCount: number): number => {
  const threeStarsThreshold = Math.max(8, wordsCount * 1.6);
  const twoStarsThreshold = Math.max(12, wordsCount * 2.4);

  if (seconds <= threeStarsThreshold) {
    return 3;
  }

  if (seconds <= twoStarsThreshold) {
    return 2;
  }

  return 1;
};

const OrdenaLaFraseBoard: React.FC<OrdenaLaFraseBoardProps> = ({
  level,
  isInfinite = false,
  onGameComplete,
  onExit
}) => {
  const [currentRound, setCurrentRound] = useState(level);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [infiniteSuccesses, setInfiniteSuccesses] = useState(0);
  const [message, setMessage] = useState('Arrastra para ordenar la frase');
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [isRoundResolved, setIsRoundResolved] = useState(false);

  const audioCtx = useRef<AudioContext | null>(null);

  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.current.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.current.destination);

    osc.start();
    osc.stop(audioCtx.current.currentTime + duration);
  }, []);

  const phraseLabel = useMemo(() => {
    return isInfinite ? `Infinito Ronda ${currentRound}` : `Nivel ${level}`;
  }, [currentRound, isInfinite, level]);

  useEffect(() => {
    if (isInfinite) {
      setCurrentRound(1);
      setInfiniteSuccesses(0);
      setupRound(1);
      return;
    }

    setCurrentRound(level);
    setupRound(level);
  }, [level, isInfinite]);

  const setupRound = (phraseLevel: number) => {
    const words = isInfinite ? getInfinitePhraseWords(phraseLevel) : getPhraseWordsByLevel(phraseLevel);
    setTargetWords(words);
    setOrderedWords(shuffleWords(words));
    setSelectedWordIndex(null);
    setDragIndex(null);
    setShowIncorrectFeedback(false);
    setIsRoundResolved(false);
    setMessage('Arrastra para ordenar la frase');
    setRoundStartTime(Date.now());
  };

  const moveWord = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= orderedWords.length || to >= orderedWords.length) {
      return;
    }

    setOrderedWords(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  };

  const handleDragStart = (index: number) => {
    if (isRoundResolved) {
      return;
    }

    setDragIndex(index);
  };

  const handleDrop = (index: number) => {
    if (isRoundResolved) {
      return;
    }

    if (dragIndex === null) {
      return;
    }

    moveWord(dragIndex, index);
    setDragIndex(null);
  };

  const handleWordClick = (index: number) => {
    if (isRoundResolved) {
      return;
    }

    if (selectedWordIndex === null) {
      setSelectedWordIndex(index);
      return;
    }

    if (selectedWordIndex === index) {
      setSelectedWordIndex(null);
      return;
    }

    moveWord(selectedWordIndex, index);
    setSelectedWordIndex(null);
  };

  const checkPhrase = () => {
    if (isRoundResolved) {
      return;
    }

    const isCorrect = orderedWords.every((word, index) => word === targetWords[index]);

    if (!isCorrect) {
      setIsRoundResolved(true);
      setShowIncorrectFeedback(true);
      setMessage('Orden incorrecto. Fin de la ronda.');
      playSound(220, 0.3, 'square');
      if (isInfinite) {
        const elapsed = Math.round((Date.now() - roundStartTime) / 1000);
        setTimeout(() => onGameComplete(infiniteSuccesses, elapsed), 1000);
        return;
      }

      setTimeout(() => onGameComplete(0, 0), 1000);
      return;
    }

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - roundStartTime) / 1000));
    setIsRoundResolved(true);
    playSound(880, 0.2);

    if (isInfinite) {
      setMessage('Correcto. Siguiente frase.');
      setInfiniteSuccesses(prev => prev + 1);
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setTimeout(() => setupRound(nextRound), 700);
      return;
    }

    const stars = calculateStars(elapsedSeconds, targetWords.length);
    setMessage('Frase correcta.');
    setTimeout(() => onGameComplete(stars, elapsedSeconds), 700);
  };

  return (
    <div className="max-w-5xl w-full flex flex-col items-center space-y-8">
      <div className="w-full flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100">
        <button
          onClick={onExit}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-5 rounded-2xl text-3xl transition-all shadow-sm active:scale-95"
        >
          <i className="fas fa-home"></i>
        </button>

        <div className="text-3xl font-black text-slate-800 uppercase tracking-tight text-center">
          {phraseLabel}
        </div>

        <button
          onClick={checkPhrase}
          disabled={isRoundResolved}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-black uppercase shadow-md transition-all active:scale-95"
        >
          Confirmar
        </button>
      </div>

      <div className="relative w-full bg-white py-12 px-8 rounded-[3rem] shadow-2xl border border-gray-100">
        <h2 className="text-4xl md:text-5xl font-black text-center text-slate-800 uppercase tracking-tight mb-3">
          Ordena la frase
        </h2>
        <p className="text-slate-500 text-center font-bold uppercase tracking-wide mb-10">
          Arrastra una palabra sobre otra para cambiarla de lugar
        </p>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 min-h-20">
          {orderedWords.map((word, index) => (
            <button
              key={`${word}-${index}`}
              draggable={!isRoundResolved}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              onClick={() => handleWordClick(index)}
              disabled={isRoundResolved}
              className={`px-4 md:px-6 py-3 md:py-4 rounded-2xl font-black text-lg md:text-xl select-none transition-all active:scale-95 shadow-md
                ${showIncorrectFeedback
                  ? 'bg-red-500 text-white'
                  : selectedWordIndex === index
                  ? 'bg-emerald-700 text-white ring-4 ring-emerald-200'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'}
              `}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 text-center">
        <p className="text-xl font-black text-slate-600">{message}</p>
        <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-wide">
          Si estas en movil, toca una palabra y luego otra para intercambiarlas
        </p>
      </div>
    </div>
  );
};

export default OrdenaLaFraseBoard;
