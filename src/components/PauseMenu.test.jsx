import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PauseMenu from './PauseMenu';

describe('PauseMenu', () => {
  const defaultProps = {
    onResume: vi.fn(),
    onRestart: vi.fn(),
    onMainMenu: vi.fn(),
  };

  // Step 1: Test component renders with title
  // Should display "Paused" title
  it('renders Paused title', () => {
    render(<PauseMenu {...defaultProps} />);
    
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  // Step 2: Test all buttons are rendered
  // Resume, Restart, and Main Menu buttons should exist
  it('renders all action buttons', () => {
    render(<PauseMenu {...defaultProps} />);
    
    expect(screen.getByText('Resume (P)')).toBeInTheDocument();
    expect(screen.getByText('Restart')).toBeInTheDocument();
    expect(screen.getByText('Main Menu')).toBeInTheDocument();
  });

  // Step 3: Test Resume button calls onResume
  // Clicking resume should continue the game
  it('calls onResume when Resume button is clicked', () => {
    const onResume = vi.fn();
    render(<PauseMenu {...defaultProps} onResume={onResume} />);
    
    fireEvent.click(screen.getByText('Resume (P)'));
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  // Step 4: Test Restart button calls onRestart
  // Clicking restart should reset the game
  it('calls onRestart when Restart button is clicked', () => {
    const onRestart = vi.fn();
    render(<PauseMenu {...defaultProps} onRestart={onRestart} />);
    
    fireEvent.click(screen.getByText('Restart'));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test Main Menu button calls onMainMenu
  // Clicking main menu should navigate back
  it('calls onMainMenu when Main Menu button is clicked', () => {
    const onMainMenu = vi.fn();
    render(<PauseMenu {...defaultProps} onMainMenu={onMainMenu} />);
    
    fireEvent.click(screen.getByText('Main Menu'));
    expect(onMainMenu).toHaveBeenCalledTimes(1);
  });

  // Step 6: Test component has proper structure
  // Should have glass overlay styling
  it('has glass-overlay class for styling', () => {
    const { container } = render(<PauseMenu {...defaultProps} />);
    
    const overlay = container.querySelector('.glass-overlay');
    expect(overlay).toBeInTheDocument();
  });
});
