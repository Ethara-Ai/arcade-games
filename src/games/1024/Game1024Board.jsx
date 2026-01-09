import { useRef } from 'react';
import Tile from '../Tile';

/**
 * Game1024Board - Presentation component for the 1024 game board
 * Handles rendering of the game grid and tiles
 * @param {array} grid - 2D array representing the game grid
 * @param {number} score - Current score
 * @param {number} bestScore - Best/high score
 * @param {number} highestTile - Highest tile value on the board
 * @param {function} onTouchStart - Touch start handler
 * @param {function} onTouchEnd - Touch end handler
 * @param {string} accentColor - Accent color theme
 */
const Game1024Board = ({
  grid,
  score,
  bestScore,
  highestTile,
  onTouchStart,
  onTouchEnd,
  accentColor = 'amber',
}) => {
  const boardRef = useRef(null);

  // Color configurations
  const colorConfig = {
    amber: {
      titleColor: 'text-amber-400',
      statText: 'text-amber-400',
      statBorder: 'border-amber-500/20',
      tileHighlight: 'text-amber-400',
    },
    cyan: {
      titleColor: 'text-cyan-400',
      statText: 'text-cyan-400',
      statBorder: 'border-cyan-500/20',
      tileHighlight: 'text-cyan-400',
    },
    green: {
      titleColor: 'text-green-400',
      statText: 'text-green-400',
      statBorder: 'border-green-500/20',
      tileHighlight: 'text-green-400',
    },
  };

  const colors = colorConfig[accentColor] || colorConfig.amber;

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      {/* Score Display */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 w-full max-w-[min(90vw,400px)]">
        <div className={`glass-stat ${colors.statBorder} rounded-lg px-4 py-2 text-center flex-1`}>
          <div className={`text-[10px] ${colors.statText} font-semibold uppercase tracking-wider`}>
            Score
          </div>
          <div className="text-lg sm:text-xl font-bold text-white">{score}</div>
        </div>
        <div className={`glass-stat ${colors.statBorder} rounded-lg px-4 py-2 text-center flex-1`}>
          <div className={`text-[10px] ${colors.statText} font-semibold uppercase tracking-wider`}>
            Best
          </div>
          <div className="text-lg sm:text-xl font-bold text-white">{bestScore}</div>
        </div>
        <div className={`glass-stat ${colors.statBorder} rounded-lg px-4 py-2 text-center flex-1`}>
          <div className={`text-[10px] ${colors.statText} font-semibold uppercase tracking-wider`}>
            Top Tile
          </div>
          <div className={`text-lg sm:text-xl font-bold ${colors.tileHighlight}`}>
            {highestTile}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div
        ref={boardRef}
        className="game-1024-board relative bg-[#1a1a2e] rounded-lg sm:rounded-xl p-1.5 sm:p-2 shadow-2xl"
        style={{
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)',
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Grid Background */}
        <div className="absolute inset-1.5 sm:inset-2 grid grid-cols-4 grid-rows-4 gap-1 sm:gap-1.5">
          {Array(16)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="bg-[#252540] rounded-md sm:rounded-lg" />
            ))}
        </div>

        {/* Tiles */}
        <div className="absolute inset-1.5 sm:inset-2">
          {grid.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <Tile key={`${rowIndex}-${colIndex}`} value={value} row={rowIndex} col={colIndex} />
            ))
          )}
        </div>
      </div>

      {/* Mobile Instructions */}
      <p className="text-gray-500 text-xs text-center sm:hidden">Swipe to move tiles</p>

      {/* Desktop Instructions */}
      <p className="text-gray-500 text-xs text-center hidden sm:block">
        Use arrow keys or swipe to move tiles
      </p>
    </div>
  );
};

export default Game1024Board;
