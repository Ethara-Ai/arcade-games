import { describe, it, expect } from 'vitest';
import {
  handleBallPaddleCollision,
  handleBallBrickCollision,
  moveBalls,
  updatePowerUps,
} from './gamePhysics';

describe('gamePhysics', () => {
  describe('handleBallPaddleCollision', () => {
    const createBall = (overrides = {}) => ({
      x: 100,
      y: 380,
      radius: 8,
      dx: 0,
      dy: 5,
      speed: 5,
      ...overrides,
    });

    const createPaddle = (overrides = {}) => ({
      x: 50,
      y: 390,
      width: 100,
      height: 15,
      ...overrides,
    });

    it('should detect collision when ball hits paddle', () => {
      const balls = [createBall({ y: 385 })];
      const paddle = createPaddle();

      const result = handleBallPaddleCollision(balls, paddle);

      expect(result[0].dy).toBeLessThan(0); // Ball should bounce up
    });

    it('should not affect ball when no collision', () => {
      const balls = [createBall({ y: 200 })];
      const paddle = createPaddle();

      const result = handleBallPaddleCollision(balls, paddle);

      expect(result[0].dy).toBe(5); // dy unchanged
      expect(result[0].y).toBe(200); // y unchanged
    });

    it('should adjust ball angle based on hit position', () => {
      const paddle = createPaddle();

      // Ball hits left side of paddle
      const leftBall = [createBall({ x: 60, y: 385 })];
      const leftResult = handleBallPaddleCollision(leftBall, paddle);

      // Ball hits right side of paddle
      const rightBall = [createBall({ x: 140, y: 385 })];
      const rightResult = handleBallPaddleCollision(rightBall, paddle);

      // Left hit should send ball left (negative dx)
      expect(leftResult[0].dx).toBeLessThan(0);
      // Right hit should send ball right (positive dx)
      expect(rightResult[0].dx).toBeGreaterThan(0);
    });

    it('should handle multiple balls', () => {
      const balls = [
        createBall({ x: 100, y: 385 }),
        createBall({ x: 200, y: 200 }), // Not hitting paddle
      ];
      const paddle = createPaddle();

      const result = handleBallPaddleCollision(balls, paddle);

      expect(result[0].dy).toBeLessThan(0); // First ball bounces
      expect(result[1].dy).toBe(5); // Second ball unchanged
    });

    it('should only bounce ball moving downward', () => {
      const balls = [createBall({ y: 385, dy: -5 })]; // Ball moving up
      const paddle = createPaddle();

      const result = handleBallPaddleCollision(balls, paddle);

      expect(result[0].dy).toBe(-5); // dy unchanged (ball moving up)
    });

    it('should return new array without mutating original', () => {
      const balls = [createBall({ y: 385 })];
      const paddle = createPaddle();

      const result = handleBallPaddleCollision(balls, paddle);

      expect(result).not.toBe(balls);
      expect(result[0]).not.toBe(balls[0]);
    });
  });

  describe('handleBallBrickCollision', () => {
    const createBall = (overrides = {}) => ({
      x: 100,
      y: 50,
      radius: 8,
      dx: 3,
      dy: -4,
      speed: 5,
      ...overrides,
    });

    const createBrick = (overrides = {}) => ({
      x: 90,
      y: 40,
      width: 40,
      height: 20,
      status: 1,
      isSteel: false,
      ...overrides,
    });

    it('should destroy brick on collision', () => {
      const balls = [createBall()];
      const bricks = [[createBrick()]];

      const result = handleBallBrickCollision(balls, bricks, 1, 1, 5);

      expect(result.bricks[0][0].status).toBe(0);
      expect(result.bricksHit.length).toBe(1);
    });

    it('should bounce ball on collision', () => {
      const balls = [createBall({ dy: -4 })];
      const bricks = [[createBrick()]];

      const result = handleBallBrickCollision(balls, bricks, 1, 1, 5);

      // Ball should have direction reversed
      expect(result.balls[0].dy !== -4 || result.balls[0].dx !== 3).toBe(true);
    });

    it('should not destroy steel bricks', () => {
      const balls = [createBall()];
      const bricks = [[createBrick({ isSteel: true })]];

      const result = handleBallBrickCollision(balls, bricks, 1, 1, 5);

      expect(result.bricks[0][0].status).toBe(1);
      expect(result.bricksHit.length).toBe(0);
    });

    it('should report all cleared when no non-steel bricks remain', () => {
      const balls = [createBall()];
      const bricks = [[createBrick()]]; // Only one brick

      const result = handleBallBrickCollision(balls, bricks, 1, 1, 5);

      expect(result.allCleared).toBe(true);
    });

    it('should not report all cleared when bricks remain', () => {
      const balls = [createBall({ x: 200, y: 200 })]; // Ball not hitting brick
      const bricks = [[createBrick()]];

      const result = handleBallBrickCollision(balls, bricks, 1, 1, 5);

      expect(result.allCleared).toBe(false);
    });

    it('should skip bricks with status 0', () => {
      const balls = [createBall()];
      const bricks = [[createBrick({ status: 0 })]];

      const result = handleBallBrickCollision(balls, bricks, 1, 1, 5);

      expect(result.bricksHit.length).toBe(0);
    });

    it('should increase ball speed after hitting brick', () => {
      const balls = [createBall({ speed: 5 })];
      const bricks = [[createBrick()]];

      const result = handleBallBrickCollision(balls, bricks, 1, 1, 5);

      expect(result.balls[0].speed).toBeGreaterThan(5);
    });

    it('should not exceed max ball speed', () => {
      const balls = [createBall({ speed: 9.9 })]; // Near max (initial * 2 = 10)
      const bricks = [[createBrick()]];

      const result = handleBallBrickCollision(balls, bricks, 1, 1, 5);

      expect(result.balls[0].speed).toBeLessThanOrEqual(10);
    });

    it('should return new arrays without mutating originals', () => {
      const balls = [createBall()];
      const bricks = [[createBrick()]];

      const result = handleBallBrickCollision(balls, bricks, 1, 1, 5);

      expect(result.balls).not.toBe(balls);
      expect(result.bricks).not.toBe(bricks);
    });
  });

  describe('moveBalls', () => {
    const createBall = (overrides = {}) => ({
      x: 100,
      y: 100,
      radius: 8,
      dx: 5,
      dy: -5,
      ...overrides,
    });

    it('should move ball by dx and dy', () => {
      const balls = [createBall()];

      const result = moveBalls(balls, 800, 600);

      expect(result.balls[0].x).toBe(105);
      expect(result.balls[0].y).toBe(95);
    });

    it('should bounce ball off left wall', () => {
      const balls = [createBall({ x: 5, dx: -10 })];

      const result = moveBalls(balls, 800, 600);

      expect(result.balls[0].dx).toBe(10); // Direction reversed
      expect(result.balls[0].x).toBeGreaterThanOrEqual(8); // x >= radius
    });

    it('should bounce ball off right wall', () => {
      const balls = [createBall({ x: 795, dx: 10 })];

      const result = moveBalls(balls, 800, 600);

      expect(result.balls[0].dx).toBe(-10); // Direction reversed
      expect(result.balls[0].x).toBeLessThanOrEqual(792); // x <= width - radius
    });

    it('should bounce ball off top wall', () => {
      const balls = [createBall({ y: 5, dy: -10 })];

      const result = moveBalls(balls, 800, 600);

      expect(result.balls[0].dy).toBe(10); // Direction reversed
      expect(result.balls[0].y).toBe(8); // y = radius
    });

    it('should remove ball that falls off bottom', () => {
      const balls = [createBall({ y: 600, dy: 10 })];

      const result = moveBalls(balls, 800, 600);

      expect(result.balls.length).toBe(0);
      expect(result.lostBalls.length).toBe(1);
    });

    it('should handle multiple balls independently', () => {
      const balls = [
        createBall({ x: 100, y: 100 }),
        createBall({ x: 600, y: 595, dy: 10 }), // Will fall off
      ];

      const result = moveBalls(balls, 800, 600);

      expect(result.balls.length).toBe(1);
      expect(result.lostBalls.length).toBe(1);
    });

    it('should return new array without mutating original', () => {
      const balls = [createBall()];

      const result = moveBalls(balls, 800, 600);

      expect(result.balls).not.toBe(balls);
      expect(result.balls[0]).not.toBe(balls[0]);
    });
  });

  describe('updatePowerUps', () => {
    const createPowerUp = (overrides = {}) => ({
      x: 100,
      y: 200,
      size: 20,
      dy: 2,
      type: 'multiball',
      ...overrides,
    });

    const createPaddle = (overrides = {}) => ({
      x: 50,
      y: 380,
      width: 100,
      height: 15,
      ...overrides,
    });

    it('should move power-up downward', () => {
      const powerUps = [createPowerUp()];
      const paddle = createPaddle();

      const result = updatePowerUps(powerUps, paddle, 600);

      expect(result.activePowerUps[0].y).toBe(202);
    });

    it('should collect power-up when hitting paddle', () => {
      const powerUps = [createPowerUp({ x: 80, y: 378 })]; // Near paddle
      const paddle = createPaddle();

      const result = updatePowerUps(powerUps, paddle, 600);

      expect(result.collectedPowerUps.length).toBe(1);
      expect(result.activePowerUps.length).toBe(0);
    });

    it('should remove power-up that falls off screen', () => {
      const powerUps = [createPowerUp({ y: 590 })]; // Near bottom
      const paddle = createPaddle();

      const result = updatePowerUps(powerUps, paddle, 600);

      expect(result.activePowerUps.length).toBe(0);
      expect(result.collectedPowerUps.length).toBe(0);
    });

    it('should handle multiple power-ups', () => {
      const powerUps = [
        createPowerUp({ x: 80, y: 378 }), // Will be collected
        createPowerUp({ x: 200, y: 100 }), // Will continue falling
        createPowerUp({ x: 300, y: 590 }), // Will fall off screen
      ];
      const paddle = createPaddle();

      const result = updatePowerUps(powerUps, paddle, 600);

      expect(result.collectedPowerUps.length).toBe(1);
      expect(result.activePowerUps.length).toBe(1);
    });

    it('should return empty arrays for empty input', () => {
      const result = updatePowerUps([], createPaddle(), 600);

      expect(result.activePowerUps).toEqual([]);
      expect(result.collectedPowerUps).toEqual([]);
    });
  });
});
