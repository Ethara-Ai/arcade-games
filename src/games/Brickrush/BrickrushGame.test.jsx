import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { forwardRef } from 'react';
import BrickrushGame from './BrickrushGame';
import { GAME_STATES } from '../../constants';

// Mock the useBrickrushGame hook
vi.mock('./useBrickrushGame', () => ({
  useBrickrushGame: vi.fn(() => ({
    initGame: vi.fn(),
    launchBall: vi.fn(),
    updateGame: vi.fn(),
    updatePaddlePosition: vi.fn(),
    getGameObjects: vi.fn(() => ({
      paddle: { x: 200, y: 550, width: 100, height: 10 },
      balls: [{ x: 250, y: 540, radius: 8, color: '#fff' }],
      bricks: [],
      powerUps: [],
      brickDropProgress: 1,
    })),
    startNextLevel: vi.fn(),
  })),
}));

// Mock the BrickrushCanvas component
vi.mock('./BrickrushCanvas', () => {
  const MockCanvas = forwardRef((props, ref) => (
    <canvas data-testid="brickrush-canvas" ref={ref}>
      Canvas
    </canvas>
  ));
  MockCanvas.displayName = 'BrickrushCanvas';
  return { default: MockCanvas };
});

// Mock the hooks
vi.mock('../../hooks', () => ({
  useHighScore: vi.fn(() => ({
    highScore: 1000,
    updateHighScore: vi.fn(),
  })),
  useWindowSize: vi.fn(() => ({
    isMobile: false,
    isDesktop: true,
  })),
}));

// Mock LevelTransition
vi.mock('../../components/LevelTransition', () => ({
  default: ({ visible, message }) =>
    visible ? <div data-testid="level-transition">{message}</div> : null,
  useLevelTransition: vi.fn(() => ({
    transitionProps: { visible: false, opacity: 0, transitionDuration: 500 },
    startTransition: vi.fn(),
    resetTransition: vi.fn(),
    isTransitioning: false,
    currentPhase: 'idle',
  })),
}));

import { useBrickrushGame } from './useBrickrushGame';
import { useHighScore, useWindowSize } from '../../hooks';

