import { useState, useEffect, useCallback, useRef } from "react";
import {
  GAME_STATES,
  INITIAL_LIVES,
  TRANSITION_TIMINGS,
} from "../../constants";
import { useHighScore, useWindowSize } from "../../hooks";
import { STORAGE_KEYS } from "../../config";
import {
  TopBar,
  MenuOverlay,
  DesktopControls,
  MobileControls,
  GameErrorBoundary,
} from "../../components";
import LevelTransition, {
  useLevelTransition,
} from "../../components/LevelTransition";
import { useBrickrushGame } from "./useBrickrushGame";
import BrickrushCanvas from "./BrickrushCanvas";

/**
 * BrickrushGame - Main component for the Brickrush game
 * Manages game state and composes UI components
 *
 * Refactored to use proper React patterns:
 * - No direct DOM manipulation
 * - Centralized timing constants
 * - Error boundary protection
 * - Proper state management for transitions
 */
const BrickrushGameContent = ({ onBack }) => {
  // Game state
  const [gameState, setGameState] = useState(GAME_STATES.START_MENU);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [ballLaunched, setBallLaunched] = useState(false);

  // UI state for transitions
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [canvasFadeIn, setCanvasFadeIn] = useState(false);

  // Level transition callback ref
  const levelTransitionCallbackRef = useRef(null);

  // Level transition hook (replaces DOM manipulation)
  const { transitionProps, startTransition } = useLevelTransition({
    onMidpoint: () => {
      if (levelTransitionCallbackRef.current) {
        levelTransitionCallbackRef.current();
        levelTransitionCallbackRef.current = null;
      }
    },
    onComplete: () => {
      // Transition complete, nothing extra needed
    },
  });

  // Keyboard state
  const [keys, setKeys] = useState({});

  // Canvas ref
  const canvasRef = useRef(null);

  // Hooks
  const { highScore, updateHighScore } = useHighScore(
    STORAGE_KEYS.BRICKRUSH_HIGH_SCORE,
    "Brickrush",
  );
  const { isMobile, isDesktop } = useWindowSize();

  // Handle level complete with React-managed transition (no DOM manipulation)
  const handleLevelComplete = useCallback(
    (onComplete) => {
      // Store callback and trigger transition via hook
      levelTransitionCallbackRef.current = onComplete;
      startTransition();
    },
    [startTransition],
  );

  // Game logic hook
  const {
    initGame,
    launchBall,
    updateGame,
    updatePaddlePosition,
    getGameObjects,
    startNextLevel,
  } = useBrickrushGame({
    gameState,
    score,
    lives,
    currentLevel,
    ballLaunched,
    keys,
    onScoreChange: setScore,
    onLivesChange: setLives,
    onLevelChange: setCurrentLevel,
    onBallLaunchedChange: setBallLaunched,
    onGameOver: useCallback(() => {
      updateHighScore(score);
      setGameState(GAME_STATES.GAME_OVER);
    }, [score, updateHighScore]),
    onLevelComplete: handleLevelComplete,
  });

  // Handle start game with proper timing constants
  const handleStart = useCallback(() => {
    setIsFadingOut(true);

    const fadeOutTimer = setTimeout(() => {
      setScore(0);
      setLives(INITIAL_LIVES);
      setCurrentLevel(1);
      setBallLaunched(false);
      initGame();
      setGameState(GAME_STATES.PLAYING);
      setIsFadingOut(false);
      setCanvasFadeIn(true);

      const fadeInTimer = setTimeout(() => {
        setCanvasFadeIn(false);
      }, TRANSITION_TIMINGS.CANVAS_FADE_IN);

      return () => clearTimeout(fadeInTimer);
    }, TRANSITION_TIMINGS.MENU_FADE_OUT);

    return () => clearTimeout(fadeOutTimer);
  }, [initGame]);

  // Handle pause
  const handlePause = useCallback(() => {
    setGameState(GAME_STATES.PAUSED);
  }, []);

  // Handle resume with timing constants
  const handleResume = useCallback(() => {
    setIsFadingOut(true);

    const timer = setTimeout(() => {
      setGameState(GAME_STATES.PLAYING);
      setIsFadingOut(false);
    }, TRANSITION_TIMINGS.MENU_FADE_OUT);

    return () => clearTimeout(timer);
  }, []);

  // Handle restart with timing constants
  const handleRestart = useCallback(() => {
    setIsFadingOut(true);

    const fadeOutTimer = setTimeout(() => {
      setScore(0);
      setLives(INITIAL_LIVES);
      setCurrentLevel(1);
      setBallLaunched(false);
      initGame();
      setGameState(GAME_STATES.PLAYING);
      setIsFadingOut(false);
      setCanvasFadeIn(true);

      const fadeInTimer = setTimeout(() => {
        setCanvasFadeIn(false);
      }, TRANSITION_TIMINGS.CANVAS_FADE_IN);

      return () => clearTimeout(fadeInTimer);
    }, TRANSITION_TIMINGS.MENU_FADE_OUT);

    return () => clearTimeout(fadeOutTimer);
  }, [initGame]);

  // Handle main menu with timing constants
  const handleMainMenu = useCallback(() => {
    setIsFadingOut(true);

    const timer = setTimeout(() => {
      setGameState(GAME_STATES.START_MENU);
      setScore(0);
      setLives(INITIAL_LIVES);
      setCurrentLevel(1);
      setBallLaunched(false);
      setIsFadingOut(false);
    }, TRANSITION_TIMINGS.MENU_FADE_OUT);

    return () => clearTimeout(timer);
  }, []);

  // Handle ball launch (for mobile)
  const handleLaunchBall = useCallback(() => {
    if (gameState === GAME_STATES.PLAYING && !ballLaunched) {
      launchBall();
    }
  }, [gameState, ballLaunched, launchBall]);

  // Handle pause/resume toggle
  const handlePauseResume = useCallback(() => {
    if (gameState === GAME_STATES.PLAYING) {
      handlePause();
    } else if (gameState === GAME_STATES.PAUSED) {
      handleResume();
    }
  }, [gameState, handlePause, handleResume]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys((prev) => ({ ...prev, [e.key]: true }));

      // Handle pause
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        if (gameState === GAME_STATES.PLAYING) {
          handlePause();
        } else if (gameState === GAME_STATES.PAUSED) {
          handleResume();
        }
      }

      // Handle Enter key for menu navigation
      if (e.key === "Enter") {
        if (gameState === GAME_STATES.START_MENU) {
          handleStart();
        } else if (gameState === GAME_STATES.GAME_OVER) {
          handleRestart();
        } else if (gameState === GAME_STATES.PAUSED) {
          handleResume();
        }
      }

      // Handle space for ball launch
      if (e.key === " " && gameState === GAME_STATES.PLAYING && !ballLaunched) {
        launchBall();
      }
    };

    const handleKeyUp = (e) => {
      setKeys((prev) => ({ ...prev, [e.key]: false }));
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    gameState,
    ballLaunched,
    handlePause,
    handleResume,
    handleStart,
    handleRestart,
    launchBall,
  ]);

  // hasBalls is true when game is playing
  const hasBalls = gameState === GAME_STATES.PLAYING;

  return (
    <div className="game-container">
      {/* Top Bar */}
      <TopBar
        gameState={gameState}
        score={score}
        level={currentLevel}
        lives={lives}
      />

      {/* Desktop Controls */}
      {isDesktop && (
        <DesktopControls
          gameState={gameState}
          ballLaunched={ballLaunched}
          hasBalls={hasBalls}
          onPauseResume={handlePauseResume}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
          onBack={onBack}
        />
      )}

      {/* Game Canvas */}
      <BrickrushCanvas
        ref={canvasRef}
        gameState={gameState}
        ballLaunched={ballLaunched}
        fadeIn={canvasFadeIn}
        getGameObjects={getGameObjects}
        updateGame={updateGame}
        updatePaddlePosition={updatePaddlePosition}
        launchBall={launchBall}
      />

      {/* Mobile Controls */}
      {isMobile && (
        <MobileControls
          gameState={gameState}
          ballLaunched={ballLaunched}
          hasBalls={hasBalls}
          onPause={handlePause}
          onBack={onBack}
          onLaunchBall={handleLaunchBall}
        />
      )}

      {/* Menu Overlay */}
      <MenuOverlay
        gameState={gameState}
        score={score}
        highScore={highScore}
        isFadingOut={isFadingOut}
        onStart={handleStart}
        onResume={handleResume}
        onRestart={handleRestart}
        onMainMenu={handleMainMenu}
        onNextLevel={startNextLevel}
        onBack={onBack}
      />

      {/* Level Transition Overlay - React-managed via hook */}
      <LevelTransition
        {...transitionProps}
        accentColor="cyan"
        message="Level Complete!"
      />
    </div>
  );
};

/**
 * BrickrushGame - Wrapped with error boundary for crash protection
 */
const BrickrushGame = ({ onBack }) => {
  return (
    <GameErrorBoundary
      gameName="Brickrush"
      accentColor="cyan"
      onBack={onBack}
      showErrorDetails={import.meta.env.DEV}
    >
      <BrickrushGameContent onBack={onBack} />
    </GameErrorBoundary>
  );
};

export default BrickrushGame;
