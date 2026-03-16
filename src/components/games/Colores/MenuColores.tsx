
import React from 'react';
import GameModeMenu from '../../shared/GameModeMenu';

interface MainMenuProps {
  onPlay: () => void;
  onInfinite: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onPlay, onInfinite }) => {
  return (
    <GameModeMenu
      onPlay={onPlay}
      onInfinite={onInfinite}
      title={(
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-2 flex justify-center">
          <span className="text-blue-500">C</span>
          <span className="text-red-500">o</span>
          <span className="text-yellow-500">l</span>
          <span className="text-blue-500">o</span>
          <span className="text-green-500">r</span>
          <span className="text-red-500">e</span>
          <span className="text-blue-500">s</span>
        </h1>
      )}
      subtitle="Entrenamiento Mental"
      description="Selecciona el nombre del COLOR que VES, no lo que lees."
      levelsButtonClassName="bg-[#2b6eff] hover:bg-blue-700"
      infiniteButtonClassName="bg-[#9d3eff] hover:bg-purple-700"
    />
  );
};

export default MainMenu;
