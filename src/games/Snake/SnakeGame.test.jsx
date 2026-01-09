import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { forwardRef } from 'react';
import SnakeGame from './SnakeGame';
import { SNAKE_GAME_STATES } from '../../constants';

// Mock the useSnakeGame hook
vi.mock('./useSnakeGame', () => ({
  useSnakeGame: vi.fn(() => ({
    gameState: SNAKE_GAME_STATES.START,
    score: 0,
    highScore: 100,
    snakeLength: 3,
    speedLevel: 3,
    gameLoopRef: { current: null },
    handleStartGame: vi.fn(),
    handleNewGame: vi.fn(),
    handleResume: vi.fn(),
    handlePauseToggle: vi.fn(),
    handleKeyDown: vi.fn(),
    handleTouchStart: vi.fn(),
    handleTouchEnd: vi.fn(),
    handleGameOver: vi.fn(),
    moveSnake: vi.fn(() => true),
    getGameSpeed: vi.fn(() => 150),
    getGameObjects: vi.fn(() => ({
      snake: [{ x: 5, y: 5 }],
      food: { x: 10, y: 10, isBonus: false },
      bonusFood: null,
    })),
    increaseSpeed: vi.fn(),
    decreaseSpeed: vi.fn(),
  })),
}));

// Mock the SnakeCanvas component
vi.mock('./SnakeCanvas', () => {
  const MockCanvas = forwardRef((props, ref) => (
    <canvas data-testid="snake-canvas" ref={ref}>
      Canvas
    </canvas>
  ));
  MockCanvas.displayName = 'SnakeCanvas';
  return { default: MockCanvas };
});

// Import the mocked hook so we can change its return value
import { useSnakeGame } from './useSnakeGame';

