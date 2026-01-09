import { useState, useCallback, useRef, useEffect } from "react";
import {
  GAME_1024_KEY_MAPPINGS as KEY_MAPPINGS,
  GAME_1024_STATES,
} from "../../constants";
import { STORAGE_KEYS, debugLog } from "../../config";
import {
  initializeGrid,
  move,
  addRandomTile,
  getGameState,
  getHighestTile,
} from "../../utils/game1024Logic";

/**
 * useGame1024 - Custom hook for 1024 game logic
 * Separates game state and logic from rendering concerns
 */
export const useGame1024 = () => {
  // Grid state
  const [grid, setGrid] = useState(() => initializeGrid());

  // Score state
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GAME_1024_BEST_SCORE);
    debugLog("Loaded 1024 best score:", saved);
    return saved ? parseInt(saved, 10) : 0;
  });

  // Game state
  const [gameState, setGameState] = useState(GAME_1024_STATES.START);
  const [hasWonBefore, setHasWonBefore] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Touch handling ref
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Computed values
  const effectiveBestScore = score > bestScore ? score : bestScore;
  const highestTile = getHighestTile(grid);

  // Save best score when it changes
  useEffect(() => {
    if (score > bestScore) {
      localStorage.setItem(STORAGE_KEYS.GAME_1024_BEST_SCORE, score.toString());
      setBestScore(score);
      debugLog("Saved 1024 best score:", score);
    }
  }, [score, bestScore]);

  // Start game
  const handleStartGame = useCallback(() => {
    setGameState(GAME_1024_STATES.PLAYING);
  }, []);

  // Handle move
  const handleMove = useCallback(
    (direction) => {
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
          setScore((prev) => prev + result.score);

          const newState = getGameState(newGrid, hasWonBefore);
          setGameState(newState);
          setIsAnimating(false);
        }, 100);
      }
    },
    [grid, gameState, hasWonBefore, isAnimating],
  );

  // Handle resume
  const handleResume = useCallback(() => {
    if (gameState === GAME_1024_STATES.PAUSED) {
      setGameState(GAME_1024_STATES.PLAYING);
    }
  }, [gameState]);

  // Handle pause
  const handlePause = useCallback(() => {
    if (gameState === GAME_1024_STATES.PLAYING) {
      setGameState(GAME_1024_STATES.PAUSED);
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

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e, showHelp = false) => {
      // Enter key to start game from start menu
      if (
        e.key === "Enter" &&
        gameState === GAME_1024_STATES.START &&
        !showHelp
      ) {
        e.preventDefault();
        setGameState(GAME_1024_STATES.PLAYING);
        return true;
      }

      // Handle pause with P or Escape
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        e.preventDefault();
        handlePauseToggle();
        return true;
      }

      const direction = KEY_MAPPINGS[e.key];
      if (direction) {
        e.preventDefault();
        handleMove(direction);
        return true;
      }

      return false;
    },
    [handleMove, handlePauseToggle, gameState],
  );

  // Handle touch start
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  // Handle touch end
  const handleTouchEnd = useCallback(
    (e) => {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const minSwipe = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipe) {
          handleMove(deltaX > 0 ? "RIGHT" : "LEFT");
        }
      } else {
        if (Math.abs(deltaY) > minSwipe) {
          handleMove(deltaY > 0 ? "DOWN" : "UP");
        }
      }
    },
    [handleMove],
  );

  return {
    // State
    grid,
    score,
    bestScore: effectiveBestScore,
    gameState,
    hasWonBefore,
    isAnimating,
    highestTile,

    // Actions
    handleStartGame,
    handleMove,
    handleResume,
    handlePause,
    handlePauseToggle,
    handleNewGame,
    handleContinue,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,

    // State setters (for external control if needed)
    setGameState,
  };
};

export default useGame1024;
