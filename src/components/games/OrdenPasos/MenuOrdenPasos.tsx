import React from 'react';
import GameModeMenu from '../../shared/GameModeMenu';

interface MenuOrdenPasosProps {
  onPlay: () => void;
  onInfinite: () => void;
}

const MenuOrdenPasos: React.FC<MenuOrdenPasosProps> = ({ onPlay, onInfinite }) => {
  return (
    <GameModeMenu
      onPlay={onPlay}
      onInfinite={onInfinite}
      title={(
        <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-2 flex flex-wrap justify-center gap-2">
          <span className="text-indigo-500">O</span>
          <span className="text-indigo-400">r</span>
          <span className="text-indigo-500">d</span>
          <span className="text-indigo-400">e</span>
          <span className="text-indigo-500">n</span>
          <span className="text-indigo-400">a</span>
          <span className="text-indigo-300 mx-2">l</span>
          <span className="text-indigo-400">o</span>
          <span className="text-indigo-500">s</span>
          <span className="text-indigo-300 mx-2">P</span>
          <span className="text-indigo-400">a</span>
          <span className="text-indigo-500">s</span>
          <span className="text-indigo-400">o</span>
          <span className="text-indigo-500">s</span>
        </h1>
      )}
      subtitle="Secuencias lógicas"
      description="Lee los pasos de una acción cotidiana que están desordenados, y colócalos en el orden cronológico correcto."
      levelsButtonClassName="bg-indigo-500 hover:bg-indigo-600"
      infiniteButtonClassName="bg-purple-500 hover:bg-purple-600"
    />
  );
};

export default MenuOrdenPasos;
