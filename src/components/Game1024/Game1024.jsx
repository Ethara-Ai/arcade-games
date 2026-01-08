import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IoArrowBack, IoHelpCircle, IoPause, IoPlay, IoRefresh, IoHome } from 'react-icons/io5';
import { GRID_SIZE, KEY_MAPPINGS, GAME_1024_STATES, WINNING_TILE } from '../../constants/game1024Constants';
import { HowToPlayModal } from '../shared';
import {
  initializeGrid,
  move,
  addRandomTile,
  getGameState,
  getHighestTile,
} from '../../utils/game1024Logic';
import { STORAGE_KEYS, debugLog } from '../../config';
import Tile from './Tile';

const GAME_1024_INSTRUCTIONS = [
  'Slide tiles in any direction using arrow keys or swipe',
  'When two tiles with the same number collide, they merge',
  'Create a tile with the number 1024 to win',
  'The game ends when no more moves are possible',
];

const GAME_1024_CONTROLS = [
  { key: '↑ ↓ ← →', action: 'Move tiles' },
  { key: 'W A S D', action: 'Move tiles (alternative)' },
  { key: 'Swipe', action: 'Move tiles (touch)' },
];

const GAME_1024_TIPS = [
  'Keep your highest tile in a corner',
  'Build a chain of decreasing numbers',
  'Plan several moves ahead',
  'Don\'t chase small merges randomly',
];

