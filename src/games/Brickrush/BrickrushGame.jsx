import { useState, useEffect, useCallback, useRef } from "react";
import { GAME_STATES, INITIAL_LIVES } from "../../constants";
import { useHighScore, useWindowSize } from "../../hooks";
import { STORAGE_KEYS } from "../../config";
import {
  TopBar,
  MenuOverlay,
  DesktopControls,
  MobileControls,
} from "../../components";
import { useBrickrushGame } from "./hooks/useBrickrushGame";
import BrickrushCanvas from "./components/BrickrushCanvas";

/**
 * BrickrushGame - Main component for the Brickrush game
 * Manages game state and composes UI components
 */
const BrickrushGame = ({ onBack }) => {
  // Game state
  const [gameState, setGameState] = useState(GAME_STATES.START_MENU);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [ballLaunched, setBallLaunched] = useState(false);

  // UI state
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [canvasFadeIn, setCanvasFadeIn] = useState(false);

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

  // Handle level complete with transition
  const handleLevelComplete = useCallback((onComplete) => {
    const gameContainer = document.querySelector(".game-container");
    if (gameContainer) {
      const overlay = document.createElement("div");
      overlay.className = "level-transition-overlay";
      overlay.style.opacity = "0";
      gameContainer.appendChild(overlay);

      setTimeout(() => {
        overlay.style.opacity = "1";
        setTimeout(() => {
          onComplete();
          overlay.style.opacity = "0";
          setTimeout(() => {
            overlay.remove();
          }, 500);
        }, 500);
      }, 10);
    } else {
      onComplete();
    }
  }, []);

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

  // Handle start game
  const handleStart = useCallback(() => {
    setIsFadingOut(true);

    setTimeout(() => {
      setScore(0);
      setLives(INITIAL_LIVES);
      setCurrentLevel(1);
      setBallLaunched(false);
      initGame();
      setGameState(GAME_STATES.PLAYING);
      setIsFadingOut(false);
      setCanvasFadeIn(true);

      setTimeout(() => {
        setCanvasFadeIn(false);
      }, 800);
    }, 600);
  }, [initGame]);

  // Handle pause
  const handlePause = useCallback(() => {
    setGameState(GAME_STATES.PAUSED);
  }, []);

  // Handle resume
  const handleResume = useCallback(() => {
    setIsFadingOut(true);

    setTimeout(() => {
      setGameState(GAME_STATES.PLAYING);
      setIsFadingOut(false);
    }, 600);
  }, []);

  // Handle restart
  const handleRestart = useCallback(() => {
    setIsFadingOut(true);

    setTimeout(() => {
      setScore(0);
      setLives(INITIAL_LIVES);
      setCurrentLevel(1);
      setBallLaunched(false);
      initGame();
      setGameState(GAME_STATES.PLAYING);
      setIsFadingOut(false);
      setCanvasFadeIn(true);

      setTimeout(() => {
        setCanvasFadeIn(false);
      }, 800);
    }, 600);
  }, [initGame]);

  // Handle main menu
  const handleMainMenu = useCallback(() => {
    setIsFadingOut(true);

    setTimeout(() => {
      setGameState(GAME_STATES.START_MENU);
      setScore(0);
      setLives(INITIAL_LIVES);
      setCurrentLevel(1);
      setBallLaunched(false);
      setIsFadingOut(false);
    }, 600);
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
    </div>
  );
};

export default BrickrushGame;
