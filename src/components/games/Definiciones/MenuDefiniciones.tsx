import React from 'react';
import GameModeMenu from '../../shared/GameModeMenu';

interface MenuDefinicionesProps {
  onPlay: () => void;
  onInfinite: () => void;
}

const MenuDefiniciones: React.FC<MenuDefinicionesProps> = ({ onPlay, onInfinite }) => {
  return (
    <GameModeMenu
      onPlay={onPlay}
      onInfinite={onInfinite}
      title={(
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-2 flex flex-wrap justify-center gap-2">
          <span className="text-emerald-500">D</span>
          <span className="text-emerald-400">e</span>
          <span className="text-emerald-500">f</span>
          <span className="text-emerald-400">i</span>
          <span className="text-emerald-500">n</span>
          <span className="text-emerald-400">i</span>
          <span className="text-emerald-500">c</span>
          <span className="text-emerald-400">i</span>
          <span className="text-emerald-500">o</span>
          <span className="text-emerald-400">n</span>
          <span className="text-emerald-500">e</span>
          <span className="text-emerald-400">s</span>
        </h1>
      )}
      subtitle="Comprension de palabras"
      description="Lee una definicion y toca la palabra correcta. En niveles altos tendras hasta 6 opciones."
      levelsButtonClassName="bg-emerald-500 hover:bg-emerald-600"
      infiniteButtonClassName="bg-cyan-500 hover:bg-cyan-600"
      descriptionWidthClassName="max-w-md"
    />
  );
};

export default MenuDefiniciones;
