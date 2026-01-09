import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StartMenu from './StartMenu';

describe('StartMenu', () => {
  const defaultProps = {
    onStart: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders title
  // Should display "Brickrush" title
  it('renders Brickrush title', () => {
    render(<StartMenu {...defaultProps} />);
    
    expect(screen.getByText('Brickrush')).toBeInTheDocument();
  });

  // Step 2: Test description is displayed
  // Should show game description
  it('renders game description', () => {
    render(<StartMenu {...defaultProps} />);
    
    expect(screen.getByText(/Break bricks, collect power-ups/)).toBeInTheDocument();
  });

  // Step 3: Test back button
  // Should call onBack when clicked
  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(<StartMenu {...defaultProps} onBack={onBack} />);
    
    const backButton = screen.getByTitle('Back to Game Selector');
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // Step 4: Test Start Game button
  // Should call onStart when clicked
  it('calls onStart when Start Game button is clicked', () => {
    const onStart = vi.fn();
    render(<StartMenu {...defaultProps} onStart={onStart} />);
    
    fireEvent.click(screen.getByText('Start Game'));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test How to Play button opens modal
  // Should show modal when clicked
  it('opens How to Play modal when button is clicked', () => {
    render(<StartMenu {...defaultProps} />);
    
    fireEvent.click(screen.getByText('How to Play'));
    expect(screen.getByText('Objective')).toBeInTheDocument();
  });

  // Step 6: Test Enter key starts game
  // Pressing Enter should start the game
  it('calls onStart when Enter key is pressed', () => {
    const onStart = vi.fn();
    render(<StartMenu {...defaultProps} onStart={onStart} />);
    
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  // Step 7: Test Enter key does not start game when modal is open
  // Enter should be blocked when help modal is displayed
  it('does not call onStart when Enter is pressed and help modal is open', () => {
    const onStart = vi.fn();
    render(<StartMenu {...defaultProps} onStart={onStart} />);
    
    // Open the help modal
    fireEvent.click(screen.getByText('How to Play'));
    
    // Press Enter
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onStart).not.toHaveBeenCalled();
  });

  // Step 8: Test component structure
  // Should have glass overlay styling
  it('has glass-overlay class for styling', () => {
    const { container } = render(<StartMenu {...defaultProps} />);
    
    const overlay = container.querySelector('.glass-overlay');
    expect(overlay).toBeInTheDocument();
  });

  // Step 9: Test modal can be closed
  // Modal should close when Got It is clicked
  it('closes How to Play modal when Got It is clicked', () => {
    render(<StartMenu {...defaultProps} />);
    
    // Open modal
    fireEvent.click(screen.getByText('How to Play'));
    expect(screen.getByText('Objective')).toBeInTheDocument();
    
    // Close modal
    fireEvent.click(screen.getByText('Got It!'));
    expect(screen.queryByText('Objective')).not.toBeInTheDocument();
  });
});
