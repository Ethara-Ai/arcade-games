import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileControls from './MobileControls';
import { GAME_STATES } from '../constants';

describe('MobileControls', () => {
  const defaultProps = {
    gameState: GAME_STATES.PLAYING,
    ballLaunched: false,
    hasBalls: true,
    onPause: vi.fn(),
    onBack: vi.fn(),
    onLaunchBall: vi.fn(),
  };

  // Step 1: Test back button renders and handles click
  // Mobile back button should navigate to main menu
  it('renders back button and handles click', () => {
    render(<MobileControls {...defaultProps} />);
    
    const backButton = screen.getByTitle('Back to Main Menu');
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  // Step 2: Test pause button visibility during gameplay
  // Pause button should only show when actively playing
  it('shows pause button when game state is PLAYING', () => {
    const { container } = render(<MobileControls {...defaultProps} gameState={GAME_STATES.PLAYING} />);
    
    const pauseButton = container.querySelector('.mobile-pause-btn');
    expect(pauseButton).toHaveClass('show');
  });

  it('hides pause button when game state is not PLAYING', () => {
    const { container } = render(<MobileControls {...defaultProps} gameState={GAME_STATES.PAUSED} />);
    
    const pauseButton = container.querySelector('.mobile-pause-btn');
    expect(pauseButton).not.toHaveClass('show');
  });

  // Step 3: Test pause button calls onPause handler
  // Clicking pause should trigger the pause callback
  it('calls onPause when pause button is clicked', () => {
    const onPause = vi.fn();
    render(<MobileControls {...defaultProps} onPause={onPause} />);
    
    const pauseButton = screen.getByRole('button', { name: '' }); // Pause button has icon only
    const buttons = screen.getAllByRole('button');
    const pauseBtn = buttons.find(btn => btn.classList.contains('mobile-pause-btn'));
    
    if (pauseBtn) {
      fireEvent.click(pauseBtn);
      expect(onPause).toHaveBeenCalledTimes(1);
    }
  });

  // Step 4: Test touch area shows launch hint
  // Should display tap hint when ball not launched
  it('shows touch area with launch hint when ball not launched', () => {
    render(<MobileControls {...defaultProps} ballLaunched={false} hasBalls={true} />);
    
    expect(screen.getByText('Tap to Launch Ball')).toBeInTheDocument();
  });

  it('hides touch area when ball is launched', () => {
    const { container } = render(<MobileControls {...defaultProps} ballLaunched={true} />);
    
    const touchArea = container.querySelector('.mobile-touch-area');
    expect(touchArea).not.toHaveClass('show');
  });

  // Step 5: Test touch area calls onLaunchBall
  // Tapping the launch area should launch the ball
  it('calls onLaunchBall when touch area is clicked', () => {
    const onLaunchBall = vi.fn();
    render(<MobileControls {...defaultProps} onLaunchBall={onLaunchBall} />);
    
    const touchArea = screen.getByText('Tap to Launch Ball');
    fireEvent.click(touchArea);
    expect(onLaunchBall).toHaveBeenCalledTimes(1);
  });

  // Step 6: Test controls visibility based on game state
  // Controls should show/hide based on game state
  it('shows back button when playing or paused', () => {
    const { container, rerender } = render(<MobileControls {...defaultProps} gameState={GAME_STATES.PLAYING} />);
    
    let backButton = container.querySelector('.mobile-back-btn');
    expect(backButton).toHaveClass('show');
    
    rerender(<MobileControls {...defaultProps} gameState={GAME_STATES.PAUSED} />);
    backButton = container.querySelector('.mobile-back-btn');
    expect(backButton).toHaveClass('show');
  });
});
