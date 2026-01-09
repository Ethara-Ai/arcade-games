import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameOverMenu from './GameOverMenu';

describe('GameOverMenu', () => {
  const defaultProps = {
    score: 500,
    highScore: 1000,
    onRestart: vi.fn(),
    onMainMenu: vi.fn(),
  };

  // Step 1: Test component renders Game Over title
  // Should clearly indicate game has ended
  it('renders Game Over title', () => {
    render(<GameOverMenu {...defaultProps} />);
    
    expect(screen.getByText('Game Over')).toBeInTheDocument();
  });

  // Step 2: Test score display
  // Should show current score and high score
  it('displays current score and high score', () => {
    render(<GameOverMenu {...defaultProps} score={500} highScore={1000} />);
    
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Best')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
  });

  // Step 3: Test new high score badge
  // Should show trophy badge when score matches or beats high score
  it('shows new high score badge when score equals high score', () => {
    render(<GameOverMenu {...defaultProps} score={1000} highScore={1000} />);
    
    expect(screen.getByText('New High Score!')).toBeInTheDocument();
  });

  it('shows new high score badge when score exceeds previous high score', () => {
    render(<GameOverMenu {...defaultProps} score={1500} highScore={1500} />);
    
    expect(screen.getByText('New High Score!')).toBeInTheDocument();
  });

  it('does not show new high score badge when score is zero', () => {
    render(<GameOverMenu {...defaultProps} score={0} highScore={0} />);
    
    expect(screen.queryByText('New High Score!')).not.toBeInTheDocument();
  });

  it('does not show new high score badge when score is below high score', () => {
    render(<GameOverMenu {...defaultProps} score={500} highScore={1000} />);
    
    expect(screen.queryByText('New High Score!')).not.toBeInTheDocument();
  });

  // Step 4: Test Play Again button
  // Should call onRestart when clicked
  it('calls onRestart when Play Again button is clicked', () => {
    const onRestart = vi.fn();
    render(<GameOverMenu {...defaultProps} onRestart={onRestart} />);
    
    fireEvent.click(screen.getByText('Play Again'));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test Main Menu button
  // Should call onMainMenu when clicked
  it('calls onMainMenu when Main Menu button is clicked', () => {
    const onMainMenu = vi.fn();
    render(<GameOverMenu {...defaultProps} onMainMenu={onMainMenu} />);
    
    fireEvent.click(screen.getByText('Main Menu'));
    expect(onMainMenu).toHaveBeenCalledTimes(1);
  });

  // Step 6: Test component structure
  // Should have glass overlay styling
  it('has glass-overlay class for styling', () => {
    const { container } = render(<GameOverMenu {...defaultProps} />);
    
    const overlay = container.querySelector('.glass-overlay');
    expect(overlay).toBeInTheDocument();
  });
});
