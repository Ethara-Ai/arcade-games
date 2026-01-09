import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import BrickrushCanvas from './BrickrushCanvas';
import { GAME_STATES } from '../../constants';

describe('BrickrushCanvas', () => {
  const mockGameObjects = {
    paddle: { x: 150, y: 550, width: 100, height: 10 },
    balls: [{ x: 200, y: 300, radius: 8, color: '#ffffff' }],
    bricks: [],
    powerUps: [],
    brickDropProgress: 1,
  };

  const defaultProps = {
    gameState: GAME_STATES.START_MENU,
    ballLaunched: false,
    fadeIn: false,
    getGameObjects: vi.fn(() => mockGameObjects),
    updateGame: vi.fn(),
    updatePaddlePosition: vi.fn(),
    launchBall: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders canvas element
  it('renders a canvas element', () => {
    const { container } = render(<BrickrushCanvas {...defaultProps} />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Step 2: Test canvas has game-canvas class
  it('has game-canvas class', () => {
    const { container } = render(<BrickrushCanvas {...defaultProps} />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('game-canvas');
  });

  // Step 3: Test fade-in class is applied when fadeIn is true
  it('applies fade-in class when fadeIn prop is true', () => {
    const { container } = render(<BrickrushCanvas {...defaultProps} fadeIn={true} />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('fade-in');
  });

  // Step 4: Test fade-in class is not applied when fadeIn is false
  it('does not apply fade-in class when fadeIn prop is false', () => {
    const { container } = render(<BrickrushCanvas {...defaultProps} fadeIn={false} />);

    const canvas = container.querySelector('canvas');
    expect(canvas).not.toHaveClass('fade-in');
  });

  // Step 5: Test forwardRef exposes methods
  it('exposes getCanvas method through ref', () => {
    const ref = createRef();
    render(<BrickrushCanvas {...defaultProps} ref={ref} />);

    expect(ref.current.getCanvas).toBeDefined();
    expect(typeof ref.current.getCanvas).toBe('function');
  });

  // Step 6: Test forwardRef exposes getScale
  it('exposes getScale method through ref', () => {
    const ref = createRef();
    render(<BrickrushCanvas {...defaultProps} ref={ref} />);

    expect(ref.current.getScale).toBeDefined();
    expect(typeof ref.current.getScale).toBe('function');
  });

  // Step 7: Test forwardRef exposes getRect
  it('exposes getRect method through ref', () => {
    const ref = createRef();
    render(<BrickrushCanvas {...defaultProps} ref={ref} />);

    expect(ref.current.getRect).toBeDefined();
    expect(typeof ref.current.getRect).toBe('function');
  });

  // Step 8: Test click handler calls launchBall when conditions met
  it('calls launchBall when canvas is clicked and ball not launched', () => {
    const launchBall = vi.fn();
    const { container } = render(
      <BrickrushCanvas
        {...defaultProps}
        gameState={GAME_STATES.PLAYING}
        ballLaunched={false}
        launchBall={launchBall}
      />
    );

    const canvas = container.querySelector('canvas');
    fireEvent.click(canvas);
    expect(launchBall).toHaveBeenCalledTimes(1);
  });

  // Step 9: Test click handler does not call launchBall when ball already launched
  it('does not call launchBall when ball is already launched', () => {
    const launchBall = vi.fn();
    const { container } = render(
      <BrickrushCanvas
        {...defaultProps}
        gameState={GAME_STATES.PLAYING}
        ballLaunched={true}
        launchBall={launchBall}
      />
    );

    const canvas = container.querySelector('canvas');
    fireEvent.click(canvas);
    expect(launchBall).not.toHaveBeenCalled();
  });

  // Step 10: Test click handler does not call launchBall when not playing
  it('does not call launchBall when game state is not PLAYING', () => {
    const launchBall = vi.fn();
    const { container } = render(
      <BrickrushCanvas
        {...defaultProps}
        gameState={GAME_STATES.PAUSED}
        ballLaunched={false}
        launchBall={launchBall}
      />
    );

    const canvas = container.querySelector('canvas');
    fireEvent.click(canvas);
    expect(launchBall).not.toHaveBeenCalled();
  });

  // Step 11: Test display name is set
  it('has correct displayName', () => {
    expect(BrickrushCanvas.displayName).toBe('BrickrushCanvas');
  });

  // Step 12: Test getCanvas returns the canvas element
  it('getCanvas returns the canvas element', () => {
    const ref = createRef();
    const { container } = render(<BrickrushCanvas {...defaultProps} ref={ref} />);

    const canvas = container.querySelector('canvas');
    expect(ref.current.getCanvas()).toBe(canvas);
  });

  // Step 13: Test getScale returns a number
  it('getScale returns a number', () => {
    const ref = createRef();
    render(<BrickrushCanvas {...defaultProps} ref={ref} />);

    const scale = ref.current.getScale();
    expect(typeof scale).toBe('number');
  });

  // Step 14: Test component renders without errors in START_MENU state
  it('renders without errors in START_MENU state', () => {
    expect(() =>
      render(<BrickrushCanvas {...defaultProps} gameState={GAME_STATES.START_MENU} />)
    ).not.toThrow();
  });

  // Step 15: Test component renders without errors in PLAYING state
  it('renders without errors in PLAYING state', () => {
    expect(() =>
      render(<BrickrushCanvas {...defaultProps} gameState={GAME_STATES.PLAYING} />)
    ).not.toThrow();
  });

  // Step 16: Test component renders without errors in PAUSED state
  it('renders without errors in PAUSED state', () => {
    expect(() =>
      render(<BrickrushCanvas {...defaultProps} gameState={GAME_STATES.PAUSED} />)
    ).not.toThrow();
  });

  // Step 17: Test component renders without errors in GAME_OVER state
  it('renders without errors in GAME_OVER state', () => {
    expect(() =>
      render(<BrickrushCanvas {...defaultProps} gameState={GAME_STATES.GAME_OVER} />)
    ).not.toThrow();
  });

  // Step 18: Test component handles empty bricks array
  it('renders correctly with empty bricks array', () => {
    const getGameObjects = vi.fn(() => ({
      ...mockGameObjects,
      bricks: [],
    }));

    expect(() =>
      render(<BrickrushCanvas {...defaultProps} getGameObjects={getGameObjects} />)
    ).not.toThrow();
  });

  // Step 19: Test component handles multiple balls
  it('renders correctly with multiple balls', () => {
    const getGameObjects = vi.fn(() => ({
      ...mockGameObjects,
      balls: [
        { x: 100, y: 300, radius: 8, color: '#ffffff' },
        { x: 200, y: 300, radius: 8, color: '#ffffff' },
        { x: 300, y: 300, radius: 8, color: '#ffffff' },
      ],
    }));

    expect(() =>
      render(<BrickrushCanvas {...defaultProps} getGameObjects={getGameObjects} />)
    ).not.toThrow();
  });

  // Step 20: Test component handles power-ups
  it('renders correctly with power-ups', () => {
    const getGameObjects = vi.fn(() => ({
      ...mockGameObjects,
      powerUps: [{ x: 100, y: 200, size: 20, type: 'MULTIBALL', color: '#ff0000' }],
    }));

    expect(() =>
      render(<BrickrushCanvas {...defaultProps} getGameObjects={getGameObjects} />)
    ).not.toThrow();
  });

  // Step 21: Test component handles brick drop progress
  it('handles brick drop progress animation', () => {
    const getGameObjects = vi.fn(() => ({
      ...mockGameObjects,
      brickDropProgress: 0.5,
    }));

    expect(() =>
      render(<BrickrushCanvas {...defaultProps} getGameObjects={getGameObjects} />)
    ).not.toThrow();
  });

  // Step 22: Test component unmounts without errors
  it('unmounts without errors', () => {
    const { unmount } = render(<BrickrushCanvas {...defaultProps} />);

    expect(() => unmount()).not.toThrow();
  });

  // Step 23: Test component unmounts without errors during PLAYING state
  it('unmounts without errors during PLAYING state', () => {
    const { unmount } = render(
      <BrickrushCanvas {...defaultProps} gameState={GAME_STATES.PLAYING} />
    );

    expect(() => unmount()).not.toThrow();
  });

  // Step 24: Test getRect method exists and is callable
  it('getRect returns a value or null', () => {
    const ref = createRef();
    render(<BrickrushCanvas {...defaultProps} ref={ref} />);

    // getRect may return null if canvas isn't properly rendered in jsdom
    expect(() => ref.current.getRect()).not.toThrow();
  });

  // Step 25: Test component handles bricks with various properties
  it('renders correctly with bricks having various properties', () => {
    const getGameObjects = vi.fn(() => ({
      ...mockGameObjects,
      bricks: [
        [
          { x: 0, y: 0, width: 50, height: 20, status: 1, color: '#ff0000', isSteel: false },
          { x: 60, y: 0, width: 50, height: 20, status: 1, color: '#00ff00', isSteel: true },
        ],
      ],
    }));

    expect(() =>
      render(<BrickrushCanvas {...defaultProps} getGameObjects={getGameObjects} />)
    ).not.toThrow();
  });

  // Step 26: Test canvas click in START_MENU state
  it('does not call launchBall when in START_MENU state', () => {
    const launchBall = vi.fn();
    const { container } = render(
      <BrickrushCanvas
        {...defaultProps}
        gameState={GAME_STATES.START_MENU}
        ballLaunched={false}
        launchBall={launchBall}
      />
    );

    const canvas = container.querySelector('canvas');
    fireEvent.click(canvas);
    expect(launchBall).not.toHaveBeenCalled();
  });

  // Step 27: Test canvas click in GAME_OVER state
  it('does not call launchBall when in GAME_OVER state', () => {
    const launchBall = vi.fn();
    const { container } = render(
      <BrickrushCanvas
        {...defaultProps}
        gameState={GAME_STATES.GAME_OVER}
        ballLaunched={false}
        launchBall={launchBall}
      />
    );

    const canvas = container.querySelector('canvas');
    fireEvent.click(canvas);
    expect(launchBall).not.toHaveBeenCalled();
  });
});
