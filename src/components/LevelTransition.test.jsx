import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import LevelTransition, { useLevelTransition } from './LevelTransition';

describe('LevelTransition', () => {
  // Step 1: Test component does not render when not visible
  it('does not render when visible is false', () => {
    const { container } = render(
      <LevelTransition visible={false} opacity={0} accentColor="cyan" />
    );

    expect(container.firstChild).toBeNull();
  });

  // Step 2: Test component renders when visible
  it('renders when visible is true', () => {
    const { container } = render(
      <LevelTransition visible={true} opacity={1} accentColor="cyan" />
    );

    expect(container.firstChild).not.toBeNull();
    expect(container.querySelector('.fixed')).toBeInTheDocument();
  });

  // Step 3: Test opacity is applied correctly
  it('applies opacity style correctly', () => {
    const { container } = render(
      <LevelTransition visible={true} opacity={0.5} accentColor="cyan" />
    );

    const overlay = container.firstChild;
    expect(overlay.style.opacity).toBe('0.5');
  });

  // Step 4: Test message is displayed when provided
  it('displays message when provided', () => {
    render(
      <LevelTransition visible={true} opacity={1} accentColor="cyan" message="Level Complete!" />
    );

    expect(screen.getByText('Level Complete!')).toBeInTheDocument();
  });

  // Step 5: Test message is not displayed when not provided
  it('does not display message when not provided', () => {
    const { container } = render(
      <LevelTransition visible={true} opacity={1} accentColor="cyan" />
    );

    // Should not have any text content in the message area
    const textElement = container.querySelector('.text-center');
    expect(textElement).toBeNull();
  });

  // Step 6: Test cyan accent color styling
  it('applies cyan accent color styling', () => {
    const { container } = render(
      <LevelTransition visible={true} opacity={1} accentColor="cyan" message="Test" />
    );

    const overlay = container.firstChild;
    expect(overlay.className).toContain('bg-cyan-900/95');
  });

  // Step 7: Test green accent color styling
  it('applies green accent color styling', () => {
    const { container } = render(
      <LevelTransition visible={true} opacity={1} accentColor="green" message="Test" />
    );

    const overlay = container.firstChild;
    expect(overlay.className).toContain('bg-emerald-900/95');
  });

  // Step 8: Test amber accent color styling
  it('applies amber accent color styling', () => {
    const { container } = render(
      <LevelTransition visible={true} opacity={1} accentColor="amber" message="Test" />
    );

    const overlay = container.firstChild;
    expect(overlay.className).toContain('bg-amber-900/95');
  });

  // Step 9: Test pink accent color styling
  it('applies pink accent color styling', () => {
    const { container } = render(
      <LevelTransition visible={true} opacity={1} accentColor="pink" message="Test" />
    );

    const overlay = container.firstChild;
    expect(overlay.className).toContain('bg-pink-900/95');
  });

  // Step 10: Test transition duration is applied
  it('applies custom transition duration', () => {
    const { container } = render(
      <LevelTransition visible={true} opacity={1} accentColor="cyan" transitionDuration={1000} />
    );

    const overlay = container.firstChild;
    expect(overlay.style.transition).toContain('1000ms');
  });

  // Step 11: Test default transition duration
  it('uses default transition duration of 500ms', () => {
    const { container } = render(
      <LevelTransition visible={true} opacity={1} accentColor="cyan" />
    );

    const overlay = container.firstChild;
    expect(overlay.style.transition).toContain('500ms');
  });

  // Step 12: Test fallback to cyan for unknown accent color
  it('falls back to cyan for unknown accent color', () => {
    const { container } = render(
      <LevelTransition visible={true} opacity={1} accentColor="unknown" message="Test" />
    );

    const overlay = container.firstChild;
    expect(overlay.className).toContain('bg-cyan-900/95');
  });
});

