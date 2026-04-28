
import React from 'react';

interface Game {
  id: string;
  name: string;
  icon: string; // FontAwesome icon class
  color: string;
  disabled?: boolean;
}

interface GameSelectionMenuProps {
  onSelectGame: (gameId: string) => void;
  onAbout: () => void;
}

const GAMES: Game[] = [
  {
    id: 'colores',
    name: 'Colores',
    icon: 'fas fa-palette',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600',
  },
  {
    id: 'nombres',
    name: 'Recordar nombres',
    icon: 'fas fa-user-tag',
    color: 'bg-gradient-to-br from-purple-400 to-purple-600',
    disabled: false
  },
  {
    id: 'moneda',
    name: 'Seguir moneda',
    icon: 'fas fa-coins',
    color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    disabled: false
  },
  {
    id: 'frase',
    name: 'Ordena la frase',
    icon: 'fas fa-align-left',
    color: 'bg-gradient-to-br from-emerald-400 to-teal-600',
    disabled: false
  },
  {
    id: 'igual',
    name: 'Encuentra el igual',
    icon: 'fas fa-clone',
    color: 'bg-gradient-to-br from-orange-400 to-amber-500',
    disabled: false
  },
  {
    id: 'definiciones',
    name: 'Definiciones',
    icon: 'fas fa-book-open',
    color: 'bg-gradient-to-br from-emerald-400 to-cyan-500',
    disabled: false
  }
];

const GameSelectionMenu: React.FC<GameSelectionMenuProps> = ({ onSelectGame, onAbout }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-tight mb-2 sm:mb-3 md:mb-4 text-slate-800">
          Mind<span className="text-blue-500">Games</span>
        </h1>
        <p className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold text-slate-500 uppercase tracking-widest">
          Selecciona un juego
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-7xl mb-20 sm:mb-16">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => !game.disabled && onSelectGame(game.id)}
            disabled={game.disabled}
            className={`
              relative group flex flex-col items-center justify-center 
              p-3 sm:p-5 md:p-8 rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-lg sm:shadow-xl transition-all duration-300
              ${game.disabled 
                ? 'opacity-50 cursor-not-allowed bg-slate-200' 
                : 'hover:scale-105 hover:shadow-2xl bg-white cursor-pointer active:scale-95'
              }
            `}
          >
            <div className={`
              w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl md:rounded-3xl mb-2 sm:mb-3 md:mb-6 flex items-center justify-center shadow-inner
              text-white text-2xl sm:text-3xl md:text-5xl
              ${game.color}
            `}>
              <i className={game.icon}></i>
            </div>
            
            <h3 className={`
              text-xs sm:text-base md:text-2xl font-black uppercase tracking-wide text-center
              ${game.disabled ? 'text-slate-400' : 'text-slate-700 group-hover:text-blue-600'}
            `}>
              {game.name}
            </h3>
            
            {game.disabled && (
              <span className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-4 md:right-4 bg-slate-300 text-slate-500 text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full uppercase">
                Próximamente
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={onAbout}
        className="fixed right-2 sm:right-3 md:right-6 bottom-4 sm:bottom-6 px-4 sm:px-6 md:px-10 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl text-slate-500 border-2 border-transparent hover:border-slate-300 text-xs sm:text-sm md:text-lg md:text-xl font-bold tracking-wide z-40"
      >
        Sobre nosotros
      </button>
    </div>
  );
};

export default GameSelectionMenu;
