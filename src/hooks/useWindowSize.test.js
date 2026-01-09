import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useWindowSize,
  useMediaQuery,
  usePrefersReducedMotion,
  useIsTouchDevice,
} from "./useWindowSize";

describe("useWindowSize", () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    // Use fake timers to control debouncing
    vi.useFakeTimers();

    // Reset window size before each test
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    vi.useRealTimers();

    // Restore original window size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it("should return initial window dimensions", () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it("should return isDesktop true when width >= 768", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });

  it("should return isMobile true when width < 768", () => {
    Object.defineProperty(window, "innerWidth", { value: 500, writable: true });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it("should update dimensions on window resize after debounce delay", async () => {
    const { result } = renderHook(() => useWindowSize({ debounceDelay: 100 }));

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);

    // Trigger resize
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        value: 500,
        writable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 400,
        writable: true,
      });
      window.dispatchEvent(new Event("resize"));
    });

    // Values should not have changed yet (debounced)
    expect(result.current.width).toBe(1024);

    // Fast-forward past the debounce delay
    await act(async () => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(400);
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it("should update isMobile/isDesktop when crossing breakpoint", async () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });

    const { result } = renderHook(() => useWindowSize({ debounceDelay: 100 }));

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);

    // Resize to mobile
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        value: 767,
        writable: true,
      });
      window.dispatchEvent(new Event("resize"));
    });

    // Fast-forward past debounce
    await act(async () => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isMobile).toBe(true);

    // Resize back to desktop
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        value: 768,
        writable: true,
      });
      window.dispatchEvent(new Event("resize"));
    });

    // Fast-forward past debounce
    await act(async () => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });

  it("should remove event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useWindowSize());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });

  it("should handle exact breakpoint value of 768", () => {
    Object.defineProperty(window, "innerWidth", { value: 768, writable: true });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isMobile).toBe(false);
  });

  it("should calculate aspect ratio correctly", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1920,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 1080,
      writable: true,
    });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.aspectRatio).toBeCloseTo(1.778, 2);
  });

  it("should detect landscape orientation", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 768,
      writable: true,
    });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isLandscape).toBe(true);
    expect(result.current.isPortrait).toBe(false);
  });

  it("should detect portrait orientation", () => {
    Object.defineProperty(window, "innerWidth", { value: 768, writable: true });
    Object.defineProperty(window, "innerHeight", {
      value: 1024,
      writable: true,
    });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current.isLandscape).toBe(false);
    expect(result.current.isPortrait).toBe(true);
  });

  it("should call onResize callback when window resizes", async () => {
    const onResizeMock = vi.fn();

    renderHook(() =>
      useWindowSize({ onResize: onResizeMock, debounceDelay: 100 }),
    );

    act(() => {
      Object.defineProperty(window, "innerWidth", {
        value: 500,
        writable: true,
      });
      window.dispatchEvent(new Event("resize"));
    });

    // Fast-forward past debounce
    await act(async () => {
      vi.advanceTimersByTime(150);
    });

    expect(onResizeMock).toHaveBeenCalledWith({
      width: 500,
      height: 768,
    });
  });

  it("should debounce rapid resize events", async () => {
    const onResizeMock = vi.fn();

    renderHook(() =>
      useWindowSize({ onResize: onResizeMock, debounceDelay: 100 }),
    );

    // Trigger multiple resize events rapidly
    for (let i = 0; i < 5; i++) {
      act(() => {
        Object.defineProperty(window, "innerWidth", {
          value: 500 + i * 100,
          writable: true,
        });
        window.dispatchEvent(new Event("resize"));
      });

      await act(async () => {
        vi.advanceTimersByTime(50); // Less than debounce delay
      });
    }

    // Callback should not have been called yet
    expect(onResizeMock).not.toHaveBeenCalled();

    // Fast-forward to complete the final debounce
    await act(async () => {
      vi.advanceTimersByTime(150);
    });

    // Should only be called once with the final value
    expect(onResizeMock).toHaveBeenCalledTimes(1);
    expect(onResizeMock).toHaveBeenCalledWith({
      width: 900, // 500 + 4 * 100
      height: 768,
    });
  });

  it("should support custom mobile breakpoint", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });

    const { result } = renderHook(() =>
      useWindowSize({ mobileBreakpoint: 1200 }),
    );

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });
});

describe("useMediaQuery", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial match state", () => {
    // Mock matchMedia
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(min-width: 768px)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.matchMedia = mockMatchMedia;

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(true);
  });

  it("should return false for non-matching query", () => {
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.matchMedia = mockMatchMedia;

    const { result } = renderHook(() => useMediaQuery("(max-width: 500px)"));

    expect(result.current).toBe(false);
  });
});

describe("usePrefersReducedMotion", () => {
  it("should return true when reduced motion is preferred", () => {
    const mockMatchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.matchMedia = mockMatchMedia;

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(true);
  });

  it("should return false when reduced motion is not preferred", () => {
    const mockMatchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.matchMedia = mockMatchMedia;

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);
  });
});

describe("useIsTouchDevice", () => {
  it("should return true for touch-enabled devices", () => {
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: 1,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsTouchDevice());

    expect(result.current).toBe(true);
  });

  it("should return false for non-touch devices", () => {
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: 0,
      writable: true,
      configurable: true,
    });

    // Also make sure ontouchstart is not present
    delete window.ontouchstart;

    const { result } = renderHook(() => useIsTouchDevice());

    expect(result.current).toBe(false);
  });
});
