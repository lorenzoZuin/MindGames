
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { COLORS, QUESTIONS_PER_LEVEL, BASE_OPTIONS_COUNT, OPTIONS_INCREASE_INTERVAL, STARS_3_THRESHOLD, STARS_2_THRESHOLD } from '../constants';
import { Question } from '../types';

interface GameBoardProps {
  level: number;
  isInfinite: boolean;
  onComplete: (stars: number, timeTaken: number) => void;
  onQuit: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ level, isInfinite, onComplete, onQuit }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [isWrong, setIsWrong] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  
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

  const generateQuestion = useCallback(() => {
    const optionsCount = isInfinite 
      ? Math.min(8, BASE_OPTIONS_COUNT + Math.floor(score / 15))
      : Math.min(8, BASE_OPTIONS_COUNT + Math.floor((level - 1) / OPTIONS_INCREASE_INTERVAL));

    const color1 = COLORS[Math.floor(Math.random() * COLORS.length)];
    let color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
    while (color1.name === color2.name) {
      color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    const correctColor = color2;
    const wordDisplay = color1.name;

    const others = COLORS.filter(c => c.name !== correctColor.name);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
    const finalOptions = [correctColor.name, ...shuffledOthers.slice(0, optionsCount - 1).map(c => c.name)]
      .sort(() => Math.random() - 0.5);

    setQuestion({
      word: wordDisplay,
      colorValue: correctColor.value,
      correctAnswer: correctColor.name,
      options: finalOptions
    });
  }, [level, isInfinite, score]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswer = (answer: string) => {
    if (isWrong || isCorrect) return;

    if (answer === question?.correctAnswer) {
      setIsCorrect(true);
      playSound(880, 0.2); 
      
      (window as any).confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setIsCorrect(false);
        const nextScore = score + 1;
        setScore(nextScore);
        
        if (!isInfinite && currentQuestionIdx + 1 >= QUESTIONS_PER_LEVEL) {
          const finalTime = Math.floor((Date.now() - startTime) / 1000);
          let stars = 1;
          if (finalTime <= STARS_3_THRESHOLD && mistakes === 0) stars = 3;
          else if (finalTime <= STARS_2_THRESHOLD && mistakes <= 1) stars = 2;
          onComplete(stars, finalTime);
        } else {
          setCurrentQuestionIdx(i => i + 1);
          generateQuestion();
        }
      }, 800);
    } else {
      setIsWrong(true);
      setMistakes(m => m + 1);
      playSound(220, 0.3, 'square');
      setTimeout(() => setIsWrong(false), 800);
    }
  };

  const handleFinishInfinite = () => {
    onComplete(score, elapsed);
  };

  if (!question) return null;

  return (
    <div className="max-w-4xl w-full flex flex-col items-center space-y-8">
      {/* Header Info */}
      <div className="w-full flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100">
        <div className="flex gap-3">
          <button 
            onClick={onQuit} 
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-5 rounded-2xl text-3xl transition-all shadow-sm active:scale-95"
          >
            <i className="fas fa-home"></i>
          </button>
          
          {isInfinite && (
            <button 
              onClick={handleFinishInfinite} 
              className="bg-green-500 hover:bg-green-600 text-white px-8 rounded-2xl text-2xl font-black uppercase shadow-md active:scale-95"
            >
              Cerrar
            </button>
          )}
        </div>
        
        <div className="text-3xl font-black text-slate-800 uppercase tracking-tight">
          {isInfinite ? `Aciertos: ${score}` : `Nivel ${level}: ${currentQuestionIdx + 1}/${QUESTIONS_PER_LEVEL}`}
        </div>

        <div className="text-3xl font-black text-blue-500 tabular-nums">
          <i className="fas fa-clock mr-2 opacity-30"></i>
          {elapsed}s
        </div>
      </div>

      {/* Main Challenge Area */}
      <div className={`
        relative w-full bg-white py-28 px-8 rounded-[3rem] shadow-2xl transition-all duration-300 border-4 overflow-hidden
        ${isWrong ? 'border-red-500 animate-shake' : isCorrect ? 'border-green-500 scale-105' : 'border-transparent'}
      `}>
        <div 
          className="text-[8rem] font-black text-center select-none uppercase transition-colors leading-none break-words max-w-full"
          style={{ color: question.colorValue }}
        >
          {question.word}
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="bg-slate-900 text-white hover:bg-blue-600 text-4xl font-black py-10 px-4 rounded-[2rem] shadow-xl transition-all active:scale-95 uppercase tracking-wide break-words overflow-hidden"
          >
            {option}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-20px); }
          50% { transform: translateX(20px); }
          75% { transform: translateX(-20px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default GameBoard;
