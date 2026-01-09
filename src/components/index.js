// ============================================
// Error Handling Components
// ============================================
export { default as GameErrorBoundary, withGameErrorBoundary } from './GameErrorBoundary';

// ============================================
// Transition Components
// ============================================
export { default as LevelTransition, useLevelTransition } from './LevelTransition';

// ============================================
// Shared Components (reusable across all games)
// ============================================
export { default as GameCard } from './GameCard';
export { default as GameResultCard } from './GameResultCard';
export { default as HowToPlayModal } from './HowToPlayModal';
export { default as LoadingScreen } from './LoadingScreen';

// Generic Menu Components (shared across all games)
export { default as StartMenu } from './SharedStartMenu';
export { default as PauseMenu } from './SharedPauseMenu';
export { default as GameOverMenu } from './SharedGameOverMenu';
export { default as LevelCompleteMenu } from './SharedLevelCompleteMenu';

// ============================================
// UI Components (general purpose)
// ============================================
export { default as GameSelector } from './GameSelector';

// ============================================
// Icons
// ============================================
export {
  BrickrushIcon,
  Game1024Icon,
  SnakeIcon,
  GameControllerIcon,
  PuzzleIcon,
  GameIcons,
} from './icons';
