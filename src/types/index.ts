
export interface ColorInfo {
  name: string;
  value: string;
  contrastColor: string;
}

export interface LevelProgress {
  levelNumber: number;
  stars: number;
  timeTaken: number;
  completed: boolean;
}

export type GameState = 'HOME' | 'MENU' | 'LEVEL_SELECTOR' | 'PLAYING' | 'RESULT' | 'INFINITE';

export interface Question {
  word: string;
  colorValue: string;
  correctAnswer: string;
  options: string[];
}
