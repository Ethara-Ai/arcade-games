import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MenuOverlay from './MenuOverlay';
import { GAME_STATES } from '../constants';

describe('MenuOverlay', () => {
  const defaultProps = {
    gameState: GAME_STATES.START_MENU,
    score: 0,
    highScore: 0,
    isFadingOut: false,
    onStart: vi.fn(),
    onResume: vi.fn(),
    onRestart: vi.fn(),
    onMainMenu: vi.fn(),
    onNextLevel: vi.fn(),
    onBack: vi.fn(),
  };

  // Step 1: Test StartMenu renders when game state is START_MENU
  // Should show the start menu overlay
  it('renders StartMenu when game state is START_MENU', () => {
    render(<MenuOverlay {...defaultProps} gameState={GAME_STATES.START_MENU} />);
    
    expect(screen.getByText('Brickrush')).toBeInTheDocument();
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  // Step 2: Test PauseMenu renders when game state is PAUSED
  // Should show the pause menu overlay
  it('renders PauseMenu when game state is PAUSED', () => {
    render(<MenuOverlay {...defaultProps} gameState={GAME_STATES.PAUSED} />);
    
    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(screen.getByText('Resume (P)')).toBeInTheDocument();
  });

  // Step 3: Test GameOverMenu renders when game state is GAME_OVER
  // Should show the game over menu overlay
  it('renders GameOverMenu when game state is GAME_OVER', () => {
    render(<MenuOverlay {...defaultProps} gameState={GAME_STATES.GAME_OVER} score={500} highScore={1000} />);
    
    expect(screen.getByText('Game Over')).toBeInTheDocument();
    expect(screen.getByText('Play Again')).toBeInTheDocument();
  });

  // Step 4: Test LevelCompleteMenu renders when game state is LEVEL_COMPLETE
  // Should show the level complete menu overlay
  it('renders LevelCompleteMenu when game state is LEVEL_COMPLETE', () => {
    render(<MenuOverlay {...defaultProps} gameState={GAME_STATES.LEVEL_COMPLETE} score={1500} />);
    
    expect(screen.getByText('Level Complete!')).toBeInTheDocument();
    expect(screen.getByText('Next Level')).toBeInTheDocument();
  });

  // Step 5: Test overlay does not render when playing
  // Should return null when actively playing
  it('does not render when game state is PLAYING and not fading out', () => {
    const { container } = render(
      <MenuOverlay {...defaultProps} gameState={GAME_STATES.PLAYING} isFadingOut={false} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  // Step 6: Test overlay renders with fade-out class
  // Should show overlay with fade-out animation
  it('renders with fade-out class when isFadingOut is true', () => {
    const { container } = render(
      <MenuOverlay {...defaultProps} gameState={GAME_STATES.START_MENU} isFadingOut={true} />
    );
    
    const overlay = container.querySelector('.overlay');
    expect(overlay).toHaveClass('fade-out');
  });

  // Step 7: Test correct score and highScore are passed to GameOverMenu
  // GameOverMenu should receive proper props
  it('passes correct score and highScore to GameOverMenu', () => {
    render(
      <MenuOverlay {...defaultProps} gameState={GAME_STATES.GAME_OVER} score={999} highScore={2000} />
    );
    
    expect(screen.getByText('999')).toBeInTheDocument();
    expect(screen.getByText('2000')).toBeInTheDocument();
  });
});
