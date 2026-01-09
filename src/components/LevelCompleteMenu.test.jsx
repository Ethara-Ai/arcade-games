import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LevelCompleteMenu from './LevelCompleteMenu';

describe('LevelCompleteMenu', () => {
  const defaultProps = {
    score: 1500,
    level: 3,
    onNextLevel: vi.fn(),
    onMainMenu: vi.fn(),
  };

  // Step 1: Test component renders Level Complete title
  // Should indicate level was successfully completed
  it('renders Level Complete title', () => {
    render(<LevelCompleteMenu {...defaultProps} />);
    
    expect(screen.getByText('Level Complete!')).toBeInTheDocument();
  });

  // Step 2: Test level display
  // Should show current level number
  it('displays the completed level', () => {
    render(<LevelCompleteMenu {...defaultProps} level={3} />);
    
    expect(screen.getByText('Level')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  // Step 3: Test score display
  // Should show current score
  it('displays the current score', () => {
    render(<LevelCompleteMenu {...defaultProps} score={1500} />);
    
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('1500')).toBeInTheDocument();
  });

  // Step 4: Test Next Level button
  // Should call onNextLevel when clicked
  it('calls onNextLevel when Next Level button is clicked', () => {
    const onNextLevel = vi.fn();
    render(<LevelCompleteMenu {...defaultProps} onNextLevel={onNextLevel} />);
    
    fireEvent.click(screen.getByText('Next Level'));
    expect(onNextLevel).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test Main Menu button
  // Should call onMainMenu when clicked
  it('calls onMainMenu when Main Menu button is clicked', () => {
    const onMainMenu = vi.fn();
    render(<LevelCompleteMenu {...defaultProps} onMainMenu={onMainMenu} />);
    
    fireEvent.click(screen.getByText('Main Menu'));
    expect(onMainMenu).toHaveBeenCalledTimes(1);
  });

  // Step 6: Test component structure
  // Should have glass overlay styling
  it('has glass-overlay class for styling', () => {
    const { container } = render(<LevelCompleteMenu {...defaultProps} />);
    
    const overlay = container.querySelector('.glass-overlay');
    expect(overlay).toBeInTheDocument();
  });

  // Step 7: Test level display fallback
  // Should show em dash when level is undefined
  it('shows em dash when level is undefined', () => {
    render(<LevelCompleteMenu {...defaultProps} level={undefined} />);
    
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
