import { describe, it, expect } from 'vitest';
import {
  // BrickRush Game Constants
  GAME_WIDTH,
  GAME_HEIGHT,
  TARGET_ASPECT_RATIO,
  PADDLE_BASE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_MARGIN_BOTTOM,
  PADDLE_COLOR,
  PADDLE_STRETCH_WIDTH,
  PADDLE_STRETCH_DURATION,
  PADDLE_SPEED,
  BALL_RADIUS,
  BALL_INITIAL_SPEED,
  BALL_COLOR,
  BRICK_ROW_COUNT,
  BRICK_COLUMN_COUNT,
  BRICK_PADDING,
  BRICK_OFFSET_TOP,
  BRICK_OFFSET_LEFT,
  BRICK_BASE_WIDTH,
  BRICK_HEIGHT,
  BRICK_COLORS,
  STEEL_BRICK_COLOR,
  POWERUP_SIZE,
  POWERUP_SPEED,
  POWERUP_TYPES,
  POWERUP_COLORS,
  GAME_STATES,
  INITIAL_LIVES,
  BRICK_PATTERNS,
  STEEL_BRICK_PATTERNS,
  // 1024 Game Constants
  GAME_1024_GRID_SIZE,
  WINNING_TILE,
  GAME_1024_STATES,
  TILE_COLORS,
  GAME_1024_DIRECTIONS,
  GAME_1024_KEY_MAPPINGS,
  // Snake Game Constants
  SNAKE_GRID_SIZE,
  SNAKE_CELL_SIZE,
  SNAKE_CANVAS_SIZE,
  SNAKE_GAME_STATES,
  SNAKE_DIRECTIONS,
  SNAKE_KEY_MAPPINGS,
  SNAKE_OPPOSITE_DIRECTIONS,
  SNAKE_BASE_SPEED,
  SNAKE_MIN_SPEED,
  SNAKE_SPEED_INCREASE_PER_FOOD,
  SNAKE_COLORS,
  SNAKE_INITIAL_POSITION,
  SNAKE_FOOD_POINTS,
  SNAKE_BONUS_FOOD_POINTS,
  SNAKE_BONUS_FOOD_CHANCE,
} from './index';

