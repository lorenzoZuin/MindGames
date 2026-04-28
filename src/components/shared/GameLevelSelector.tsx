import React from 'react';
import { LevelProgress } from '../../types';

interface GameLevelSelectorProps {
  levels: LevelProgress[];
  onSelectLevel: (lvl: number) => void;
  onBack: () => void;
  unlockedLevelClassName: string;
}

const GameLevelSelector: React.FC<GameLevelSelectorProps> = ({
  levels,
  onSelectLevel,
  onBack,
  unlockedLevelClassName
}) => {
  return (
    <div className="max-w-4xl w-full bg-white p-4 sm:p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl h-[85vh] flex flex-col border border-gray-100 overflow-hidden mx-3 sm:mx-4 md:mx-0">
      <div className="flex justify-between items-center mb-6 sm:mb-8 md:mb-10 gap-2">
        <button
          onClick={onBack}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 sm:px-5 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg md:text-2xl uppercase transition-colors flex-shrink-0"
        >
          <i className="fas fa-arrow-left mr-1 sm:mr-2"></i>
          <span className="hidden sm:inline">Atrás</span>
        </button>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight flex-grow text-center">Niveles</h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4 md:gap-6 overflow-y-auto pr-2 pb-6 custom-scrollbar p-2 -m-2">
        {levels.map((lvl, index) => {
          const isUnlocked = index === 0 || levels[index - 1].completed;

          return (
            <button
              key={lvl.levelNumber}
              disabled={!isUnlocked}
              onClick={() => onSelectLevel(lvl.levelNumber)}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-lg sm:rounded-xl md:rounded-[2rem] transition-all
                ${isUnlocked
                  ? unlockedLevelClassName
                  : 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-60'}
              `}
            >
              <span className="text-xl sm:text-2xl md:text-4xl font-black">{lvl.levelNumber}</span>
              {isUnlocked && (
                <div className="flex mt-1 sm:mt-2 gap-0.5 sm:gap-1">
                  {[1, 2, 3].map(starIdx => (
                    <i
                      key={starIdx}
                      className={`fas fa-star text-xs sm:text-sm ${starIdx <= lvl.stars ? 'text-yellow-400' : 'text-slate-300'}`}
                    ></i>
                  ))}
                </div>
              )}
              {!isUnlocked && <i className="fas fa-lock text-lg sm:text-xl mt-1 sm:mt-2"></i>}
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

export default GameLevelSelector;