import React from 'react';
import GameModeMenu from '../../shared/GameModeMenu';

interface MenuRecordarNombresProps {
  onPlay: () => void;
  onInfinite: () => void;
}

const MenuRecordarNombres: React.FC<MenuRecordarNombresProps> = ({ onPlay, onInfinite }) => {
  return (
    <GameModeMenu
      onPlay={onPlay}
      onInfinite={onInfinite}
      title={(
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
      )}
      subtitle="Entrenamiento de Memoria"
      description="Memoriza los nombres y ubicalos en el personaje correcto."
      levelsButtonClassName="bg-[#A855F7] hover:bg-purple-700"
      infiniteButtonClassName="bg-[#EC4899] hover:bg-pink-700"
    />
  );
};

export default MenuRecordarNombres;
