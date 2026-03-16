
import React from 'react';
import GameModeMenu from '../../shared/GameModeMenu';

interface MenuSeguirLaMonedaProps {
  onPlay: () => void;
  onInfinite: () => void;
}

const MenuSeguirLaMoneda: React.FC<MenuSeguirLaMonedaProps> = ({ onPlay, onInfinite }) => {
  return (
    <GameModeMenu
      onPlay={onPlay}
      onInfinite={onInfinite}
      title={(
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
      )}
      subtitle="Entrenamiento de Atencion"
      description="Sigue la moneda escondida bajo los vasos mientras se mezclan."
      levelsButtonClassName="bg-[#EAB308] hover:bg-yellow-600"
      infiniteButtonClassName="bg-[#D97706] hover:bg-orange-700"
    />
  );
};

export default MenuSeguirLaMoneda;
