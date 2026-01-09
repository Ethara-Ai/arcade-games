import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingScreen from './LoadingScreen';

describe('LoadingScreen', () => {
  // Step 1: Test that component renders correctly when visible
  // This verifies the loading screen displays its content properly
  it('renders loading content when visible', () => {
    render(<LoadingScreen isVisible={true} />);
    
    expect(screen.getByText('Arcade Games')).toBeInTheDocument();
    expect(screen.getByText('Get ready to play!')).toBeInTheDocument();
  });

  // Step 2: Test hidden class is applied when not visible
  // This ensures the loading screen can be hidden
  it('applies hidden class when not visible', () => {
    const { container } = render(<LoadingScreen isVisible={false} />);
    
    const loadingScreen = container.querySelector('.loading-screen');
    expect(loadingScreen).toHaveClass('hidden');
  });

  // Step 3: Test hidden class is not applied when visible
  // Verifies visible state works correctly
  it('does not apply hidden class when visible', () => {
    const { container } = render(<LoadingScreen isVisible={true} />);
    
    const loadingScreen = container.querySelector('.loading-screen');
    expect(loadingScreen).not.toHaveClass('hidden');
  });

  // Step 4: Test loading spinner and progress bar exist
  // These are visual indicators of loading progress
  it('renders loading spinner and progress bar', () => {
    const { container } = render(<LoadingScreen isVisible={true} />);
    
    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
    expect(container.querySelector('.loading-progress')).toBeInTheDocument();
    expect(container.querySelector('.loading-progress-bar')).toBeInTheDocument();
  });
});
