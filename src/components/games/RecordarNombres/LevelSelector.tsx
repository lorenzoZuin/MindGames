import React from 'react';
import { LevelProgress } from '../../../types';
import GameLevelSelector from '../../shared/GameLevelSelector';

interface LevelSelectorProps {
  levels: LevelProgress[];
  onSelectLevel: (lvl: number) => void;
  onBack: () => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ levels, onSelectLevel, onBack }) => {
  return (
    <GameLevelSelector
      levels={levels}
      onSelectLevel={onSelectLevel}
      onBack={onBack}
      unlockedLevelClassName="bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white cursor-pointer shadow-md hover:shadow-purple-200 scale-100 hover:scale-105 active:scale-95"
    />
  );
};

export default LevelSelector;
