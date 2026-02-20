
import React from 'react';
import { LevelProgress } from '../../../types';

interface LevelSelectorProps {
  levels: LevelProgress[];
  onSelectLevel: (lvl: number) => void;
  onBack: () => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ levels, onSelectLevel, onBack }) => {
  return (
    <div className="max-w-4xl w-full bg-white p-10 rounded-[3rem] shadow-2xl h-[85vh] flex flex-col border border-gray-100 overflow-hidden">
      <div className="flex justify-between items-center mb-10">
        <button 
          onClick={onBack}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-black text-2xl uppercase transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Atrás
        </button>
        <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight">Niveles</h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 overflow-y-auto pr-2 pb-6 custom-scrollbar p-2 -m-2">
        {levels.map((lvl, index) => {
          const isUnlocked = index === 0 || levels[index - 1].completed;
          
          return (
            <button
              key={lvl.levelNumber}
              disabled={!isUnlocked}
              onClick={() => onSelectLevel(lvl.levelNumber)}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-[2rem] transition-all
                ${isUnlocked 
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer shadow-md hover:shadow-blue-200 scale-100 hover:scale-105 active:scale-95' 
                  : 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-60'}
              `}
            >
              <span className="text-4xl font-black">{lvl.levelNumber}</span>
              {isUnlocked && (
                <div className="flex mt-2 gap-1">
                  {[1, 2, 3].map(starIdx => (
                    <i 
                      key={starIdx}
                      className={`fas fa-star text-sm ${starIdx <= lvl.stars ? 'text-yellow-400' : 'text-slate-300'}`}
                    ></i>
                  ))}
                </div>
              )}
              {!isUnlocked && <i className="fas fa-lock text-xl mt-2"></i>}
            </button>
          );
        })}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default LevelSelector;
