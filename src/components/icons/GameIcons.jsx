/**
 * Game Icons - Centralized icon components for all games
 * Used in GameSelector and other UI components
 */

/**
 * Brickrush game icon - brick breaker paddle and ball
 */
export const BrickrushIcon = () => (
  <svg
    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="2" y="4" width="4" height="2" rx="0.5" />
    <rect x="7" y="4" width="4" height="2" rx="0.5" />
    <rect x="12" y="4" width="4" height="2" rx="0.5" />
    <rect x="17" y="4" width="4" height="2" rx="0.5" />
    <rect x="2" y="7" width="4" height="2" rx="0.5" />
    <rect x="7" y="7" width="4" height="2" rx="0.5" />
    <rect x="12" y="7" width="4" height="2" rx="0.5" />
    <rect x="17" y="7" width="4" height="2" rx="0.5" />
    <circle cx="12" cy="15" r="1.5" />
    <rect x="8" y="20" width="8" height="2" rx="1" />
  </svg>
);

/**
 * 1024 game icon - text-based number display
 */
export const Game1024Icon = () => (
  <span
    className="text-white font-black text-sm sm:text-base md:text-xl"
    style={{ fontFamily: '"Raleway", sans-serif' }}
  >
    1024
  </span>
);

/**
 * Snake game icon - snake body shape
 */
export const SnakeIcon = () => (
  <svg
    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20 12c0 1.1-.9 2-2 2h-1v1c0 1.1-.9 2-2 2h-1v1c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1H5c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2h1V9c0-1.1.9-2 2-2h1V6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v1h1c1.1 0 2 .9 2 2v3z" />
    <circle cx="10" cy="8" r="1" />
    <circle cx="14" cy="8" r="1" />
  </svg>
);

/**
 * Generic game controller icon
 */
export const GameControllerIcon = () => (
  <svg
    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

/**
 * Puzzle icon for puzzle-type games
 */
export const PuzzleIcon = () => (
  <svg
    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
  </svg>
);

export default {
  BrickrushIcon,
  Game1024Icon,
  SnakeIcon,
  GameControllerIcon,
  PuzzleIcon,
};
