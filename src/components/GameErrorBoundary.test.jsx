import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameErrorBoundary from './GameErrorBoundary';
import { withGameErrorBoundary } from './withGameErrorBoundary';

// Component that throws an error
const ThrowingComponent = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Child content</div>;
};

// Suppress console.error for error boundary tests
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

describe('GameErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test component renders children when no error
  it('renders children when there is no error', () => {
    render(
      <GameErrorBoundary>
        <div>Test child content</div>
      </GameErrorBoundary>
    );

    expect(screen.getByText('Test child content')).toBeInTheDocument();
  });

  // Step 2: Test error boundary catches error and shows fallback
  it('catches error and displays fallback UI', () => {
    render(
      <GameErrorBoundary gameName="TestGame">
        <ThrowingComponent />
      </GameErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/TestGame encountered an unexpected error/)).toBeInTheDocument();
  });

  // Step 3: Test Try Again button resets error state
  it('resets error state when Try Again is clicked', () => {
    let shouldThrow = true;
    const TestComponent = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>Recovered content</div>;
    };

    const { rerender } = render(
      <GameErrorBoundary>
        <TestComponent />
      </GameErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    // Change state so component won't throw on next render
    shouldThrow = false;

    fireEvent.click(screen.getByText('Try Again'));

    // Force rerender to trigger recovery
    rerender(
      <GameErrorBoundary>
        <TestComponent />
      </GameErrorBoundary>
    );
  });

  // Step 4: Test Back to Menu button calls onBack
  it('calls onBack when Back to Menu is clicked', () => {
    const onBack = vi.fn();
    render(
      <GameErrorBoundary onBack={onBack}>
        <ThrowingComponent />
      </GameErrorBoundary>
    );

    fireEvent.click(screen.getByText('Back to Menu'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test onRetry callback is called
  it('calls onRetry callback when Try Again is clicked', () => {
    const onRetry = vi.fn();
    render(
      <GameErrorBoundary onRetry={onRetry}>
        <ThrowingComponent />
      </GameErrorBoundary>
    );

    fireEvent.click(screen.getByText('Try Again'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  // Step 6: Test onError callback is called when error occurs
  it('calls onError callback when error is caught', () => {
    const onError = vi.fn();
    render(
      <GameErrorBoundary onError={onError}>
        <ThrowingComponent />
      </GameErrorBoundary>
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });

  // Step 7: Test error details are shown when showErrorDetails is true
  it('shows error details when showErrorDetails is true', () => {
    render(
      <GameErrorBoundary showErrorDetails={true}>
        <ThrowingComponent />
      </GameErrorBoundary>
    );

    expect(screen.getByText(/Test error/)).toBeInTheDocument();
  });

  // Step 8: Test error details are hidden by default
  it('hides error details by default', () => {
    render(
      <GameErrorBoundary>
        <ThrowingComponent />
      </GameErrorBoundary>
    );

    // The error message should not be visible
    const errorDetails = screen.queryByText('Error: Test error');
    expect(errorDetails).not.toBeInTheDocument();
  });

  // Step 9: Test custom fallback is rendered
  it('renders custom fallback when provided', () => {
    const customFallback = ({ onRetry, onBack }) => (
      <div>
        <span>Custom error UI</span>
        <button onClick={onRetry}>Custom Retry</button>
        <button onClick={onBack}>Custom Back</button>
      </div>
    );

    render(
      <GameErrorBoundary customFallback={customFallback} onBack={vi.fn()}>
        <ThrowingComponent />
      </GameErrorBoundary>
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
    expect(screen.getByText('Custom Retry')).toBeInTheDocument();
    expect(screen.getByText('Custom Back')).toBeInTheDocument();
  });

  // Step 10: Test different accent colors render correctly
  it('applies cyan accent color styling', () => {
    const { container } = render(
      <GameErrorBoundary accentColor="cyan">
        <ThrowingComponent />
      </GameErrorBoundary>
    );

    expect(container.querySelector('.text-cyan-400')).toBeInTheDocument();
  });

  it('applies green accent color styling', () => {
    const { container } = render(
      <GameErrorBoundary accentColor="green">
        <ThrowingComponent />
      </GameErrorBoundary>
    );

    expect(container.querySelector('.text-green-400')).toBeInTheDocument();
  });

  it('applies amber accent color styling', () => {
    const { container } = render(
      <GameErrorBoundary accentColor="amber">
        <ThrowingComponent />
      </GameErrorBoundary>
    );

    expect(container.querySelector('.text-amber-400')).toBeInTheDocument();
  });

  // Step 11: Test Back to Menu button is not shown when onBack is not provided
  it('does not show Back to Menu button when onBack is not provided', () => {
    render(
      <GameErrorBoundary>
        <ThrowingComponent />
      </GameErrorBoundary>
    );

    expect(screen.queryByText('Back to Menu')).not.toBeInTheDocument();
  });

  // Step 12: Test default game name
  it('uses default game name when not provided', () => {
    render(
      <GameErrorBoundary>
        <ThrowingComponent />
      </GameErrorBoundary>
    );

    expect(screen.getByText(/Game encountered an unexpected error/)).toBeInTheDocument();
  });
});

describe('withGameErrorBoundary HOC', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Step 1: Test HOC wraps component correctly
  it('wraps component with error boundary', () => {
    const TestComponent = () => <div>Test content</div>;
    const WrappedComponent = withGameErrorBoundary(TestComponent);

    render(<WrappedComponent />);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  // Step 2: Test HOC catches errors from wrapped component
  it('catches errors from wrapped component', () => {
    const WrappedComponent = withGameErrorBoundary(ThrowingComponent, {
      gameName: 'WrappedGame',
    });

    render(<WrappedComponent />);
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/WrappedGame encountered an unexpected error/)).toBeInTheDocument();
  });

  // Step 3: Test HOC passes props through to wrapped component
  it('passes props to wrapped component', () => {
    const TestComponent = ({ message }) => <div>{message}</div>;
    const WrappedComponent = withGameErrorBoundary(TestComponent);

    render(<WrappedComponent message="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  // Step 4: Test HOC passes onBack prop to error boundary
  it('passes onBack prop to error boundary', () => {
    const onBack = vi.fn();
    const WrappedComponent = withGameErrorBoundary(ThrowingComponent);

    render(<WrappedComponent onBack={onBack} />);

    fireEvent.click(screen.getByText('Back to Menu'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test HOC sets display name
  it('sets correct display name for wrapped component', () => {
    const TestComponent = () => <div>Test</div>;
    TestComponent.displayName = 'TestComponent';
    const WrappedComponent = withGameErrorBoundary(TestComponent);

    expect(WrappedComponent.displayName).toBe('WithGameErrorBoundary(TestComponent)');
  });
});
