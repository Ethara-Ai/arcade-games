import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameSelector from './GameSelector';

describe('GameSelector', () => {
  const defaultProps = {
    onSelectGame: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders title
  // Should display "Arcade Games" title
  it('renders Arcade Games title', () => {
    render(<GameSelector {...defaultProps} />);

    expect(screen.getByText('Arcade Games')).toBeInTheDocument();
    expect(screen.getByText('Choose your game')).toBeInTheDocument();
  });

  // Step 2: Test all game cards are rendered
  // Should show Brickrush, 1024, and Snake cards
  it('renders all three game cards', () => {
    render(<GameSelector {...defaultProps} />);

    expect(screen.getByText('Brickrush')).toBeInTheDocument();
    // 1024 appears multiple times (in icon and heading), so use getAllByText
    expect(screen.getAllByText('1024').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Snake')).toBeInTheDocument();
  });

  // Step 3: Test clicking Brickrush card
  // Should call onSelectGame with 'brickrush'
  it('calls onSelectGame with "brickrush" when Brickrush card is clicked', () => {
    const onSelectGame = vi.fn();
    render(<GameSelector onSelectGame={onSelectGame} />);

    const brickrushCard = screen.getByText('Brickrush').closest('button');
    fireEvent.click(brickrushCard);
    expect(onSelectGame).toHaveBeenCalledWith('brickrush');
  });

  // Step 4: Test clicking 1024 card
  // Should call onSelectGame with '1024'
  it('calls onSelectGame with "1024" when 1024 card is clicked', () => {
    const onSelectGame = vi.fn();
    render(<GameSelector onSelectGame={onSelectGame} />);

    // Find the 1024 card by its title heading
    const cards = screen.getAllByRole('button');
    const card1024 = cards.find((card) => card.textContent.includes('Puzzle'));
    fireEvent.click(card1024);
    expect(onSelectGame).toHaveBeenCalledWith('1024');
  });

  // Step 5: Test clicking Snake card
  // Should call onSelectGame with 'snake'
  it('calls onSelectGame with "snake" when Snake card is clicked', () => {
    const onSelectGame = vi.fn();
    render(<GameSelector onSelectGame={onSelectGame} />);

    const snakeCard = screen.getByText('Snake').closest('button');
    fireEvent.click(snakeCard);
    expect(onSelectGame).toHaveBeenCalledWith('snake');
  });

  // Step 6: Test keyboard shortcut 1 for Brickrush
  // Pressing "1" should select Brickrush
  it('calls onSelectGame with "brickrush" when key 1 is pressed', () => {
    const onSelectGame = vi.fn();
    render(<GameSelector onSelectGame={onSelectGame} />);

    fireEvent.keyDown(window, { key: '1' });
    expect(onSelectGame).toHaveBeenCalledWith('brickrush');
  });

  // Step 7: Test keyboard shortcut 2 for 1024
  // Pressing "2" should select 1024
  it('calls onSelectGame with "1024" when key 2 is pressed', () => {
    const onSelectGame = vi.fn();
    render(<GameSelector onSelectGame={onSelectGame} />);

    fireEvent.keyDown(window, { key: '2' });
    expect(onSelectGame).toHaveBeenCalledWith('1024');
  });

  // Step 8: Test keyboard shortcut 3 for Snake
  // Pressing "3" should select Snake
  it('calls onSelectGame with "snake" when key 3 is pressed', () => {
    const onSelectGame = vi.fn();
    render(<GameSelector onSelectGame={onSelectGame} />);

    fireEvent.keyDown(window, { key: '3' });
    expect(onSelectGame).toHaveBeenCalledWith('snake');
  });

  // Step 9: Test game descriptions are shown
  // Each card should have a description
  it('renders game descriptions', () => {
    render(<GameSelector {...defaultProps} />);

    expect(screen.getByText(/Classic brick breaker with power-ups/)).toBeInTheDocument();
    expect(screen.getByText(/Slide and merge tiles to reach 1024/)).toBeInTheDocument();
    expect(screen.getByText(/Classic snake game/)).toBeInTheDocument();
  });

  // Step 10: Test game tags are rendered
  // Each game should have category tags (some tags appear multiple times)
  it('renders game tags', () => {
    render(<GameSelector {...defaultProps} />);

    // Arcade tag appears twice (Brickrush and Snake cards)
    expect(screen.getAllByText('Arcade').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Puzzle')).toBeInTheDocument();
    expect(screen.getByText('Classic')).toBeInTheDocument();
  });

  // Step 11: Test keyboard hints are displayed
  // Should show keyboard shortcut hint
  it('displays keyboard shortcut hints', () => {
    render(<GameSelector {...defaultProps} />);

    expect(screen.getByText(/Press/)).toBeInTheDocument();
    expect(screen.getByText(/to quick start a game/)).toBeInTheDocument();
  });
});
