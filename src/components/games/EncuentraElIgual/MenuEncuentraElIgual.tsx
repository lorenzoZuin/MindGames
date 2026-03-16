import React from 'react';
import GameModeMenu from '../../shared/GameModeMenu';

interface MenuEncuentraElIgualProps {
  onPlay: () => void;
  onInfinite: () => void;
}

const MenuEncuentraElIgual: React.FC<MenuEncuentraElIgualProps> = ({ onPlay, onInfinite }) => {
  return (
    <GameModeMenu
      onPlay={onPlay}
      onInfinite={onInfinite}
      title={(
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-2 flex flex-wrap justify-center gap-2">
          <span className="text-orange-500">E</span>
          <span className="text-orange-400">n</span>
          <span className="text-orange-500">c</span>
          <span className="text-orange-400">u</span>
          <span className="text-orange-500">e</span>
          <span className="text-orange-400">n</span>
          <span className="text-orange-500">t</span>
          <span className="text-orange-400">r</span>
          <span className="text-orange-500">a</span>
          <span className="mx-4 text-slate-700">el</span>
          <span className="text-emerald-500">I</span>
          <span className="text-emerald-400">g</span>
          <span className="text-emerald-500">u</span>
          <span className="text-emerald-400">a</span>
          <span className="text-emerald-500">l</span>
        </h1>
      )}
      subtitle="Entrenamiento de Concentracion"
      description="Observa la imagen objetivo y toca todas las iguales. Tienes hasta 3 errores."
      levelsButtonClassName="bg-orange-500 hover:bg-orange-600"
      infiniteButtonClassName="bg-emerald-500 hover:bg-emerald-600"
      descriptionWidthClassName="max-w-md"
    />
  );
};

export default MenuEncuentraElIgual;
