// ============================================================
// Shared Components (reusable across all games)
// ============================================================
export {
  GameCard,
  GameResultCard,
  HowToPlayModal,
  LoadingScreen,
  // Generic Menu Components
  StartMenu,
  PauseMenu,
  GameOverMenu,
  LevelCompleteMenu,
} from "./shared";

// ============================================================
// UI Components (general purpose)
// ============================================================
export { default as TopBar } from "./TopBar";
export { default as GameSelector } from "./GameSelector";
export { default as DesktopControls } from "./DesktopControls";
export { default as MobileControls } from "./MobileControls";
export { default as MenuOverlay } from "./MenuOverlay";

// ============================================================
// Legacy Brickrush Menu Components
// These are kept for backward compatibility with MenuOverlay
// New games should use the generic shared menu components
// ============================================================
export { default as BrickrushStartMenu } from "./StartMenu";
export { default as BrickrushPauseMenu } from "./PauseMenu";
export { default as BrickrushGameOverMenu } from "./GameOverMenu";
export { default as BrickrushLevelCompleteMenu } from "./LevelCompleteMenu";
