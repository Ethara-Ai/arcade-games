import { useEffect, useRef, useCallback, useState } from "react";
import { TRANSITION_TIMINGS, getAccessibleTiming } from "../constants/timing";

/**
 * LevelTransition - A purely presentational transition overlay component
 *
 * This component only renders based on props - no internal state management.
 * Use the useLevelTransition hook for managing the transition state.
 *
 * @param {Object} props
 * @param {boolean} props.visible - Whether the overlay is visible
 * @param {number} props.opacity - Current opacity (0-1)
 * @param {string} props.accentColor - Color theme ('cyan', 'green', 'amber', 'pink')
 * @param {string} props.message - Optional message to display
 * @param {number} props.transitionDuration - CSS transition duration in ms
 */
const LevelTransition = ({
  visible = false,
  opacity = 0,
  accentColor = "cyan",
  message = "",
  transitionDuration = 500,
}) => {
  // Color configurations
  const colorConfig = {
    cyan: {
      bg: "bg-cyan-900/95",
      glow: "bg-cyan-500/30",
      text: "text-cyan-400",
    },
    green: {
      bg: "bg-emerald-900/95",
      glow: "bg-green-500/30",
      text: "text-green-400",
    },
    amber: {
      bg: "bg-amber-900/95",
      glow: "bg-amber-500/30",
      text: "text-amber-400",
    },
    pink: {
      bg: "bg-pink-900/95",
      glow: "bg-pink-500/30",
      text: "text-pink-400",
    },
  };

  const colors = colorConfig[accentColor] || colorConfig.cyan;

  // Don't render if not visible
  if (!visible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${colors.bg}`}
      style={{
        opacity,
        transition: `opacity ${transitionDuration}ms ease-in-out`,
      }}
    >
      {/* Animated glow effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${colors.glow} rounded-full blur-[100px] animate-pulse`}
        />
      </div>

      {/* Optional message */}
      {message && (
        <div className="relative z-10 text-center">
          <p
            className={`text-2xl sm:text-3xl font-bold ${colors.text}`}
            style={{
              fontFamily: '"Raleway", sans-serif',
              textShadow: "0 0 20px currentColor",
            }}
          >
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * useLevelTransition - Hook for managing level transition state
 *
 * Handles all the timing logic for fade-in/hold/fade-out transitions.
 * Returns props to spread onto LevelTransition component.
 *
 * @param {Object} options
 * @param {Function} options.onMidpoint - Callback fired at the midpoint (when fully faded in)
 * @param {Function} options.onComplete - Callback fired when transition is complete
 * @param {number} options.fadeInDuration - Duration of fade in (ms)
 * @param {number} options.fadeOutDuration - Duration of fade out (ms)
 * @param {number} options.holdDuration - Duration to hold at full opacity (ms)
 * @returns {Object} - { transitionProps, startTransition, isTransitioning }
 */
export const useLevelTransition = (options = {}) => {
  const {
    onMidpoint,
    onComplete,
    fadeInDuration = TRANSITION_TIMINGS?.LEVEL_TRANSITION_IN || 500,
    fadeOutDuration = TRANSITION_TIMINGS?.LEVEL_TRANSITION_OUT || 500,
    holdDuration = 100,
  } = options;

  // State for controlling the transition
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("idle");

  // Timer refs for cleanup
  const timersRef = useRef([]);

  // Callback refs to avoid stale closures
  const onMidpointRef = useRef(onMidpoint);
  const onCompleteRef = useRef(onComplete);

  // Update callback refs when they change
  useEffect(() => {
    onMidpointRef.current = onMidpoint;
    onCompleteRef.current = onComplete;
  }, [onMidpoint, onComplete]);

  // Get accessible timings
  const accessibleFadeIn = getAccessibleTiming(fadeInDuration, 50);
  const accessibleFadeOut = getAccessibleTiming(fadeOutDuration, 50);
  const accessibleHold = getAccessibleTiming(holdDuration, 0);

  // Clear all timers
  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  // Add a timer to the list (for cleanup tracking)
  const addTimer = useCallback((callback, delay) => {
    const timer = setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  }, []);

  // Start the transition sequence
  const startTransition = useCallback(() => {
    // Clear any existing timers
    clearTimers();

    // Start transition
    setIsTransitioning(true);
    setCurrentPhase("fading-in");
    setOpacity(0);

    // After a tiny delay, start fading in
    addTimer(() => {
      setOpacity(1);

      // After fade-in completes, enter holding phase
      addTimer(() => {
        setCurrentPhase("holding");

        // Call midpoint callback
        if (onMidpointRef.current) {
          onMidpointRef.current();
        }

        // After hold, start fading out
        addTimer(() => {
          setCurrentPhase("fading-out");
          setOpacity(0);

          // After fade-out, complete the transition
          addTimer(() => {
            setCurrentPhase("idle");
            setIsTransitioning(false);

            // Call completion callback
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          }, accessibleFadeOut);
        }, accessibleHold);
      }, accessibleFadeIn);
    }, 10);
  }, [
    clearTimers,
    addTimer,
    accessibleFadeIn,
    accessibleFadeOut,
    accessibleHold,
  ]);

  // Reset the transition (cancel and hide immediately)
  const resetTransition = useCallback(() => {
    clearTimers();
    setIsTransitioning(false);
    setOpacity(0);
    setCurrentPhase("idle");
  }, [clearTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // Determine transition duration for CSS
  const transitionDuration =
    currentPhase === "fading-in" ? accessibleFadeIn : accessibleFadeOut;

  return {
    // Props to spread onto LevelTransition component
    transitionProps: {
      visible: isTransitioning,
      opacity,
      transitionDuration,
    },

    // Control functions
    startTransition,
    resetTransition,

    // State
    isTransitioning,
    currentPhase,
  };
};

export default LevelTransition;
