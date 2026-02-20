import React, { useState, useEffect } from 'react';
import { CHARACTERS, GAME_CONFIG } from './constants';
import { Character } from './constants';

interface GameBoardProps {
  level: number;
  isInfinite?: boolean;
  onGameComplete: (stars: number, score: number) => void;
  onExit: () => void;
}

const RecordarNombresBoard: React.FC<GameBoardProps> = ({ level, isInfinite = false, onGameComplete, onExit }) => {
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [currentCharacters, setCurrentCharacters] = useState<Character[]>([]);
  const [recallCharacters, setRecallCharacters] = useState<Character[]>([]);
  const [matches, setMatches] = useState<{ [key: string]: string | null }>({});
  const [availableNames, setAvailableNames] = useState<string[]>([]);
  const [infiniteRound, setInfiniteRound] = useState(1);
  const [infiniteSuccesses, setInfiniteSuccesses] = useState(0);

  const clampMemorizeTime = (value: number) => Math.max(5000, Math.min(10000, value));

  const calculateMemorizeTime = (characterCount: number) => {
    if (isInfinite) {
      const baseTime = 2000;
      const timePerChar = 1000;
      return clampMemorizeTime(baseTime + (characterCount * timePerChar));
    }

    return clampMemorizeTime(GAME_CONFIG.memorizeTimeBase + (characterCount * GAME_CONFIG.memorizeTimePerChar));
  };

  const shuffleCharactersForRecall = (characters: Character[]) => {
    if (characters.length <= 1) {
      return [...characters];
    }

    const shuffled = [...characters].sort(() => 0.5 - Math.random());
    const sameOrder = shuffled.every((char, index) => char.id === characters[index].id);

    if (sameOrder) {
      return [...characters.slice(1), characters[0]];
    }

    return shuffled;
  };

  const setupRound = (selectedCharacters: Character[]) => {
    setCurrentCharacters(selectedCharacters);
    setRecallCharacters(shuffleCharactersForRecall(selectedCharacters));
    setTimeLeft(calculateMemorizeTime(selectedCharacters.length));

    const initialMatches: { [key: string]: string | null } = {};
    selectedCharacters.forEach(c => {
      initialMatches[c.id] = null;
    });
    setMatches(initialMatches);

    setAvailableNames(selectedCharacters.map(c => c.name).sort(() => 0.5 - Math.random()));
    setPhase('memorize');
    setSelectedNameForClick(null);
  };

  // Initialize level
  useEffect(() => {
    if (!isInfinite) {
      // Story mode levels
      const levelConfig = GAME_CONFIG.levels.find(l => l.level === level) || GAME_CONFIG.levels[GAME_CONFIG.levels.length - 1];
      const charCount = levelConfig.count;
      const shuffled = [...CHARACTERS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, charCount);

      setupRound(selected);
    }
  }, [level, isInfinite]);

  useEffect(() => {
    if (!isInfinite) {
      return;
    }

    setInfiniteRound(1);
    setInfiniteSuccesses(0);

    const selected = [...CHARACTERS].sort(() => 0.5 - Math.random()).slice(0, 2);
    setupRound(selected);
  }, [isInfinite, level]);

  // Timer logic for memorize phase
  useEffect(() => {
    if (phase !== 'memorize' || timeLeft === null) {
      return;
    }

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1000), 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft <= 0) {
      setPhase('recall');
    }
  }, [phase, timeLeft]);

  const handleDragStart = (e: React.DragEvent, name: string) => {
    e.dataTransfer.setData('text/plain', name);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, charId: string) => {
    e.preventDefault();
    const name = e.dataTransfer.getData('text/plain');
    
    // If name is already used, remove it from previous location
    const oldKey = Object.keys(matches).find(key => matches[key] === name);
    
    setMatches(prev => {
      const newMatches = { ...prev };
      if (oldKey) newMatches[oldKey] = null;
      newMatches[charId] = name;
      return newMatches;
    });
  };
  
  // Mobile touch support helper (basic implementation for click-to-select alternative if drag fails)
  const [selectedNameForClick, setSelectedNameForClick] = useState<string | null>(null);

  const handleNameClick = (name: string) => {
    if (selectedNameForClick === name) {
      setSelectedNameForClick(null);
    } else {
      setSelectedNameForClick(name);
    }
  };

  const handleSlotClick = (charId: string) => {
    if (selectedNameForClick) {
       // If name is already used, remove it from previous location
      const oldKey = Object.keys(matches).find(key => matches[key] === selectedNameForClick);
      
      setMatches(prev => {
        const newMatches = { ...prev };
        if (oldKey) newMatches[oldKey] = null;
        newMatches[charId] = selectedNameForClick;
        return newMatches;
      });
      setSelectedNameForClick(null);
    } else if (matches[charId]) {
        // Unselect/Remove name from slot if clicked directly
        setMatches(prev => ({
            ...prev,
            [charId]: null
        }));
    }
  };

  const checkResults = () => {
    let correctCount = 0;
    currentCharacters.forEach(char => {
      if (matches[char.id] === char.name) {
        correctCount++;
      }
    });

    const isPerfect = correctCount === currentCharacters.length;
    const calculatedScore = Math.round((correctCount / currentCharacters.length) * 100);
    const stars = isPerfect ? 3 : (correctCount > currentCharacters.length / 2 ? 2 : (correctCount > 0 ? 1 : 0));

    if (isInfinite) {
      if (isPerfect) {
        setInfiniteSuccesses(prev => prev + 1);
        setInfiniteRound(prev => prev + 1);

        const currentIds = new Set(currentCharacters.map(char => char.id));
        const remainingCharacters = CHARACTERS.filter(char => !currentIds.has(char.id));

        if (remainingCharacters.length > 0) {
          const nextCharacter = remainingCharacters[Math.floor(Math.random() * remainingCharacters.length)];
          setupRound([...currentCharacters, nextCharacter]);
        } else {
          setupRound([...currentCharacters]);
        }

        return;
      }

      onGameComplete(infiniteSuccesses, calculatedScore);
      return;
    }

    onGameComplete(stars, calculatedScore);
  };

  // Check if all slots are filled to enable "Check" button
  const allSlotsFilled = currentCharacters.length > 0 && currentCharacters.every(c => matches[c.id]);

  if (phase === 'memorize') {
    return (
      <div className="max-w-4xl w-full flex flex-col items-center space-y-8">
        <div className="w-full flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100">
          <button
            onClick={onExit}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-5 rounded-2xl text-3xl transition-all shadow-sm active:scale-95"
          >
            <i className="fas fa-home"></i>
          </button>

          <div className="text-3xl font-black text-slate-800 uppercase tracking-tight text-center">
            {isInfinite ? `Infinito Ronda ${infiniteRound}` : `Nivel ${level}`}
          </div>

          <div className="text-3xl font-black text-purple-500 tabular-nums">
            <i className="fas fa-clock mr-2 opacity-30"></i>
            {Math.max(0, Math.ceil((timeLeft ?? 0) / 1000))}s
          </div>
        </div>

        <div className="relative w-full bg-white py-14 px-8 rounded-[3rem] shadow-2xl border border-gray-100">
          <h2 className="text-5xl font-black text-center text-slate-800 uppercase tracking-tight mb-10">
            Memoriza
          </h2>

          <div className="flex flex-wrap justify-center gap-8">
          {currentCharacters.map(char => (
            <div key={char.id} className="flex flex-col items-center">
              <div className="w-46 h-72 bg-slate-100 rounded-2xl overflow-hidden mb-3 border-2 border-slate-200 shadow-md">
                 <img 
                    src={char.image} 
                    alt={char.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback if image fails
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMDAtNC00SDhhNCA0IDAgMDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==';
                        (e.target as HTMLImageElement).classList.add('p-4', 'text-slate-400');
                    }}
                />
              </div>
              <div className="text-xl font-black bg-purple-500 text-white px-4 py-1 rounded-full shadow-md">
                {char.name}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full flex flex-col items-center space-y-8">
      <div className="w-full flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100">
        <button
          onClick={onExit}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-5 rounded-2xl text-3xl transition-all shadow-sm active:scale-95"
        >
          <i className="fas fa-home"></i>
        </button>

        <div className="text-3xl font-black text-slate-800 uppercase tracking-tight text-center">
          {isInfinite ? `Infinito Ronda ${infiniteRound}` : `Nivel ${level}`}
        </div>

        <div className="text-2xl font-black text-slate-400 uppercase tracking-wide">
          Asignar
        </div>
      </div>

      <div className="relative w-full bg-white py-12 px-8 rounded-[3rem] shadow-2xl border border-gray-100">
        <h2 className="text-4xl md:text-5xl font-black text-center text-slate-800 uppercase tracking-tight mb-3">
          ¿Quién es quién?
        </h2>
        <p className="text-slate-500 text-center font-bold uppercase tracking-wide mb-10">Asigna los nombres correctos</p>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8 w-full">
          {recallCharacters.map(char => (
            <div key={char.id} className="flex flex-col items-center">
              <div className="w-46 h-72 bg-slate-100 rounded-2xl overflow-hidden mb-3 border-2 border-slate-200 shadow-md">
                <img
                  src={char.image}
                  alt="Character"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMDAtNC00SDhhNCA0IDAgMDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==';
                    (e.target as HTMLImageElement).classList.add('p-4', 'text-slate-400');
                  }}
                />
              </div>

              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, char.id)}
                onClick={() => handleSlotClick(char.id)}
                className={`w-32 md:w-40 h-12 border-2 border-dashed rounded-xl flex items-center justify-center transition-colors cursor-pointer px-2
                  ${matches[char.id] ? 'bg-blue-500 border-blue-400 text-white' :
                    (selectedNameForClick ? 'border-purple-400 bg-purple-50' : 'border-slate-300 bg-slate-50')
                  }`}
              >
                {matches[char.id] ? (
                  <span className="font-black text-sm md:text-base text-center">{matches[char.id]}</span>
                ) : (
                  <span className="text-xs font-bold text-slate-400 text-center">
                    {selectedNameForClick ? 'Toca aquí' : 'Arrastra'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
        <h3 className="text-slate-500 mb-6 text-center text-lg font-black uppercase tracking-wider">Nombres disponibles</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {availableNames.map((name) => {
            const isPlaced = Object.values(matches).includes(name);
            if (isPlaced) return null;

            return (
              <div
                key={name}
                draggable
                onDragStart={(e) => handleDragStart(e, name)}
                onClick={() => handleNameClick(name)}
                className={`px-6 py-3 rounded-full font-black cursor-grab active:cursor-grabbing shadow-md transition-all active:scale-95 select-none text-lg
                  ${selectedNameForClick === name ? 'bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'}
                `}
              >
                {name}
              </div>
            );
          })}
          {currentCharacters.length > 0 && currentCharacters.every(c => matches[c.id]) && (
            <div className="text-slate-400 font-bold">Todos los nombres han sido asignados</div>
          )}
        </div>
      </div>

      <div className="w-full flex justify-between items-center">
        <button 
            onClick={onExit}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-black text-2xl uppercase transition-colors"
        >
            Atrás
        </button>

        <button
            onClick={checkResults}
            disabled={!allSlotsFilled}
            className={`px-10 py-4 rounded-2xl font-black text-2xl uppercase shadow-md transition-all active:scale-95
                ${allSlotsFilled 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
            `}
        >
            Confirmar
        </button>
      </div>
    </div>
  );
};

export default RecordarNombresBoard;
