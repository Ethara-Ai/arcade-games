import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWindowSize } from './useWindowSize';

describe('useWindowSize', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    // Reset window size before each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    // Restore original window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('should return initial window dimensions', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it('should return isDesktop true when width >= 768', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });

  it('should return isMobile true when width < 768', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should update dimensions on window resize', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 400, writable: true });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(400);
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('should update isMobile/isDesktop when crossing breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);

    // Resize to mobile
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 767, writable: true });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isMobile).toBe(true);

    // Resize back to desktop
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useWindowSize());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it('should handle exact breakpoint value of 768', () => {
    Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });
});