describe('constants/index.js', () => {
  describe('BrickRush Game Dimensions', () => {
    it('should have correct game dimensions', () => {
      expect(GAME_WIDTH).toBe(800);
      expect(GAME_HEIGHT).toBe(600);
    });

    it('should have correct aspect ratio', () => {
      expect(TARGET_ASPECT_RATIO).toBe(GAME_WIDTH / GAME_HEIGHT);
      expect(TARGET_ASPECT_RATIO).toBeCloseTo(4 / 3);
    });
  });

  describe('BrickRush Paddle Constants', () => {
    it('should have paddle dimensions', () => {
      expect(PADDLE_BASE_WIDTH).toBe(100);
      expect(PADDLE_HEIGHT).toBe(20);
      expect(PADDLE_MARGIN_BOTTOM).toBe(30);
    });

    it('should have paddle color as hex string', () => {
      expect(PADDLE_COLOR).toBe('#00d1ff');
      expect(PADDLE_COLOR).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('should have paddle stretch properties', () => {
      expect(PADDLE_STRETCH_WIDTH).toBe(150);
      expect(PADDLE_STRETCH_WIDTH).toBeGreaterThan(PADDLE_BASE_WIDTH);
      expect(PADDLE_STRETCH_DURATION).toBe(10000);
    });

    it('should have paddle speed', () => {
      expect(PADDLE_SPEED).toBe(8);
      expect(PADDLE_SPEED).toBeGreaterThan(0);
    });
  });

  describe('BrickRush Ball Constants', () => {
    it('should have ball radius', () => {
      expect(BALL_RADIUS).toBe(10);
      expect(BALL_RADIUS).toBeGreaterThan(0);
    });

    it('should have ball initial speed', () => {
      expect(BALL_INITIAL_SPEED).toBe(6);
      expect(BALL_INITIAL_SPEED).toBeGreaterThan(0);
    });

    it('should have ball color as hex string', () => {
      expect(BALL_COLOR).toBe('#ffffff');
      expect(BALL_COLOR).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  describe('BrickRush Brick Constants', () => {
    it('should have brick grid dimensions', () => {
      expect(BRICK_ROW_COUNT).toBe(5);
      expect(BRICK_COLUMN_COUNT).toBe(9);
      expect(BRICK_PADDING).toBe(5);
    });

    it('should have brick offsets', () => {
      expect(BRICK_OFFSET_TOP).toBe(80);
      expect(BRICK_OFFSET_LEFT).toBe(30);
    });

    it('should have brick dimensions', () => {
      expect(BRICK_BASE_WIDTH).toBeGreaterThan(0);
      expect(BRICK_HEIGHT).toBe(20);
    });

    it('should have brick colors as array of hex strings', () => {
      expect(Array.isArray(BRICK_COLORS)).toBe(true);
      expect(BRICK_COLORS.length).toBeGreaterThan(0);
      BRICK_COLORS.forEach((color) => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it('should have steel brick color', () => {
      expect(STEEL_BRICK_COLOR).toBe('#c0c0c0');
      expect(STEEL_BRICK_COLOR).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  describe('BrickRush Power-up Constants', () => {
    it('should have power-up size and speed', () => {
      expect(POWERUP_SIZE).toBe(15);
      expect(POWERUP_SPEED).toBe(2);
    });

    it('should have power-up types', () => {
      expect(POWERUP_TYPES).toHaveProperty('MULTIBALL');
      expect(POWERUP_TYPES).toHaveProperty('STRETCH_PADDLE');
      expect(POWERUP_TYPES.MULTIBALL).toBe('multiball');
      expect(POWERUP_TYPES.STRETCH_PADDLE).toBe('stretch_paddle');
    });

    it('should have power-up colors for each type', () => {
      expect(POWERUP_COLORS[POWERUP_TYPES.MULTIBALL]).toBeDefined();
      expect(POWERUP_COLORS[POWERUP_TYPES.STRETCH_PADDLE]).toBeDefined();
    });
  });

  describe('BrickRush Game States', () => {
    it('should have all required game states', () => {
      expect(GAME_STATES).toHaveProperty('START_MENU');
      expect(GAME_STATES).toHaveProperty('PLAYING');
      expect(GAME_STATES).toHaveProperty('PAUSED');
      expect(GAME_STATES).toHaveProperty('GAME_OVER');
      expect(GAME_STATES).toHaveProperty('LEVEL_COMPLETE');
    });

    it('should have unique game state values', () => {
      const values = Object.values(GAME_STATES);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('BrickRush Initial Lives', () => {
    it('should have initial lives', () => {
      expect(INITIAL_LIVES).toBe(3);
      expect(INITIAL_LIVES).toBeGreaterThan(0);
    });
  });

  describe('BrickRush Brick Patterns', () => {
    it('should have brick patterns array', () => {
      expect(Array.isArray(BRICK_PATTERNS)).toBe(true);
      expect(BRICK_PATTERNS.length).toBeGreaterThan(0);
    });

    it('should have patterns with correct dimensions', () => {
      BRICK_PATTERNS.forEach((pattern, index) => {
        expect(pattern.length).toBe(BRICK_ROW_COUNT);
        pattern.forEach((row) => {
          expect(row.length).toBe(BRICK_COLUMN_COUNT);
        });
      });
    });

    it('should have pattern values of 0 or 1', () => {
      BRICK_PATTERNS.forEach((pattern) => {
        pattern.forEach((row) => {
          row.forEach((cell) => {
            expect([0, 1]).toContain(cell);
          });
        });
      });
    });

    it('should have steel brick patterns array', () => {
      expect(Array.isArray(STEEL_BRICK_PATTERNS)).toBe(true);
      expect(STEEL_BRICK_PATTERNS.length).toBe(BRICK_PATTERNS.length);
    });

    it('should have steel patterns with correct dimensions', () => {
      STEEL_BRICK_PATTERNS.forEach((pattern) => {
        expect(pattern.length).toBe(BRICK_ROW_COUNT);
        pattern.forEach((row) => {
          expect(row.length).toBe(BRICK_COLUMN_COUNT);
        });
      });
    });
  });

  describe('1024 Game Constants', () => {
    it('should have grid size', () => {
      expect(GAME_1024_GRID_SIZE).toBe(4);
    });

    it('should have winning tile value', () => {
      expect(WINNING_TILE).toBe(1024);
    });

    it('should have all required game states', () => {
      expect(GAME_1024_STATES).toHaveProperty('START');
      expect(GAME_1024_STATES).toHaveProperty('PLAYING');
      expect(GAME_1024_STATES).toHaveProperty('PAUSED');
      expect(GAME_1024_STATES).toHaveProperty('WON');
      expect(GAME_1024_STATES).toHaveProperty('GAME_OVER');
    });

    it('should have unique game state values', () => {
      const values = Object.values(GAME_1024_STATES);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('1024 Tile Colors', () => {
    it('should have colors for common tile values', () => {
      const requiredValues = [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
      requiredValues.forEach((value) => {
        expect(TILE_COLORS[value]).toBeDefined();
        expect(TILE_COLORS[value]).toHaveProperty('bg');
        expect(TILE_COLORS[value]).toHaveProperty('text');
      });
    });

    it('should have bg and text properties for each tile color', () => {
      Object.values(TILE_COLORS).forEach((colorObj) => {
        expect(typeof colorObj.bg).toBe('string');
        expect(typeof colorObj.text).toBe('string');
      });
    });
  });

  describe('1024 Directions', () => {
    it('should have all four directions', () => {
      expect(GAME_1024_DIRECTIONS).toHaveProperty('UP');
      expect(GAME_1024_DIRECTIONS).toHaveProperty('DOWN');
      expect(GAME_1024_DIRECTIONS).toHaveProperty('LEFT');
      expect(GAME_1024_DIRECTIONS).toHaveProperty('RIGHT');
    });

    it('should have correct direction vectors', () => {
      expect(GAME_1024_DIRECTIONS.UP).toEqual({ row: -1, col: 0 });
      expect(GAME_1024_DIRECTIONS.DOWN).toEqual({ row: 1, col: 0 });
      expect(GAME_1024_DIRECTIONS.LEFT).toEqual({ row: 0, col: -1 });
      expect(GAME_1024_DIRECTIONS.RIGHT).toEqual({ row: 0, col: 1 });
    });
  });

  describe('1024 Key Mappings', () => {
    it('should map arrow keys', () => {
      expect(GAME_1024_KEY_MAPPINGS.ArrowUp).toBe('UP');
      expect(GAME_1024_KEY_MAPPINGS.ArrowDown).toBe('DOWN');
      expect(GAME_1024_KEY_MAPPINGS.ArrowLeft).toBe('LEFT');
      expect(GAME_1024_KEY_MAPPINGS.ArrowRight).toBe('RIGHT');
    });

    it('should map WASD keys (lowercase)', () => {
      expect(GAME_1024_KEY_MAPPINGS.w).toBe('UP');
      expect(GAME_1024_KEY_MAPPINGS.s).toBe('DOWN');
      expect(GAME_1024_KEY_MAPPINGS.a).toBe('LEFT');
      expect(GAME_1024_KEY_MAPPINGS.d).toBe('RIGHT');
    });

    it('should map WASD keys (uppercase)', () => {
      expect(GAME_1024_KEY_MAPPINGS.W).toBe('UP');
      expect(GAME_1024_KEY_MAPPINGS.S).toBe('DOWN');
      expect(GAME_1024_KEY_MAPPINGS.A).toBe('LEFT');
      expect(GAME_1024_KEY_MAPPINGS.D).toBe('RIGHT');
    });
  });

  describe('Snake Game Grid Constants', () => {
    it('should have grid size', () => {
      expect(SNAKE_GRID_SIZE).toBe(20);
    });

    it('should have cell size', () => {
      expect(SNAKE_CELL_SIZE).toBe(20);
    });

    it('should have correct canvas size', () => {
      expect(SNAKE_CANVAS_SIZE).toBe(SNAKE_GRID_SIZE * SNAKE_CELL_SIZE);
      expect(SNAKE_CANVAS_SIZE).toBe(400);
    });
  });

  describe('Snake Game States', () => {
    it('should have all required game states', () => {
      expect(SNAKE_GAME_STATES).toHaveProperty('START');
      expect(SNAKE_GAME_STATES).toHaveProperty('PLAYING');
      expect(SNAKE_GAME_STATES).toHaveProperty('PAUSED');
      expect(SNAKE_GAME_STATES).toHaveProperty('GAME_OVER');
    });

    it('should have unique game state values', () => {
      const values = Object.values(SNAKE_GAME_STATES);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('Snake Directions', () => {
    it('should have all four directions', () => {
      expect(SNAKE_DIRECTIONS).toHaveProperty('UP');
      expect(SNAKE_DIRECTIONS).toHaveProperty('DOWN');
      expect(SNAKE_DIRECTIONS).toHaveProperty('LEFT');
      expect(SNAKE_DIRECTIONS).toHaveProperty('RIGHT');
    });

    it('should have correct direction vectors', () => {
      expect(SNAKE_DIRECTIONS.UP).toEqual({ x: 0, y: -1 });
      expect(SNAKE_DIRECTIONS.DOWN).toEqual({ x: 0, y: 1 });
      expect(SNAKE_DIRECTIONS.LEFT).toEqual({ x: -1, y: 0 });
      expect(SNAKE_DIRECTIONS.RIGHT).toEqual({ x: 1, y: 0 });
    });
  });

  describe('Snake Key Mappings', () => {
    it('should map arrow keys', () => {
      expect(SNAKE_KEY_MAPPINGS.ArrowUp).toBe('UP');
      expect(SNAKE_KEY_MAPPINGS.ArrowDown).toBe('DOWN');
      expect(SNAKE_KEY_MAPPINGS.ArrowLeft).toBe('LEFT');
      expect(SNAKE_KEY_MAPPINGS.ArrowRight).toBe('RIGHT');
    });

    it('should map WASD keys (lowercase)', () => {
      expect(SNAKE_KEY_MAPPINGS.w).toBe('UP');
      expect(SNAKE_KEY_MAPPINGS.s).toBe('DOWN');
      expect(SNAKE_KEY_MAPPINGS.a).toBe('LEFT');
      expect(SNAKE_KEY_MAPPINGS.d).toBe('RIGHT');
    });

    it('should map WASD keys (uppercase)', () => {
      expect(SNAKE_KEY_MAPPINGS.W).toBe('UP');
      expect(SNAKE_KEY_MAPPINGS.S).toBe('DOWN');
      expect(SNAKE_KEY_MAPPINGS.A).toBe('LEFT');
      expect(SNAKE_KEY_MAPPINGS.D).toBe('RIGHT');
    });
  });

  describe('Snake Opposite Directions', () => {
    it('should have opposite for each direction', () => {
      expect(SNAKE_OPPOSITE_DIRECTIONS.UP).toBe('DOWN');
      expect(SNAKE_OPPOSITE_DIRECTIONS.DOWN).toBe('UP');
      expect(SNAKE_OPPOSITE_DIRECTIONS.LEFT).toBe('RIGHT');
      expect(SNAKE_OPPOSITE_DIRECTIONS.RIGHT).toBe('LEFT');
    });

    it('should be symmetric (opposite of opposite is original)', () => {
      Object.keys(SNAKE_OPPOSITE_DIRECTIONS).forEach((dir) => {
        const opposite = SNAKE_OPPOSITE_DIRECTIONS[dir];
        expect(SNAKE_OPPOSITE_DIRECTIONS[opposite]).toBe(dir);
      });
    });
  });

  describe('Snake Speed Constants', () => {
    it('should have base speed', () => {
      expect(SNAKE_BASE_SPEED).toBe(150);
      expect(SNAKE_BASE_SPEED).toBeGreaterThan(0);
    });

    it('should have min speed less than base speed', () => {
      expect(SNAKE_MIN_SPEED).toBe(60);
      expect(SNAKE_MIN_SPEED).toBeLessThan(SNAKE_BASE_SPEED);
    });

    it('should have speed increase per food', () => {
      expect(SNAKE_SPEED_INCREASE_PER_FOOD).toBe(2);
      expect(SNAKE_SPEED_INCREASE_PER_FOOD).toBeGreaterThan(0);
    });
  });

  describe('Snake Colors', () => {
    it('should have all required colors', () => {
      expect(SNAKE_COLORS).toHaveProperty('background');
      expect(SNAKE_COLORS).toHaveProperty('grid');
      expect(SNAKE_COLORS).toHaveProperty('snakeHead');
      expect(SNAKE_COLORS).toHaveProperty('snakeBody');
      expect(SNAKE_COLORS).toHaveProperty('snakeGlow');
      expect(SNAKE_COLORS).toHaveProperty('food');
      expect(SNAKE_COLORS).toHaveProperty('foodGlow');
      expect(SNAKE_COLORS).toHaveProperty('bonusFood');
      expect(SNAKE_COLORS).toHaveProperty('bonusFoodGlow');
    });

    it('should have string values for all colors', () => {
      Object.values(SNAKE_COLORS).forEach((color) => {
        expect(typeof color).toBe('string');
      });
    });
  });

  describe('Snake Initial Position', () => {
    it('should be an array of positions', () => {
      expect(Array.isArray(SNAKE_INITIAL_POSITION)).toBe(true);
      expect(SNAKE_INITIAL_POSITION.length).toBeGreaterThanOrEqual(3);
    });

    it('should have x and y coordinates for each segment', () => {
      SNAKE_INITIAL_POSITION.forEach((segment) => {
        expect(segment).toHaveProperty('x');
        expect(segment).toHaveProperty('y');
        expect(typeof segment.x).toBe('number');
        expect(typeof segment.y).toBe('number');
      });
    });

    it('should be within grid bounds', () => {
      SNAKE_INITIAL_POSITION.forEach((segment) => {
        expect(segment.x).toBeGreaterThanOrEqual(0);
        expect(segment.x).toBeLessThan(SNAKE_GRID_SIZE);
        expect(segment.y).toBeGreaterThanOrEqual(0);
        expect(segment.y).toBeLessThan(SNAKE_GRID_SIZE);
      });
    });

    it('should have consecutive segments (snake is connected)', () => {
      for (let i = 1; i < SNAKE_INITIAL_POSITION.length; i++) {
        const prev = SNAKE_INITIAL_POSITION[i - 1];
        const curr = SNAKE_INITIAL_POSITION[i];
        const dx = Math.abs(prev.x - curr.x);
        const dy = Math.abs(prev.y - curr.y);
        // Each segment should be adjacent (1 unit apart in one direction)
        expect(dx + dy).toBe(1);
      }
    });
  });

  describe('Snake Points', () => {
    it('should have food points', () => {
      expect(SNAKE_FOOD_POINTS).toBe(10);
      expect(SNAKE_FOOD_POINTS).toBeGreaterThan(0);
    });

    it('should have bonus food points greater than regular food', () => {
      expect(SNAKE_BONUS_FOOD_POINTS).toBe(50);
      expect(SNAKE_BONUS_FOOD_POINTS).toBeGreaterThan(SNAKE_FOOD_POINTS);
    });

    it('should have bonus food chance between 0 and 1', () => {
      expect(SNAKE_BONUS_FOOD_CHANCE).toBe(0.1);
      expect(SNAKE_BONUS_FOOD_CHANCE).toBeGreaterThan(0);
      expect(SNAKE_BONUS_FOOD_CHANCE).toBeLessThan(1);
    });
  });

  describe('Cross-game Consistency', () => {
    it('should have different game states for each game', () => {
      // BrickRush and 1024/Snake states should be separate objects
      expect(GAME_STATES).not.toBe(GAME_1024_STATES);
      expect(GAME_STATES).not.toBe(SNAKE_GAME_STATES);
      expect(GAME_1024_STATES).not.toBe(SNAKE_GAME_STATES);
    });

    it('should have consistent key mapping patterns across games', () => {
      // Both 1024 and Snake should support same keys
      const keys1024 = Object.keys(GAME_1024_KEY_MAPPINGS);
      const keysSnake = Object.keys(SNAKE_KEY_MAPPINGS);

      // They should have the same key set
      expect(keys1024.sort()).toEqual(keysSnake.sort());
    });
  });
});
