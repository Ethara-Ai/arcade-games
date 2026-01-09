import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IoArrowBack, IoTrophy, IoHelpCircle, IoPause, IoPlay, IoRefresh, IoHome } from 'react-icons/io5';
import {
  SNAKE_GRID_SIZE as GRID_SIZE,
  SNAKE_CELL_SIZE as CELL_SIZE,
  SNAKE_CANVAS_SIZE as CANVAS_SIZE,
  SNAKE_GAME_STATES,
  SNAKE_DIRECTIONS as DIRECTIONS,
  SNAKE_KEY_MAPPINGS as KEY_MAPPINGS,
  SNAKE_OPPOSITE_DIRECTIONS as OPPOSITE_DIRECTIONS,
  SNAKE_BASE_SPEED as BASE_SPEED,
  SNAKE_MIN_SPEED as MIN_SPEED,
  SNAKE_SPEED_INCREASE_PER_FOOD as SPEED_INCREASE_PER_FOOD,
  SNAKE_COLORS as COLORS,
  SNAKE_INITIAL_POSITION as INITIAL_SNAKE,
  SNAKE_FOOD_POINTS as FOOD_POINTS,
  SNAKE_BONUS_FOOD_POINTS as BONUS_FOOD_POINTS,
  SNAKE_BONUS_FOOD_CHANCE as BONUS_FOOD_CHANCE,
} from '../../constants';
import { STORAGE_KEYS, debugLog } from '../../config';
import { HowToPlayModal } from '../';

const SNAKE_INSTRUCTIONS = [
  'Guide the snake to eat food and grow longer',
  'Pink food gives 10 points, golden food gives 50 points',
  'Avoid hitting the walls or your own tail',
  'The snake speeds up as you eat more food',
];

const SNAKE_CONTROLS = [
  { key: '↑ ↓ ← →', action: 'Change direction' },
  { key: 'W A S D', action: 'Change direction (alternative)' },
  { key: 'Swipe', action: 'Change direction (touch)' },
  { key: 'P / Space', action: 'Pause game' },
];

const SNAKE_TIPS = [
  'Plan your path to avoid trapping yourself',
  'Use the edges carefully - don\'t get cornered',
  'Grab bonus food quickly for extra points',
  'Stay calm as the speed increases',
];

