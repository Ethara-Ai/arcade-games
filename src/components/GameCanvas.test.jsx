import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import GameCanvas from './GameCanvas';
import { GAME_STATES } from '../constants';

describe('GameCanvas', () => {
  const defaultProps = {
    gameState: GAME_STATES.PLAYING,
    score: 0,
    lives: 3,
    currentLevel: 1,
    ballLaunched: false,
    onScoreChange: vi.fn(),
    onLivesChange: vi.fn(),
    onLevelChange: vi.fn(),
    onBallLaunchedChange: vi.fn(),
    onGameOver: vi.fn(),
    _onNextLevel: vi.fn(),
    keys: {},
    fadeIn: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test canvas element renders
  // Should render a canvas element
  it('renders a canvas element', () => {
    const { container } = render(<GameCanvas {...defaultProps} />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('game-canvas');
  });

  // Step 2: Test fade-in class is applied when prop is true
  // Canvas should have fade-in animation class
  it('applies fade-in class when fadeIn is true', () => {
    const { container } = render(<GameCanvas {...defaultProps} fadeIn={true} />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('fade-in');
  });

  it('does not apply fade-in class when fadeIn is false', () => {
    const { container } = render(<GameCanvas {...defaultProps} fadeIn={false} />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toHaveClass('fade-in');
  });

  // Step 3: Test ref exposure
  // Component should expose methods via ref
  it('exposes methods via ref', () => {
    const ref = createRef();
    render(<GameCanvas {...defaultProps} ref={ref} />);
    
    expect(ref.current).toBeDefined();
    expect(typeof ref.current.initGame).toBe('function');
    expect(typeof ref.current.resetPaddleAndBall).toBe('function');
    expect(typeof ref.current.launchBall).toBe('function');
    expect(typeof ref.current.getBalls).toBe('function');
    expect(typeof ref.current.startNextLevel).toBe('function');
  });

  // Step 4: Test initGame method
  // Should initialize game state
  it('initGame method can be called without error', () => {
    const ref = createRef();
    render(<GameCanvas {...defaultProps} ref={ref} />);
    
    expect(() => ref.current.initGame()).not.toThrow();
  });

  // Step 5: Test getBalls returns array
  // Should return balls array
  it('getBalls returns an array', () => {
    const ref = createRef();
    render(<GameCanvas {...defaultProps} ref={ref} />);
    
    const balls = ref.current.getBalls();
    expect(Array.isArray(balls)).toBe(true);
  });

  // Step 6: Test canvas click handler
  // Clicking canvas should trigger ball launch logic
  it('handles canvas click events', () => {
    const onBallLaunchedChange = vi.fn();
    const ref = createRef();
    const { container } = render(
      <GameCanvas 
        {...defaultProps} 
        ref={ref}
        gameState={GAME_STATES.PLAYING}
        ballLaunched={false}
        onBallLaunchedChange={onBallLaunchedChange}
      />
    );
    
    // Initialize game first to have a ball
    ref.current.initGame();
    
    const canvas = container.querySelector('canvas');
    fireEvent.click(canvas);
    
    // The ball should be launched
    expect(onBallLaunchedChange).toHaveBeenCalledWith(true);
  });

  // Step 7: Test canvas doesn't launch ball when already launched
  // Clicking should not launch again if ball is already launched
  it('does not launch ball when already launched', () => {
    const onBallLaunchedChange = vi.fn();
    const ref = createRef();
    const { container } = render(
      <GameCanvas 
        {...defaultProps} 
        ref={ref}
        gameState={GAME_STATES.PLAYING}
        ballLaunched={true}
        onBallLaunchedChange={onBallLaunchedChange}
      />
    );
    
    ref.current.initGame();
    
    const canvas = container.querySelector('canvas');
    fireEvent.click(canvas);
    
    // onBallLaunchedChange may be called during init but not on click
    const callsWithTrue = onBallLaunchedChange.mock.calls.filter(call => call[0] === true);
    expect(callsWithTrue.length).toBe(0);
  });

  // Step 8: Test display name
  // Component should have display name set
  it('has correct display name', () => {
    expect(GameCanvas.displayName).toBe('GameCanvas');
  });

  // Step 9: Test component handles different game states
  // Should work with different game states
  it('renders without error for different game states', () => {
    const { rerender } = render(<GameCanvas {...defaultProps} gameState={GAME_STATES.PLAYING} />);
    
    rerender(<GameCanvas {...defaultProps} gameState={GAME_STATES.PAUSED} />);
    rerender(<GameCanvas {...defaultProps} gameState={GAME_STATES.START_MENU} />);
    rerender(<GameCanvas {...defaultProps} gameState={GAME_STATES.GAME_OVER} />);
    
    // No error thrown means the component handles all states
    expect(true).toBe(true);
  });
});
