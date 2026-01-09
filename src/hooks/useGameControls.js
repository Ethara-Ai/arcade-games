import { useEffect, useCallback, useRef, useMemo, useState } from "react";

/**
 * useGameControls - Shared hook for common keyboard and touch handling across games
 *
 * Features:
 * - Common key bindings (pause, start, quit)
 * - Directional input (arrow keys, WASD)
 * -
 Touch/swipe gesture handling
 * - Customizable key mappings
 * - Automatic cleanup
 */

// Default key mappings for directional input
export const DEFAULT_DIRECTION_KEYS = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  w: "UP",
  W: "UP",
  s: "DOWN",
  S: "DOWN",
  a: "LEFT",
  A: "LEFT",
  d: "RIGHT",
  D: "RIGHT",
};

// Default pause keys
export const DEFAULT_PAUSE_KEYS = ["p", "P", "Escape"];

// Default start/confirm keys
export const DEFAULT_START_KEYS = ["Enter"];

// Default launch/action keys
export const DEFAULT_ACTION_KEYS = [" "]; // Space

// Minimum swipe distance for gesture detection
const MIN_SWIPE_DISTANCE = 50;

/**
 * @typedef {Object} GameControlsOptions
 * @property {boolean} enabled - Whether controls are enabled (default: true)
 * @property {boolean} enableKeyboard - Enable keyboard controls (default: true)
 * @property {boolean} enableTouch - Enable touch controls (default: true)
 * @property {boolean} enableDirectional - Enable directional keys (default: true)
 * @property {boolean} preventDefault - Prevent default for handled keys (default: true)
 * @property {Object} directionKeys - Custom direction key mappings
 * @property {string[]} pauseKeys - Keys that trigger pause
 * @property {string[]} startKeys - Keys that trigger start/confirm
 * @property {string[]} actionKeys - Keys that trigger action (e.g., launch ball)
 * @property {Function} onDirection - Callback for directional input (direction: string) => void
 * @property {Function} onPause - Callback for pause key
 * @property {Function} onStart - Callback for start/confirm key
 * @property {Function} onAction - Callback for action key
 * @property {Function} onSwipe - Callback for swipe gesture (direction: string) => void
 * @property {Function} onKeyDown - General keydown handler for custom keys
 * @property {Function} onKeyUp - General keyup handler
 * @property {number} minSwipeDistance - Minimum swipe distance in pixels
 * @property {string[]} disabledStates - Game states where controls should be disabled
 * @property {string} currentState - Current game state
 * @property {boolean} blockWhenModalOpen - Block input when modal is open (default: true)
 * @property {boolean} isModalOpen - Whether a modal is currently open
 */

/**
 * useGameControls hook
 * @param {GameControlsOptions} options - Configuration options
 * @returns {Object} - Controls API
 */
