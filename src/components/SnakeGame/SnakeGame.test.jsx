import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SnakeGame from './SnakeGame';

describe('SnakeGame', () => {
  const defaultProps = {
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage mock
    window.localStorage.getItem.mockReturnValue(null);
  });

  // Step 1: Test component renders start screen
  // Should show start menu initially
  it('renders start menu initially', () => {
    render(<SnakeGame {...defaultProps} />);
    
    // Multiple "Snake" texts exist - one in the title, one in the start menu
    const snakeTitles = screen.getAllByText('Snake');
    expect(snakeTitles.length).toBeGreaterThan(0);
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  // Step 2: Test canvas renders
  // Should render a canvas element for the game
  it('renders a canvas element', () => {
    const { container } = render(<SnakeGame {...defaultProps} />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  // Step 3: Test back button calls onBack
  // Back button should navigate to game selector
  it('calls onBack when back button in start menu is clicked', () => {
    const onBack = vi.fn();
    render(<SnakeGame onBack={onBack} />);
    
    // Find the back button in the start menu (first one)
    const backButtons = screen.getAllByTitle('Back to Game Selector');
    fireEvent.click(backButtons[0]);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // Step 4: Test Start Game button starts the game
  // Clicking start should change game state
  it('starts game when Start Game button is clicked', () => {
    render(<SnakeGame {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Start Game'));
    
    // After starting, the start menu overlay should be gone
    // and control buttons should be visible
    expect(screen.queryByText('Start Game')).not.toBeInTheDocument();
  });

  // Step 5: Test How to Play button opens modal
  // Should show help modal when clicked
  it('opens How to Play modal when button is clicked', () => {
    render(<SnakeGame {...defaultProps} />);
    
    fireEvent.click(screen.getByText('How to Play'));
    
    // Modal should be visible - check for modal content
    expect(screen.getByText('Objective')).toBeInTheDocument();
  });

  // Step 6: Test score display
  // Should show initial score of 0
  it('displays score and high score', () => {
    render(<SnakeGame {...defaultProps} />);
    
    // Score boxes should be visible
    const scoreLabels = screen.getAllByText('Score');
    expect(scoreLabels.length).toBeGreaterThan(0);
    
    const bestLabels = screen.getAllByText('Best');
    expect(bestLabels.length).toBeGreaterThan(0);
  });

  // Step 7: Test New Game button
  // Should restart the game
  it('restarts game when New Game button is clicked', () => {
    render(<SnakeGame {...defaultProps} />);
    
    // Start the game first
    fireEvent.click(screen.getByText('Start Game'));
    
    // Click New Game
    fireEvent.click(screen.getByText('New Game'));
    
    // Game should continue running (not show start menu)
    expect(screen.queryByText('Start Game')).not.toBeInTheDocument();
  });

  // Step 8: Test keyboard controls start game
  // Pressing arrow key should start the game
  it('starts game when arrow key is pressed', () => {
    render(<SnakeGame {...defaultProps} />);
    
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    
    // Game should start
    expect(screen.queryByText('Start Game')).not.toBeInTheDocument();
  });

  // Step 9: Test pause functionality
  // Pressing P should pause the game
  it('pauses game when P key is pressed during play', () => {
    render(<SnakeGame {...defaultProps} />);
    
    // Start the game
    fireEvent.click(screen.getByText('Start Game'));
    
    // Pause the game
    fireEvent.keyDown(window, { key: 'p' });
    
    // Paused overlay should appear
    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(screen.getByText('Resume (P)')).toBeInTheDocument();
  });

  // Step 10: Test resume functionality
  // Pressing P again should resume
  it('resumes game when P key is pressed while paused', () => {
    render(<SnakeGame {...defaultProps} />);
    
    // Start and pause
    fireEvent.click(screen.getByText('Start Game'));
    fireEvent.keyDown(window, { key: 'p' });
    
    expect(screen.getByText('Paused')).toBeInTheDocument();
    
    // Resume
    fireEvent.keyDown(window, { key: 'P' });
    
    // Paused overlay should be gone
    expect(screen.queryByText('Paused')).not.toBeInTheDocument();
  });

  // Step 11: Test space bar pauses game
  // Space should toggle pause
  it('toggles pause when Space key is pressed', () => {
    render(<SnakeGame {...defaultProps} />);
    
    // Start the game
    fireEvent.click(screen.getByText('Start Game'));
    
    // Pause with space
    fireEvent.keyDown(window, { key: ' ' });
    
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  // Step 12: Test control buttons appear during gameplay
  // Pause, restart, home buttons should be visible
  it('shows control buttons during gameplay', () => {
    render(<SnakeGame {...defaultProps} />);
    
    // Start the game
    fireEvent.click(screen.getByText('Start Game'));
    
    // Control buttons should be visible
    expect(screen.getByTitle('Pause')).toBeInTheDocument();
    expect(screen.getByTitle('Restart')).toBeInTheDocument();
    expect(screen.getByTitle('Main Menu')).toBeInTheDocument();
  });

  // Step 13: Test high score is loaded from localStorage
  // Should load saved high score (key has 'arcade_' prefix)
  it('loads high score from localStorage', () => {
    window.localStorage.getItem.mockReturnValue('100');
    
    render(<SnakeGame {...defaultProps} />);
    
    expect(window.localStorage.getItem).toHaveBeenCalledWith('arcade_snakeHighScore');
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
