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
  (GAME_WIDTH - 2 * BRICK_OFFSET_LEFT - (BRICK_COLUMN_COUNT - 1) * BRICK_PADDING) /
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
