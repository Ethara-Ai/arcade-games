import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HowToPlayModal from './HowToPlayModal';

describe('HowToPlayModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    gameName: 'Test Game',
    accentColor: 'cyan',
    instructions: [],
    controls: [],
    tips: [],
  };

  // Step 1: Test modal renders when open
  // Modal should be visible when isOpen is true
  it('renders when isOpen is true', () => {
    render(<HowToPlayModal {...defaultProps} isOpen={true} />);
    
    expect(screen.getByText('How to Play')).toBeInTheDocument();
    expect(screen.getByText('Test Game')).toBeInTheDocument();
  });

  // Step 2: Test modal does not render when closed
  // Should return null when isOpen is false
  it('does not render when isOpen is false', () => {
    const { container } = render(<HowToPlayModal {...defaultProps} isOpen={false} />);
    
    expect(container.firstChild).toBeNull();
  });

  // Step 3: Test close button calls onClose
  // Clicking X button should close the modal
  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<HowToPlayModal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: '' }); // Close button with icon
    const buttons = screen.getAllByRole('button');
    const closeBtn = buttons[0]; // First button is the close button
    
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Step 4: Test clicking overlay closes modal
  // Clicking outside the modal content should close it
  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<HowToPlayModal {...defaultProps} onClose={onClose} />);
    
    const overlay = container.querySelector('.glass-overlay');
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test clicking content does not close modal
  // Clicking inside the modal content should not close it
  it('does not call onClose when content is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<HowToPlayModal {...defaultProps} onClose={onClose} />);
    
    const content = container.querySelector('.glass-panel');
    fireEvent.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });

  // Step 6: Test instructions rendering
  // Should display all provided instructions
  it('renders instructions when provided', () => {
    const instructions = ['First instruction', 'Second instruction'];
    render(<HowToPlayModal {...defaultProps} instructions={instructions} />);
    
    expect(screen.getByText('Objective')).toBeInTheDocument();
    expect(screen.getByText('First instruction')).toBeInTheDocument();
    expect(screen.getByText('Second instruction')).toBeInTheDocument();
  });

  // Step 7: Test controls rendering
  // Should display all provided controls with keys
  it('renders controls when provided', () => {
    const controls = [
      { key: 'Space', action: 'Jump' },
      { key: 'Arrow Keys', action: 'Move' },
    ];
    render(<HowToPlayModal {...defaultProps} controls={controls} />);
    
    expect(screen.getByText('Controls')).toBeInTheDocument();
    expect(screen.getByText('Jump')).toBeInTheDocument();
    expect(screen.getByText('Space')).toBeInTheDocument();
    expect(screen.getByText('Move')).toBeInTheDocument();
    expect(screen.getByText('Arrow Keys')).toBeInTheDocument();
  });

  // Step 8: Test tips rendering
  // Should display all provided tips
  it('renders tips when provided', () => {
    const tips = ['Pro tip 1', 'Pro tip 2'];
    render(<HowToPlayModal {...defaultProps} tips={tips} />);
    
    expect(screen.getByText('Tips')).toBeInTheDocument();
    expect(screen.getByText('Pro tip 1')).toBeInTheDocument();
    expect(screen.getByText('Pro tip 2')).toBeInTheDocument();
  });

  // Step 9: Test "Got It" button
  // Should call onClose when clicked
  it('calls onClose when Got It button is clicked', () => {
    const onClose = vi.fn();
    render(<HowToPlayModal {...defaultProps} onClose={onClose} />);
    
    fireEvent.click(screen.getByText('Got It!'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Step 10: Test different accent colors
  // Should apply correct color classes
  it('applies green color classes when accentColor is green', () => {
    render(<HowToPlayModal {...defaultProps} accentColor="green" />);
    
    const title = screen.getByText('How to Play');
    expect(title).toHaveClass('text-green-400');
  });
});
