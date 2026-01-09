import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Game1024Board from './Game1024Board';

describe('Game1024Board', () => {
  const emptyGrid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const defaultProps = {
    grid: emptyGrid,
    score: 0,
    bestScore: 0,
    highestTile: 2,
    onTouchStart: vi.fn(),
    onTouchEnd: vi.fn(),
    accentColor: 'amber',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders score
  it('renders the current score', () => {
    render(<Game1024Board {...defaultProps} score={256} />);

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('256')).toBeInTheDocument();
  });

  // Step 2: Test component renders best score
  it('renders the best score', () => {
    render(<Game1024Board {...defaultProps} bestScore={1024} />);

    expect(screen.getByText('Best')).toBeInTheDocument();
    expect(screen.getByText('1024')).toBeInTheDocument();
  });

  // Step 3: Test component renders highest tile
  it('renders the highest tile value', () => {
    render(<Game1024Board {...defaultProps} highestTile={512} />);

    expect(screen.getByText('Top Tile')).toBeInTheDocument();
    expect(screen.getByText('512')).toBeInTheDocument();
  });

  // Step 4: Test grid background cells are rendered
  it('renders 16 background grid cells', () => {
    const { container } = render(<Game1024Board {...defaultProps} />);

    const gridCells = container.querySelectorAll('.bg-\\[\\#252540\\]');
    expect(gridCells.length).toBe(16);
  });

  // Step 5: Test touch start handler is called
  it('calls onTouchStart when board is touched', () => {
    const onTouchStart = vi.fn();
    const { container } = render(<Game1024Board {...defaultProps} onTouchStart={onTouchStart} />);

    const board = container.querySelector('.game-1024-board');
    fireEvent.touchStart(board);
    expect(onTouchStart).toHaveBeenCalledTimes(1);
  });

  // Step 6: Test touch end handler is called
  it('calls onTouchEnd when touch ends on board', () => {
    const onTouchEnd = vi.fn();
    const { container } = render(<Game1024Board {...defaultProps} onTouchEnd={onTouchEnd} />);

    const board = container.querySelector('.game-1024-board');
    fireEvent.touchEnd(board);
    expect(onTouchEnd).toHaveBeenCalledTimes(1);
  });

  // Step 7: Test grid with values renders tiles
  it('renders tiles with values', () => {
    const gridWithValues = [
      [2, 4, 0, 0],
      [0, 8, 16, 0],
      [0, 0, 32, 64],
      [0, 0, 0, 128],
    ];
    render(<Game1024Board {...defaultProps} grid={gridWithValues} highestTile={128} />);

    // Use getAllByText for values that may appear multiple times (e.g., in stats)
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByText('64')).toBeInTheDocument();
    // 128 appears in both the tile and the Top Tile stat
    expect(screen.getAllByText('128').length).toBeGreaterThanOrEqual(1);
  });

  // Step 8: Test amber accent color styling
  it('applies amber accent color styling', () => {
    const { container } = render(<Game1024Board {...defaultProps} accentColor="amber" />);

    expect(container.querySelector('.text-amber-400')).toBeInTheDocument();
  });

  // Step 9: Test cyan accent color styling
  it('applies cyan accent color styling', () => {
    const { container } = render(<Game1024Board {...defaultProps} accentColor="cyan" />);

    expect(container.querySelector('.text-cyan-400')).toBeInTheDocument();
  });

  // Step 10: Test green accent color styling
  it('applies green accent color styling', () => {
    const { container } = render(<Game1024Board {...defaultProps} accentColor="green" />);

    expect(container.querySelector('.text-green-400')).toBeInTheDocument();
  });

  // Step 11: Test mobile instructions are rendered
  it('renders mobile instructions', () => {
    render(<Game1024Board {...defaultProps} />);

    expect(screen.getByText('Swipe to move tiles')).toBeInTheDocument();
  });

  // Step 12: Test desktop instructions are rendered
  it('renders desktop instructions', () => {
    render(<Game1024Board {...defaultProps} />);

    expect(screen.getByText('Use arrow keys or swipe to move tiles')).toBeInTheDocument();
  });

  // Step 13: Test zero score is displayed
  it('displays zero score correctly', () => {
    render(<Game1024Board {...defaultProps} score={0} />);

    const scoreElements = screen.getAllByText('0');
    expect(scoreElements.length).toBeGreaterThanOrEqual(1);
  });

  // Step 14: Test board has correct class
  it('has game-1024-board class', () => {
    const { container } = render(<Game1024Board {...defaultProps} />);

    const board = container.querySelector('.game-1024-board');
    expect(board).toBeInTheDocument();
  });

  // Step 15: Test stat containers have glass-stat class
  it('has glass-stat class on stat containers', () => {
    const { container } = render(<Game1024Board {...defaultProps} />);

    const statContainers = container.querySelectorAll('.glass-stat');
    expect(statContainers.length).toBe(3); // Score, Best, Top Tile
  });

  // Step 16: Test all stats are visible
  it('renders all three stat sections', () => {
    render(<Game1024Board {...defaultProps} />);

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Best')).toBeInTheDocument();
    expect(screen.getByText('Top Tile')).toBeInTheDocument();
  });

  // Step 17: Test default accent color fallback
  it('falls back to amber for unknown accent color', () => {
    const { container } = render(<Game1024Board {...defaultProps} accentColor="invalid" />);

    expect(container.querySelector('.text-amber-400')).toBeInTheDocument();
  });

  // Step 18: Test empty tiles don't show numbers
  it('does not render numbers for empty tiles (value 0)', () => {
    render(<Game1024Board {...defaultProps} grid={emptyGrid} />);

    // The board should exist but not have tile numbers visible
    // Empty tiles (0 values) should not render text
    const tileTexts = screen.queryAllByText(/^[2-9]|^[1-9]\d+$/);
    // Only highestTile (2) should be shown in stats
    expect(tileTexts.length).toBe(1); // Just the "2" in Top Tile stat
  });

  // Step 19: Test board has correct container class
  it('has game-1024-board class for styling', () => {
    const { container } = render(<Game1024Board {...defaultProps} />);

    const board = container.querySelector('.game-1024-board');
    // Board should exist with the correct class
    expect(board).toBeInTheDocument();
    expect(board).toHaveClass('game-1024-board');
    expect(board).toHaveClass('relative');
    expect(board).toHaveClass('shadow-2xl');
  });

  // Step 20: Test high value tiles render correctly
  it('renders high value tiles like 1024', () => {
    const gridWith1024 = [
      [1024, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    render(<Game1024Board {...defaultProps} grid={gridWith1024} highestTile={1024} />);

    // 1024 should appear in both the tile and the Top Tile stat
    const tileElements = screen.getAllByText('1024');
    expect(tileElements.length).toBeGreaterThanOrEqual(1);
  });
});
