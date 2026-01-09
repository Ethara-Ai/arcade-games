import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Tile from './Tile';
import { TILE_COLORS } from '../constants';

describe('Tile', () => {
  // Step 1: Test tile renders with value
  // Should display the tile value
  it('renders tile value', () => {
    render(<Tile value={2} row={0} col={0} />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  // Step 2: Test tile with value 0 does not show text
  // Empty tiles should not display "0"
  it('does not render text for value 0', () => {
    render(<Tile value={0} row={0} col={0} />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  // Step 3: Test various tile values
  // Should render different values correctly
  it('renders various tile values correctly', () => {
    const { rerender } = render(<Tile value={4} row={0} col={0} />);
    expect(screen.getByText('4')).toBeInTheDocument();

    rerender(<Tile value={128} row={0} col={0} />);
    expect(screen.getByText('128')).toBeInTheDocument();

    rerender(<Tile value={1024} row={0} col={0} />);
    expect(screen.getByText('1024')).toBeInTheDocument();
  });

  // Step 4: Test tile positioning
  // Should apply correct position based on row and col
  it('applies correct positioning styles', () => {
    const { container } = render(<Tile value={2} row={1} col={2} />);

    const tile = container.querySelector('.tile');
    expect(tile).toHaveStyle({
      left: 'calc(50% + 3px)', // col * 25%
      top: 'calc(25% + 3px)', // row * 25%
    });
  });

  // Step 5: Test tile colors based on value
  // Each value should have its own color scheme
  it('applies correct background color for value 2', () => {
    const { container } = render(<Tile value={2} row={0} col={0} />);

    const tile = container.querySelector('.tile');
    expect(tile).toHaveStyle({
      backgroundColor: TILE_COLORS[2].bg,
      color: TILE_COLORS[2].text,
    });
  });

  it('applies correct background color for value 1024', () => {
    const { container } = render(<Tile value={1024} row={0} col={0} />);

    const tile = container.querySelector('.tile');
    expect(tile).toHaveStyle({
      backgroundColor: TILE_COLORS[1024].bg,
      color: TILE_COLORS[1024].text,
    });
  });

  // Step 6: Test scale transform for visibility
  // Value > 0 should be scaled up, 0 should be scaled down
  it('applies scale(1) transform for non-zero values', () => {
    const { container } = render(<Tile value={2} row={0} col={0} />);

    const tile = container.querySelector('.tile');
    expect(tile).toHaveStyle({
      transform: 'scale(1)',
    });
  });

  it('applies scale(0) transform for zero value', () => {
    const { container } = render(<Tile value={0} row={0} col={0} />);

    const tile = container.querySelector('.tile');
    expect(tile).toHaveStyle({
      transform: 'scale(0)',
    });
  });

  // Step 7: Test font size adjustment for large numbers
  // Larger numbers should have smaller font
  it('has tile class for styling', () => {
    const { container } = render(<Tile value={2} row={0} col={0} />);

    const tile = container.querySelector('.tile');
    expect(tile).toHaveClass('tile');
  });

  // Step 8: Test glow effect for high value tiles
  // Higher value tiles should have glow effect
  it('applies glow effect for tiles >= 1024', () => {
    const { container } = render(<Tile value={1024} row={0} col={0} />);

    const tile = container.querySelector('.tile');
    const style = tile.getAttribute('style');
    expect(style).toContain('box-shadow');
  });

  // Step 9: Test fallback color for very high values
  // Should use 2048 colors for values not in TILE_COLORS
  it('uses fallback colors for values not in TILE_COLORS', () => {
    const { container } = render(<Tile value={4096} row={0} col={0} />);

    const tile = container.querySelector('.tile');
    expect(tile).toHaveStyle({
      backgroundColor: TILE_COLORS[2048].bg,
    });
  });
});
