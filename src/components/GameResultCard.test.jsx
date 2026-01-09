import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameResultCard from './GameResultCard';

describe('GameResultCard', () => {
  const defaultProps = {
    title: 'Game Over',
    accentColor: 'cyan',
    stats: [],
    buttons: [],
    isNewHighScore: false,
    subtitle: '',
  };

  // Step 1: Test component renders title
  // Title should be displayed prominently
  it('renders the title', () => {
    render(<GameResultCard {...defaultProps} title="Victory!" />);
    
    expect(screen.getByText('Victory!')).toBeInTheDocument();
  });

  // Step 2: Test subtitle rendering
  // Optional subtitle should appear when provided
  it('renders subtitle when provided', () => {
    render(<GameResultCard {...defaultProps} subtitle="You beat the game!" />);
    
    expect(screen.getByText('You beat the game!')).toBeInTheDocument();
  });

  it('does not render subtitle when empty', () => {
    render(<GameResultCard {...defaultProps} subtitle="" />);
    
    expect(screen.queryByText('You beat the game!')).not.toBeInTheDocument();
  });

  // Step 3: Test stats display
  // Should render all provided stats
  it('renders stats correctly', () => {
    const stats = [
      { label: 'Score', value: 1000 },
      { label: 'Time', value: '2:30' },
    ];
    render(<GameResultCard {...defaultProps} stats={stats} />);
    
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
  });

  it('does not render stats section when empty', () => {
    const { container } = render(<GameResultCard {...defaultProps} stats={[]} />);
    
    // There should be no stat boxes when empty
    const statBoxes = container.querySelectorAll('.bg-\\[\\#1e1e1e\\]');
    expect(statBoxes.length).toBe(0);
  });

  // Step 4: Test buttons rendering and functionality
  // Should render all buttons and handle clicks
  it('renders buttons correctly', () => {
    const buttons = [
      { label: 'Retry', onClick: vi.fn() },
      { label: 'Main Menu', onClick: vi.fn() },
    ];
    render(<GameResultCard {...defaultProps} buttons={buttons} />);
    
    expect(screen.getByText('Retry')).toBeInTheDocument();
    expect(screen.getByText('Main Menu')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const onClick = vi.fn();
    const buttons = [{ label: 'Click Me', onClick }];
    render(<GameResultCard {...defaultProps} buttons={buttons} />);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test new high score badge
  // Trophy badge should appear when isNewHighScore is true
  it('shows new high score badge when isNewHighScore is true', () => {
    render(<GameResultCard {...defaultProps} isNewHighScore={true} />);
    
    expect(screen.getByText('New High Score!')).toBeInTheDocument();
  });

  it('does not show new high score badge when isNewHighScore is false', () => {
    render(<GameResultCard {...defaultProps} isNewHighScore={false} />);
    
    expect(screen.queryByText('New High Score!')).not.toBeInTheDocument();
  });

  // Step 6: Test different accent colors
  // Component should apply correct color styling
  it('applies correct color classes for different accent colors', () => {
    const { rerender, container } = render(
      <GameResultCard {...defaultProps} accentColor="cyan" title="Test" />
    );
    
    let title = screen.getByText('Test');
    expect(title).toHaveClass('text-cyan-400');
    
    rerender(<GameResultCard {...defaultProps} accentColor="green" title="Test" />);
    title = screen.getByText('Test');
    expect(title).toHaveClass('text-green-400');
    
    rerender(<GameResultCard {...defaultProps} accentColor="red" title="Test" />);
    title = screen.getByText('Test');
    expect(title).toHaveClass('text-red-500');
  });
});
