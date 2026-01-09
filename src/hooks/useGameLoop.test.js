import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameLoop } from './useGameLoop';

describe('useGameLoop', () => {
  let requestAnimationFrameSpy;
  let cancelAnimationFrameSpy;

  beforeEach(() => {
    vi.useFakeTimers();
    requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');
    cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    requestAnimationFrameSpy.mockRestore();
    cancelAnimationFrameSpy.mockRestore();
  });

  it('should call requestAnimationFrame when running', () => {
    const callback = vi.fn();

    renderHook(() => useGameLoop(callback, true));

    expect(requestAnimationFrameSpy).toHaveBeenCalled();
  });

  it('should not call requestAnimationFrame when not running', () => {
    const callback = vi.fn();
    requestAnimationFrameSpy.mockClear();

    renderHook(() => useGameLoop(callback, false));

    expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
  });

  it('should call callback with deltaTime on animation frame', async () => {
    const callback = vi.fn();

    renderHook(() => useGameLoop(callback, true));

    // First frame - no callback since previousTime is undefined
    act(() => {
      vi.advanceTimersByTime(16);
    });

    // Second frame - callback should be called with deltaTime
    act(() => {
      vi.advanceTimersByTime(16);
    });

    // The callback should have been called at least once after two frames
    expect(callback).toHaveBeenCalled();
  });

  it('should cancel animation frame on unmount', () => {
    const callback = vi.fn();

    const { unmount } = renderHook(() => useGameLoop(callback, true));

    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });

  it('should cancel animation frame when isRunning changes to false', () => {
    const callback = vi.fn();

    const { rerender } = renderHook(({ isRunning }) => useGameLoop(callback, isRunning), {
      initialProps: { isRunning: true },
    });

    cancelAnimationFrameSpy.mockClear();

    rerender({ isRunning: false });

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });

  it('should update callback reference when callback changes', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { rerender } = renderHook(({ callback }) => useGameLoop(callback, true), {
      initialProps: { callback: callback1 },
    });

    rerender({ callback: callback2 });

    // Advance timers to trigger frames
    act(() => {
      vi.advanceTimersByTime(32);
    });

    // callback2 should be the one being called after the update
    expect(callback2).toHaveBeenCalled();
  });

  it('should restart animation frame when isRunning changes from false to true', () => {
    const callback = vi.fn();

    const { rerender } = renderHook(({ isRunning }) => useGameLoop(callback, isRunning), {
      initialProps: { isRunning: false },
    });

    requestAnimationFrameSpy.mockClear();

    rerender({ isRunning: true });

    expect(requestAnimationFrameSpy).toHaveBeenCalled();
  });

  it('should default isRunning to true when not provided', () => {
    const callback = vi.fn();
    requestAnimationFrameSpy.mockClear();

    renderHook(() => useGameLoop(callback));

    expect(requestAnimationFrameSpy).toHaveBeenCalled();
  });
});
