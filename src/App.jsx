import { useState, useEffect, useCallback, useRef } from "react";
import { GAME_STATES, INITIAL_LIVES } from "./constants";
import useHighScore from "./hooks/useHighScore";
import useWindowSize from "./hooks/useWindowSize";
import LoadingScreen from "./components/LoadingScreen";
import TopBar from "./components/TopBar";
import MenuOverlay from "./components/MenuOverlay";
import DesktopControls from "./components/DesktopControls";
import MobileControls from "./components/MobileControls";
import GameCanvas from "./components/GameCanvas";
import GameSelector from "./components/GameSelector";
import { Game1024 } from "./games";
import { SnakeGame } from "./games";

// App-level game modes
const APP_MODES = {
  SELECTOR: "SELECTOR",
  BRICKRUSH: "BRICKRUSH",
  GAME_1024: "GAME_1024",
  SNAKE: "SNAKE",
};

function App() {
  // App mode - which game is selected
  const [appMode, setAppMode] = useState(APP_MODES.SELECTOR);

  // Brickrush game state
  const [gameState, setGameState] = useState(GAME_STATES.START_MENU);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [ballLaunched, setBallLaunched] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [canvasFadeIn, setCanvasFadeIn] = useState(false);

  // Keyboard state
  const [keys, setKeys] = useState({});

  // Refs
  const gameCanvasRef = useRef(null);

  // Hooks
  const { highScore, updateHighScore, loadHighScore } = useHighScore();
  const { isMobile, isDesktop } = useWindowSize();

  // Handle game selection
  const handleSelectGame = useCallback((game) => {
    if (game === "brickrush") {
      setAppMode(APP_MODES.BRICKRUSH);
      setGameState(GAME_STATES.START_MENU);
    } else if (game === "1024") {
      setAppMode(APP_MODES.GAME_1024);
    } else if (game === "snake") {
      setAppMode(APP_MODES.SNAKE);
    }
  }, []);

  // Handle back to selector
  const handleBackToSelector = useCallback(() => {
    setAppMode(APP_MODES.SELECTOR);
    setGameState(GAME_STATES.START_MENU);
    setScore(0);
    setLives(INITIAL_LIVES);
    setCurrentLevel(1);
    setBallLaunched(false);
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    setScore(0);
    setLives(INITIAL_LIVES);
    setCurrentLevel(1);
    setBallLaunched(false);

    if (gameCanvasRef.current) {
      gameCanvasRef.current.initGame();
    }
  }, []);

  // Handle start game
  const handleStart = useCallback(() => {
    setIsFadingOut(true);

    setTimeout(() => {
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
      initGame();
      setGameState(GAME_STATES.PLAYING);
      setIsFadingOut(false);
      setCanvasFadeIn(true);

      setTimeout(() => {
        setCanvasFadeIn(false);
      }, 800);
    }, 600);
  }, [initGame]);

  // Handle keyboard events (only for Brickrush)
  useEffect(() => {
    if (appMode !== APP_MODES.BRICKRUSH) return;

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
        if (gameCanvasRef.current) {
          gameCanvasRef.current.launchBall();
        }
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
  }, [appMode, gameState, ballLaunched, handlePause, handleResume, handleStart, handleRestart]);

  // Loading screen timer
  useEffect(() => {
    loadHighScore();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [loadHighScore]);

  // Handle main menu - redirect to game selector page
  const handleMainMenu = useCallback(() => {
    setIsFadingOut(true);

    setTimeout(() => {
      // Step: Navigate back to the game selector where all game options are shown
      setAppMode(APP_MODES.SELECTOR);
      setGameState(GAME_STATES.START_MENU);
      setScore(0);
      setLives(INITIAL_LIVES);
      setCurrentLevel(1);
      setBallLaunched(false);
      setIsFadingOut(false);
    }, 600);
  }, []);

  // Handle game over
  const handleGameOver = useCallback(() => {
    updateHighScore(score);
    setGameState(GAME_STATES.GAME_OVER);
  }, [score, updateHighScore]);

  // Handle next level
  const handleNextLevel = useCallback(() => {
    if (gameCanvasRef.current) {
      gameCanvasRef.current.startNextLevel();
    }
  }, []);

  // Handle ball launch (for mobile)
  const handleLaunchBall = useCallback(() => {
    if (gameState === GAME_STATES.PLAYING && !ballLaunched) {
      if (gameCanvasRef.current) {
        gameCanvasRef.current.launchBall();
      }
    }
  }, [gameState, ballLaunched]);

  // Handle pause/resume toggle
  const handlePauseResume = useCallback(() => {
    if (gameState === GAME_STATES.PLAYING) {
      handlePause();
    } else if (gameState === GAME_STATES.PAUSED) {
      handleResume();
    }
  }, [gameState, handlePause, handleResume]);

  // hasBalls is true when game is playing (balls are created when playing state begins)
  const hasBalls = gameState === GAME_STATES.PLAYING;

  // Render loading screen
  if (isLoading) {
    return <LoadingScreen isVisible={true} />;
  }

  // Render game selector
  if (appMode === APP_MODES.SELECTOR) {
    return <GameSelector onSelectGame={handleSelectGame} />;
  }

  // Render 1024 game
  if (appMode === APP_MODES.GAME_1024) {
    return <Game1024 onBack={handleBackToSelector} />;
  }

  // Render Snake game
  if (appMode === APP_MODES.SNAKE) {
    return <SnakeGame onBack={handleBackToSelector} />;
  }

  // Render Brickrush game
  return (
    <div className="game-container">
      {/* Top Bar */}
      <TopBar gameState={gameState} score={score} level={currentLevel} lives={lives} />

      {/* Desktop Controls */}
      {isDesktop && (
        <DesktopControls
          gameState={gameState}
          ballLaunched={ballLaunched}
          hasBalls={hasBalls}
          onPauseResume={handlePauseResume}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
          onBack={handleBackToSelector}
        />
      )}

      {/* Game Canvas */}
      <GameCanvas
        ref={gameCanvasRef}
        gameState={gameState}
        score={score}
        lives={lives}
        currentLevel={currentLevel}
        ballLaunched={ballLaunched}
        onScoreChange={setScore}
        onLivesChange={setLives}
        onLevelChange={setCurrentLevel}
        onBallLaunchedChange={setBallLaunched}
        onGameOver={handleGameOver}
        onNextLevel={handleNextLevel}
        keys={keys}
        fadeIn={canvasFadeIn}
      />

      {/* Mobile Controls */}
      {isMobile && (
        <MobileControls
          gameState={gameState}
          ballLaunched={ballLaunched}
          hasBalls={hasBalls}
          onPause={handlePause}
          onBack={handleBackToSelector}
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
        onNextLevel={handleNextLevel}
        onBack={handleBackToSelector}
      />
    </div>
  );
}

export default App;
