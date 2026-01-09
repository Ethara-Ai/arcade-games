import { useState, useCallback, useRef, useEffect } from 'react';
import {
  SNAKE_GRID_SIZE as GRID_SIZE,
  SNAKE_GAME_STATES,
  SNAKE_DIRECTIONS as DIRECTIONS,
  SNAKE_KEY_MAPPINGS as KEY_MAPPINGS,
  SNAKE_OPPOSITE_DIRECTIONS as OPPOSITE_DIRECTIONS,
  SNAKE_BASE_SPEED as BASE_SPEED,
  SNAKE_MIN_SPEED as MIN_SPEED,
  SNAKE_SPEED_INCREASE_PER_FOOD as SPEED_INCREASE_PER_FOOD,
  SNAKE_INITIAL_POSITION as INITIAL_SNAKE,
  SNAKE_FOOD_POINTS as FOOD_POINTS,
  SNAKE_BONUS_FOOD_POINTS as BONUS_FOOD_POINTS,
  SNAKE_BONUS_FOOD_CHANCE as BONUS_FOOD_CHANCE,
} from '../../constants';
import { STORAGE_KEYS, debugLog } from '../../config';
import { safeGetInt, safeSetItem } from '../../utils/safeStorage';

/**
 * useSnakeGame - Custom hook for Snake game logic
 * Separates game state and logic from rendering concerns
 *
 * Refactored to use:
 * - Safe storage utilities for localStorage access
 * - Proper cleanup for game loop
 * - Improved error handling
 */
