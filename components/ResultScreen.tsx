
import React from 'react';
import { LevelProgress } from '../types';

interface ResultScreenProps {
  result: LevelProgress;
  isInfinite: boolean;
  onNext: () => void;
  onRetry: () => void;
  onMenu: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, isInfinite, onNext, onRetry, onMenu }) => {
  return (
    <div className="max-w-2xl w-full text-center space-y-10 bg-white p-16 rounded-[3rem] shadow-2xl border border-gray-100">
      <h2 className="text-6xl font-black text-slate-800 uppercase tracking-tight">
        {isInfinite ? '¡Genial!' : '¡Completado!'}
      </h2>

      {isInfinite ? (
        <div className="py-6">
          <p className="text-3xl font-bold text-slate-400 uppercase tracking-widest">Aciertos</p>
          <div className="text-9xl font-black text-[#9d3eff] mt-4">
            {result.stars}
          </div>
        </div>
      ) : (
        <div className="flex justify-center gap-6 py-6">
          {[1, 2, 3].map(i => (
            <i 
              key={i} 
              className={`fas fa-star text-8xl transition-all ${i <= result.stars ? 'text-yellow-400 drop-shadow-lg' : 'text-slate-100'}`}
            ></i>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <p className="text-3xl font-bold text-slate-600">
          Tiempo: <span className="text-blue-500 font-black">{result.timeTaken}s</span>
        </p>
        <p className="text-2xl text-slate-400 font-medium">
          Tu cerebro está más ágil hoy.
        </p>
      </div>

      <div className="flex flex-col gap-4 pt-8">
        {!isInfinite && (
          <button 
            onClick={onNext}
            className="bg-[#2b6eff] hover:bg-blue-700 text-white text-3xl font-black py-8 rounded-[2rem] shadow-xl transition-all active:scale-95 uppercase"
          >
            Siguiente
          </button>
        )}
        
        <button 
          onClick={onRetry}
          className="bg-slate-800 hover:bg-black text-white text-2xl font-black py-6 rounded-[2rem] shadow-xl transition-all active:scale-95 uppercase"
        >
          {isInfinite ? 'Jugar de nuevo' : 'Reintentar'}
        </button>

        <button 
          onClick={onMenu}
          className="text-slate-400 hover:text-slate-600 text-xl font-bold py-4 uppercase tracking-widest transition-colors"
        >
          Menú Principal
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
