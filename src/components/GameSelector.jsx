import { useEffect } from 'react';
import GameCard from './GameCard';
import { BrickrushIcon, Game1024Icon, SnakeIcon } from './icons';

// Game configuration data
const GAMES = [
  {
    id: 'brickrush',
    title: 'Brickrush',
    description: 'Classic brick breaker with power-ups and multiple levels',
    accentColor: 'cyan',
    shortcutKey: '1',
    icon: <BrickrushIcon />,
    tags: [
      { label: 'Arcade', color: 'cyan' },
      { label: 'Action', color: 'pink' },
    ],
  },
  {
    id: '1024',
    title: '1024',
    description: 'Slide and merge tiles to reach 1024',
    accentColor: 'amber',
    shortcutKey: '2',
    icon: <Game1024Icon />,
    tags: [
      { label: 'Puzzle', color: 'amber' },
      { label: 'Strategy', color: 'cyan' },
    ],
  },
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic snake game - eat, grow, survive!',
    accentColor: 'green',
    shortcutKey: '3',
    icon: <SnakeIcon />,
    tags: [
      { label: 'Classic', color: 'green' },
      { label: 'Arcade', color: 'pink' },
    ],
  },
];

/**
 * GameSelector - Game selection screen component
 * Displays available games as cards with keyboard shortcuts
 */
const GameSelector = ({ onSelectGame }) => {
  // Keyboard shortcuts to select games
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case '1':
          onSelectGame('brickrush');
          break;
        case '2':
          onSelectGame('1024');
          break;
        case '3':
          onSelectGame('snake');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectGame]);

  return (
    <div className="game-selector fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-start md:justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-cyan-500/20 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-amber-500/15 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-green-500/15 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-1/2 left-1/3 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-pink-500/10 rounded-full blur-[40px] sm:blur-[60px] md:blur-[80px] animate-pulse"
          style={{ animationDelay: '1.5s' }}
        ></div>
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="relative z-10 text-center max-w-4xl mx-auto py-4 sm:py-6 md:py-8 w-full">
        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 bg-clip-text text-transparent"
          style={{
            fontFamily: '"Raleway", sans-serif',
            backgroundSize: '200% 200%',
            animation: 'gradientMove 4s linear infinite',
          }}
        >
          Arcade Games
        </h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-10">
          Choose your game
        </p>

        {/* Game Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-2 sm:px-4">
          {GAMES.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              onClick={() => onSelectGame(game.id)}
              accentColor={game.accentColor}
              shortcutKey={game.shortcutKey}
              icon={game.icon}
              tags={game.tags}
            />
          ))}
        </div>

        {/* Keyboard shortcut hint */}
        <p className="text-gray-500 text-[10px] sm:text-xs mt-4 sm:mt-6 md:mt-8 hidden sm:block">
          Press{' '}
          <kbd className="px-1.5 py-0.5 mx-0.5 rounded bg-gray-800 text-gray-400 font-mono">1</kbd>
          <kbd className="px-1.5 py-0.5 mx-0.5 rounded bg-gray-800 text-gray-400 font-mono">2</kbd>
          <kbd className="px-1.5 py-0.5 mx-0.5 rounded bg-gray-800 text-gray-400 font-mono">3</kbd>
          to quick start a game
        </p>
      </div>
    </div>
  );
};

export default GameSelector;