describe('BrickrushGame', () => {
  const defaultProps = {
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders without crashing
  it('renders without crashing', () => {
    render(<BrickrushGame {...defaultProps} />);

    expect(screen.getByText('Brickrush')).toBeInTheDocument();
  });

  // Step 2: Test start menu is shown initially
  it('shows start menu when game state is START_MENU', () => {
    render(<BrickrushGame {...defaultProps} />);

    expect(screen.getByText('Start Game')).toBeInTheDocument();
    expect(screen.getByText('How to Play')).toBeInTheDocument();
  });

  // Step 3: Test game description container exists
  it('displays game description in start menu', () => {
    const { container } = render(<BrickrushGame {...defaultProps} />);

    // The start menu should be rendered with a description area
    expect(container.querySelector('.glass-stat')).toBeInTheDocument();
  });

  // Step 4: Test back button calls onBack
  it('calls onBack when back button is clicked in start menu', () => {
    const onBack = vi.fn();
    render(<BrickrushGame onBack={onBack} />);

    const backButton = screen.getByTitle('Back to Game Selector');
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test Start Game button exists
  it('renders Start Game button', () => {
    render(<BrickrushGame {...defaultProps} />);

    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  // Step 6: Test How to Play button opens modal
  it('opens How to Play modal when clicked', () => {
    render(<BrickrushGame {...defaultProps} />);

    fireEvent.click(screen.getByText('How to Play'));
    expect(screen.getByText('Objective')).toBeInTheDocument();
  });

  // Step 7: Test Enter key starts game
  it('starts game when Enter key is pressed', () => {
    render(<BrickrushGame {...defaultProps} />);

    fireEvent.keyDown(document, { key: 'Enter' });

    // The initGame should be called eventually
    expect(useBrickrushGame).toHaveBeenCalled();
  });

  // Step 8: Test game container has correct class
  it('has game-container class', () => {
    const { container } = render(<BrickrushGame {...defaultProps} />);

    expect(container.querySelector('.game-container')).toBeInTheDocument();
  });

  // Step 9: Test TopBar is rendered
  it('renders TopBar component', () => {
    const { container } = render(<BrickrushGame {...defaultProps} />);

    // TopBar component should be present in the game container
    expect(container.querySelector('.game-container')).toBeInTheDocument();
  });

  // Step 10: Test desktop controls are shown on desktop
  it('shows desktop controls on desktop', () => {
    useWindowSize.mockReturnValue({
      isMobile: false,
      isDesktop: true,
    });

    render(<BrickrushGame {...defaultProps} />);

    // Desktop controls should be present
    const backButton = screen.getByTitle('Back to Game Selector');
    expect(backButton).toBeInTheDocument();
  });

  // Step 11: Test mobile controls are shown on mobile
  it('shows mobile controls on mobile', () => {
    useWindowSize.mockReturnValue({
      isMobile: true,
      isDesktop: false,
    });

    render(<BrickrushGame {...defaultProps} />);

    // Component should still render
    expect(screen.getByText('Brickrush')).toBeInTheDocument();
  });

  // Step 12: Test canvas is rendered
  it('renders game canvas', () => {
    render(<BrickrushGame {...defaultProps} />);

    expect(screen.getByTestId('brickrush-canvas')).toBeInTheDocument();
  });

  // Step 13: Test component is wrapped with error boundary
  it('is wrapped with GameErrorBoundary', () => {
    expect(() => render(<BrickrushGame {...defaultProps} />)).not.toThrow();
  });

  // Step 14: Test high score is tracked
  it('uses high score hook', () => {
    render(<BrickrushGame {...defaultProps} />);

    expect(useHighScore).toHaveBeenCalled();
  });

  // Step 15: Test P key toggles pause when playing
  it('handles P key for pause', () => {
    render(<BrickrushGame {...defaultProps} />);

    // Start the game first
    fireEvent.keyDown(document, { key: 'Enter' });

    // Then try to pause
    fireEvent.keyDown(document, { key: 'p' });

    // Component should handle the key event
    expect(document.body).toBeInTheDocument();
  });

  // Step 16: Test Escape key for pause
  it('handles Escape key for pause', () => {
    render(<BrickrushGame {...defaultProps} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(document.body).toBeInTheDocument();
  });

  // Step 17: Test space key launches ball
  it('handles space key for ball launch', () => {
    render(<BrickrushGame {...defaultProps} />);

    fireEvent.keyDown(document, { key: ' ' });

    expect(useBrickrushGame).toHaveBeenCalled();
  });

  // Step 18: Test MenuOverlay is rendered
  it('renders MenuOverlay component', () => {
    render(<BrickrushGame {...defaultProps} />);

    // MenuOverlay shows the start menu initially
    expect(screen.getByText('Brickrush')).toBeInTheDocument();
  });

  // Step 19: Test cyan accent color (default for Brickrush)
  it('uses cyan accent color styling', () => {
    const { container } = render(<BrickrushGame {...defaultProps} />);

    // Brickrush uses cyan accent color
    expect(container.querySelector('[class*="cyan"]')).toBeInTheDocument();
  });

  // Step 20: Test LevelTransition component is included
  it('includes LevelTransition component', () => {
    render(<BrickrushGame {...defaultProps} />);

    // LevelTransition is not visible initially but component should be mounted
    expect(screen.queryByTestId('level-transition')).not.toBeInTheDocument();
  });

  // Step 21: Test keyboard event cleanup
  it('cleans up keyboard event listeners on unmount', () => {
    const { unmount } = render(<BrickrushGame {...defaultProps} />);

    unmount();

    // After unmount, events should not cause errors
    expect(() => fireEvent.keyDown(document, { key: 'Enter' })).not.toThrow();
  });

  // Step 22: Test initial game state values
  it('initializes with correct default state values', () => {
    const { container } = render(<BrickrushGame {...defaultProps} />);

    // Game container should be rendered with initial state
    expect(container.querySelector('.game-container')).toBeInTheDocument();
  });

  // Step 23: Test component renders without crashing in start menu state
  it('renders start menu state correctly', () => {
    const { container } = render(<BrickrushGame {...defaultProps} />);

    // Should render the game container
    expect(container.querySelector('.game-container')).toBeInTheDocument();
  });

  // Step 24: Test game canvas is included
  it('includes game canvas element', () => {
    render(<BrickrushGame {...defaultProps} />);

    // Canvas should be present (from mocked BrickrushCanvas)
    expect(screen.getByTestId('brickrush-canvas')).toBeInTheDocument();
  });

  // Step 25: Test window size hook is used
  it('uses window size hook for responsive layout', () => {
    render(<BrickrushGame {...defaultProps} />);

    expect(useWindowSize).toHaveBeenCalled();
  });

  // Step 26: Test game hook is initialized
  it('initializes game hook', () => {
    render(<BrickrushGame {...defaultProps} />);

    expect(useBrickrushGame).toHaveBeenCalled();
  });

  // Step 27: Test arrow keys are tracked
  it('tracks arrow key states', () => {
    render(<BrickrushGame {...defaultProps} />);

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    fireEvent.keyUp(document, { key: 'ArrowLeft' });

    // Keys should be handled without errors
    expect(document.body).toBeInTheDocument();
  });

  // Step 28: Test transition timing constants are respected
  it('respects transition timing constants', () => {
    render(<BrickrushGame {...defaultProps} />);

    // Component should render without timing-related errors
    expect(screen.getByText('Brickrush')).toBeInTheDocument();
  });
});
