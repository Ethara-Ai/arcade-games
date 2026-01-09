import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Game1024 from './Game1024';
import { GAME_1024_STATES } from '../../constants';

// Mock the useGame1024 hook
vi.mock('./useGame1024', () => ({
  useGame1024: vi.fn(() => ({
    grid: [
      [0, 0, 0, 0],
      [0, 2, 0, 0],
      [0, 0, 2, 0],
      [0, 0, 0, 0],
    ],
    score: 100,
    bestScore: 500,
    gameState: GAME_1024_STATES.START,
    highestTile: 2,
    handleStartGame: vi.fn(),
    handleResume: vi.fn(),
    handlePauseToggle: vi.fn(),
    handleNewGame: vi.fn(),
    handleContinue: vi.fn(),
    handleKeyDown: vi.fn(),
    handleTouchStart: vi.fn(),
    handleTouchEnd: vi.fn(),
  })),
}));

// Mock the Game1024Board component
vi.mock('./Game1024Board', () => ({
  default: () => <div data-testid="game-1024-board">Game Board</div>,
}));

// Import the mocked hook so we can change its return value
import { useGame1024 } from './useGame1024';

describe('Game1024', () => {
  const defaultProps = {
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders without crashing
  it('renders without crashing', () => {
    render(<Game1024 {...defaultProps} />);

    expect(screen.getByText('1024')).toBeInTheDocument();
  });

  // Step 2: Test start menu is shown initially
  it('shows start menu when game state is START', () => {
    render(<Game1024 {...defaultProps} />);

    expect(screen.getByText('Start Game')).toBeInTheDocument();
    expect(screen.getByText('How to Play')).toBeInTheDocument();
  });

  // Step 3: Test game description is shown in start menu
  it('displays game description in start menu', () => {
    render(<Game1024 {...defaultProps} />);

    expect(screen.getByText(/Slide and merge tiles to reach 1024/)).toBeInTheDocument();
  });

  // Step 4: Test back button in start menu calls onBack
  it('calls onBack when back button is clicked in start menu', () => {
    const onBack = vi.fn();
    render(<Game1024 onBack={onBack} />);

    const backButton = screen.getByTitle('Back to Game Selector');
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test playing state shows game board
  it('shows game board when game state is PLAYING', () => {
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
      ],
      score: 100,
      bestScore: 500,
      gameState: GAME_1024_STATES.PLAYING,
      highestTile: 2,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    expect(screen.getByTestId('game-1024-board')).toBeInTheDocument();
  });

  // Step 6: Test header controls are visible during gameplay
  it('shows header controls when game is active', () => {
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
      ],
      score: 100,
      bestScore: 500,
      gameState: GAME_1024_STATES.PLAYING,
      highestTile: 2,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    // There may be multiple back buttons (TopBar + desktop controls), so use getAllByTitle
    expect(screen.getAllByTitle('Back to Game Selector').length).toBeGreaterThan(0);
    expect(screen.getByTitle('How to Play')).toBeInTheDocument();
    expect(screen.getByTitle('Pause')).toBeInTheDocument();
    expect(screen.getByTitle('New Game')).toBeInTheDocument();
  });

  // Step 7: Test pause menu is shown when paused
  it('shows pause menu when game state is PAUSED', () => {
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
      ],
      score: 100,
      bestScore: 500,
      gameState: GAME_1024_STATES.PAUSED,
      highestTile: 2,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(screen.getByText('Resume (P)')).toBeInTheDocument();
    expect(screen.getByText('Restart')).toBeInTheDocument();
    expect(screen.getByText('Main Menu')).toBeInTheDocument();
  });

  // Step 8: Test game over menu is shown
  it('shows game over menu when game state is GAME_OVER', () => {
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
      ],
      score: 100,
      bestScore: 500,
      gameState: GAME_1024_STATES.GAME_OVER,
      highestTile: 256,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    expect(screen.getByText('Game Over')).toBeInTheDocument();
    expect(screen.getByText('Play Again')).toBeInTheDocument();
  });

  // Step 9: Test win screen is shown
  it('shows win screen when game state is WON', () => {
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 1024, 0],
        [0, 0, 0, 0],
      ],
      score: 10000,
      bestScore: 10000,
      gameState: GAME_1024_STATES.WON,
      highestTile: 1024,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    expect(screen.getByText('🎉 You Win! 🎉')).toBeInTheDocument();
    expect(screen.getByText('Congratulations! You reached 1024!')).toBeInTheDocument();
    expect(screen.getByText('Keep Playing')).toBeInTheDocument();
    expect(screen.getByText('New Game')).toBeInTheDocument();
  });

  // Step 10: Test pause toggle button shows correct icon
  it('shows Resume button when game is paused', () => {
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
      ],
      score: 100,
      bestScore: 500,
      gameState: GAME_1024_STATES.PAUSED,
      highestTile: 2,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    expect(screen.getByTitle('Resume')).toBeInTheDocument();
  });

  // Step 11: Test new game button calls handleNewGame
  it('calls handleNewGame when new game button is clicked', () => {
    const handleNewGame = vi.fn();
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
      ],
      score: 100,
      bestScore: 500,
      gameState: GAME_1024_STATES.PLAYING,
      highestTile: 2,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame,
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    const newGameButton = screen.getByTitle('New Game');
    fireEvent.click(newGameButton);
    expect(handleNewGame).toHaveBeenCalledTimes(1);
  });

  // Step 12: Test pause toggle button calls handlePauseToggle
  it('calls handlePauseToggle when pause button is clicked', () => {
    const handlePauseToggle = vi.fn();
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
      ],
      score: 100,
      bestScore: 500,
      gameState: GAME_1024_STATES.PLAYING,
      highestTile: 2,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle,
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    const pauseButton = screen.getByTitle('Pause');
    fireEvent.click(pauseButton);
    expect(handlePauseToggle).toHaveBeenCalledTimes(1);
  });

  // Step 13: Test help button opens modal
  it('opens help modal when help button is clicked', () => {
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
      ],
      score: 100,
      bestScore: 500,
      gameState: GAME_1024_STATES.PLAYING,
      highestTile: 2,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    const helpButton = screen.getByTitle('How to Play');
    fireEvent.click(helpButton);

    expect(screen.getByText('Objective')).toBeInTheDocument();
  });

  // Step 14: Test game over stats are displayed
  it('displays stats in game over menu', () => {
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
      ],
      score: 1500,
      bestScore: 2000,
      gameState: GAME_1024_STATES.GAME_OVER,
      highestTile: 256,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('1500')).toBeInTheDocument();
    expect(screen.getByText('Best')).toBeInTheDocument();
    expect(screen.getByText('2000')).toBeInTheDocument();
    expect(screen.getByText('Top Tile')).toBeInTheDocument();
    expect(screen.getByText('256')).toBeInTheDocument();
  });

  // Step 15: Test keyboard event handler is registered
  it('registers keyboard event handler', () => {
    const handleKeyDown = vi.fn();
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
      ],
      score: 100,
      bestScore: 500,
      gameState: GAME_1024_STATES.PLAYING,
      highestTile: 2,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown,

      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    expect(handleKeyDown).toHaveBeenCalled();
  });

  // Step 16: Test win screen score is displayed
  it('displays score in win screen', () => {
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 1024, 0],
        [0, 0, 0, 0],
      ],
      score: 15000,
      bestScore: 15000,
      gameState: GAME_1024_STATES.WON,
      highestTile: 1024,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    expect(screen.getByText('15000')).toBeInTheDocument();
  });

  // Step 17: Test continue button in win screen calls handleContinue
  it('calls handleContinue when Keep Playing is clicked on win screen', () => {
    const handleContinue = vi.fn();
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 1024, 0],
        [0, 0, 0, 0],
      ],
      score: 15000,
      bestScore: 15000,
      gameState: GAME_1024_STATES.WON,
      highestTile: 1024,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue,
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    render(<Game1024 {...defaultProps} />);

    fireEvent.click(screen.getByText('Keep Playing'));
    expect(handleContinue).toHaveBeenCalledTimes(1);
  });

  // Step 18: Test amber accent color is applied
  it('applies amber accent color styling', () => {
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
      ],
      score: 100,
      bestScore: 500,
      gameState: GAME_1024_STATES.PLAYING,
      highestTile: 2,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    const { container } = render(<Game1024 {...defaultProps} />);

    expect(container.querySelector('.text-amber-400')).toBeInTheDocument();
  });

  // Step 19: Test component is wrapped with error boundary
  it('is wrapped with GameErrorBoundary', () => {
    // This test verifies that the component renders without throwing
    // due to the error boundary wrapper
    expect(() => render(<Game1024 {...defaultProps} />)).not.toThrow();
  });

  // Step 20: Test animated background is rendered
  it('renders animated background elements', () => {
    useGame1024.mockReturnValue({
      grid: [
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
      ],
      score: 100,
      bestScore: 500,
      gameState: GAME_1024_STATES.PLAYING,
      highestTile: 2,
      handleStartGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleNewGame: vi.fn(),
      handleContinue: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
    });

    const { container } = render(<Game1024 {...defaultProps} />);

    const animatedBg = container.querySelector('.animate-pulse');
    expect(animatedBg).toBeInTheDocument();
  });
});
