// 1024 Game Constants
export const GRID_SIZE = 4;
export const WINNING_TILE = 1024;

// Game states
export const GAME_1024_STATES = {
  START: 'START',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  WON: 'WON',
  GAME_OVER: 'GAME_OVER',
};

// Tile colors - Dark theme with neon accents
export const TILE_COLORS = {
  0: { bg: 'rgba(255, 255, 255, 0.05)', text: '#9e9e9e' },
  2: { bg: '#1e3a5f', text: '#00d1ff' },
  4: { bg: '#1e4d6b', text: '#00d1ff' },
  8: { bg: '#00796b', text: '#ffffff' },
  16: { bg: '#00897b', text: '#ffffff' },
  32: { bg: '#26a69a', text: '#ffffff' },
  64: { bg: '#ff7043', text: '#ffffff' },
  128: { bg: '#ff5722', text: '#ffffff' },
  256: { bg: '#f4511e', text: '#ffffff' },
  512: { bg: '#e91e63', text: '#ffffff' },
  1024: { bg: '#00d1ff', text: '#121212' },
  2048: { bg: '#ff4081', text: '#ffffff' },
};

// Direction vectors
export const DIRECTIONS = {
  UP: { row: -1, col: 0 },
  DOWN: { row: 1, col: 0 },
  LEFT: { row: 0, col: -1 },
  RIGHT: { row: 0, col: 1 },
};

// Key mappings
export const KEY_MAPPINGS = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  W: 'UP',
  s: 'DOWN',
  S: 'DOWN',
  a: 'LEFT',
  A: 'LEFT',
  d: 'RIGHT',
  D: 'RIGHT',
};
