// ============================================
// Core Game Hooks
// ============================================
export { default as useGameLoop } from './useGameLoop';
export { default as useHighScore } from './useHighScore';
export { default as useKeyboard } from './useKeyboard';
export {
  default as useWindowSize,
  useMediaQuery,
  usePrefersReducedMotion,
  usePrefersDarkMode,
  useIsTouchDevice,
} from './useWindowSize';

// ============================================
// State Management Hooks
// ============================================
export {
  default as useGameStateMachine,
  useGameStateMachine as useStateMachine,
  createGameStateMachine,
  GAME_STATES,
} from './useGameStateMachine';

// ============================================
// Control Hooks
// ============================================
export {
  default as useGameControls,
  createGameControls,
  useBrickrushControls,
  use1024Controls,
  useSnakeControls,
  DEFAULT_DIRECTION_KEYS,
  DEFAULT_PAUSE_KEYS,
  DEFAULT_START_KEYS,
  DEFAULT_ACTION_KEYS,
} from './useGameControls';

// ============================================
// Animation Hooks
// ============================================
export { default as useAnimationFrame, useAnimationLoop, useInterval } from './useAnimationFrame';
