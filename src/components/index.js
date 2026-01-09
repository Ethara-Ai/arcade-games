// ============================================
// Error Handling Components
// ============================================
export {
  default as GameErrorBoundary,
  withGameErrorBoundary,
} from "./GameErrorBoundary";

// ============================================
// Transition Components
// ============================================
export {
  default as LevelTransition,
  useLevelTransition,
} from "./LevelTransition";

// ============================================
// Shared Components (reusable across all games)
// ============================================
export { default as GameCard } from "./GameCard";
export { default as GameResultCard } from "./GameResultCard";
export { default as HowToPlayModal } from "./HowToPlayModal";
export { default as LoadingScreen } from "./LoadingScreen";

// Generic Menu Components (from shared, renamed to avoid conflicts)
export { default as StartMenu } from "./SharedStartMenu";
export { default as PauseMenu } from "./SharedPauseMenu";
export { default as GameOverMenu } from "./SharedGameOverMenu";
export { default as LevelCompleteMenu } from "./SharedLevelCompleteMenu";

// ============================================
// UI Components (general purpose)
// ============================================
export { default as TopBar } from "./TopBar";
export { default as GameSelector } from "./GameSelector";
export { default as DesktopControls } from "./DesktopControls";
export { default as MobileControls } from "./MobileControls";
export { default as MenuOverlay } from "./MenuOverlay";

// ============================================
// Legacy Brickrush Menu Components
// These are kept for backward compatibility with MenuOverlay
// New games should use the generic shared menu components
// ============================================
export { default as BrickrushStartMenu } from "./StartMenu";
export { default as BrickrushPauseMenu } from "./PauseMenu";
export { default as BrickrushGameOverMenu } from "./GameOverMenu";
export { default as BrickrushLevelCompleteMenu } from "./LevelCompleteMenu";
