import React from 'react';
import GameModeMenu from '../../shared/GameModeMenu';

interface MenuOrdenaLaFraseProps {
  onPlay: () => void;
  onInfinite: () => void;
}

const MenuOrdenaLaFrase: React.FC<MenuOrdenaLaFraseProps> = ({ onPlay, onInfinite }) => {
  return (
    <GameModeMenu
      onPlay={onPlay}
      onInfinite={onInfinite}
      title={(
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-2 flex flex-wrap justify-center gap-2">
          <span className="text-emerald-500">O</span>
          <span className="text-teal-500">r</span>
          <span className="text-emerald-500">d</span>
          <span className="text-teal-500">e</span>
          <span className="text-emerald-500">n</span>
          <span className="text-teal-500">a</span>
          <span className="mx-4 text-slate-700">la</span>
          <span className="text-emerald-500">F</span>
          <span className="text-teal-500">r</span>
          <span className="text-emerald-500">a</span>
          <span className="text-teal-500">s</span>
          <span className="text-emerald-500">e</span>
        </h1>
      )}
      subtitle="Entrenamiento de Secuenciacion"
      description="Ordena las palabras arrastrandolas hasta formar una frase valida."
      levelsButtonClassName="bg-[#10B981] hover:bg-emerald-700"
      infiniteButtonClassName="bg-[#14B8A6] hover:bg-teal-700"
      descriptionWidthClassName="max-w-md"
    />
  );
};

export default MenuOrdenaLaFrase;
