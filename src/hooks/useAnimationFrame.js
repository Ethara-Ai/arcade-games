import { useEffect, useRef, useCallback } from 'react';

/**
 * useAnimationFrame - Hook for managing requestAnimationFrame with proper cleanup
 *
 * Features:
 * - Automatic cleanup on unmount (prevents memory leaks)
 * - Start/stop/pause controls
 * - Delta time calculation
 * - FPS tracking
 * - Respects reduced motion preference
 *
 * @param {Function} callback - Function to call each frame: (deltaTime, totalTime) => void
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoStart - Start animation automatically (default: false)
 * @param {boolean} options.respectReducedMotion - Stop animation if user prefers reduced motion (default: false)
 */
export const useAnimationFrame = (callback, options = {}) => {
  const { autoStart = false, respectReducedMotion = false } = options;

  // Refs for tracking animation state
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);
  const startTimeRef = useRef(null);
  const isRunningRef = useRef(false);
  const callbackRef = useRef(callback);

  // FPS tracking
  const frameCountRef = useRef(0);
  const fpsRef = useRef(0);
  const lastFpsUpdateRef = useRef(0);

  // Update callback ref when callback changes (avoids stale closures)
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Check for reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Start the animation loop
  const start = useCallback(() => {
    // Check reduced motion preference
    if (respectReducedMotion && prefersReducedMotion()) {
      console.debug('[useAnimationFrame] Animation disabled due to reduced motion preference');
      return;
    }

    if (isRunningRef.current) return; // Already running

    isRunningRef.current = true;
    previousTimeRef.current = null;
    startTimeRef.current = null;

    // Animation loop function - defined here to avoid hoisting issues
    const animate = (currentTime) => {
      if (!isRunningRef.current) return;

      // Initialize timing on first frame
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
        previousTimeRef.current = currentTime;
        lastFpsUpdateRef.current = currentTime;
      }

      // Calculate delta time (time since last frame)
      const deltaTime = currentTime - previousTimeRef.current;
      previousTimeRef.current = currentTime;

      // Calculate total elapsed time
      const totalTime = currentTime - startTimeRef.current;

      // Update FPS counter every second
      frameCountRef.current++;
      if (currentTime - lastFpsUpdateRef.current >= 1000) {
        fpsRef.current = frameCountRef.current;
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = currentTime;
      }

      // Call the callback with timing info
      if (callbackRef.current) {
        callbackRef.current(deltaTime, totalTime);
      }

      // Request next frame
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
  }, [respectReducedMotion, prefersReducedMotion]);

  // Stop the animation loop
  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    // Reset timing
    previousTimeRef.current = null;
    startTimeRef.current = null;
    frameCountRef.current = 0;
    fpsRef.current = 0;
  }, []);

  // Pause the animation (keeps timing state)
  const pause = useCallback(() => {
    isRunningRef.current = false;
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, []);

  // Resume the animation (after pause)
  const resume = useCallback(() => {
    if (isRunningRef.current) return; // Already running

    // Check reduced motion preference
    if (respectReducedMotion && prefersReducedMotion()) {
      return;
    }

    isRunningRef.current = true;

    // Animation loop function for resume
    const animate = (currentTime) => {
      if (!isRunningRef.current) return;

      // Reset previous time to prevent large delta on resume
      if (previousTimeRef.current === null) {
        previousTimeRef.current = currentTime;
      }

      // Calculate delta time
      const deltaTime = currentTime - previousTimeRef.current;
      previousTimeRef.current = currentTime;

      // Calculate total elapsed time (from original start)
      const totalTime = startTimeRef.current !== null ? currentTime - startTimeRef.current : 0;

      // Update FPS counter
      frameCountRef.current++;
      if (currentTime - lastFpsUpdateRef.current >= 1000) {
        fpsRef.current = frameCountRef.current;
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = currentTime;
      }

      // Call the callback
      if (callbackRef.current) {
        callbackRef.current(deltaTime, totalTime);
      }

      // Request next frame
      requestRef.current = requestAnimationFrame(animate);
    };

    // Reset previous time to prevent large delta on resume
    previousTimeRef.current = null;
    requestRef.current = requestAnimationFrame(animate);
  }, [respectReducedMotion, prefersReducedMotion]);

  // Toggle running state
  const toggle = useCallback(() => {
    if (isRunningRef.current) {
      pause();
    } else {
      resume();
    }
  }, [pause, resume]);

  // Get current FPS
  const getFps = useCallback(() => fpsRef.current, []);

  // Check if animation is running
  const isRunning = useCallback(() => isRunningRef.current, []);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      start();
    }

    // Cleanup on unmount - this is the key fix for the memory leak
    return () => {
      isRunningRef.current = false;
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [autoStart, start]);

  // Listen for reduced motion preference changes
  useEffect(() => {
    if (!respectReducedMotion || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e) => {
      if (e.matches && isRunningRef.current) {
        stop();
        console.debug('[useAnimationFrame] Stopped due to reduced motion preference change');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [respectReducedMotion, stop]);

  return {
    start,
    stop,
    pause,
    resume,
    toggle,
    getFps,
    isRunning,
    // Expose refs for advanced use cases
    requestRef,
  };
};

/**
 * useAnimationLoop - Simpler hook that just runs a callback every frame
 * Useful for game loops that need to run continuously
 *
 * @param {Function} callback - Function to call each frame
 * @param {boolean} isRunning - Whether the loop should be running
 */
export const useAnimationLoop = (callback, isRunning = true) => {
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isRunning) {
      // Cleanup when not running
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      return;
    }

    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callbackRef.current(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount or when isRunning changes
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isRunning]);
};

/**
 * useInterval - Hook for running a callback at a fixed interval
 * Uses requestAnimationFrame for better performance than setInterval
 *
 * @param {Function} callback - Function to call each interval
 * @param {number|null} delay - Interval in milliseconds (null to pause)
 */
export const useInterval = (callback, delay) => {
  const callbackRef = useRef(callback);
  const requestRef = useRef(null);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      return;
    }

    const tick = (time) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const elapsed = time - lastTimeRef.current;

      if (elapsed >= delay) {
        lastTimeRef.current = time - (elapsed % delay);
        callbackRef.current();
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [delay]);
};

export default useAnimationFrame;
