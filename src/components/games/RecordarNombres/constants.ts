export interface Character {
  id: string;
  name: string;
  gender: 'male' | 'female';
  image: string; // Path relative to public or src/assets
}

// Initial set of characters - user can update names and add more images
// Place your images in public/assets/images/characters/ (create folder if missing)
// Or import them here if they are in src/assets
export const CHARACTERS: Character[] = [
  { id: '1', name: 'Carlos', gender: 'male', image: new URL('../../../assets/images/characters/Char1.png', import.meta.url).href },
  { id: '2', name: 'Ana', gender: 'female', image: new URL('../../../assets/images/characters/Char2.png', import.meta.url).href },
  { id: '3', name: 'Sofia', gender: 'female', image: new URL('../../../assets/images/characters/Char3.png', import.meta.url).href },
  { id: '4', name: 'David', gender: 'male', image: new URL('../../../assets/images/characters/Char4.png', import.meta.url).href },
  { id: '5', name: 'Elena', gender: 'female', image: new URL('../../../assets/images/characters/Char5.png', import.meta.url).href },
  { id: '6', name: 'Lucas', gender: 'male', image: new URL('../../../assets/images/characters/Char6.png', import.meta.url).href },
  { id: '7', name: 'Juan', gender: 'male', image: new URL('../../../assets/images/characters/Char7.png', import.meta.url).href },
  { id: '8', name: 'María', gender: 'female', image: new URL('../../../assets/images/characters/Char8.png', import.meta.url).href },
];

export const GAME_CONFIG = {
  memorizeTimeBase: 3000, // 3 seconds base
  memorizeTimePerChar: 1000, // 1 second per character
  levels: [
    { level: 1, count: 2 },
    { level: 2, count: 3 },
    { level: 3, count: 4 },
    { level: 4, count: 5 },
    { level: 5, count: 6 },
    { level: 6, count: 7 },
    { level: 7, count: 8 },
  ]
};
