/**
 * Timing Constants
 *
 * Centralizes all timing
-related magic numbers used throughout the application.
 * This makes it easier to maintain consistent animations and adjust timing globally.
 */

// ============================================
// Transition Timings (in milliseconds)
// ============================================

export const TRANSITION_TIMINGS = {
  // Menu fade transitions
  MENU_FADE_OUT: 600,
  MENU_FADE_IN: 600,

  // Canvas/game area transitions
  CANVAS_FADE_IN: 800,
  CANVAS_FADE_OUT: 500,

  // Level transition overlay
  LEVEL_TRANSITION_IN: 500,
  LEVEL_TRANSITION_OUT: 500,
  LEVEL_TRANSITION_TOTAL: 1000,

  // Loading screen duration
  LOADING_SCREEN: 3500,
};

// ============================================
// Animation Timings (in milliseconds)
// ============================================

export const ANIMATION_TIMINGS = {
  // Brick drop animation
  BRICK_DROP_DURATION: 700,

  // Paddle stretch animation
  PADDLE_STRETCH_IN: 300,
  PADDLE_SHRINK_OUT: 300,

  // Tile merge animation (1024 game)
  TILE_MERGE: 100,
  TILE_APPEAR: 150,

  // General UI animations
  BUTTON_PRESS: 150,
  MODAL_OPEN: 300,
  MODAL_CLOSE: 200,

  // Pulse/glow effects
  PULSE_DURATION: 2000,
  GLOW_DURATION: 1500,
};

// ============================================
// Delay Timings (in milliseconds)
// ============================================

export const DELAY_TIMINGS = {
  // Small delay before starting animation
  ANIMATION_START_DELAY: 10,

  // Debounce delays
  RESIZE_DEBOUNCE: 100,
  INPUT_DEBOUNCE: 50,

  // Stagger delays for sequential animations
  STAGGER_SMALL: 50,
  STAGGER_MEDIUM: 100,
  STAGGER_LARGE: 200,
};

// ============================================
// Game-Specific Timings
// ============================================

export const GAME_TIMINGS = {
  // Brickrush
  BRICKRUSH: {
    POWER_UP_DURATION: 10000, // Paddle stretch power-up
    COLLISION_COOLDOWN_FRAMES: 3,
  },

  // 1024 Game
  GAME_1024: {
    MOVE_ANIMATION: 100,
    NEW_TILE_DELAY: 100,
  },

  // Snake Game - speeds defined in main constants
  SNAKE: {
    DIRECTION_BUFFER: 50, // Buffer time for direction changes
  },
};

// ============================================
// CSS Transition Values (for inline styles)
// ============================================

export const CSS_TRANSITIONS = {
  FAST: 'all 0.15s ease',
  NORMAL: 'all 0.3s ease',
  SLOW: 'all 0.5s ease',
  MENU: 'opacity 0.6s ease, transform 0.6s ease',
  TRANSFORM: 'transform 0.3s ease',
  OPACITY: 'opacity 0.3s ease',
};

// ============================================
// Accessibility - Reduced Motion Values
// ============================================

export const REDUCED_MOTION_TIMINGS = {
  // Near-instant transitions for users who prefer reduced motion
  TRANSITION: 50,
  ANIMATION: 0,
  DELAY: 0,
};

/**
 * Get timing value respecting user's reduced motion preference
 * @param {number} normalTiming - Normal timing value in ms
 * @param {number} reducedTiming - Reduced motion timing value (default: 0)
 * @returns {number} - Appropriate timing value
 */
export const getAccessibleTiming = (normalTiming, reducedTiming = 0) => {
  if (typeof window === 'undefined') return normalTiming;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return prefersReducedMotion ? reducedTiming : normalTiming;
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export default {
  TRANSITION_TIMINGS,
  ANIMATION_TIMINGS,
  DELAY_TIMINGS,
  GAME_TIMINGS,
  CSS_TRANSITIONS,
  REDUCED_MOTION_TIMINGS,
  getAccessibleTiming,
  prefersReducedMotion,
};
