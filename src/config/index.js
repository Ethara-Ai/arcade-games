/**
 * Application Configuration
 * 
 * Centralizes all environment variables and provides default values.
 * Access environment variables through this config to ensure consistency.
 */

// Application Settings
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Arcade Games';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Storage Settings
export const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'arcade_';

// Development Settings
export const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

/**
 * Get a localStorage key with the configured prefix
 * @param {string} key - The base key name
 * @returns {string} - The prefixed key
 */
export const getStorageKey = (key) => `${STORAGE_PREFIX}${key}`;

/**
 * Debug logger - only logs when DEBUG_MODE is enabled
 * @param  {...any} args - Arguments to log
 */
export const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log('[DEBUG]', ...args);
  }
};

/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  BRICKRUSH_HIGH_SCORE: getStorageKey('brickrushHighScore'),
  GAME_1024_BEST_SCORE: getStorageKey('game1024BestScore'),
  SNAKE_HIGH_SCORE: getStorageKey('snakeHighScore'),
};

// Export all config as default object
export default {
  APP_NAME,
  APP_VERSION,
  STORAGE_PREFIX,
  DEBUG_MODE,
  STORAGE_KEYS,
  getStorageKey,
  debugLog,
};
