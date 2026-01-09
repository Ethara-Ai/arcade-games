import { useEffect, useState, useCallback, useRef } from 'react';
import { IoArrowBack, IoHelpCircle, IoPause, IoPlay, IoRefresh } from 'react-icons/io5';
import { SNAKE_GAME_STATES } from '../../constants';
import {
  StartMenu,
  PauseMenu,
  GameOverMenu,
  HowToPlayModal,
  GameErrorBoundary,
} from '../../components';
import { useSnakeGame } from './useSnakeGame';
import SnakeCanvas from './SnakeCanvas';

// Game-specific content for menus
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
  { key: 'Pause Menu', action: 'Adjust speed' },
];

const SNAKE_TIPS = [
  'Plan your path to avoid trapping yourself',
  "Use the edges carefully - don't get cornered",
  'Grab bonus food quickly for extra points',
  'Pause the game to adjust speed to your skill level',
];

/**
 * SnakeGameContent - Internal component for the Snake game
 * Manages game state and composes UI components
 *
 * Separated from wrapper to allow error boundary to catch errors
 */
const SnakeGameContent = ({ onBack }) => {
  // Game logic hook
  const {
    gameState,
    score,
    highScore,
    snakeLength,
    speedLevel,
    gameLoopRef,
    handleStartGame,
    handleNewGame,
    handleResume,
    handlePauseToggle,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
    handleGameOver,
    moveSnake,
    getGameSpeed,
    getGameObjects,
    increaseSpeed,
    decreaseSpeed,
  } = useSnakeGame();

  // UI state
  const [showHelp, setShowHelp] = useState(false);

  // Canvas ref
  const canvasRef = useRef(null);

  // Keyboard controls with cleanup
  useEffect(() => {
    const onKeyDown = (e) => {
      handleKeyDown(e, showHelp);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeyDown, showHelp]);

  // Touch handlers for game area
  useEffect(() => {
    const handleTouchStartWrapper = (e) => {
      if (gameState === SNAKE_GAME_STATES.PLAYING) {
        handleTouchStart(e);
      }
    };

    const handleTouchEndWrapper = (e) => {
      if (gameState === SNAKE_GAME_STATES.PLAYING) {
        handleTouchEnd(e);
      }
    };

    document.addEventListener('touchstart', handleTouchStartWrapper, {
      passive: true,
    });
    document.addEventListener('touchend', handleTouchEndWrapper, {
      passive: true,
    });

    return () => {
      document.removeEventListener('touchstart', handleTouchStartWrapper);
      document.removeEventListener('touchend', handleTouchEndWrapper);
    };
  }, [gameState, handleTouchStart, handleTouchEnd]);

  // Check if game is active (playing or paused)
  const isGameActive =
    gameState === SNAKE_GAME_STATES.PLAYING || gameState === SNAKE_GAME_STATES.PAUSED;

  const isPaused = gameState === SNAKE_GAME_STATES.PAUSED;

  // Handle main menu navigation
  const handleMainMenu = useCallback(() => {
    onBack();
  }, [onBack]);

  // Handle help modal open
  const handleOpenHelp = useCallback(() => {
    setShowHelp(true);
  }, []);

  // Handle help modal close
  const handleCloseHelp = useCallback(() => {
    setShowHelp(false);
  }, []);

  return (
    <div
      className="snake-game-container flex flex-col items-center justify-center min-h-screen overflow-hidden p-4 bg-[#0a0a0a]"
      style={{
        touchAction: 'none',
        overscrollBehavior: 'none',
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Header with controls - visible when game is active */}
      {isGameActive && (
        <div className="relative z-20 flex items-center justify-between w-full max-w-[min(90vw,400px)] mb-4">
          {/* Back button - Step 3: Add responsive sizing w-9/h-9 for mobile, w-10/h-10 for larger screens 
              to ensure circular shape is maintained */}
          <button
            onClick={onBack}
            className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600/40 rounded-full text-white flex items-center justify-center shadow-lg shadow-black/40 hover:brightness-110 hover:border-gray-500/50 active:brightness-90 transition-all flex-shrink-0"
            title="Back to Game Selector"
            aria-label="Back to Game Selector"
          >
            <IoArrowBack />
          </button>

          {/* Title */}
          <h1
            className="text-2xl sm:text-3xl font-black text-green-400"
            style={{
              fontFamily: '"Raleway", sans-serif',
              textShadow: '0 0 30px rgba(74, 222, 128, 0.5)',
            }}
          >
            Snake
          </h1>

          {/* Action buttons - responsive sizing to maintain circular shape on mobile */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenHelp}
              className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] glass-button rounded-full text-green-400 flex items-center justify-center hover:brightness-110 active:brightness-90 transition-all flex-shrink-0"
              title="How to Play"
              aria-label="How to Play"
            >
              <IoHelpCircle className="text-xl" />
            </button>
            <button
              onClick={handlePauseToggle}
              className={`w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] rounded-full text-white flex items-center justify-center shadow-lg hover:brightness-110 active:brightness-90 transition-all flex-shrink-0 ${
                isPaused
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-400/40'
                  : 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-400/40'
              }`}
              title={isPaused ? 'Resume' : 'Pause'}
              aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
            >
              {isPaused ? <IoPlay /> : <IoPause />}
            </button>
            <button
              onClick={handleNewGame}
              className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] bg-gradient-to-br from-green-400 to-emerald-500 rounded-full text-white flex items-center justify-center shadow-lg shadow-green-400/40 hover:brightness-110 active:brightness-90 transition-all flex-shrink-0"
              title="New Game"
              aria-label="Start New Game"
            >
              <IoRefresh />
            </button>
          </div>
        </div>
      )}

      {/* Score Display - visible when game is active */}
      {isGameActive && (
        <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 w-full max-w-[min(90vw,400px)] mb-4">
          <div className="glass-stat border-green-500/20 rounded-lg px-3 py-2 text-center flex-1">
            <div className="text-[10px] text-green-400 font-semibold uppercase tracking-wider">
              Score
            </div>
            <div className="text-lg sm:text-xl font-bold text-white">{score}</div>
          </div>
          <div className="glass-stat border-green-500/20 rounded-lg px-3 py-2 text-center flex-1">
            <div className="text-[10px] text-green-400 font-semibold uppercase tracking-wider">
              Best
            </div>
            <div className="text-lg sm:text-xl font-bold text-white">{highScore}</div>
          </div>
          <div className="glass-stat border-green-500/20 rounded-lg px-3 py-2 text-center flex-1">
            <div className="text-[10px] text-green-400 font-semibold uppercase tracking-wider">
              Length
            </div>
            <div className="text-lg sm:text-xl font-bold text-green-400">{snakeLength}</div>
          </div>
        </div>
      )}

      {/* Game Canvas - visible when game is active */}
      {isGameActive && (
        <div className="relative z-10">
          <SnakeCanvas
            ref={canvasRef}
            gameState={gameState}
            getGameObjects={getGameObjects}
            moveSnake={moveSnake}
            getGameSpeed={getGameSpeed}
            onGameOver={handleGameOver}
            gameLoopRef={gameLoopRef}
          />

          {/* Mobile Instructions */}
          <p className="text-gray-500 text-xs text-center mt-4 sm:hidden">
            Swipe to change direction
          </p>

          {/* Desktop Instructions */}
          <p className="text-gray-500 text-xs text-center mt-4 hidden sm:block">
            Use arrow keys to change direction • P or Space to pause
          </p>
        </div>
      )}

      {/* Start Menu */}
      {gameState === SNAKE_GAME_STATES.START && (
        <StartMenu
          title="Snake"
          description="Guide the snake to eat food and grow longer! Avoid hitting the walls or your own tail. The snake speeds up as you eat more food. How long can you survive?"
          accentColor="green"
          onStart={handleStartGame}
          onBack={onBack}
          instructions={SNAKE_INSTRUCTIONS}
          controls={SNAKE_CONTROLS}
          tips={SNAKE_TIPS}
        />
      )}

      {/* Pause Menu - includes speed control for adjusting game speed */}
      {gameState === SNAKE_GAME_STATES.PAUSED && (
        <PauseMenu
          title="Paused"
          accentColor="green"
          onResume={handleResume}
          onRestart={handleNewGame}
          onMainMenu={handleMainMenu}
          speedControl={{
            speedLevel,
            minSpeed: 1,
            maxSpeed: 5,
            onIncrease: increaseSpeed,
            onDecrease: decreaseSpeed,
            label: 'Speed',
          }}
        />
      )}

      {/* Game Over Menu */}
      {gameState === SNAKE_GAME_STATES.GAME_OVER && (
        <GameOverMenu
          title="Game Over"
          accentColor="green"
          score={score}
          highScore={highScore}
          onRestart={handleNewGame}
          onMainMenu={handleMainMenu}
          stats={[
            { label: 'Score', value: score },
            { label: 'Best', value: highScore },
            { label: 'Length', value: snakeLength },
          ]}
        />
      )}

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={showHelp}
        onClose={handleCloseHelp}
        gameName="Snake"
        accentColor="green"
        instructions={SNAKE_INSTRUCTIONS}
        controls={SNAKE_CONTROLS}
        tips={SNAKE_TIPS}
      />
    </div>
  );
};

/**
 * SnakeGame - Container component wrapped with error boundary
 * Provides crash protection for the game
 */
const SnakeGame = ({ onBack }) => {
  return (
    <GameErrorBoundary
      gameName="Snake"
      accentColor="green"
      onBack={onBack}
      showErrorDetails={import.meta.env.DEV}
    >
      <SnakeGameContent onBack={onBack} />
    </GameErrorBoundary>
  );
};

export default SnakeGame;
