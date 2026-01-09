import { useState, useEffect, useCallback } from "react";
import { LoadingScreen, GameSelector } from "./components";
import { BrickrushGame, Game1024, SnakeGame } from "./games";

// App-level game modes
const APP_MODES = {
  SELECTOR: "SELECTOR",
  BRICKRUSH: "BRICKRUSH",
  GAME_1024: "GAME_1024",
  SNAKE: "SNAKE",
};

/**
 * App - Main application component
 * Acts as a clean router between different games
 */
function App() {
  // App mode - which game/screen is selected
  const [appMode, setAppMode] = useState(APP_MODES.SELECTOR);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Handle game selection
  const handleSelectGame = useCallback((game) => {
    switch (game) {
      case "brickrush":
        setAppMode(APP_MODES.BRICKRUSH);
        break;
      case "1024":
        setAppMode(APP_MODES.GAME_1024);
        break;
      case "snake":
        setAppMode(APP_MODES.SNAKE);
        break;
      default:
        setAppMode(APP_MODES.SELECTOR);
    }
  }, []);

  // Handle back to selector
  const handleBackToSelector = useCallback(() => {
    setAppMode(APP_MODES.SELECTOR);
  }, []);

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Render loading screen
  if (isLoading) {
    return <LoadingScreen isVisible={true} />;
  }

  // Render based on current mode
  switch (appMode) {
    case APP_MODES.BRICKRUSH:
      return <BrickrushGame onBack={handleBackToSelector} />;

    case APP_MODES.GAME_1024:
      return <Game1024 onBack={handleBackToSelector} />;

    case APP_MODES.SNAKE:
      return <SnakeGame onBack={handleBackToSelector} />;

    case APP_MODES.SELECTOR:
    default:
      return <GameSelector onSelectGame={handleSelectGame} />;
  }
}

export default App;
