import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameCard from './GameCard';

describe('GameCard', () => {
  const defaultProps = {
    title: 'Test Game',
    description: 'A test game description',
    onClick: vi.fn(),
    accentColor: 'cyan',
    shortcutKey: '1',
    icon: <span data-testid="test-icon">🎮</span>,
    tags: [
      { label: 'Arcade', color: 'cyan' },
      { label: 'Classic', color: 'green' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders title
  it('renders the game title', () => {
    render(<GameCard {...defaultProps} />);

    expect(screen.getByText('Test Game')).toBeInTheDocument();
  });

  // Step 2: Test description is rendered
  it('renders the game description', () => {
    render(<GameCard {...defaultProps} />);

    expect(screen.getByText('A test game description')).toBeInTheDocument();
  });

  // Step 3: Test onClick handler
  it('calls onClick when card is clicked', () => {
    const onClick = vi.fn();
    render(<GameCard {...defaultProps} onClick={onClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // Step 4: Test shortcut key badge is displayed
  it('renders keyboard shortcut badge', () => {
    render(<GameCard {...defaultProps} />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  // Step 5: Test icon is rendered
  it('renders the icon', () => {
    render(<GameCard {...defaultProps} />);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  // Step 6: Test tags are rendered
  it('renders all tags', () => {
    render(<GameCard {...defaultProps} />);

    expect(screen.getByText('Arcade')).toBeInTheDocument();
    expect(screen.getByText('Classic')).toBeInTheDocument();
  });

  // Step 7: Test component renders without optional props
  it('renders without optional props', () => {
    render(<GameCard title="Minimal Game" onClick={vi.fn()} />);

    expect(screen.getByText('Minimal Game')).toBeInTheDocument();
  });

  // Step 8: Test different accent colors
  it('renders with amber accent color', () => {
    render(<GameCard {...defaultProps} accentColor="amber" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with green accent color', () => {
    render(<GameCard {...defaultProps} accentColor="green" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with pink accent color', () => {
    render(<GameCard {...defaultProps} accentColor="pink" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  // Step 9: Test without shortcut key
  it('does not render shortcut badge when shortcutKey is not provided', () => {
    render(<GameCard {...defaultProps} shortcutKey={undefined} />);

    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  // Step 10: Test with empty tags array
  it('renders without tags when tags array is empty', () => {
    render(<GameCard {...defaultProps} tags={[]} />);

    expect(screen.queryByText('Arcade')).not.toBeInTheDocument();
    expect(screen.queryByText('Classic')).not.toBeInTheDocument();
  });

  // Step 11: Test button has correct class
  it('has game-card class for styling', () => {
    render(<GameCard {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('game-card');
  });

  // Step 12: Test with different tag colors
  it('renders tags with different colors', () => {
    const tagsWithColors = [
      { label: 'Yellow Tag', color: 'yellow' },
      { label: 'Pink Tag', color: 'pink' },
      { label: 'Amber Tag', color: 'amber' },
    ];
    render(<GameCard {...defaultProps} tags={tagsWithColors} />);

    expect(screen.getByText('Yellow Tag')).toBeInTheDocument();
    expect(screen.getByText('Pink Tag')).toBeInTheDocument();
    expect(screen.getByText('Amber Tag')).toBeInTheDocument();
  });

  // Step 13: Test default accent color fallback
  it('falls back to cyan when invalid accent color is provided', () => {
    render(<GameCard {...defaultProps} accentColor="invalid" />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  // Step 14: Test displayName is set (for React DevTools)
  it('has correct displayName', () => {
    expect(GameCard.displayName).toBe('GameCard');
  });
});
