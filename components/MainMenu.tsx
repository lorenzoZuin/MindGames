
import React from 'react';

interface MainMenuProps {
  onPlay: () => void;
  onInfinite: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onPlay, onInfinite }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      <div className="text-center">
        <h1 className="text-8xl font-black tracking-tight mb-2 flex justify-center">
          <span className="text-blue-500">C</span>
          <span className="text-red-500">o</span>
          <span className="text-yellow-500">l</span>
          <span className="text-blue-500">o</span>
          <span className="text-green-500">r</span>
          <span className="text-red-500">e</span>
          <span className="text-blue-500">s</span>
        </h1>
        <p className="text-3xl font-bold text-slate-500 uppercase tracking-widest">
          Entrenamiento Mental
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md px-6">
        <button 
          onClick={onPlay}
          className="bg-[#2b6eff] hover:bg-blue-700 text-white text-3xl font-black py-8 px-12 rounded-[2rem] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 uppercase"
        >
          <i className="fas fa-th-large text-4xl"></i>
          Niveles
        </button>

        <button 
          onClick={onInfinite}
          className="bg-[#9d3eff] hover:bg-purple-700 text-white text-3xl font-black py-8 px-12 rounded-[2rem] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 uppercase"
        >
          <i className="fas fa-infinity text-4xl"></i>
          Modo Infinito
        </button>
      </div>

      <div className="pt-12 text-slate-400 font-bold text-xl text-center max-w-xs leading-relaxed">
        <p>Selecciona el nombre del COLOR que VES, no lo que lees.</p>
      </div>
    </div>
  );
};

export default MainMenu;