const Game1024 = ({ onBack }) => {
  const [grid, setGrid] = useState(() => initializeGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GAME_1024_BEST_SCORE);
    debugLog('Loaded 1024 best score:', saved);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [gameState, setGameState] = useState(GAME_1024_STATES.START);
  const [hasWonBefore, setHasWonBefore] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const boardRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Save best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(STORAGE_KEYS.GAME_1024_BEST_SCORE, score.toString());
      debugLog('Saved 1024 best score:', score);
    }
  }, [score, bestScore]);

  // Start game
  const handleStartGame = useCallback(() => {
    setGameState(GAME_1024_STATES.PLAYING);
  }, []);

  // Handle move
  const handleMove = useCallback((direction) => {
    if (gameState === GAME_1024_STATES.START) return;
    if (gameState === GAME_1024_STATES.PAUSED) return;
    if (gameState === GAME_1024_STATES.GAME_OVER || isAnimating) return;
    if (gameState === GAME_1024_STATES.WON && !hasWonBefore) return;

    const result = move(grid, direction);

    if (result.moved) {
      setIsAnimating(true);

      setTimeout(() => {
        const newGrid = addRandomTile(result.grid);
        setGrid(newGrid);
        setScore(prev => prev + result.score);

        const newState = getGameState(newGrid, hasWonBefore);
        setGameState(newState);
        setIsAnimating(false);
      }, 100);
    }
  }, [grid, gameState, hasWonBefore, isAnimating]);

  // Handle pause
  const handlePause = useCallback(() => {
    if (gameState === GAME_1024_STATES.PLAYING) {
      setGameState(GAME_1024_STATES.PAUSED);
    }
  }, [gameState]);

  // Handle resume
  const handleResume = useCallback(() => {
    if (gameState === GAME_1024_STATES.PAUSED) {
      setGameState(GAME_1024_STATES.PLAYING);
    }
  }, [gameState]);

  // Handle pause toggle
  const handlePauseToggle = useCallback(() => {
    if (gameState === GAME_1024_STATES.PLAYING) {
      setGameState(GAME_1024_STATES.PAUSED);
    } else if (gameState === GAME_1024_STATES.PAUSED) {
      setGameState(GAME_1024_STATES.PLAYING);
    }
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Enter key to start game from start menu
      if (e.key === 'Enter' && gameState === GAME_1024_STATES.START && !showHelp) {
        e.preventDefault();
        setGameState(GAME_1024_STATES.PLAYING);
        return;
      }

      // Handle pause with P or Escape
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        e.preventDefault();
        handlePauseToggle();
        return;
      }

      const direction = KEY_MAPPINGS[e.key];
      if (direction) {
        e.preventDefault();
        handleMove(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handlePauseToggle, gameState, showHelp]);

  // Touch controls
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipe = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipe) {
        handleMove(deltaX > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(deltaY) > minSwipe) {
        handleMove(deltaY > 0 ? 'DOWN' : 'UP');
      }
    }
  }, [handleMove]);

  // New game
  const handleNewGame = useCallback(() => {
    setGrid(initializeGrid());
    setScore(0);
    setGameState(GAME_1024_STATES.PLAYING);
    setHasWonBefore(false);
  }, []);

  // Continue after winning
  const handleContinue = useCallback(() => {
    setHasWonBefore(true);
    setGameState(GAME_1024_STATES.PLAYING);
  }, []);

  const highestTile = getHighestTile(grid);

  return (
    <div className="game-1024-container flex flex-col items-center justify-center h-screen overflow-hidden p-4 bg-[#0a0a0a]">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Start Menu Overlay */}
      {gameState === GAME_1024_STATES.START && (
        <div className="fixed inset-0 glass-overlay flex flex-col items-center justify-center z-50 p-3 sm:p-4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-cyan-500/20 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]"></div>
          </div>

          <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-md w-full mx-3 sm:mx-4">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] rounded-2xl sm:rounded-3xl pointer-events-none"></div>

            <div className="relative z-10">
              {/* Header Row - Back Button + Title */}
              <div className="flex items-center gap-3 mb-3 sm:mb-4 md:mb-6">
                <button
                  onClick={onBack}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full text-white flex items-center justify-center shadow-lg shadow-amber-400/40 hover:scale-105 active:scale-95 transition-transform text-sm sm:text-lg flex-shrink-0"
                  title="Back to Game Selector"
                >
                  <IoArrowBack />
                </button>
                <h1
                  className="game-title text-2xl sm:text-3xl md:text-4xl font-black"
                  style={{ fontFamily: '"Raleway", sans-serif' }}
                >
                  1024
                </h1>
              </div>

              {/* Description */}
              <div className="glass-stat rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed border-amber-500/10 mb-3 sm:mb-4 md:mb-6">
                Swipe or use arrow keys to move tiles. Merge matching numbers to reach <span className="text-amber-400 font-bold">1024</span>!
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full">
                <button
                  onClick={handleStartGame}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg sm:rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-amber-400/30 text-sm sm:text-base md:text-lg flex items-center justify-center gap-2"
                >
                  Start Game
                </button>
                <button
                  onClick={() => setShowHelp(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 glass-button text-amber-400 rounded-lg sm:rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all text-sm sm:text-base md:text-lg border-amber-400/30"
                >
                  <IoHelpCircle className="text-lg sm:text-xl" />
                  How to Play
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        gameName="1024"
        accentColor="cyan"
        instructions={GAME_1024_INSTRUCTIONS}
        controls={GAME_1024_CONTROLS}
        tips={GAME_1024_TIPS}
      />

      <div className="relative z-10 w-full max-w-md px-2 sm:px-0">
        {/* Header Row - Back, Title, New Game */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
          <button
            onClick={onBack}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full text-white font-bold flex items-center justify-center shadow-lg shadow-cyan-400/40 hover:scale-105 active:scale-95 transition-transform text-sm sm:text-lg"
          >
            <IoArrowBack />
          </button>

          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            style={{ fontFamily: '"Raleway", sans-serif' }}
          >
            1024
          </h1>

          <button
            onClick={handleNewGame}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-md sm:rounded-lg font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-cyan-400/30 text-xs sm:text-sm"
          >
            New Game
          </button>
        </div>

        {/* Score Row - Glass stat boxes */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
          <div className="flex gap-2 sm:gap-3">
            <div className="glass-stat border-cyan-500/20 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-center min-w-[60px] sm:min-w-20">
              <div className="text-[8px] sm:text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Score</div>
              <div className="text-base sm:text-xl font-bold text-white">{score}</div>
            </div>
            <div className="glass-stat border-cyan-500/20 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-center min-w-[60px] sm:min-w-20">
              <div className="text-[8px] sm:text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Best</div>
              <div className="text-base sm:text-xl font-bold text-white">{bestScore}</div>
            </div>
          </div>

          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 text-right hidden sm:block">
            Join tiles to get <span className="text-cyan-400 font-bold">{WINNING_TILE}</span>!
          </p>
        </div>

        {/* Game Board - Glass panel */}
        <div
          ref={boardRef}
          className="game-1024-board relative glass-cyan rounded-2xl p-3"
          style={{
            width: 'min(400px, 85vw, calc(100vh - 280px))',
            height: 'min(400px, 85vw, calc(100vh - 280px))',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Grid background */}
          <div className="absolute inset-3 grid grid-cols-4 grid-rows-4 gap-2">
            {Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-lg"
              />
            ))}
          </div>

          {/* Tiles */}
          <div className="absolute inset-3">
            {grid.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <Tile
                  key={`${rowIndex}-${colIndex}`}
                  value={value}
                  row={rowIndex}
                  col={colIndex}
                />
              ))
            )}
          </div>

          {/* Game Over Overlay */}
          {gameState === GAME_1024_STATES.GAME_OVER && (
            <div className="absolute inset-0 glass-overlay rounded-2xl flex flex-col items-center justify-center z-10 p-4">
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500/20 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                <h2
                  className="text-3xl sm:text-4xl font-black text-red-500 text-center"
                  style={{ fontFamily: '"Raleway", sans-serif', textShadow: '0 0 30px rgba(255,23,68,0.5)' }}
                >
                  Game Over!
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-3 my-2">
                  <div className="glass-stat border-cyan-500/20 rounded-xl px-4 py-2 text-center min-w-[90px]">
                    <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Highest</div>
                    <div className="text-xl font-bold text-white">{highestTile}</div>
                  </div>
                  <div className="glass-stat border-cyan-500/20 rounded-xl px-4 py-2 text-center min-w-[90px]">
                    <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Score</div>
                    <div className="text-xl font-bold text-white">{score}</div>
                  </div>
                </div>

                <div className="flex items-stretch justify-center gap-3 mt-2 w-full max-w-xs">
                  <button
                    onClick={handleNewGame}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-amber-400/30 text-sm sm:text-base whitespace-nowrap"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={onBack}
                    className="flex-1 px-4 py-3 glass-button text-gray-300 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform text-sm sm:text-base whitespace-nowrap"
                  >
                    Main Menu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Won Overlay */}
          {gameState === GAME_1024_STATES.WON && !hasWonBefore && (
            <div className="absolute inset-0 glass-overlay rounded-2xl flex flex-col items-center justify-center z-10 p-4">
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                <h2
                  className="text-3xl sm:text-4xl font-black text-cyan-400 text-center"
                  style={{ fontFamily: '"Raleway", sans-serif', textShadow: '0 0 30px rgba(0,209,255,0.5)' }}
                >
                  You Win!
                </h2>

                <p className="text-gray-300 text-center text-sm sm:text-base">
                  You reached <span className="text-cyan-400 font-bold">{WINNING_TILE}</span>!
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 my-2">
                  <div className="glass-stat border-cyan-500/20 rounded-xl px-4 py-2 text-center min-w-[90px]">
                    <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Score</div>
                    <div className="text-xl font-bold text-white">{score}</div>
                  </div>
                </div>

                <div className="flex items-stretch justify-center gap-3 mt-2 w-full max-w-xs">
                  <button
                    onClick={handleContinue}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-green-400/30 text-sm sm:text-base whitespace-nowrap"
                  >
                    Keep Playing
                  </button>
                  <button
                    onClick={handleNewGame}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-amber-400/30 text-sm sm:text-base whitespace-nowrap"
                  >
                    New Game
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paused Overlay */}
          {gameState === GAME_1024_STATES.PAUSED && (
            <div className="absolute inset-0 glass-overlay rounded-2xl flex flex-col items-center justify-center z-10 p-4">
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                <h2
                  className="text-3xl sm:text-4xl font-black text-cyan-400 text-center"
                  style={{ fontFamily: '"Raleway", sans-serif', textShadow: '0 0 30px rgba(0,209,255,0.5)' }}
                >
                  Paused
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-3 my-2">
                  <div className="glass-stat border-cyan-500/20 rounded-xl px-4 py-2 text-center min-w-[90px]">
                    <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Score</div>
                    <div className="text-xl font-bold text-white">{score}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-2 w-full max-w-[200px]">
                  <button
                    onClick={handleResume}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg shadow-green-400/30 text-sm sm:text-base"
                  >
                    Resume (P)
                  </button>
                  <button
                    onClick={handleNewGame}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg shadow-cyan-400/30 text-sm sm:text-base"
                  >
                    Restart
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full px-6 py-3 glass-button text-gray-300 rounded-xl font-semibold hover:scale-105 transition-transform text-sm sm:text-base"
                  >
                    Main Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons - Icon only, consistent position across all games */}
        {(gameState === GAME_1024_STATES.PLAYING || gameState === GAME_1024_STATES.PAUSED) && (
          <div className="flex items-center justify-center gap-3 mt-3 sm:mt-4">
            <button
              onClick={handlePauseToggle}
              className={`w-12 h-10 flex items-center justify-center ${gameState === GAME_1024_STATES.PAUSED
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-green-400/30'
                : 'bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-400/30'
                } text-white rounded-lg text-lg hover:scale-105 transition-transform shadow-lg`}
              title={gameState === GAME_1024_STATES.PAUSED ? 'Resume' : 'Pause'}
            >
              {gameState === GAME_1024_STATES.PAUSED ? <IoPlay /> : <IoPause />}
            </button>
            <button
              onClick={handleNewGame}
              className="w-12 h-10 flex items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg text-lg hover:scale-105 transition-transform shadow-lg shadow-cyan-400/30"
              title="Restart"
            >
              <IoRefresh />
            </button>
            <button
              onClick={onBack}
              className="w-12 h-10 flex items-center justify-center glass-button text-gray-300 rounded-lg text-lg hover:scale-105 transition-transform"
              title="Main Menu"
            >
              <IoHome />
            </button>
          </div>
        )}

        {/* Controls hint */}
        <div className="mt-2 sm:mt-3 text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">
            <span className="text-cyan-400 font-semibold">HOW TO PLAY:</span> Use arrow keys or swipe to move tiles.
          </p>
          <p className="text-[10px] sm:text-xs text-gray-600">
            Press <span className="text-cyan-400">P</span> or <span className="text-cyan-400">Esc</span> to pause
          </p>
        </div>
      </div>
    </div>
  );
};

export default Game1024;
