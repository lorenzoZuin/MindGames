import React from 'react';

interface MenuRecordarNombresProps {
  onPlay: () => void;
  onInfinite: () => void;
}

const MenuRecordarNombres: React.FC<MenuRecordarNombresProps> = ({ onPlay, onInfinite }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-2 flex flex-wrap justify-center gap-2">
          <span className="text-purple-500">R</span>
          <span className="text-pink-500">e</span>
          <span className="text-purple-500">c</span>
          <span className="text-pink-500">o</span>
          <span className="text-purple-500">r</span>
          <span className="text-pink-500">d</span>
          <span className="text-purple-500">a</span>
          <span className="text-pink-500">r</span>
          <span className="mx-4 text-slate-700">Nombres</span>
        </h1>
        <p className="text-xl md:text-3xl font-bold text-slate-500 uppercase tracking-widest mt-4">
          Entrenamiento de Memoria
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md px-6">
        <button
          onClick={onPlay}
          className="bg-[#A855F7] hover:bg-purple-700 text-white text-2xl font-black py-8 px-12 rounded-[2rem] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 uppercase"
        >
          <i className="fas fa-th-large text-4xl"></i>
          Niveles
        </button>

        <button
          onClick={onInfinite}
          className="bg-[#EC4899] hover:bg-pink-700 text-white text-2xl font-black py-8 px-12 rounded-[2rem] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 uppercase"
        >
          <i className="fas fa-infinity text-4xl"></i>
          Modo Infinito
        </button>
      </div>

      <div className="pt-12 text-slate-400 font-bold text-xl text-center max-w-xs leading-relaxed">
        <p>Memoriza los nombres y ubícalos en el personaje correcto.</p>
      </div>
    </div>
  );
};

export default MenuRecordarNombres;
