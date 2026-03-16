import React from 'react';

interface GameModeMenuProps {
  onPlay: () => void;
  onInfinite: () => void;
  title: React.ReactNode;
  subtitle: string;
  description: string;
  levelsButtonClassName: string;
  infiniteButtonClassName: string;
  descriptionWidthClassName?: string;
}

const GameModeMenu: React.FC<GameModeMenuProps> = ({
  onPlay,
  onInfinite,
  title,
  subtitle,
  description,
  levelsButtonClassName,
  infiniteButtonClassName,
  descriptionWidthClassName = 'max-w-xs'
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      <div className="text-center">
        {title}
        <p className="text-xl md:text-3xl font-bold text-slate-500 uppercase tracking-widest mt-4">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md px-6">
        <button
          onClick={onPlay}
          className={`${levelsButtonClassName} text-white text-2xl font-black py-8 px-12 rounded-[2rem] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 uppercase`}
        >
          <i className="fas fa-th-large text-4xl"></i>
          Niveles
        </button>

        <button
          onClick={onInfinite}
          className={`${infiniteButtonClassName} text-white text-2xl font-black py-8 px-12 rounded-[2rem] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 uppercase`}
        >
          <i className="fas fa-infinity text-4xl"></i>
          Modo Infinito
        </button>
      </div>

      <div className={`pt-12 text-slate-400 font-bold text-xl text-center ${descriptionWidthClassName} leading-relaxed`}>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default GameModeMenu;