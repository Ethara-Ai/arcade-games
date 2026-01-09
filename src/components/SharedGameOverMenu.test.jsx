import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SharedGameOverMenu from './SharedGameOverMenu';

describe('SharedGameOverMenu', () => {
  const defaultProps = {
    onRestart: vi.fn(),
    onMainMenu: vi.fn(),
    score: 100,
    highScore: 500,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders default title
  it('renders default "Game Over" title', () => {
    render(<SharedGameOverMenu {...defaultProps} />);

    expect(screen.getByText('Game Over')).toBeInTheDocument();
  });

  // Step 2: Test custom title is rendered
  it('renders custom title when provided', () => {
    render(<SharedGameOverMenu {...defaultProps} title="You Lost!" />);

    expect(screen.getByText('You Lost!')).toBeInTheDocument();
  });

  // Step 3: Test score is displayed
  it('displays the current score', () => {
    render(<SharedGameOverMenu {...defaultProps} score={250} />);

    expect(screen.getByText('250')).toBeInTheDocument();
  });

  // Step 4: Test high score is displayed
  it('displays the high score', () => {
    render(<SharedGameOverMenu {...defaultProps} highScore={1000} />);

    expect(screen.getByText('1000')).toBeInTheDocument();
  });

  // Step 5: Test Play Again button calls onRestart
  it('calls onRestart when Play Again button is clicked', () => {
    const onRestart = vi.fn();
    render(<SharedGameOverMenu {...defaultProps} onRestart={onRestart} />);

    fireEvent.click(screen.getByText('Play Again'));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  // Step 6: Test Main Menu button calls onMainMenu
  it('calls onMainMenu when Main Menu button is clicked', () => {
    const onMainMenu = vi.fn();
    render(<SharedGameOverMenu {...defaultProps} onMainMenu={onMainMenu} />);

    fireEvent.click(screen.getByText('Main Menu'));
    expect(onMainMenu).toHaveBeenCalledTimes(1);
  });

  // Step 7: Test custom button text
  it('renders custom button text when provided', () => {
    render(
      <SharedGameOverMenu {...defaultProps} restartText="Try Again" mainMenuText="Exit Game" />
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Exit Game')).toBeInTheDocument();
  });

  // Step 8: Test new high score badge is shown
  it('shows new high score badge when score equals or exceeds high score', () => {
    render(<SharedGameOverMenu {...defaultProps} score={500} highScore={500} />);

    expect(screen.getByText('New High Score!')).toBeInTheDocument();
  });

  // Step 9: Test new high score badge is not shown when score is lower
  it('does not show new high score badge when score is lower than high score', () => {
    render(<SharedGameOverMenu {...defaultProps} score={100} highScore={500} />);

    expect(screen.queryByText('New High Score!')).not.toBeInTheDocument();
  });

  // Step 10: Test new high score badge is not shown when score is 0
  it('does not show new high score badge when score is 0', () => {
    render(<SharedGameOverMenu {...defaultProps} score={0} highScore={0} />);

    expect(screen.queryByText('New High Score!')).not.toBeInTheDocument();
  });

  // Step 11: Test custom stats are rendered
  it('renders custom stats when provided', () => {
    const customStats = [
      { label: 'Level', value: 5 },
      { label: 'Time', value: '2:30' },
    ];
    render(<SharedGameOverMenu {...defaultProps} stats={customStats} />);

    expect(screen.getByText('Level')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
  });

  // Step 12: Test default stats (Score and Best) are shown when no custom stats
  it('shows Score and Best labels when no custom stats provided', () => {
    render(<SharedGameOverMenu {...defaultProps} />);

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Best')).toBeInTheDocument();
  });

  // Step 13: Test cyan accent color
  it('renders with cyan accent color', () => {
    const { container } = render(<SharedGameOverMenu {...defaultProps} accentColor="cyan" />);

    expect(container.querySelector('.text-cyan-400')).toBeInTheDocument();
  });

  // Step 14: Test green accent color
  it('renders with green accent color', () => {
    const { container } = render(<SharedGameOverMenu {...defaultProps} accentColor="green" />);

    expect(container.querySelector('.text-green-400')).toBeInTheDocument();
  });

  // Step 15: Test amber accent color
  it('renders with amber accent color', () => {
    const { container } = render(<SharedGameOverMenu {...defaultProps} accentColor="amber" />);

    expect(container.querySelector('.text-amber-400')).toBeInTheDocument();
  });

  // Step 16: Test pink accent color
  it('renders with pink accent color', () => {
    const { container } = render(<SharedGameOverMenu {...defaultProps} accentColor="pink" />);

    expect(container.querySelector('.text-pink-400')).toBeInTheDocument();
  });

  // Step 17: Test default red accent color
  it('renders with red accent color by default', () => {
    const { container } = render(<SharedGameOverMenu {...defaultProps} />);

    expect(container.querySelector('.text-red-500')).toBeInTheDocument();
  });

  // Step 18: Test glass-overlay class for styling
  it('has glass-overlay class for styling', () => {
    const { container } = render(<SharedGameOverMenu {...defaultProps} />);

    const overlay = container.querySelector('.glass-overlay');
    expect(overlay).toBeInTheDocument();
  });

  // Step 19: Test glass-panel class for container
  it('has glass-panel class for container', () => {
    const { container } = render(<SharedGameOverMenu {...defaultProps} />);

    const panel = container.querySelector('.glass-panel');
    expect(panel).toBeInTheDocument();
  });

  // Step 20: Test trophy icons are shown with new high score
  it('shows trophy icons when new high score is achieved', () => {
    render(<SharedGameOverMenu {...defaultProps} score={600} highScore={500} />);

    // Trophy icons should be rendered alongside "New High Score!"
    const highScoreBadge = screen.getByText('New High Score!').closest('div');
    expect(highScoreBadge).toBeInTheDocument();
  });
});
