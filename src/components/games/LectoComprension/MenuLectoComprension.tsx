import React from 'react';
import GameModeMenu from '../../shared/GameModeMenu';

interface MenuLectoComprensionProps {
  onPlay: () => void;
  onInfinite: () => void;
}

const MenuLectoComprension: React.FC<MenuLectoComprensionProps> = ({ onPlay, onInfinite }) => {
  return (
    <GameModeMenu
      onPlay={onPlay}
      onInfinite={onInfinite}
      title={(
        <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-2 flex flex-wrap justify-center gap-2">
          <span className="text-amber-500">L</span>
          <span className="text-amber-400">e</span>
          <span className="text-amber-500">c</span>
          <span className="text-amber-400">t</span>
          <span className="text-amber-500">o</span>
          <span className="text-amber-300 mx-2">-</span>
          <span className="text-amber-400">c</span>
          <span className="text-amber-500">o</span>
          <span className="text-amber-400">m</span>
          <span className="text-amber-500">p</span>
          <span className="text-amber-400">r</span>
          <span className="text-amber-500">e</span>
          <span className="text-amber-400">n</span>
          <span className="text-amber-500">s</span>
          <span className="text-amber-400">i</span>
          <span className="text-amber-500">ó</span>
          <span className="text-amber-400">n</span>
        </h1>
      )}
      subtitle="Lee y responde"
      description="Lee atentamente los textos. Luego responde a las preguntas. Cada texto abarca 5 niveles de complejidad creciente."
      levelsButtonClassName="bg-amber-500 hover:bg-amber-600"
      infiniteButtonClassName="bg-orange-500 hover:bg-orange-600"
      descriptionWidthClassName="max-w-md"
    />
  );
};

export default MenuLectoComprension;
