import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PauseMenu from './SharedPauseMenu';

describe('SharedPauseMenu', () => {
  const defaultProps = {
    onResume: vi.fn(),
    onRestart: vi.fn(),
    onMainMenu: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders title
  it('renders default Paused title', () => {
    render(<PauseMenu {...defaultProps} />);

    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  // Step 2: Test custom title
  it('renders custom title when provided', () => {
    render(<PauseMenu {...defaultProps} title="Game Paused" />);

    expect(screen.getByText('Game Paused')).toBeInTheDocument();
  });

  // Step 3: Test Resume button
  it('calls onResume when Resume button is clicked', () => {
    const onResume = vi.fn();
    render(<PauseMenu {...defaultProps} onResume={onResume} />);

    fireEvent.click(screen.getByText('Resume (P)'));
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  // Step 4: Test Restart button
  it('calls onRestart when Restart button is clicked', () => {
    const onRestart = vi.fn();
    render(<PauseMenu {...defaultProps} onRestart={onRestart} />);

    fireEvent.click(screen.getByText('Restart'));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test Main Menu button
  it('calls onMainMenu when Main Menu button is clicked', () => {
    const onMainMenu = vi.fn();
    render(<PauseMenu {...defaultProps} onMainMenu={onMainMenu} />);

    fireEvent.click(screen.getByText('Main Menu'));
    expect(onMainMenu).toHaveBeenCalledTimes(1);
  });

  // Step 6: Test custom button text
  it('renders custom button text', () => {
    render(
      <PauseMenu
        {...defaultProps}
        resumeText="Continue"
        restartText="Try Again"
        mainMenuText="Exit"
      />
    );

    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Exit')).toBeInTheDocument();
  });

  // Step 7: Test P key triggers resume
  it('calls onResume when P key is pressed', () => {
    const onResume = vi.fn();
    render(<PauseMenu {...defaultProps} onResume={onResume} />);

    fireEvent.keyDown(window, { key: 'p' });
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  // Step 8: Test uppercase P key triggers resume
  it('calls onResume when uppercase P key is pressed', () => {
    const onResume = vi.fn();
    render(<PauseMenu {...defaultProps} onResume={onResume} />);

    fireEvent.keyDown(window, { key: 'P' });
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  // Step 9: Test Escape key triggers resume
  it('calls onResume when Escape key is pressed', () => {
    const onResume = vi.fn();
    render(<PauseMenu {...defaultProps} onResume={onResume} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  // Step 10: Test speed control is not shown by default
  it('does not render speed control by default', () => {
    render(<PauseMenu {...defaultProps} />);

    expect(screen.queryByText('Speed')).not.toBeInTheDocument();
  });

  // Step 11: Test speed control is shown when provided
  it('renders speed control when speedControl prop is provided', () => {
    const speedControl = {
      speedLevel: 3,
      minSpeed: 1,
      maxSpeed: 5,
      onIncrease: vi.fn(),
      onDecrease: vi.fn(),
      label: 'Speed',
    };

    render(<PauseMenu {...defaultProps} speedControl={speedControl} />);

    expect(screen.getByText('Speed')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('/5')).toBeInTheDocument();
  });

  // Step 12: Test speed increase button
  it('calls onIncrease when increase button is clicked', () => {
    const onIncrease = vi.fn();
    const speedControl = {
      speedLevel: 3,
      minSpeed: 1,
      maxSpeed: 5,
      onIncrease,
      onDecrease: vi.fn(),
      label: 'Speed',
    };

    render(<PauseMenu {...defaultProps} speedControl={speedControl} />);

    fireEvent.click(screen.getByTitle('Increase Speed'));
    expect(onIncrease).toHaveBeenCalledTimes(1);
  });

  // Step 13: Test speed decrease button
  it('calls onDecrease when decrease button is clicked', () => {
    const onDecrease = vi.fn();
    const speedControl = {
      speedLevel: 3,
      minSpeed: 1,
      maxSpeed: 5,
      onIncrease: vi.fn(),
      onDecrease,
      label: 'Speed',
    };

    render(<PauseMenu {...defaultProps} speedControl={speedControl} />);

    fireEvent.click(screen.getByTitle('Decrease Speed'));
    expect(onDecrease).toHaveBeenCalledTimes(1);
  });

  // Step 14: Test decrease button is disabled at min speed
  it('disables decrease button when at minimum speed', () => {
    const speedControl = {
      speedLevel: 1,
      minSpeed: 1,
      maxSpeed: 5,
      onIncrease: vi.fn(),
      onDecrease: vi.fn(),
      label: 'Speed',
    };

    render(<PauseMenu {...defaultProps} speedControl={speedControl} />);

    const decreaseButton = screen.getByTitle('Decrease Speed');
    expect(decreaseButton).toBeDisabled();
  });

  // Step 15: Test increase button is disabled at max speed
  it('disables increase button when at maximum speed', () => {
    const speedControl = {
      speedLevel: 5,
      minSpeed: 1,
      maxSpeed: 5,
      onIncrease: vi.fn(),
      onDecrease: vi.fn(),
      label: 'Speed',
    };

    render(<PauseMenu {...defaultProps} speedControl={speedControl} />);

    const increaseButton = screen.getByTitle('Increase Speed');
    expect(increaseButton).toBeDisabled();
  });

  // Step 16: Test cyan accent color
  it('applies cyan accent color styling', () => {
    const { container } = render(<PauseMenu {...defaultProps} accentColor="cyan" />);

    expect(container.querySelector('.text-cyan-400')).toBeInTheDocument();
  });

  // Step 17: Test green accent color
  it('applies green accent color styling', () => {
    const { container } = render(<PauseMenu {...defaultProps} accentColor="green" />);

    expect(container.querySelector('.text-green-400')).toBeInTheDocument();
  });

  // Step 18: Test amber accent color
  it('applies amber accent color styling', () => {
    const { container } = render(<PauseMenu {...defaultProps} accentColor="amber" />);

    expect(container.querySelector('.text-amber-400')).toBeInTheDocument();
  });

  // Step 19: Test pink accent color
  it('applies pink accent color styling', () => {
    const { container } = render(<PauseMenu {...defaultProps} accentColor="pink" />);

    expect(container.querySelector('.text-pink-400')).toBeInTheDocument();
  });

  // Step 20: Test component has correct id
  it('has pauseMenu id for styling', () => {
    const { container } = render(<PauseMenu {...defaultProps} />);

    expect(container.querySelector('#pauseMenu')).toBeInTheDocument();
  });

  // Step 21: Test glass-overlay class is applied
  it('has glass-overlay class for styling', () => {
    const { container } = render(<PauseMenu {...defaultProps} />);

    expect(container.querySelector('.glass-overlay')).toBeInTheDocument();
  });

  // Step 22: Test keyboard event cleanup on unmount
  it('removes keyboard event listener on unmount', () => {
    const onResume = vi.fn();
    const { unmount } = render(<PauseMenu {...defaultProps} onResume={onResume} />);

    unmount();

    // After unmount, pressing P should not trigger callback
    fireEvent.keyDown(window, { key: 'p' });
    expect(onResume).not.toHaveBeenCalled();
  });

  // Step 23: Test custom speed control label
  it('renders custom speed control label', () => {
    const speedControl = {
      speedLevel: 3,
      minSpeed: 1,
      maxSpeed: 5,
      onIncrease: vi.fn(),
      onDecrease: vi.fn(),
      label: 'Difficulty',
    };

    render(<PauseMenu {...defaultProps} speedControl={speedControl} />);

    expect(screen.getByText('Difficulty')).toBeInTheDocument();
  });

  // Step 24: Test fallback to cyan for unknown accent color
  it('falls back to cyan for unknown accent color', () => {
    const { container } = render(<PauseMenu {...defaultProps} accentColor="unknown" />);

    expect(container.querySelector('.text-cyan-400')).toBeInTheDocument();
  });
});