const SnakeGame = ({ onBack }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const [gameState, setGameState] = useState(SNAKE_GAME_STATES.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SNAKE_HIGH_SCORE);
    debugLog('Loaded Snake high score:', saved);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showHelp, setShowHelp] = useState(false);

  const snakeRef = useRef([...INITIAL_SNAKE]);
  const directionRef = useRef('RIGHT');
  const nextDirectionRef = useRef('RIGHT');
  const foodRef = useRef(null);
  const bonusFoodRef = useRef(null);
  const scoreRef = useRef(0);

  const generateFood = useCallback((isBonus = false) => {
    const snake = snakeRef.current;
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        isBonus: isBonus,
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const initGame = useCallback(() => {
    snakeRef.current = [...INITIAL_SNAKE.map(s => ({ ...s }))];
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    foodRef.current = generateFood(false); // Regular food
    bonusFoodRef.current = null;
    scoreRef.current = 0;
    setScore(0);
  }, [generateFood]);

  const getGameSpeed = useCallback(() => {
    const speedReduction = Math.floor(scoreRef.current / FOOD_POINTS) * SPEED_INCREASE_PER_FOOD;
    return Math.max(MIN_SPEED, BASE_SPEED - speedReduction);
  }, []);

  const moveSnake = useCallback(() => {
    const snake = snakeRef.current;
    const direction = DIRECTIONS[nextDirectionRef.current];
    directionRef.current = nextDirectionRef.current;

    const newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      return false;
    }

    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      return false;
    }

    snake.unshift(newHead);

    const food = foodRef.current;
    const bonusFood = bonusFoodRef.current;

    if (food && newHead.x === food.x && newHead.y === food.y) {
      scoreRef.current += FOOD_POINTS;
      setScore(scoreRef.current);
      foodRef.current = generateFood(false); // Always regular food

      // Chance to spawn bonus food
      if (!bonusFood && Math.random() < BONUS_FOOD_CHANCE) {
        bonusFoodRef.current = generateFood(true); // Bonus food
      }
    } else if (bonusFood && newHead.x === bonusFood.x && newHead.y === bonusFood.y) {
      scoreRef.current += BONUS_FOOD_POINTS;
      setScore(scoreRef.current);
      bonusFoodRef.current = null;
    } else {
      snake.pop();
    }

    return true;
  }, [generateFood]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const snake = snakeRef.current;
    const food = foodRef.current;
    const bonusFood = bonusFoodRef.current;

    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    if (food) {
      const foodColor = food.isBonus ? COLORS.bonusFood : COLORS.food;
      const glowColor = food.isBonus ? COLORS.bonusFoodGlow : COLORS.foodGlow;

      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 15;

      ctx.fillStyle = foodColor;
      ctx.beginPath();
      ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.shadowBlur = 0;
    }

    if (bonusFood) {
      ctx.shadowColor = COLORS.bonusFoodGlow;
      ctx.shadowBlur = 20;

      ctx.fillStyle = COLORS.bonusFood;
      ctx.beginPath();
      ctx.arc(
        bonusFood.x * CELL_SIZE + CELL_SIZE / 2,
        bonusFood.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 1,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.shadowBlur = 0;
    }

    snake.forEach((segment, index) => {
      const isHead = index === 0;

      if (isHead) {
        ctx.shadowColor = COLORS.snakeGlow;
        ctx.shadowBlur = 10;
      }

      ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snakeBody;

      const x = segment.x * CELL_SIZE + 1;
      const y = segment.y * CELL_SIZE + 1;
      const size = CELL_SIZE - 2;
      const radius = isHead ? 6 : 4;

      ctx.beginPath();
      ctx.roundRect(x, y, size, size, radius);
      ctx.fill();

      ctx.shadowBlur = 0;
    });
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState !== SNAKE_GAME_STATES.PLAYING) return;

    const continueGame = moveSnake();

    if (!continueGame) {
      setGameState(SNAKE_GAME_STATES.GAME_OVER);
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current);
        localStorage.setItem(STORAGE_KEYS.SNAKE_HIGH_SCORE, scoreRef.current.toString());
        debugLog('Saved Snake high score:', scoreRef.current);
      }
      return;
    }

    draw();

    gameLoopRef.current = setTimeout(gameLoop, getGameSpeed());
  }, [gameState, moveSnake, draw, getGameSpeed, highScore]);

  useEffect(() => {
    if (gameState === SNAKE_GAME_STATES.PLAYING) {
      gameLoopRef.current = setTimeout(gameLoop, getGameSpeed());
    }

    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop, getGameSpeed]);

  useEffect(() => {
    if (gameState === SNAKE_GAME_STATES.START) {
      initGame();
      draw();
    }
  }, [gameState, initGame, draw]);

  const changeDirection = useCallback((newDirection) => {
    if (!newDirection) return;

    const currentDirection = directionRef.current;

    if (OPPOSITE_DIRECTIONS[newDirection] === currentDirection) {
      return;
    }

    nextDirectionRef.current = newDirection;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const direction = KEY_MAPPINGS[e.key];

      if (direction) {
        e.preventDefault();

        if (gameState === SNAKE_GAME_STATES.START) {
          setGameState(SNAKE_GAME_STATES.PLAYING);
        }

        changeDirection(direction);
      }

      // Enter key to start game from start menu
      if (e.key === 'Enter' && gameState === SNAKE_GAME_STATES.START && !showHelp) {
        e.preventDefault();
        setGameState(SNAKE_GAME_STATES.PLAYING);
      }

      if (e.key === ' ') {
        e.preventDefault();
        if (gameState === SNAKE_GAME_STATES.START) {
          setGameState(SNAKE_GAME_STATES.PLAYING);
        } else if (gameState === SNAKE_GAME_STATES.PLAYING) {
          setGameState(SNAKE_GAME_STATES.PAUSED);
        } else if (gameState === SNAKE_GAME_STATES.PAUSED) {
          setGameState(SNAKE_GAME_STATES.PLAYING);
        }
      }

      if (e.key === 'p' || e.key === 'P') {
        if (gameState === SNAKE_GAME_STATES.PLAYING) {
          setGameState(SNAKE_GAME_STATES.PAUSED);
        } else if (gameState === SNAKE_GAME_STATES.PAUSED) {
          setGameState(SNAKE_GAME_STATES.PLAYING);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, changeDirection, showHelp]);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipe = 30;

    if (gameState === SNAKE_GAME_STATES.START) {
      setGameState(SNAKE_GAME_STATES.PLAYING);
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipe) {
        changeDirection(deltaX > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(deltaY) > minSwipe) {
        changeDirection(deltaY > 0 ? 'DOWN' : 'UP');
      }
    }
  }, [gameState, changeDirection]);

  const handleNewGame = useCallback(() => {
    initGame();
    setGameState(SNAKE_GAME_STATES.PLAYING);
  }, [initGame]);

  const handleResume = useCallback(() => {
    setGameState(SNAKE_GAME_STATES.PLAYING);
  }, []);

  const handlePause = useCallback(() => {
    setGameState(SNAKE_GAME_STATES.PAUSED);
  }, []);

  const handlePauseToggle = useCallback(() => {
    if (gameState === SNAKE_GAME_STATES.PLAYING) {
      setGameState(SNAKE_GAME_STATES.PAUSED);
    } else if (gameState === SNAKE_GAME_STATES.PAUSED) {
      setGameState(SNAKE_GAME_STATES.PLAYING);
    }
  }, [gameState]);

  const handleStartGame = useCallback(() => {
    initGame();
    setGameState(SNAKE_GAME_STATES.PLAYING);
  }, [initGame]);

  return (
    <div
      className="snake-game-container flex flex-col items-center justify-center h-screen overflow-hidden p-4 bg-[#0a0a0a]"
      style={{ touchAction: 'none', overscrollBehavior: 'none' }}
    >
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/15 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Start Menu Overlay */}
      {gameState === SNAKE_GAME_STATES.START && (
        <div className="fixed inset-0 glass-overlay flex flex-col items-center justify-center z-50 p-3 sm:p-4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-green-500/20 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]"></div>
          </div>

          <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-md w-full mx-3 sm:mx-4">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] rounded-2xl sm:rounded-3xl pointer-events-none"></div>

            <div className="relative z-10">
              {/* Header Row - Back Button + Title */}
              <div className="flex items-center gap-3 mb-3 sm:mb-4 md:mb-6">
                <button
                  onClick={onBack}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full text-white flex items-center justify-center shadow-lg shadow-green-400/40 hover:scale-105 active:scale-95 transition-transform text-sm sm:text-lg flex-shrink-0"
                  title="Back to Game Selector"
                >
                  <IoArrowBack />
                </button>
                <h1
                  className="game-title text-2xl sm:text-3xl md:text-4xl font-black"
                  style={{ fontFamily: '"Raleway", sans-serif' }}
                >
                  Snake
                </h1>
              </div>

              {/* Description */}
              <div className="glass-stat rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed border-green-500/10 mb-3 sm:mb-4 md:mb-6">
                Use arrow keys or swipe to control the snake. Eat food to grow and score points!
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full">
                <button
                  onClick={handleStartGame}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg sm:rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-green-400/30 text-sm sm:text-base md:text-lg flex items-center justify-center gap-2"
                >
                  Start Game
                </button>
                <button
                  onClick={() => setShowHelp(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 glass-button text-green-400 rounded-lg sm:rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all text-sm sm:text-base md:text-lg border-green-400/30"
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
        gameName="Snake"
        accentColor="green"
        instructions={SNAKE_INSTRUCTIONS}
        controls={SNAKE_CONTROLS}
        tips={SNAKE_TIPS}
      />

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center px-2 sm:px-0">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4 w-full" style={{ maxWidth: 'min(400px, 85vw, calc(100vh - 280px))' }}>
          <button
            onClick={onBack}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full text-white font-bold flex items-center justify-center shadow-lg shadow-green-400/40 hover:scale-105 active:scale-95 transition-transform text-sm sm:text-lg"
          >
            <IoArrowBack />
          </button>

          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
            style={{ fontFamily: '"Raleway", sans-serif' }}
          >
            Snake
          </h1>

          <button
            onClick={handleNewGame}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-md sm:rounded-lg font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-green-400/30 text-xs sm:text-sm"
          >
            New Game
          </button>
        </div>

        {/* Score Row - Glass stat boxes */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4 w-full" style={{ maxWidth: 'min(400px, 85vw, calc(100vh - 280px))' }}>
          <div className="flex gap-2 sm:gap-3">
            <div className="glass-stat border-green-500/20 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-center min-w-[60px] sm:min-w-20">
              <div className="text-[8px] sm:text-[10px] text-green-400 font-semibold uppercase tracking-wider">Score</div>
              <div className="text-base sm:text-xl font-bold text-white">{score}</div>
            </div>
            <div className="glass-stat border-green-500/20 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-center min-w-[60px] sm:min-w-20">
              <div className="text-[8px] sm:text-[10px] text-green-400 font-semibold uppercase tracking-wider">Best</div>
              <div className="text-base sm:text-xl font-bold text-white">{highScore}</div>
            </div>
          </div>

          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 text-right hidden sm:block">
            Eat to <span className="text-green-400 font-bold">grow</span>!
          </p>
        </div>

        {/* Game Canvas - Glass panel */}
        <div
          className="relative glass-green rounded-2xl p-3 mx-auto"
          style={{ width: 'min(400px, 85vw, calc(100vh - 280px))', height: 'min(400px, 85vw, calc(100vh - 280px))' }}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="rounded-lg w-full h-full"
            style={{ imageRendering: 'pixelated' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />

          {/* Paused Overlay */}
          {gameState === SNAKE_GAME_STATES.PAUSED && (
            <div className="absolute inset-0 glass-overlay rounded-2xl flex flex-col items-center justify-center z-10 p-4">
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-500/20 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                <h2
                  className="text-3xl sm:text-4xl font-black text-green-400 text-center"
                  style={{ fontFamily: '"Raleway", sans-serif', textShadow: '0 0 30px rgba(74,222,128,0.5)' }}
                >
                  Paused
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-3 my-2">
                  <div className="glass-stat border-green-500/20 rounded-xl px-4 py-2 text-center min-w-[90px]">
                    <div className="text-[10px] text-green-400 font-semibold uppercase tracking-wider">Score</div>
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

          {/* Game Over Overlay */}
          {gameState === SNAKE_GAME_STATES.GAME_OVER && (
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

                {score === highScore && score > 0 && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold animate-pulse glass-stat px-4 py-2 rounded-full">
                    <IoTrophy className="text-lg" />
                    <span>New High Score!</span>
                    <IoTrophy className="text-lg" />
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 my-2">
                  <div className="glass-stat border-green-500/20 rounded-xl px-4 py-2 text-center min-w-[90px]">
                    <div className="text-[10px] text-green-400 font-semibold uppercase tracking-wider">Score</div>
                    <div className="text-xl font-bold text-white">{score}</div>
                  </div>
                  <div className="glass-stat border-green-500/20 rounded-xl px-4 py-2 text-center min-w-[90px]">
                    <div className="text-[10px] text-green-400 font-semibold uppercase tracking-wider">Best</div>
                    <div className="text-xl font-bold text-white">{highScore}</div>
                  </div>
                </div>

                <div className="flex items-stretch justify-center gap-3 mt-2 w-full max-w-xs">
                  <button
                    onClick={handleNewGame}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-green-400/30 text-sm sm:text-base whitespace-nowrap"
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
        </div>

        {/* Control Buttons - Icon only, consistent position across all games */}
        {(gameState === SNAKE_GAME_STATES.PLAYING || gameState === SNAKE_GAME_STATES.PAUSED) && (
          <div className="flex items-center justify-center gap-3 mt-3 sm:mt-4 w-full" style={{ maxWidth: 'min(400px, 85vw, calc(100vh - 280px))' }}>
            <button
              onClick={handlePauseToggle}
              className={`w-12 h-10 flex items-center justify-center ${gameState === SNAKE_GAME_STATES.PAUSED
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-green-400/30'
                : 'bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-400/30'
                } text-white rounded-lg text-lg hover:scale-105 transition-transform shadow-lg`}
              title={gameState === SNAKE_GAME_STATES.PAUSED ? 'Resume' : 'Pause'}
            >
              {gameState === SNAKE_GAME_STATES.PAUSED ? <IoPlay /> : <IoPause />}
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
        <div className="mt-2 sm:mt-3 text-center w-full" style={{ maxWidth: 'min(400px, 85vw, calc(100vh - 280px))' }}>
          <p className="text-xs sm:text-sm text-gray-500 mb-1">
            <span className="text-green-400 font-semibold">CONTROLS:</span> Arrow keys / WASD / Swipe
          </p>
          <p className="text-[10px] sm:text-xs text-gray-600">
            Press <span className="text-green-400">P</span> or <span className="text-green-400">Space</span> to pause
          </p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