export const useSnakeGame = () => {
  // Game state
  const [gameState, setGameState] = useState(SNAKE_GAME_STATES.START);
  const [score, setScore] = useState(0);
  const [snakeLength, setSnakeLength] = useState(INITIAL_SNAKE.length);
  const [speedLevel, setSpeedLevel] = useState(3); // Speed level: 1 (slowest) to 5 (fastest), default is 3 (normal)

  // High score state - using safe storage for initialization
  const [highScore, setHighScore] = useState(() => {
    const saved = safeGetInt(STORAGE_KEYS.SNAKE_HIGH_SCORE, 0);
    debugLog('Loaded Snake high score:', saved);
    return saved;
  });

  // Game object refs
  const snakeRef = useRef([...INITIAL_SNAKE]);
  const directionRef = useRef('RIGHT');
  const nextDirectionRef = useRef('RIGHT');
  const foodRef = useRef({ x: 5, y: 5, isBonus: false });
  const bonusFoodRef = useRef(null);
  const scoreRef = useRef(0);
  const gameLoopRef = useRef(null);

  // Touch handling ref
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Generate food at random position
  const generateFood = useCallback((isBonus = false) => {
    const snake = snakeRef.current;
    let newFood;
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loop

    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        isBonus: isBonus,
      };
      attempts++;
    } while (
      snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y) &&
      attempts < maxAttempts
    );

    return newFood;
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    snakeRef.current = [...INITIAL_SNAKE.map((s) => ({ ...s }))];
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    foodRef.current = generateFood(false);
    bonusFoodRef.current = null;
    scoreRef.current = 0;
    setScore(0);
    setSnakeLength(INITIAL_SNAKE.length);
  }, [generateFood]);

  // Speed level multipliers (1 = slowest, 5 = fastest)
  const SPEED_MULTIPLIERS = {
    1: 1.5, // 50% slower
    2: 1.25, // 25% slower
    3: 1.0, // Normal speed
    4: 0.75, // 25% faster
    5: 0.5, // 50% faster
  };

  // Get game speed based on score and speed level
  const getGameSpeed = useCallback(() => {
    const speedReduction = Math.floor(scoreRef.current / FOOD_POINTS) * SPEED_INCREASE_PER_FOOD;
    const baseSpeed = Math.max(MIN_SPEED, BASE_SPEED - speedReduction);
    const multiplier = SPEED_MULTIPLIERS[speedLevel] || 1.0;
    return Math.max(MIN_SPEED * 0.5, baseSpeed * multiplier);
  }, [speedLevel]);

  // Increase speed (lower level number = slower)
  const increaseSpeed = useCallback(() => {
    setSpeedLevel((prev) => Math.min(5, prev + 1));
  }, []);

  // Decrease speed
  const decreaseSpeed = useCallback(() => {
    setSpeedLevel((prev) => Math.max(1, prev - 1));
  }, []);

  // Move snake
  const moveSnake = useCallback(() => {
    const snake = snakeRef.current;
    const direction = DIRECTIONS[nextDirectionRef.current];
    directionRef.current = nextDirectionRef.current;

    const newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      return false;
    }

    // Check self collision
    if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      return false;
    }

    snake.unshift(newHead);

    const food = foodRef.current;
    const bonusFood = bonusFoodRef.current;

    // Check food collision
    if (food && newHead.x === food.x && newHead.y === food.y) {
      scoreRef.current += FOOD_POINTS;
      setScore(scoreRef.current);
      setSnakeLength(snake.length);
      foodRef.current = generateFood(false);

      // Chance to spawn bonus food
      if (!bonusFood && Math.random() < BONUS_FOOD_CHANCE) {
        bonusFoodRef.current = generateFood(true);
      }
    } else if (bonusFood && newHead.x === bonusFood.x && newHead.y === bonusFood.y) {
      scoreRef.current += BONUS_FOOD_POINTS;
      setScore(scoreRef.current);
      setSnakeLength(snake.length);
      bonusFoodRef.current = null;
    } else {
      snake.pop();
    }

    return true;
  }, [generateFood]);

  // Change direction
  const changeDirection = useCallback((newDirection) => {
    if (!newDirection) return;

    const currentDirection = directionRef.current;

    // Prevent 180-degree turns
    if (OPPOSITE_DIRECTIONS[currentDirection] === newDirection) {
      return;
    }

    nextDirectionRef.current = newDirection;
  }, []);

  // Stop game loop
  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearTimeout(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  // Game over handler - using safe storage for saving
  const handleGameOver = useCallback(() => {
    stopGameLoop();
    setGameState(SNAKE_GAME_STATES.GAME_OVER);

    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);

      const success = safeSetItem(STORAGE_KEYS.SNAKE_HIGH_SCORE, scoreRef.current.toString());

      if (success) {
        debugLog('Saved Snake high score:', scoreRef.current);
      } else {
        debugLog('Failed to save Snake high score to storage, updated state:', scoreRef.current);
      }
    }
  }, [highScore, stopGameLoop]);

  // Start game
  const handleStartGame = useCallback(() => {
    initGame();
    setGameState(SNAKE_GAME_STATES.PLAYING);
  }, [initGame]);

  // New game
  const handleNewGame = useCallback(() => {
    stopGameLoop();
    initGame();
    setGameState(SNAKE_GAME_STATES.PLAYING);
  }, [initGame, stopGameLoop]);

  // Resume game
  const handleResume = useCallback(() => {
    if (gameState === SNAKE_GAME_STATES.PAUSED) {
      setGameState(SNAKE_GAME_STATES.PLAYING);
    }
  }, [gameState]);

  // Pause game
  const handlePause = useCallback(() => {
    if (gameState === SNAKE_GAME_STATES.PLAYING) {
      stopGameLoop();
      setGameState(SNAKE_GAME_STATES.PAUSED);
    }
  }, [gameState, stopGameLoop]);

  // Pause toggle
  const handlePauseToggle = useCallback(() => {
    if (gameState === SNAKE_GAME_STATES.PLAYING) {
      stopGameLoop();
      setGameState(SNAKE_GAME_STATES.PAUSED);
    } else if (gameState === SNAKE_GAME_STATES.PAUSED) {
      setGameState(SNAKE_GAME_STATES.PLAYING);
    }
  }, [gameState, stopGameLoop]);

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e, showHelp = false) => {
      // Enter key to start game from start menu
      if (e.key === 'Enter' && gameState === SNAKE_GAME_STATES.START && !showHelp) {
        e.preventDefault();
        handleStartGame();
        return true;
      }

      // Handle pause with P, Space, or Escape
      if (e.key === 'p' || e.key === 'P' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        handlePauseToggle();
        return true;
      }

      // Handle speed control with +/- keys
      if (e.key === '+' || e.key === '=' || e.key === ']') {
        e.preventDefault();
        increaseSpeed();
        return true;
      }
      if (e.key === '-' || e.key === '_' || e.key === '[') {
        e.preventDefault();
        decreaseSpeed();
        return true;
      }

      // Handle direction change
      const direction = KEY_MAPPINGS[e.key];
      if (direction && gameState === SNAKE_GAME_STATES.PLAYING) {
        e.preventDefault();
        changeDirection(direction);
        return true;
      }

      return false;
    },
    [gameState, handleStartGame, handlePauseToggle, changeDirection, increaseSpeed, decreaseSpeed]
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
          changeDirection(deltaX > 0 ? 'RIGHT' : 'LEFT');
        }
      } else {
        if (Math.abs(deltaY) > minSwipe) {
          changeDirection(deltaY > 0 ? 'DOWN' : 'UP');
        }
      }
    },
    [changeDirection]
  );

  // Get current game objects for rendering
  const getGameObjects = useCallback(
    () => ({
      snake: snakeRef.current,
      food: foodRef.current,
      bonusFood: bonusFoodRef.current,
    }),
    []
  );

  // Check if game can accept input
  const canAcceptInput = useCallback(() => {
    return gameState === SNAKE_GAME_STATES.PLAYING;
  }, [gameState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopGameLoop();
    };
  }, [stopGameLoop]);

  return {
    // State
    gameState,
    score,
    highScore,
    snakeLength,
    speedLevel,

    // Refs for direct access
    snakeRef,
    foodRef,
    bonusFoodRef,
    gameLoopRef,

    // Actions
    handleStartGame,
    handleNewGame,
    handleResume,
    handlePause,
    handlePauseToggle,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
    handleGameOver,

    // Speed control
    increaseSpeed,
    decreaseSpeed,

    // Game logic
    initGame,
    moveSnake,
    changeDirection,
    getGameSpeed,
    getGameObjects,
    stopGameLoop,

    // Utilities
    canAcceptInput,

    // State setters
    setGameState,
  };
};

export default useSnakeGame;
