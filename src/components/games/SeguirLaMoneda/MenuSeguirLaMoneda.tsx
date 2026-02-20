
import React from 'react';

interface MenuSeguirLaMonedaProps {
  onPlay: () => void;
  onInfinite: () => void;
}

const MenuSeguirLaMoneda: React.FC<MenuSeguirLaMonedaProps> = ({ onPlay, onInfinite }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-2 flex flex-wrap justify-center gap-2">
          <span className="text-yellow-500">S</span>
          <span className="text-red-500">e</span>
          <span className="text-yellow-500">g</span>
          <span className="text-red-500">u</span>
          <span className="text-yellow-500">i</span>
          <span className="text-red-500">r</span>
          <span className="mx-4 text-slate-700">la</span>
          <span className="text-yellow-500">M</span>
          <span className="text-yellow-400">o</span>
          <span className="text-yellow-600">n</span>
          <span className="text-yellow-500">e</span>
          <span className="text-yellow-400">d</span>
          <span className="text-yellow-600">a</span>
        </h1>
        <p className="text-xl md:text-3xl font-bold text-slate-500 uppercase tracking-widest mt-4">
          Entrenamiento de Atención
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md px-6">
        <button 
          onClick={onPlay}
          className="bg-[#EAB308] hover:bg-yellow-600 text-white text-2xl font-black py-8 px-12 rounded-[2rem] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 uppercase"
        >
          <i className="fas fa-th-large text-4xl"></i>
          Niveles
        </button>

        <button 
          onClick={onInfinite}
          className="bg-[#D97706] hover:bg-orange-700 text-white text-2xl font-black py-8 px-12 rounded-[2rem] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 uppercase"
        >
          <i className="fas fa-infinity text-4xl"></i>
          Modo Infinito
        </button>
      </div>

      <div className="pt-12 text-slate-400 font-bold text-xl text-center max-w-xs leading-relaxed">
        <p>Sigue la moneda escondida bajo los vasos mientras se mezclan.</p>
      </div>
    </div>
  );
};

export default MenuSeguirLaMoneda;
