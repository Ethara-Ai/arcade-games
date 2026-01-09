import { useState, useEffect, useCallback, useRef } from 'react';
import { DELAY_TIMINGS } from '../constants/timing';

/**
 * useWindowSize - Hook for tracking window dimensions with SSR compatibility
 *
 * Features:
 * - SSR-safe (doesn't access window during initial render on server)
 * - Debounced resize handling to prevent excessive re-renders
 * - Mobile/desktop breakpoint detection
 * - Optional callback on resize
 *
 * @param {Object} options - Configuration options
 * @param {number} options.debounceDelay - Debounce delay in ms (default: 100)
 * @param {number} options.mobileBreakpoint - Mobile breakpoint in px (default: 768)
 * @param {Function} options.onResize - Callback when window resizes
 * @returns {Object} - { width, height, isMobile, isDesktop, isLandscape, isPortrait }
 */
export const useWindowSize = (options = {}) => {
  const {
    debounceDelay = DELAY_TIMINGS?.RESIZE_DEBOUNCE || 100,
    mobileBreakpoint = 768,
    onResize,
  } = options;

  // Debounce timer ref
  const timeoutRef = useRef(null);

  // Safe way to get initial dimensions (SSR-compatible)
  const getWindowDimensions = useCallback(() => {
    if (typeof window === 'undefined') {
      // Server-side: return default values
      return {
        width: 0,
        height: 0,
      };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  // Initialize state with lazy initialization
  const [windowSize, setWindowSize] = useState(() => getWindowDimensions());

  // Track if we're mounted (for SSR hydration)
  const [isMounted, setIsMounted] = useState(false);

  // Handle resize with debouncing
  const handleResize = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced update
    timeoutRef.current = setTimeout(() => {
      const newSize = getWindowDimensions();
      setWindowSize(newSize);

      // Call optional resize callback
      if (onResize && typeof onResize === 'function') {
        onResize(newSize);
      }
    }, debounceDelay);
  }, [debounceDelay, getWindowDimensions, onResize]);

  // Effect for client-side hydration and resize listener
  useEffect(() => {
    // Mark as mounted (we're on the client)
    setIsMounted(true);

    // Set actual dimensions on mount (hydration)
    setWindowSize(getWindowDimensions());

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Also listen for orientation change on mobile devices
    window.addEventListener('orientationchange', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);

      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [getWindowDimensions, handleResize]);

  // Computed values
  const isMobile = windowSize.width < mobileBreakpoint;
  const isDesktop = windowSize.width >= mobileBreakpoint;
  const isLandscape = windowSize.width > windowSize.height;
  const isPortrait = windowSize.height >= windowSize.width;

  // Calculate aspect ratio
  const aspectRatio = windowSize.height > 0 ? windowSize.width / windowSize.height : 1;

  return {
    ...windowSize,
    isMobile,
    isDesktop,
    isLandscape,
    isPortrait,
    aspectRatio,
    isMounted,
  };
};

/**
 * useMediaQuery - Hook for checking CSS media queries
 *
 * @param {string} query - CSS media query string
 * @returns {boolean} - Whether the media query matches
 */
export const useMediaQuery = (query) => {
  // SSR-safe initial value with lazy initialization
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);

    // Handler for changes - only called on actual changes, not synchronously
    const handleChange = (e) => {
      setMatches(e.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Legacy browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
};

/**
 * usePrefersReducedMotion - Hook to check if user prefers reduced motion
 *
 * @returns {boolean} - Whether user prefers reduced motion
 */
export const usePrefersReducedMotion = () => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

/**
 * usePrefersDarkMode - Hook to check if user prefers dark mode
 *
 * @returns {boolean} - Whether user prefers dark mode
 */
export const usePrefersDarkMode = () => {
  return useMediaQuery('(prefers-color-scheme: dark)');
};

/**
 * useIsTouchDevice - Hook to detect touch-capable devices
 *
 * @returns {boolean} - Whether device supports touch
 */
export const useIsTouchDevice = () => {
  // Use lazy initialization to detect touch capability (SSR-safe)
  const [isTouch] = useState(() => {
    if (typeof window === 'undefined') return false;

    return (
      'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    );
  });

  return isTouch;
};

export default useWindowSize;