describe('useLevelTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Step 1: Test initial state
  it('returns initial state with isTransitioning false', () => {
    const { result } = renderHook(() => useLevelTransition());

    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.transitionProps.visible).toBe(false);
    expect(result.current.transitionProps.opacity).toBe(0);
  });

  // Step 2: Test startTransition sets isTransitioning to true
  it('sets isTransitioning to true when startTransition is called', () => {
    const { result } = renderHook(() => useLevelTransition());

    act(() => {
      result.current.startTransition();
    });

    expect(result.current.isTransitioning).toBe(true);
    expect(result.current.transitionProps.visible).toBe(true);
  });

  // Step 3: Test opacity changes during transition
  it('changes opacity to 1 during fade-in phase', async () => {
    const { result } = renderHook(() => useLevelTransition());

    act(() => {
      result.current.startTransition();
    });

    // Advance past the initial tiny delay
    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(result.current.transitionProps.opacity).toBe(1);
  });

  // Step 4: Test onMidpoint callback is called
  it('calls onMidpoint callback at midpoint of transition', () => {
    const onMidpoint = vi.fn();
    const { result } = renderHook(() =>
      useLevelTransition({
        onMidpoint,
        fadeInDuration: 100,
        holdDuration: 50,
        fadeOutDuration: 100,
      })
    );

    act(() => {
      result.current.startTransition();
    });

    // Advance past initial delay + fade in
    act(() => {
      vi.advanceTimersByTime(10 + 100);
    });

    expect(onMidpoint).toHaveBeenCalledTimes(1);
  });

  // Step 5: Test onComplete callback is called
  it('calls onComplete callback when transition ends', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useLevelTransition({
        onComplete,
        fadeInDuration: 100,
        holdDuration: 50,
        fadeOutDuration: 100,
      })
    );

    act(() => {
      result.current.startTransition();
    });

    // Advance through entire transition: delay + fadeIn + hold + fadeOut
    act(() => {
      vi.advanceTimersByTime(10 + 100 + 50 + 100);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  // Step 6: Test isTransitioning is false after transition completes
  it('sets isTransitioning to false after transition completes', () => {
    const { result } = renderHook(() =>
      useLevelTransition({
        fadeInDuration: 100,
        holdDuration: 50,
        fadeOutDuration: 100,
      })
    );

    act(() => {
      result.current.startTransition();
    });

    // Advance through entire transition
    act(() => {
      vi.advanceTimersByTime(10 + 100 + 50 + 100);
    });

    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.transitionProps.visible).toBe(false);
  });

  // Step 7: Test resetTransition cancels and hides immediately
  it('resets transition immediately when resetTransition is called', () => {
    const { result } = renderHook(() => useLevelTransition());

    act(() => {
      result.current.startTransition();
    });

    expect(result.current.isTransitioning).toBe(true);

    act(() => {
      result.current.resetTransition();
    });

    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.transitionProps.visible).toBe(false);
    expect(result.current.transitionProps.opacity).toBe(0);
  });

  // Step 8: Test currentPhase changes during transition
  it('transitions through phases correctly', () => {
    const { result } = renderHook(() =>
      useLevelTransition({
        fadeInDuration: 100,
        holdDuration: 50,
        fadeOutDuration: 100,
      })
    );

    expect(result.current.currentPhase).toBe('idle');

    act(() => {
      result.current.startTransition();
    });

    expect(result.current.currentPhase).toBe('fading-in');

    // Advance past fade-in
    act(() => {
      vi.advanceTimersByTime(10 + 100);
    });

    expect(result.current.currentPhase).toBe('holding');

    // Advance past hold
    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(result.current.currentPhase).toBe('fading-out');

    // Advance past fade-out
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.currentPhase).toBe('idle');
  });

  // Step 9: Test custom timing options
  it('respects custom timing options', () => {
    const onMidpoint = vi.fn();
    const { result } = renderHook(() =>
      useLevelTransition({
        onMidpoint,
        fadeInDuration: 200,
        holdDuration: 100,
        fadeOutDuration: 200,
      })
    );

    act(() => {
      result.current.startTransition();
    });

    // Midpoint should not be called yet with shorter time
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onMidpoint).not.toHaveBeenCalled();

    // Advance to midpoint (10 + 200)
    act(() => {
      vi.advanceTimersByTime(110);
    });

    expect(onMidpoint).toHaveBeenCalled();
  });

  // Step 10: Test cleanup on unmount
  it('cleans up timers on unmount', () => {
    const onComplete = vi.fn();
    const { result, unmount } = renderHook(() =>
      useLevelTransition({
        onComplete,
        fadeInDuration: 100,
        holdDuration: 50,
        fadeOutDuration: 100,
      })
    );

    act(() => {
      result.current.startTransition();
    });

    // Unmount before transition completes
    unmount();

    // Advance timers - callback should not be called
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onComplete).not.toHaveBeenCalled();
  });
});
