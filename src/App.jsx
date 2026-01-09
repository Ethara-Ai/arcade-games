import { useState, useEffect, useCallback } from 'react';
import { LoadingScreen, GameSelector, GameErrorBoundary } from './components';
import { BrickrushGame, Game1024, SnakeGame } from './games';
import { TRANSITION_TIMINGS } from './constants';

// App-level game modes
const APP_MODES = {
  SELECTOR: 'SELECTOR',
  BRICKRUSH: 'BRICKRUSH',
  GAME_1024: 'GAME_1024',
  SNAKE: 'SNAKE',
};

/**
 * AppContent - Main application content component
 * Acts as a clean router between different games
 *
 * Separated from App wrapper to allow top-level error boundary
 */
function AppContent() {
  // App mode - which game/screen is selected
  const [appMode, setAppMode] = useState(APP_MODES.SELECTOR);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Handle game selection
  const handleSelectGame = useCallback((game) => {
    switch (game) {
      case 'brickrush':
        setAppMode(APP_MODES.BRICKRUSH);
        break;
      case '1024':
        setAppMode(APP_MODES.GAME_1024);
        break;
      case 'snake':
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

  // Loading screen timer - using centralized timing constant
  useEffect(() => {
    const loadingDuration = TRANSITION_TIMINGS?.LOADING_SCREEN || 3500;

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingDuration);

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

/**
 * App - Root application component wrapped with error boundary
 *
 * Provides top-level crash protection for the entire application.
 * Individual games also have their own error boundaries for more
 * granular error handling.
 */
function App() {
  // Handler for when user clicks back from app-level error
  const handleAppError = useCallback(() => {
    // Reload the page to recover from catastrophic errors
    window.location.reload();
  }, []);

  return (
    <GameErrorBoundary
      gameName="Arcade Games"
      accentColor="cyan"
      onBack={handleAppError}
      showErrorDetails={import.meta.env.DEV}
    >
      <AppContent />
    </GameErrorBoundary>
  );
}

export default App;
