// Snake Game Constants
export const GRID_SIZE = 20; // 20x20 grid
export const CELL_SIZE = 20; // pixels per cell
export const CANVAS_SIZE = GRID_SIZE * CELL_SIZE; // 400x400 canvas

// Game states
export const SNAKE_GAME_STATES = {
  START: 'START',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
};

// Directions
export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
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

// Opposite directions (to prevent 180° turns)
export const OPPOSITE_DIRECTIONS = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

// Game speed (ms between moves) - decreases as score increases
export const BASE_SPEED = 150;
export const MIN_SPEED = 60;
export const SPEED_INCREASE_PER_FOOD = 2;

// Colors - Dark theme with neon accents
export const COLORS = {
  background: '#121212',
  grid: 'rgba(0, 209, 255, 0.05)',
  snakeHead: '#00d1ff',
  snakeBody: '#0097a7',
  snakeGlow: 'rgba(0, 209, 255, 0.5)',
  food: '#ff4081',
  foodGlow: 'rgba(255, 64, 129, 0.5)',
  bonusFood: '#f9a825',
  bonusFoodGlow: 'rgba(249, 168, 37, 0.5)',
};

// Initial snake position
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

// Points
export const FOOD_POINTS = 10;
export const BONUS_FOOD_POINTS = 50;
export const BONUS_FOOD_CHANCE = 0.1; // 10% chance for bonus food