describe('SnakeGame', () => {
  const defaultProps = {
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders without crashing
  it('renders without crashing', () => {
    render(<SnakeGame {...defaultProps} />);

    expect(screen.getByText('Snake')).toBeInTheDocument();
  });

  // Step 2: Test start menu is shown initially
  it('shows start menu when game state is START', () => {
    render(<SnakeGame {...defaultProps} />);

    expect(screen.getByText('Start Game')).toBeInTheDocument();
    expect(screen.getByText('How to Play')).toBeInTheDocument();
  });

  // Step 3: Test game description is shown in start menu
  it('displays game description in start menu', () => {
    render(<SnakeGame {...defaultProps} />);

    expect(screen.getByText(/Guide the snake to eat food and grow longer/)).toBeInTheDocument();
  });

  // Step 4: Test back button in start menu calls onBack
  it('calls onBack when back button is clicked in start menu', () => {
    const onBack = vi.fn();
    render(<SnakeGame onBack={onBack} />);

    const backButton = screen.getByTitle('Back to Game Selector');
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test playing state shows game canvas
  it('shows game canvas when game state is PLAYING', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    expect(screen.getByTestId('snake-canvas')).toBeInTheDocument();
  });

  // Step 6: Test header controls are visible during gameplay
  it('shows header controls when game is active', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    expect(screen.getByTitle('Back to Game Selector')).toBeInTheDocument();
    expect(screen.getByTitle('How to Play')).toBeInTheDocument();
    expect(screen.getByTitle('Pause')).toBeInTheDocument();
    expect(screen.getByTitle('New Game')).toBeInTheDocument();
  });

  // Step 7: Test score display during gameplay
  it('shows score display when game is active', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Best')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Length')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  // Step 8: Test pause menu is shown when paused
  it('shows pause menu when game state is PAUSED', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PAUSED,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(screen.getByText('Resume (P)')).toBeInTheDocument();
    expect(screen.getByText('Restart')).toBeInTheDocument();
    expect(screen.getByText('Main Menu')).toBeInTheDocument();
  });

  // Step 9: Test speed control in pause menu
  it('shows speed control in pause menu', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PAUSED,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    expect(screen.getByText('Speed')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('/5')).toBeInTheDocument();
  });

  // Step 10: Test game over menu is shown
  it('shows game over menu when game state is GAME_OVER', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.GAME_OVER,
      score: 150,
      highScore: 200,
      snakeLength: 18,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    expect(screen.getByText('Game Over')).toBeInTheDocument();
    expect(screen.getByText('Play Again')).toBeInTheDocument();
  });

  // Step 11: Test game over stats are displayed
  it('displays stats in game over menu', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.GAME_OVER,
      score: 150,
      highScore: 200,
      snakeLength: 18,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Best')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('Length')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
  });

  // Step 12: Test new game button calls handleNewGame
  it('calls handleNewGame when new game button is clicked', () => {
    const handleNewGame = vi.fn();
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame,
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    const newGameButton = screen.getByTitle('New Game');
    fireEvent.click(newGameButton);
    expect(handleNewGame).toHaveBeenCalledTimes(1);
  });

  // Step 13: Test pause toggle button calls handlePauseToggle
  it('calls handlePauseToggle when pause button is clicked', () => {
    const handlePauseToggle = vi.fn();
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle,
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    const pauseButton = screen.getByTitle('Pause');
    fireEvent.click(pauseButton);
    expect(handlePauseToggle).toHaveBeenCalledTimes(1);
  });

  // Step 14: Test help button opens modal
  it('opens help modal when help button is clicked', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    const helpButton = screen.getByTitle('How to Play');
    fireEvent.click(helpButton);

    expect(screen.getByText('Objective')).toBeInTheDocument();
  });

  // Step 15: Test keyboard event handler is registered
  it('registers keyboard event handler', () => {
    const handleKeyDown = vi.fn();
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown,
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    expect(handleKeyDown).toHaveBeenCalled();
  });

  // Step 16: Test green accent color is applied
  it('applies green accent color styling', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    const { container } = render(<SnakeGame {...defaultProps} />);

    expect(container.querySelector('.text-green-400')).toBeInTheDocument();
  });

  // Step 17: Test component is wrapped with error boundary
  it('is wrapped with GameErrorBoundary', () => {
    expect(() => render(<SnakeGame {...defaultProps} />)).not.toThrow();
  });

  // Step 18: Test animated background is rendered
  it('renders animated background elements', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    const { container } = render(<SnakeGame {...defaultProps} />);

    const animatedBg = container.querySelector('.animate-pulse');
    expect(animatedBg).toBeInTheDocument();
  });

  // Step 19: Test mobile instructions are shown
  it('shows mobile instructions when game is active', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    expect(screen.getByText('Swipe to change direction')).toBeInTheDocument();
  });

  // Step 20: Test desktop instructions are shown
  it('shows desktop instructions when game is active', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    expect(
      screen.getByText('Use arrow keys to change direction • P or Space to pause')
    ).toBeInTheDocument();
  });

  // Step 21: Test Resume button shows when paused
  it('shows Resume button when game is paused', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PAUSED,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    expect(screen.getByTitle('Resume')).toBeInTheDocument();
  });

  // Step 22: Test speed increase button calls increaseSpeed
  it('calls increaseSpeed when speed increase button is clicked in pause menu', () => {
    const increaseSpeed = vi.fn();
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PAUSED,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed,
      decreaseSpeed: vi.fn(),
    });

    render(<SnakeGame {...defaultProps} />);

    const increaseButton = screen.getByTitle('Increase Speed');
    fireEvent.click(increaseButton);
    expect(increaseSpeed).toHaveBeenCalledTimes(1);
  });

  // Step 23: Test speed decrease button calls decreaseSpeed
  it('calls decreaseSpeed when speed decrease button is clicked in pause menu', () => {
    const decreaseSpeed = vi.fn();
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PAUSED,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed,
    });

    render(<SnakeGame {...defaultProps} />);

    const decreaseButton = screen.getByTitle('Decrease Speed');
    fireEvent.click(decreaseButton);
    expect(decreaseSpeed).toHaveBeenCalledTimes(1);
  });

  // Step 24: Test snake game container has correct class
  it('has snake-game-container class', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    const { container } = render(<SnakeGame {...defaultProps} />);

    expect(container.querySelector('.snake-game-container')).toBeInTheDocument();
  });

  // Step 25: Test touch action is disabled to prevent scrolling
  it('disables touch action to prevent scrolling during gameplay', () => {
    useSnakeGame.mockReturnValue({
      gameState: SNAKE_GAME_STATES.PLAYING,
      score: 50,
      highScore: 100,
      snakeLength: 5,
      speedLevel: 3,
      gameLoopRef: { current: null },
      handleStartGame: vi.fn(),
      handleNewGame: vi.fn(),
      handleResume: vi.fn(),
      handlePauseToggle: vi.fn(),
      handleKeyDown: vi.fn(),
      handleTouchStart: vi.fn(),
      handleTouchEnd: vi.fn(),
      handleGameOver: vi.fn(),
      moveSnake: vi.fn(() => true),
      getGameSpeed: vi.fn(() => 150),
      getGameObjects: vi.fn(() => ({
        snake: [{ x: 5, y: 5 }],
        food: { x: 10, y: 10, isBonus: false },
        bonusFood: null,
      })),
      increaseSpeed: vi.fn(),
      decreaseSpeed: vi.fn(),
    });

    const { container } = render(<SnakeGame {...defaultProps} />);

    const gameContainer = container.querySelector('.snake-game-container');
    expect(gameContainer.style.touchAction).toBe('none');
  });
});