export const useGameControls = (options = {}) => {
  const {
    enabled = true,
    enableKeyboard = true,
    enableTouch = true,
    enableDirectional = true,
    preventDefault = true,
    directionKeys = DEFAULT_DIRECTION_KEYS,
    pauseKeys = DEFAULT_PAUSE_KEYS,
    startKeys = DEFAULT_START_KEYS,
    actionKeys = DEFAULT_ACTION_KEYS,
    onDirection,
    onPause,
    onStart,
    onAction,
    onSwipe,
    onKeyDown,
    onKeyUp,
    minSwipeDistance = MIN_SWIPE_DISTANCE,
    disabledStates = [],
    currentState = null,
    blockWhenModalOpen = true,
    isModalOpen = false,
  } = options;

  // Track currently pressed keys using state (so it can be returned safely)
  const [pressedKeys, setPressedKeys] = useState(new Set());

  // Also keep a ref for immediate access in handlers
  const pressedKeysRef = useRef(new Set());

  // Touch tracking
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Check if controls should be active
  const isActive = useMemo(() => {
    if (!enabled) return false;
    if (blockWhenModalOpen && isModalOpen) return false;
    if (currentState && disabledStates.includes(currentState)) return false;
    return true;
  }, [enabled, blockWhenModalOpen, isModalOpen, currentState, disabledStates]);

  // Check if a key is currently pressed
  const isKeyPressed = useCallback((key) => {
    return pressedKeysRef.current.has(key);
  }, []);

  // Check if any direction key is pressed
  const getActiveDirection = useCallback(() => {
    for (const [key, direction] of Object.entries(directionKeys)) {
      if (pressedKeysRef.current.has(key)) {
        return direction;
      }
    }
    return null;
  }, [directionKeys]);

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (e) => {
      if (!isActive || !enableKeyboard) return;

      const { key } = e;

      // Track pressed key
      pressedKeysRef.current.add(key);
      setPressedKeys(new Set(pressedKeysRef.current));

      // Check for pause keys
      if (pauseKeys.includes(key)) {
        if (preventDefault) e.preventDefault();
        onPause?.();
        return;
      }

      // Check for start/confirm keys
      if (startKeys.includes(key)) {
        if (preventDefault) e.preventDefault();
        onStart?.();
        return;
      }

      // Check for action keys
      if (actionKeys.includes(key)) {
        if (preventDefault) e.preventDefault();
        onAction?.();
        return;
      }

      // Check for directional keys
      if (enableDirectional && directionKeys[key]) {
        if (preventDefault) e.preventDefault();
        onDirection?.(directionKeys[key]);
        return;
      }

      // Call general handler for any other keys
      onKeyDown?.(e);
    },
    [
      isActive,
      enableKeyboard,
      preventDefault,
      pauseKeys,
      startKeys,
      actionKeys,
      directionKeys,
      enableDirectional,
      onPause,
      onStart,
      onAction,
      onDirection,
      onKeyDown,
    ],
  );

  // Key up handler
  const handleKeyUp = useCallback(
    (e) => {
      const { key } = e;
      pressedKeysRef.current.delete(key);
      setPressedKeys(new Set(pressedKeysRef.current));
      onKeyUp?.(e);
    },
    [onKeyUp],
  );

  // Touch start handler
  const handleTouchStart = useCallback(
    (e) => {
      if (!isActive || !enableTouch) return;

      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    },
    [isActive, enableTouch],
  );

  // Touch end handler
  const handleTouchEnd = useCallback(
    (e) => {
      if (!isActive || !enableTouch) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Ignore if swipe took too long (might be a scroll)
      if (deltaTime > 1000) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Check if it's a valid swipe
      if (absX < minSwipeDistance && absY < minSwipeDistance) return;

      let direction;
      if (absX > absY) {
        // Horizontal swipe
        direction = deltaX > 0 ? "RIGHT" : "LEFT";
      } else {
        // Vertical swipe
        direction = deltaY > 0 ? "DOWN" : "UP";
      }

      // Call swipe handler
      onSwipe?.(direction);

      // Also call direction handler for compatibility
      if (enableDirectional) {
        onDirection?.(direction);
      }
    },
    [
      isActive,
      enableTouch,
      minSwipeDistance,
      onSwipe,
      onDirection,
      enableDirectional,
    ],
  );

  // Touch move handler (for continuous tracking if needed)
  const handleTouchMove = useCallback(
    (_e) => {
      if (!isActive || !enableTouch) return;
      // Could be used for continuous paddle control, etc.
    },
    [isActive, enableTouch],
  );

  // Set up keyboard event listeners
  useEffect(() => {
    if (!enableKeyboard) return;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      // Clear pressed keys on cleanup
      pressedKeysRef.current = new Set();
    };
  }, [enableKeyboard, handleKeyDown, handleKeyUp]);

  // Set up touch event listeners
  useEffect(() => {
    if (!enableTouch) return;

    const touchOptions = { passive: true };

    document.addEventListener("touchstart", handleTouchStart, touchOptions);
    document.addEventListener("touchend", handleTouchEnd, touchOptions);
    document.addEventListener("touchmove", handleTouchMove, touchOptions);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [enableTouch, handleTouchStart, handleTouchEnd, handleTouchMove]);

  // Clear pressed keys when controls become inactive
  // We only clear the ref here - state will sync on next key event
  // This avoids the setState-in-effect anti-pattern
  useEffect(() => {
    if (!isActive) {
      pressedKeysRef.current = new Set();
    }
  }, [isActive]);

  return {
    // State (safe to access during render)
    isActive,
    pressedKeys,

    // Methods
    isKeyPressed,
    getActiveDirection,

    // Direct event handlers (for attaching to specific elements)
    handlers: {
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchMove: handleTouchMove,
    },
  };
};

/**
 * Create a game-specific controls hook with preset configuration
 * @param {GameControlsOptions} defaultOptions - Default options for this game type
 * @returns {Function} - Configured useGameControls hook
 */
export const createGameControls = (defaultOptions) => {
  return (overrideOptions = {}) => {
    return useGameControls({
      ...defaultOptions,
      ...overrideOptions,
    });
  };
};

/**
 * Preset: Brickrush controls
 */
export const useBrickrushControls = createGameControls({
  enableDirectional: true,
  actionKeys: [" "], // Space to launch ball
  pauseKeys: ["p", "P", "Escape"],
});

/**
 * Preset: 1024 game controls
 */
export const use1024Controls = createGameControls({
  enableDirectional: true,
  pauseKeys: ["p", "P", "Escape"],
  actionKeys: [], // No action key needed
});

/**
 * Preset: Snake game controls
 */
export const useSnakeControls = createGameControls({
  enableDirectional: true,
  pauseKeys: ["p", "P", " ", "Escape"], // Space also pauses in snake
  actionKeys: [],
});

export default useGameControls;
