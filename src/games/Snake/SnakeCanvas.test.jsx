import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { createRef } from 'react';
import SnakeCanvas from './SnakeCanvas';
import { SNAKE_GAME_STATES } from '../../constants';

describe('SnakeCanvas', () => {
  const mockGameObjects = {
    snake: [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ],
    food: { x: 10, y: 10, isBonus: false },
    bonusFood: null,
  };

  const defaultProps = {
    gameState: SNAKE_GAME_STATES.PLAYING,
    getGameObjects: vi.fn(() => mockGameObjects),
    moveSnake: vi.fn(() => true),
    getGameSpeed: vi.fn(() => 150),
    onGameOver: vi.fn(),
    gameLoopRef: { current: null },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Step 1: Test component renders canvas element
  it('renders a canvas element', () => {
    const { container } = render(<SnakeCanvas {...defaultProps} />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Step 2: Test canvas has game-canvas class
  it('has game-canvas class', () => {
    const { container } = render(<SnakeCanvas {...defaultProps} />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('game-canvas');
  });

  // Step 3: Test forwardRef exposes getCanvas method
  it('exposes getCanvas method through ref', () => {
    const ref = createRef();
    render(<SnakeCanvas {...defaultProps} ref={ref} />);

    expect(ref.current.getCanvas).toBeDefined();
    expect(typeof ref.current.getCanvas).toBe('function');
  });

  // Step 4: Test forwardRef exposes getContext method
  it('exposes getContext method through ref', () => {
    const ref = createRef();
    render(<SnakeCanvas {...defaultProps} ref={ref} />);

    expect(ref.current.getContext).toBeDefined();
    expect(typeof ref.current.getContext).toBe('function');
  });

  // Step 5: Test getCanvas returns the canvas element
  it('getCanvas returns the canvas element', () => {
    const ref = createRef();
    const { container } = render(<SnakeCanvas {...defaultProps} ref={ref} />);

    const canvas = container.querySelector('canvas');
    expect(ref.current.getCanvas()).toBe(canvas);
  });

  // Step 6: Test display name is set
  it('has correct displayName', () => {
    expect(SnakeCanvas.displayName).toBe('SnakeCanvas');
  });

  // Step 7: Test game loop starts when game state is PLAYING
  it('starts game loop when game state is PLAYING', () => {
    const moveSnake = vi.fn(() => true);
    const gameLoopRef = { current: null };

    render(
      <SnakeCanvas
        {...defaultProps}
        gameState={SNAKE_GAME_STATES.PLAYING}
        moveSnake={moveSnake}
        gameLoopRef={gameLoopRef}
      />
    );

    // Advance timers to trigger the game loop
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(moveSnake).toHaveBeenCalled();
  });

  // Step 8: Test game loop stops when game state is not PLAYING
  it('stops game loop when game state is not PLAYING', () => {
    const moveSnake = vi.fn(() => true);
    const gameLoopRef = { current: null };

    render(
      <SnakeCanvas
        {...defaultProps}
        gameState={SNAKE_GAME_STATES.PAUSED}
        moveSnake={moveSnake}
        gameLoopRef={gameLoopRef}
      />
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(moveSnake).not.toHaveBeenCalled();
  });

  // Step 9: Test onGameOver is called when moveSnake returns false
  it('calls onGameOver when moveSnake returns false', () => {
    const moveSnake = vi.fn(() => false);
    const onGameOver = vi.fn();
    const gameLoopRef = { current: null };

    render(
      <SnakeCanvas
        {...defaultProps}
        gameState={SNAKE_GAME_STATES.PLAYING}
        moveSnake={moveSnake}
        onGameOver={onGameOver}
        gameLoopRef={gameLoopRef}
      />
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onGameOver).toHaveBeenCalled();
  });

  // Step 10: Test getGameObjects is called during draw
  it('calls getGameObjects during rendering', () => {
    const getGameObjects = vi.fn(() => mockGameObjects);
    const gameLoopRef = { current: null };

    render(
      <SnakeCanvas
        {...defaultProps}
        gameState={SNAKE_GAME_STATES.PLAYING}
        getGameObjects={getGameObjects}
        gameLoopRef={gameLoopRef}
      />
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(getGameObjects).toHaveBeenCalled();
  });

  // Step 11: Test getGameSpeed is called to determine loop timing
  it('calls getGameSpeed to determine loop timing', () => {
    const getGameSpeed = vi.fn(() => 100);
    const gameLoopRef = { current: null };

    render(
      <SnakeCanvas
        {...defaultProps}
        gameState={SNAKE_GAME_STATES.PLAYING}
        getGameSpeed={getGameSpeed}
        gameLoopRef={gameLoopRef}
      />
    );

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(getGameSpeed).toHaveBeenCalled();
  });

  // Step 12: Test canvas has correct dimensions
  it('sets canvas width and height attributes', () => {
    const { container } = render(<SnakeCanvas {...defaultProps} />);

    const canvas = container.querySelector('canvas');
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
  });

  // Step 13: Test canvas has rounded styling
  it('has rounded corner styling classes', () => {
    const { container } = render(<SnakeCanvas {...defaultProps} />);

    const canvas = container.querySelector('canvas');
    expect(canvas.className).toContain('rounded');
  });

  // Step 14: Test canvas has shadow styling
  it('has shadow styling class', () => {
    const { container } = render(<SnakeCanvas {...defaultProps} />);

    const canvas = container.querySelector('canvas');
    expect(canvas.className).toContain('shadow');
  });

  // Step 15: Test game loop continues while moveSnake returns true
  it('continues game loop while moveSnake returns true', () => {
    const moveSnake = vi.fn(() => true);
    const gameLoopRef = { current: null };

    render(
      <SnakeCanvas
        {...defaultProps}
        gameState={SNAKE_GAME_STATES.PLAYING}
        moveSnake={moveSnake}
        gameLoopRef={gameLoopRef}
      />
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(moveSnake.mock.calls.length).toBeGreaterThan(1);
  });

  // Step 16: Test component handles empty snake array
  it('handles empty snake array without crashing', () => {
    const getGameObjects = vi.fn(() => ({
      snake: [],
      food: { x: 5, y: 5, isBonus: false },
      bonusFood: null,
    }));

    expect(() =>
      render(
        <SnakeCanvas
          {...defaultProps}
          gameState={SNAKE_GAME_STATES.PLAYING}
          getGameObjects={getGameObjects}
        />
      )
    ).not.toThrow();
  });

  // Step 17: Test component handles bonus food
  it('handles bonus food in game objects', () => {
    const getGameObjects = vi.fn(() => ({
      ...mockGameObjects,
      bonusFood: { x: 15, y: 15 },
    }));

    expect(() =>
      render(
        <SnakeCanvas
          {...defaultProps}
          gameState={SNAKE_GAME_STATES.PLAYING}
          getGameObjects={getGameObjects}
        />
      )
    ).not.toThrow();
  });

  // Step 18: Test component cleans up game loop on unmount
  it('cleans up game loop on unmount', () => {
    const gameLoopRef = { current: null };
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = render(
      <SnakeCanvas
        {...defaultProps}
        gameState={SNAKE_GAME_STATES.PLAYING}
        gameLoopRef={gameLoopRef}
      />
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  // Step 19: Test draws when game state is PAUSED (static display)
  it('draws when game state is PAUSED', () => {
    const getGameObjects = vi.fn(() => mockGameObjects);

    render(
      <SnakeCanvas
        {...defaultProps}
        gameState={SNAKE_GAME_STATES.PAUSED}
        getGameObjects={getGameObjects}
      />
    );

    // Initial draw should occur
    expect(getGameObjects).toHaveBeenCalled();
  });

  // Step 20: Test component handles food with isBonus flag
  it('handles food with isBonus flag', () => {
    const getGameObjects = vi.fn(() => ({
      ...mockGameObjects,
      food: { x: 10, y: 10, isBonus: true },
    }));

    expect(() =>
      render(
        <SnakeCanvas
          {...defaultProps}
          gameState={SNAKE_GAME_STATES.PLAYING}
          getGameObjects={getGameObjects}
        />
      )
    ).not.toThrow();
  });

  // Step 21: Test canvas has style attribute
  it('has style attribute', () => {
    const { container } = render(<SnakeCanvas {...defaultProps} />);

    const canvas = container.querySelector('canvas');
    // Canvas should have style attribute
    expect(canvas).toHaveAttribute('style');
  });

  // Step 22: Test canvas has image-rendering style
  it('has image-rendering style defined', () => {
    const { container } = render(<SnakeCanvas {...defaultProps} />);

    const canvas = container.querySelector('canvas');
    // Canvas should have image-rendering style
    expect(canvas.getAttribute('style')).toContain('image-rendering');
  });

  // Step 23: Test canvas has pixelated image rendering
  it('has pixelated image rendering style', () => {
    const { container } = render(<SnakeCanvas {...defaultProps} />);

    const canvas = container.querySelector('canvas');
    expect(canvas.style.imageRendering).toBe('pixelated');
  });

  // Step 24: Test game loop respects game speed
  it('respects game speed for loop timing', () => {
    const moveSnake = vi.fn(() => true);
    const getGameSpeed = vi.fn(() => 200);
    const gameLoopRef = { current: null };

    render(
      <SnakeCanvas
        {...defaultProps}
        gameState={SNAKE_GAME_STATES.PLAYING}
        moveSnake={moveSnake}
        getGameSpeed={getGameSpeed}
        gameLoopRef={gameLoopRef}
      />
    );

    // With speed of 200ms, after 150ms we should not have a second call
    act(() => {
      vi.advanceTimersByTime(150);
    });

    const callCountAtFirstInterval = moveSnake.mock.calls.length;

    // After another 100ms (total 250ms) we should have another call
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(moveSnake.mock.calls.length).toBeGreaterThan(callCountAtFirstInterval);
  });

  // Step 25: Test component handles long snake
  it('handles long snake array', () => {
    const longSnake = Array.from({ length: 50 }, (_, i) => ({ x: i % 20, y: Math.floor(i / 20) }));
    const getGameObjects = vi.fn(() => ({
      ...mockGameObjects,
      snake: longSnake,
    }));

    expect(() =>
      render(
        <SnakeCanvas
          {...defaultProps}
          gameState={SNAKE_GAME_STATES.PLAYING}
          getGameObjects={getGameObjects}
        />
      )
    ).not.toThrow();
  });

  // Step 26: Test component unmounts without errors
  it('unmounts without errors', () => {
    const { unmount } = render(
      <SnakeCanvas {...defaultProps} gameState={SNAKE_GAME_STATES.PLAYING} />
    );

    // Should unmount without throwing
    expect(() => unmount()).not.toThrow();
  });

  // Step 27: Test component handles null food
  it('handles null food gracefully', () => {
    const getGameObjects = vi.fn(() => ({
      ...mockGameObjects,
      food: null,
    }));

    expect(() =>
      render(
        <SnakeCanvas
          {...defaultProps}
          gameState={SNAKE_GAME_STATES.PLAYING}
          getGameObjects={getGameObjects}
        />
      )
    ).not.toThrow();
  });

  // Step 28: Test game loop clears when transitioning from PLAYING to another state
  it('clears game loop when transitioning from PLAYING to PAUSED', () => {
    const gameLoopRef = { current: null };
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { rerender } = render(
      <SnakeCanvas
        {...defaultProps}
        gameState={SNAKE_GAME_STATES.PLAYING}
        gameLoopRef={gameLoopRef}
      />
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender(
      <SnakeCanvas
        {...defaultProps}
        gameState={SNAKE_GAME_STATES.PAUSED}
        gameLoopRef={gameLoopRef}
      />
    );

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
