
import { ColorInfo } from './types';

export const COLORS: ColorInfo[] = [
  { name: 'Rojo', value: '#E11D48', contrastColor: '#000000' },
  { name: 'Azul', value: '#2563EB', contrastColor: '#000000' },
  { name: 'Verde', value: '#16A34A', contrastColor: '#000000' },
  { name: 'Amarillo', value: '#EAB308', contrastColor: '#000000' },
  { name: 'Naranja', value: '#EA580C', contrastColor: '#000000' },
  { name: 'Morado', value: '#9333EA', contrastColor: '#000000' },
  { name: 'Rosa', value: '#DB2777', contrastColor: '#000000' },
  { name: 'Marrón', value: '#713F12', contrastColor: '#000000' },
  { name: 'Negro', value: '#000000', contrastColor: '#FFFFFF' },
  { name: 'Gris', value: '#4B5563', contrastColor: '#000000' },
];

export const QUESTIONS_PER_LEVEL = 5;
export const BASE_OPTIONS_COUNT = 3;
export const OPTIONS_INCREASE_INTERVAL = 10;
export const TOTAL_LEVELS = 50;

// Scoring thresholds (seconds)
export const STARS_3_THRESHOLD = 16;
export const STARS_2_THRESHOLD = 25;
