// ============================================
// Timing Constants (re-exported from timing.js)
// ============================================
export {
  TRANSITION_TIMINGS,
  ANIMATION_TIMINGS,
  DELAY_TIMINGS,
  GAME_TIMINGS,
  CSS_TRANSITIONS,
  REDUCED_MOTION_TIMINGS,
  getAccessibleTiming,
  prefersReducedMotion,
} from "./timing";

// ============================================
// BrickRush Game Constants
// ============================================

// Game dimensions
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const TARGET_ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;

// Paddle constants
export const PADDLE_BASE_WIDTH = 100;
export const PADDLE_HEIGHT = 20;
export const PADDLE_MARGIN_BOTTOM = 30;
export const PADDLE_COLOR = "#00d1ff";
export const PADDLE_STRETCH_WIDTH = 150;
export const PADDLE_STRETCH_DURATION = 10000;
export const PADDLE_SPEED = 8;

// Ball constants
export const BALL_RADIUS = 10;
export const BALL_INITIAL_SPEED = 6;
export const BALL_COLOR = "#ffffff";

// Brick constants
export const BRICK_ROW_COUNT = 5;
export const BRICK_COLUMN_COUNT = 9;
export const BRICK_PADDING = 5;
export const BRICK_OFFSET_TOP = 80;
export const BRICK_OFFSET_LEFT = 30;
export const BRICK_BASE_WIDTH =
  (GAME_WIDTH -
    2 * BRICK_OFFSET_LEFT -
    (BRICK_COLUMN_COUNT - 1) * BRICK_PADDING) /
  BRICK_COLUMN_COUNT;
export const BRICK_HEIGHT = 20;
export const BRICK_COLORS = ["#f9a825", "#ff7043", "#66bb6a", "#29b6f6"];
export const STEEL_BRICK_COLOR = "#c0c0c0";

// Power-up constants
export const POWERUP_SIZE = 15;
export const POWERUP_SPEED = 2;
export const POWERUP_TYPES = {
  MULTIBALL: "multiball",
  STRETCH_PADDLE: "stretch_paddle",
};
export const POWERUP_COLORS = {
  [POWERUP_TYPES.MULTIBALL]: "#ff4081",
  [POWERUP_TYPES.STRETCH_PADDLE]: "#ff4081",
};

// Game states
export const GAME_STATES = {
  START_MENU: "START_MENU",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  GAME_OVER: "GAME_OVER",
  LEVEL_COMPLETE: "LEVEL_COMPLETE",
};

// Initial lives
export const INITIAL_LIVES = 3;

// ============================================
// Brick Patterns
// ============================================

// Brick patterns for each level
export const BRICK_PATTERNS = [
  // Level 1 - Pyramid
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
  ],
  // Level 2 - Diamond
  [
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
  ],
  // Level 3 - Castle
  [
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 0, 1, 0, 1, 1, 0],
  ],
  // Level 4 - Cross
  [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
  ],
  // Level 5 - Checkerboard
  [
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
  ],
  // Level 6 - Windows
  [
    [1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Level 7 - Spiral
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 1, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Level 8 - X Pattern
  [
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
  ],
];

// Steel brick patterns for each level
export const STEEL_BRICK_PATTERNS = [
  // Level 1 - No steel bricks
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  // Level 2
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  // Level 3
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
  ],
  // Level 4
  [
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
  ],
  // Level 5
  [
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
  ],
  // Level 6
  [
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  // Level 7
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  // Level 8
  [
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
  ],
];

// ============================================
// 1024 Game Constants
// ============================================

export const GAME_1024_GRID_SIZE = 4;
export const WINNING_TILE = 1024;

// Game states
export const GAME_1024_STATES = {
  START: "START",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  WON: "WON",
  GAME_OVER: "GAME_OVER",
};

// Tile colors - Dark theme with neon accents
export const TILE_COLORS = {
  0: { bg: "rgba(255, 255, 255, 0.05)", text: "#9e9e9e" },
  2: { bg: "#1e3a5f", text: "#00d1ff" },
  4: { bg: "#1e4d6b", text: "#00d1ff" },
  8: { bg: "#00796b", text: "#ffffff" },
  16: { bg: "#00897b", text: "#ffffff" },
  32: { bg: "#26a69a", text: "#ffffff" },
  64: { bg: "#ff7043", text: "#ffffff" },
  128: { bg: "#ff5722", text: "#ffffff" },
  256: { bg: "#f4511e", text: "#ffffff" },
  512: { bg: "#e91e63", text: "#ffffff" },
  1024: { bg: "#00d1ff", text: "#121212" },
  2048: { bg: "#ff4081", text: "#ffffff" },
};

// Direction vectors for 1024
export const GAME_1024_DIRECTIONS = {
  UP: { row: -1, col: 0 },
  DOWN: { row: 1, col: 0 },
  LEFT: { row: 0, col: -1 },
  RIGHT: { row: 0, col: 1 },
};

// Key mappings for 1024
export const GAME_1024_KEY_MAPPINGS = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  w: "UP",
  W: "UP",
  s: "DOWN",
  S: "DOWN",
  a: "LEFT",
  A: "LEFT",
  d: "RIGHT",
  D: "RIGHT",
};

// ============================================
// Snake Game Constants
// ============================================

export const SNAKE_GRID_SIZE = 20; // 20x20 grid
export const SNAKE_CELL_SIZE = 20; // pixels per cell
export const SNAKE_CANVAS_SIZE = SNAKE_GRID_SIZE * SNAKE_CELL_SIZE; // 400x400 canvas

// Game states
export const SNAKE_GAME_STATES = {
  START: "START",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  GAME_OVER: "GAME_OVER",
};

// Directions for Snake
export const SNAKE_DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// Key mappings for Snake
export const SNAKE_KEY_MAPPINGS = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  w: "UP",
  W: "UP",
  s: "DOWN",
  S: "DOWN",
  a: "LEFT",
  A: "LEFT",
  d: "RIGHT",
  D: "RIGHT",
};

// Opposite directions (to prevent 180° turns)
export const SNAKE_OPPOSITE_DIRECTIONS = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

// Game speed (ms between moves) - decreases as score increases
export const SNAKE_BASE_SPEED = 150;
export const SNAKE_MIN_SPEED = 60;
export const SNAKE_SPEED_INCREASE_PER_FOOD = 2;

// Colors - Dark theme with neon accents
export const SNAKE_COLORS = {
  background: "#121212",
  grid: "rgba(0, 209, 255, 0.05)",
  snakeHead: "#00d1ff",
  snakeBody: "#0097a7",
  snakeGlow: "rgba(0, 209, 255, 0.5)",
  food: "#ff4081",
  foodGlow: "rgba(255, 64, 129, 0.5)",
  bonusFood: "#f9a825",
  bonusFoodGlow: "rgba(249, 168, 37, 0.5)",
};

// Initial snake position
export const SNAKE_INITIAL_POSITION = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

// Points
export const SNAKE_FOOD_POINTS = 10;
export const SNAKE_BONUS_FOOD_POINTS = 50;
export const SNAKE_BONUS_FOOD_CHANCE = 0.1; // 10% chance for bonus food
