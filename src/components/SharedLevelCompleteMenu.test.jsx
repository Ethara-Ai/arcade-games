import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SharedLevelCompleteMenu from './SharedLevelCompleteMenu';

describe('SharedLevelCompleteMenu', () => {
  const defaultProps = {
    onNextLevel: vi.fn(),
    onMainMenu: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders default title
  it('renders default "Level Complete!" title', () => {
    render(<SharedLevelCompleteMenu {...defaultProps} />);

    expect(screen.getByText('Level Complete!')).toBeInTheDocument();
  });

  // Step 2: Test custom title is rendered
  it('renders custom title when provided', () => {
    render(<SharedLevelCompleteMenu {...defaultProps} title="Stage Cleared!" />);

    expect(screen.getByText('Stage Cleared!')).toBeInTheDocument();
  });

  // Step 3: Test Next Level button calls onNextLevel
  it('calls onNextLevel when Next Level button is clicked', () => {
    const onNextLevel = vi.fn();
    render(<SharedLevelCompleteMenu {...defaultProps} onNextLevel={onNextLevel} />);

    fireEvent.click(screen.getByText('Next Level'));
    expect(onNextLevel).toHaveBeenCalledTimes(1);
  });

  // Step 4: Test Main Menu button calls onMainMenu
  it('calls onMainMenu when Main Menu button is clicked', () => {
    const onMainMenu = vi.fn();
    render(<SharedLevelCompleteMenu {...defaultProps} onMainMenu={onMainMenu} />);

    fireEvent.click(screen.getByText('Main Menu'));
    expect(onMainMenu).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test custom button text
  it('renders custom button text', () => {
    render(
      <SharedLevelCompleteMenu
        {...defaultProps}
        nextLevelText="Continue"
        mainMenuText="Exit"
      />
    );

    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.getByText('Exit')).toBeInTheDocument();
  });

  // Step 6: Test default stats are displayed
  it('displays default stats with score and level', () => {
    render(<SharedLevelCompleteMenu {...defaultProps} score={500} level={3} />);

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Level')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  // Step 7: Test custom stats are displayed
  it('renders custom stats when provided', () => {
    const customStats = [
      { label: 'Time', value: '2:30' },
      { label: 'Stars', value: 3 },
    ];
    render(<SharedLevelCompleteMenu {...defaultProps} stats={customStats} />);

    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
    expect(screen.getByText('Stars')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  // Step 8: Test green accent color (default)
  it('applies green accent color styling by default', () => {
    const { container } = render(<SharedLevelCompleteMenu {...defaultProps} />);

    expect(container.querySelector('.text-green-400')).toBeInTheDocument();
  });

  // Step 9: Test cyan accent color
  it('applies cyan accent color styling', () => {
    const { container } = render(
      <SharedLevelCompleteMenu {...defaultProps} accentColor="cyan" />
    );

    expect(container.querySelector('.text-cyan-400')).toBeInTheDocument();
  });

  // Step 10: Test amber accent color
  it('applies amber accent color styling', () => {
    const { container } = render(
      <SharedLevelCompleteMenu {...defaultProps} accentColor="amber" />
    );

    expect(container.querySelector('.text-amber-400')).toBeInTheDocument();
  });

  // Step 11: Test pink accent color
  it('applies pink accent color styling', () => {
    const { container } = render(
      <SharedLevelCompleteMenu {...defaultProps} accentColor="pink" />
    );

    expect(container.querySelector('.text-pink-400')).toBeInTheDocument();
  });

  // Step 12: Test custom icon is rendered
  it('renders custom icon when provided', () => {
    const customIcon = <span data-testid="custom-icon">⭐</span>;
    render(<SharedLevelCompleteMenu {...defaultProps} icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  // Step 13: Test default icon is rendered when not provided
  it('renders default checkmark icon when icon is not provided', () => {
    const { container } = render(<SharedLevelCompleteMenu {...defaultProps} />);

    // Default icon has gradient background
    const iconContainer = container.querySelector('.bg-gradient-to-br');
    expect(iconContainer).toBeInTheDocument();
  });

  // Step 14: Test component has glass overlay styling
  it('has glass-overlay class for styling', () => {
    const { container } = render(<SharedLevelCompleteMenu {...defaultProps} />);

    const overlay = container.querySelector('.glass-overlay');
    expect(overlay).toBeInTheDocument();
  });

  // Step 15: Test component has glass panel styling
  it('has glass-panel class for menu container', () => {
    const { container } = render(<SharedLevelCompleteMenu {...defaultProps} />);

    const panel = container.querySelector('.glass-panel');
    expect(panel).toBeInTheDocument();
  });

  // Step 16: Test level is not shown in stats when undefined
  it('does not show level in default stats when level is undefined', () => {
    render(<SharedLevelCompleteMenu {...defaultProps} score={100} />);

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.queryByText('Level')).not.toBeInTheDocument();
  });

  // Step 17: Test zero score is displayed
  it('displays zero score correctly', () => {
    render(<SharedLevelCompleteMenu {...defaultProps} score={0} level={1} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  // Step 18: Test fallback for unknown accent color
  it('falls back to green for unknown accent color', () => {
    const { container } = render(
      <SharedLevelCompleteMenu {...defaultProps} accentColor="invalid" />
    );

    expect(container.querySelector('.text-green-400')).toBeInTheDocument();
  });

  // Step 19: Test multiple stats are rendered
  it('renders multiple custom stats correctly', () => {
    const customStats = [
      { label: 'Points', value: 1000 },
      { label: 'Combo', value: 5 },
      { label: 'Bonus', value: 250 },
    ];
    render(<SharedLevelCompleteMenu {...defaultProps} stats={customStats} />);

    expect(screen.getByText('Points')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('Combo')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Bonus')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  // Step 20: Test component structure with fixed positioning
  it('has fixed positioning for fullscreen overlay', () => {
    const { container } = render(<SharedLevelCompleteMenu {...defaultProps} />);

    const overlay = container.querySelector('.fixed');
    expect(overlay).toBeInTheDocument();
  });
});
