import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DesktopControls from './DesktopControls';
import { GAME_STATES } from '../constants';

describe('DesktopControls', () => {
  const defaultProps = {
    gameState: GAME_STATES.PLAYING,
    ballLaunched: false,
    hasBalls: true,
    onPauseResume: vi.fn(),
    onRestart: vi.fn(),
    onMainMenu: vi.fn(),
    onBack: vi.fn(),
  };

  // Step 1: Test back button renders and calls handler
  // Back button should always be visible and functional
  it('renders back button and handles click', () => {
    render(<DesktopControls {...defaultProps} />);
    
    const backButton = screen.getByTitle('Back to Main Menu');
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  // Step 2: Test launch hint shows when ball not launched
  // Should display hint to launch ball
  it('shows launch hint when ball not launched and has balls', () => {
    render(<DesktopControls {...defaultProps} ballLaunched={false} hasBalls={true} />);
    
    expect(screen.getByText('Click/Press Space to launch the ball')).toBeInTheDocument();
  });

  // Step 3: Test launch hint hides when ball is launched
  // Once ball is launched, hint should not be visible
  it('hides launch hint when ball is launched', () => {
    const { container } = render(<DesktopControls {...defaultProps} ballLaunched={true} />);
    
    const launchHint = container.querySelector('.desktop-launch-hint');
    expect(launchHint).not.toHaveClass('show');
  });

  // Step 4: Test pause hint shows correct text based on state
  // Should toggle between pause and resume messages
  it('shows "Press P to Pause" when playing', () => {
    render(<DesktopControls {...defaultProps} gameState={GAME_STATES.PLAYING} />);
    
    expect(screen.getByText('Press P to Pause')).toBeInTheDocument();
  });

  it('shows "Press P to Resume" when paused', () => {
    render(<DesktopControls {...defaultProps} gameState={GAME_STATES.PAUSED} />);
    
    expect(screen.getByText('Press P to Resume')).toBeInTheDocument();
  });

  // Step 5: Test action buttons call correct handlers
  // Pause, restart, and main menu buttons should work
  it('calls onPauseResume when pause button is clicked', () => {
    const onPauseResume = vi.fn();
    render(<DesktopControls {...defaultProps} onPauseResume={onPauseResume} />);
    
    const pauseButton = screen.getByTitle('Pause');
    fireEvent.click(pauseButton);
    expect(onPauseResume).toHaveBeenCalledTimes(1);
  });

  it('calls onRestart when restart button is clicked', () => {
    const onRestart = vi.fn();
    render(<DesktopControls {...defaultProps} onRestart={onRestart} />);
    
    const restartButton = screen.getByTitle('Restart');
    fireEvent.click(restartButton);
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it('calls onMainMenu when main menu button is clicked', () => {
    const onMainMenu = vi.fn();
    render(<DesktopControls {...defaultProps} onMainMenu={onMainMenu} />);
    
    const mainMenuButton = screen.getByTitle('Main Menu');
    fireEvent.click(mainMenuButton);
    expect(onMainMenu).toHaveBeenCalledTimes(1);
  });

  // Step 6: Test pause button shows correct icon based on state
  // Button should show play icon when paused, pause icon when playing
  it('shows Resume title when paused', () => {
    render(<DesktopControls {...defaultProps} gameState={GAME_STATES.PAUSED} />);
    
    expect(screen.getByTitle('Resume')).toBeInTheDocument();
  });
});
