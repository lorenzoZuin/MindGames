
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
  }
];

const GameSelectionMenu: React.FC<GameSelectionMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 text-slate-800">
          Mind<span className="text-blue-500">Games</span>
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-slate-500 uppercase tracking-widest">
          Selecciona un juego
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-7xl w-full">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => !game.disabled && onSelectGame(game.id)}
            disabled={game.disabled}
            className={`
              relative group flex flex-col items-center justify-center 
              p-8 rounded-[2rem] shadow-xl transition-all duration-300
              ${game.disabled 
                ? 'opacity-50 cursor-not-allowed bg-slate-200' 
                : 'hover:scale-105 hover:shadow-2xl bg-white cursor-pointer active:scale-95'
              }
            `}
          >
            <div className={`
              w-32 h-32 rounded-3xl mb-6 flex items-center justify-center shadow-inner
              text-white text-5xl
              ${game.color}
            `}>
              <i className={game.icon}></i>
            </div>
            
            <h3 className={`
              text-2xl font-black uppercase tracking-wide
              ${game.disabled ? 'text-slate-400' : 'text-slate-700 group-hover:text-blue-600'}
            `}>
              {game.name}
            </h3>
            
            {game.disabled && (
              <span className="absolute top-4 right-4 bg-slate-300 text-slate-500 text-xs font-bold px-2 py-1 rounded-full uppercase">
                Próximamente
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameSelectionMenu;
