import { useEffect, useRef, useCallback, useState } from 'react';
import { TRANSITION_TIMINGS, getAccessibleTiming } from '../constants/timing';

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
  const [currentPhase, setCurrentPhase] = useState('idle');

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
    setCurrentPhase('fading-in');
    setOpacity(0);

    // After a tiny delay, start fading in
    addTimer(() => {
      setOpacity(1);

      // After fade-in completes, enter holding phase
      addTimer(() => {
        setCurrentPhase('holding');

        // Call midpoint callback
        if (onMidpointRef.current) {
          onMidpointRef.current();
        }

        // After hold, start fading out
        addTimer(() => {
          setCurrentPhase('fading-out');
          setOpacity(0);

          // After fade-out, complete the transition
          addTimer(() => {
            setCurrentPhase('idle');
            setIsTransitioning(false);

            // Call completion callback
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          }, accessibleFadeOut);
        }, accessibleHold);
      }, accessibleFadeIn);
    }, 10);
  }, [clearTimers, addTimer, accessibleFadeIn, accessibleFadeOut, accessibleHold]);

  // Reset the transition (cancel and hide immediately)
  const resetTransition = useCallback(() => {
    clearTimers();
    setIsTransitioning(false);
    setOpacity(0);
    setCurrentPhase('idle');
  }, [clearTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // Determine transition duration for CSS
  const transitionDuration = currentPhase === 'fading-in' ? accessibleFadeIn : accessibleFadeOut;

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

export default useLevelTransition;
