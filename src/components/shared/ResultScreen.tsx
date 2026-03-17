
import React from 'react';
import { LevelProgress } from '../../types';

interface ResultScreenProps {
  result: LevelProgress;
  isInfinite: boolean;
  gameType?: string | null;
  onNext: () => void;
  onRetry: () => void;
  onMenu: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, isInfinite, gameType, onNext, onRetry, onMenu }) => {
  const isScoreBased = gameType === 'nombres';
  const metricLabel = isScoreBased ? 'Puntaje' : 'Tiempo';
  const metricValue = result.timeTaken; // We reused this field
  const metricUnit = isScoreBased ? '%' : 's';
  const titleText = isInfinite ? '¡Genial!' : result.stars > 0 ? '¡Completado!' : '¡Fallido!';

  return (
    <div className="max-w-2xl w-full text-center space-y-6 md:space-y-10 bg-white p-6 sm:p-10 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-800 uppercase tracking-tight break-words leading-tight">
        {titleText}
      </h2>

      {isInfinite ? (
        <div className="py-3 md:py-6">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-400 uppercase tracking-widest">Aciertos</p>
          <div className="text-6xl sm:text-7xl md:text-9xl font-black text-[#9d3eff] mt-3 md:mt-4">
            {result.stars}
          </div>
        </div>
      ) : (
        <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 py-3 md:py-6">
          {[1, 2, 3].map(i => (
            <i 
              key={i} 
              className={`fas fa-star text-5xl sm:text-6xl md:text-8xl transition-all ${i <= result.stars ? 'text-yellow-400 drop-shadow-lg' : 'text-slate-100'}`}
            ></i>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-600 break-words">
          {metricLabel}: <span className="text-blue-500 font-black">{metricValue}{metricUnit}</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 md:gap-4 pt-4 md:pt-8">
        {!isInfinite && result.stars > 0 && (
          <button 
            onClick={onNext}
            className="bg-[#2b6eff] hover:bg-blue-700 text-white text-xl sm:text-2xl md:text-3xl font-black py-4 sm:py-6 md:py-8 rounded-[1.25rem] md:rounded-[2rem] shadow-xl transition-all active:scale-95 uppercase"
          >
            Siguiente
          </button>
        )}
        
        <button 
          onClick={onRetry}
          className="bg-slate-800 hover:bg-black text-white text-lg sm:text-xl md:text-2xl font-black py-4 sm:py-5 md:py-6 rounded-[1.25rem] md:rounded-[2rem] shadow-xl transition-all active:scale-95 uppercase"
        >
          {isInfinite ? 'Jugar de nuevo' : 'Reintentar'}
        </button>

        <button 
          onClick={onMenu}
          className="text-slate-400 hover:text-slate-600 text-base sm:text-lg md:text-xl font-bold py-3 md:py-4 uppercase tracking-wide md:tracking-widest transition-colors"
        >
          Menú Principal
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
