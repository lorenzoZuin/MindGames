
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState } from '../../../types';

interface CoinGameBoardProps {
  onGameEnd: (score: number, timeTaken: number) => void;
  initialLevel: number;
  isInfiniteMode?: boolean;
}

interface Cup {
  id: number;
  hasCoin: boolean;
  x: number; // 0 to N-1 position
  y: number; // For depth effect (z-index)
  isLifted: boolean;
}

const MAX_CUPS_BY_LEVEL = (level: number) => {
  if (level <= 10) return 3;
  if (level <= 30) return 4;
  return 5;
};

const SWAP_SPEED_BY_LEVEL = (level: number) => {
  // Duration in ms for a swap
  if (level <= 5) return 800; // Slow
  if (level <= 10) return 600;
  if (level <= 20) return 500;
  if (level <= 30) return 400;
  if (level <= 40) return 300;
  return 250; // Very fast
};

const SWAPS_COUNT_BY_LEVEL = (level: number) => {
  if (level <= 5) return 5;
  if (level <= 15) return 8;
  if (level <= 25) return 12;
  return 15 + Math.floor((level - 25) / 5);
};

const CoinGameBoard: React.FC<CoinGameBoardProps> = ({ onGameEnd, initialLevel, isInfiniteMode }) => {
  const [level, setLevel] = useState(initialLevel);
  const [gameState, setGameState] = useState<'PREPARE' | 'SHOW' | 'SHUFFLE' | 'GUESS' | 'REVEAL'>('PREPARE');
  const [cups, setCups] = useState<Cup[]>([]);
  const [message, setMessage] = useState('¡Prepárate!');
  const [containerWidth, setContainerWidth] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const swapsQueueRef = useRef<{a: number, b: number}[]>([]);
  const isAnimatingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize level
  useEffect(() => {
    startLevel(level);
  }, [level]);

  // Handle container resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const startLevel = (currentLevel: number) => {
    const numCups = MAX_CUPS_BY_LEVEL(currentLevel);
    const newCups: Cup[] = Array.from({ length: numCups }, (_, i) => ({
      id: i,
      hasCoin: false, // Will set random
      x: i,
      y: 0,
      isLifted: false,
    }));

    // Randomly place coin
    const coinIndex = Math.floor(Math.random() * numCups);
    newCups[coinIndex].hasCoin = true;

    setCups(newCups);
    setGameState('PREPARE');
    setMessage(`Nivel ${currentLevel}`);
    
    // Sequence
    setTimeout(() => {
      setGameState('SHOW');
      setMessage('¡Mira dónde está la moneda!');
      // Lift cup with coin
      setCups(prev => prev.map((c, i) => i === coinIndex ? { ...c, isLifted: true } : c));
      
      setTimeout(() => {
        // Hide coin
        setCups(prev => prev.map(c => ({ ...c, isLifted: false })));
        setMessage('Mezclando...');
        
        setTimeout(() => {
          setGameState('SHUFFLE');
          generateSwaps(currentLevel, numCups);
          processNextSwap();
        }, 1000); // Wait for close animation
      }, 2000); // Duration to show coin
    }, 1500); // Wait before showing
  };

  const generateSwaps = (lvl: number, numCups: number) => {
    const count = SWAPS_COUNT_BY_LEVEL(lvl);
    const queue = [];
    let lastA = -1;
    let lastB = -1;

    for (let i = 0; i < count; i++) {
      let a = Math.floor(Math.random() * numCups);
      let b = Math.floor(Math.random() * numCups);
      while (a === b || (a === lastA && b === lastB) || (a === lastB && b === lastA)) {
         a = Math.floor(Math.random() * numCups);
         b = Math.floor(Math.random() * numCups);
      }
      queue.push({ a, b }); // These are INDICES in the current position array, not IDs
      lastA = a;
      lastB = b;
    }
    swapsQueueRef.current = queue;
  };

  const processNextSwap = () => {
    if (swapsQueueRef.current.length === 0) {
      setGameState('GUESS');
      setMessage('¿Dónde está la moneda?');
      startTimeRef.current = Date.now();
      return;
    }

    const { a, b } = swapsQueueRef.current.shift()!; // Position indices to swap
    const speed = SWAP_SPEED_BY_LEVEL(level);

    // Find cups at position a and b
    setCups(prev => {
      const cupsCopy = [...prev];
      const cupAIndex = cupsCopy.findIndex(c => c.x === a);
      const cupBIndex = cupsCopy.findIndex(c => c.x === b);
      
      const cupA = cupsCopy[cupAIndex];
      const cupB = cupsCopy[cupBIndex];

      // Mutate for next render
      // To simulate depth/z-index swap: one goes 'back' (y=0), one comes 'front' (y=1) or similar
      // Actually, we can just swap x. Ideally we animate it.
      // But React state updates are instantaneous. We need CSS transition.
      // The issue with swapping X index directly is that we need to distinguish who goes in front.
      
      // Let's create a visual swap.
      // We will perform the swap in state, but use a "transitioning" state ideally.
      // For simplicity with this setup:
      // We update X coordinates.
      // We also update Z-index (represented by a temporary style or order).
      
      // Heuristic: The cup moving from left to right goes in front (arbitrary) or random.
      const moveFront = Math.random() > 0.5;

      // Swap positions
      const tempX = cupA.x;
      cupA.x = cupB.x;
      cupB.x = tempX;
      
      // Assign z-index boost
      cupA.y = moveFront ? 10 : 0;
      cupB.y = !moveFront ? 10 : 0;

      return cupsCopy;
    });

    // Reset Z-index after animation
    setTimeout(() => {
      setCups(prev => prev.map(c => ({ ...c, y: 0 })));
      processNextSwap();
    }, speed);
  };

  const handleCupClick = (cupId: number) => {
    if (gameState !== 'GUESS') return;

    const cup = cups.find(c => c.id === cupId);
    if (!cup) return;

    // Reveal
    setCups(prev => prev.map(c => c.id === cupId ? { ...c, isLifted: true } : c));
    setGameState('REVEAL');

    if (cup.hasCoin) {
      setMessage('¡Correcto!');
      const timeTaken = (Date.now() - startTimeRef.current) / 1000;
      setTimeout(() => {
        if (isInfiniteMode) {
           setLevel(l => l + 1);
        } else {
           onGameEnd(3, timeTaken); // 3 stars for success
        }
      }, 1500);
    } else {
      setMessage('¡Incorrecto!');
      // Reveal the actual coin
      setTimeout(() => {
        setCups(prev => prev.map(c => c.hasCoin ? { ...c, isLifted: true } : c));
        setTimeout(() => {
           onGameEnd(0, 0); // Fail
        }, 2000);
      }, 500);
    }
  };

  // Determine Cup Width based on count
  const numCups = MAX_CUPS_BY_LEVEL(level);
  
  // available width / numCups, but capped
  // Wait, we need containerWidth to be set properly.
  // containerRef is a ref to the table.
  
  // Constants for layout
  const MAX_CUP_WIDTH = 120;
  const GAP = 20;

  // Calculate dynamic cup width based on container
  const calculateLayout = () => {
     const safeWidth = containerWidth || window.innerWidth || 800; // Fallback
     const availableWidth = safeWidth - 40; // Padding
     const totalGap = (numCups - 1) * GAP;
     let calculatedWidth = (availableWidth - totalGap) / numCups;
     calculatedWidth = Math.min(MAX_CUP_WIDTH, calculatedWidth);
     
     const totalContentWidth = numCups * calculatedWidth + totalGap;
     const startX = (safeWidth - totalContentWidth) / 2;

     return { cupWidth: calculatedWidth, startX };
  };

  const { cupWidth, startX } = calculateLayout();

  const getXPosition = (slotIndex: number) => {
      return startX + slotIndex * (cupWidth + GAP);
  };

  // Coin style to look more flat (oval)
  const coinStyle: React.CSSProperties = {
     position: 'absolute',
     bottom: 0,
     left: '50%',
     width: '60%',
     height: '20%', // Flatter
     backgroundColor: '#fbbf24', // Yellow-400
     borderRadius: '50%',
     border: '2px solid #b45309', // Amber-700
     transform: `translate(-50%, ${cupWidth * 0.1}px)`, // Little offset
     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
     zIndex: 0 // On the table
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 w-full overflow-hidden absolute inset-0">
      <div className="text-3xl font-bold text-white mb-8 z-10">{message}</div>
      
      {/* Table Surface */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-5xl h-[400px] bg-gray-700 rounded-[3rem] shadow-2xl flex items-center justify-center border-b-[12px] border-gray-900"
        style={{ perspective: '1000px' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800 rounded-[3rem] opacity-50"></div>
        
        {/* Render Coins separately to decouple from Cup transform if needed, 
            but keeping them inside is easier for X position tracking. 
            The issue is Y transform of cup lifts the coin if it's a child. 
            We need to counter-transform or just conditionally hide/show or use sibling.
            Let's keep child but fix the lifting. 
        */}

        {cups.map((cup) => {
            const xPos = getXPosition(cup.x);
            const transitionDuration = gameState === 'SHUFFLE' ? SWAP_SPEED_BY_LEVEL(level) : 500;
            
            return (
                <div
                    key={cup.id}
                    className="absolute bottom-1/3 transition-transform ease-in-out cursor-pointer"
                    style={{
                        transform: `translate3d(${xPos}px, 0, 0)`,
                        width: `${cupWidth}px`,
                        height: `${cupWidth * 1.3}px`, 
                        zIndex: cup.y + 20,
                        transitionDuration: `${transitionDuration}ms`,
                    }}
                    onClick={() => handleCupClick(cup.id)}
                >
                    {/* Coin - Rendered at the bottom of the slot, not moving up with cup */}
                    {cup.hasCoin && (
                        <div 
                            style={{
                                ...coinStyle,
                                // If cup is lifted, coin stays down. 
                                // Since coin is child of moving div, we must counter-move it?
                                // No, actually: The parent DIV moves X. The Cup VISUAL moves Y.
                                // Let's split specific cup visual from the container div.
                            }}
                            className={`${(cup.isLifted || gameState === 'SHOW' || gameState === 'REVEAL') ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                        >
                            {/* Inner detail for coin */}
                            <div className="absolute inset-2 border border-yellow-600 rounded-full opacity-50"></div>
                            <div className="absolute inset-[30%] bg-yellow-300 rounded-full opacity-40 blur-[1px]"></div>
                        </div>
                    )}

                    {/* The Cup Visual - This moves Up/Down */}
                    <div 
                        className="w-full h-full relative group transition-transform duration-300 ease-out"
                        style={{
                            transform: `translateY(${cup.isLifted ? -120 : 0}px)`
                        }}
                    >
                        {/* Cup Body */}
                        <div 
                           className="w-full h-full bg-red-600 shadow-2xl relative overflow-hidden transform-origin-bottom"
                           style={{
                               clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0% 100%)',
                               background: 'linear-gradient(90deg, #b91c1c 0%, #ef4444 40%, #dc2626 60%, #991b1b 100%)',
                               borderRadius: '0 0 15% 15%'
                           }}
                        >
                            <div className="absolute top-0 left-2 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 translate-x-[-50%]"></div>
                        </div>
                        {/* Cup Top/Rim */}
                        <div className="absolute top-0 left-[15%] w-[70%] h-[12px] bg-red-800 rounded-[50%] border-t border-red-400 opacity-80"></div>
                    </div>
                </div>
            );
        })}
      </div>
      
      <div className="mt-8 text-slate-400 font-mono">
        Nivel: {level}
      </div>
    </div>
  );
};

export default CoinGameBoard;
