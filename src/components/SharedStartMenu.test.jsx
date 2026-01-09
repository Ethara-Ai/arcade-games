import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SharedStartMenu from './SharedStartMenu';

describe('SharedStartMenu', () => {
  const defaultProps = {
    title: 'Test Game',
    description: 'A test game description for testing purposes.',
    onStart: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders title
  it('renders the game title', () => {
    render(<SharedStartMenu {...defaultProps} />);

    expect(screen.getByText('Test Game')).toBeInTheDocument();
  });

  // Step 2: Test description is displayed
  it('renders the game description', () => {
    render(<SharedStartMenu {...defaultProps} />);

    expect(screen.getByText('A test game description for testing purposes.')).toBeInTheDocument();
  });

  // Step 3: Test back button calls onBack
  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(<SharedStartMenu {...defaultProps} onBack={onBack} />);

    const backButton = screen.getByTitle('Back to Game Selector');
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // Step 4: Test Start Game button calls onStart
  it('calls onStart when Start Game button is clicked', () => {
    const onStart = vi.fn();
    render(<SharedStartMenu {...defaultProps} onStart={onStart} />);

    fireEvent.click(screen.getByText('Start Game'));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test custom start button text
  it('renders custom start button text', () => {
    render(<SharedStartMenu {...defaultProps} startButtonText="Begin Adventure" />);

    expect(screen.getByText('Begin Adventure')).toBeInTheDocument();
  });

  // Step 6: Test How to Play button opens modal when instructions provided
  it('shows How to Play button when instructions are provided', () => {
    render(
      <SharedStartMenu
        {...defaultProps}
        instructions={['Step 1', 'Step 2']}
      />
    );

    expect(screen.getByText('How to Play')).toBeInTheDocument();
  });

  // Step 7: Test How to Play button opens modal
  it('opens How to Play modal when button is clicked', () => {
    render(
      <SharedStartMenu
        {...defaultProps}
        instructions={['Step 1', 'Step 2']}
        controls={[{ key: 'Arrow', action: 'Move' }]}
        tips={['Tip 1']}
      />
    );

    fireEvent.click(screen.getByText('How to Play'));
    expect(screen.getByText('Objective')).toBeInTheDocument();
  });

  // Step 8: Test Enter key starts game
  it('calls onStart when Enter key is pressed', () => {
    const onStart = vi.fn();
    render(<SharedStartMenu {...defaultProps} onStart={onStart} />);

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  // Step 9: Test Enter key does not start game when modal is open
  it('does not call onStart when Enter is pressed and help modal is open', () => {
    const onStart = vi.fn();
    render(
      <SharedStartMenu
        {...defaultProps}
        onStart={onStart}
        instructions={['Step 1']}
      />
    );

    // Open the help modal
    fireEvent.click(screen.getByText('How to Play'));

    // Press Enter
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onStart).not.toHaveBeenCalled();
  });

  // Step 10: Test How to Play button is hidden when no instructions/controls/tips
  it('does not show How to Play button when no instructions, controls, or tips', () => {
    render(<SharedStartMenu {...defaultProps} />);

    expect(screen.queryByText('How to Play')).not.toBeInTheDocument();
  });

  // Step 11: Test How to Play modal can be closed
  it('closes How to Play modal when Got It is clicked', () => {
    render(
      <SharedStartMenu
        {...defaultProps}
        instructions={['Step 1']}
      />
    );

    // Open modal
    fireEvent.click(screen.getByText('How to Play'));
    expect(screen.getByText('Objective')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText('Got It!'));
    expect(screen.queryByText('Objective')).not.toBeInTheDocument();
  });

  // Step 12: Test cyan accent color
  it('applies cyan accent color styling', () => {
    const { container } = render(
      <SharedStartMenu {...defaultProps} accentColor="cyan" />
    );

    expect(container.querySelector('.text-cyan-400')).toBeInTheDocument();
  });

  // Step 13: Test green accent color
  it('applies green accent color styling', () => {
    const { container } = render(
      <SharedStartMenu {...defaultProps} accentColor="green" />
    );

    expect(container.querySelector('.text-green-400')).toBeInTheDocument();
  });

  // Step 14: Test amber accent color
  it('applies amber accent color styling', () => {
    const { container } = render(
      <SharedStartMenu {...defaultProps} accentColor="amber" />
    );

    expect(container.querySelector('.text-amber-400')).toBeInTheDocument();
  });

  // Step 15: Test pink accent color
  it('applies pink accent color styling', () => {
    const { container } = render(
      <SharedStartMenu {...defaultProps} accentColor="pink" />
    );

    expect(container.querySelector('.text-pink-400')).toBeInTheDocument();
  });

  // Step 16: Test component has glass-overlay class
  it('has glass-overlay class for styling', () => {
    const { container } = render(<SharedStartMenu {...defaultProps} />);

    const overlay = container.querySelector('.glass-overlay');
    expect(overlay).toBeInTheDocument();
  });

  // Step 17: Test component has glass-panel class
  it('has glass-panel class for menu container', () => {
    const { container } = render(<SharedStartMenu {...defaultProps} />);

    const panel = container.querySelector('.glass-panel');
    expect(panel).toBeInTheDocument();
  });

  // Step 18: Test default cyan accent color
  it('uses cyan as default accent color', () => {
    const { container } = render(<SharedStartMenu {...defaultProps} />);

    expect(container.querySelector('.text-cyan-400')).toBeInTheDocument();
  });

  // Step 19: Test with controls prop
  it('shows How to Play button when controls are provided', () => {
    render(
      <SharedStartMenu
        {...defaultProps}
        controls={[{ key: 'Space', action: 'Jump' }]}
      />
    );

    expect(screen.getByText('How to Play')).toBeInTheDocument();
  });

  // Step 20: Test with tips prop
  it('shows How to Play button when tips are provided', () => {
    render(
      <SharedStartMenu
        {...defaultProps}
        tips={['Tip 1: Do something']}
      />
    );

    expect(screen.getByText('How to Play')).toBeInTheDocument();
  });

  // Step 21: Test startMenu id is present
  it('has startMenu id for styling', () => {
    const { container } = render(<SharedStartMenu {...defaultProps} />);

    expect(container.querySelector('#startMenu')).toBeInTheDocument();
  });

  // Step 22: Test keyboard event cleanup on unmount
  it('removes keyboard event listener on unmount', () => {
    const onStart = vi.fn();
    const { unmount } = render(<SharedStartMenu {...defaultProps} onStart={onStart} />);

    unmount();

    // After unmount, pressing Enter should not trigger callback
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onStart).not.toHaveBeenCalled();
  });

  // Step 23: Test fallback for unknown accent color
  it('falls back to cyan for unknown accent color', () => {
    const { container } = render(
      <SharedStartMenu {...defaultProps} accentColor="invalid" />
    );

    expect(container.querySelector('.text-cyan-400')).toBeInTheDocument();
  });

  // Step 24: Test glass-stat class on description container
  it('has glass-stat class on description container', () => {
    const { container } = render(<SharedStartMenu {...defaultProps} />);

    const descContainer = container.querySelector('.glass-stat');
    expect(descContainer).toBeInTheDocument();
  });

  // Step 25: Test empty arrays do not show How to Play button
  it('does not show How to Play button when arrays are empty', () => {
    render(
      <SharedStartMenu
        {...defaultProps}
        instructions={[]}
        controls={[]}
        tips={[]}
      />
    );

    expect(screen.queryByText('How to Play')).not.toBeInTheDocument();
  });
});
