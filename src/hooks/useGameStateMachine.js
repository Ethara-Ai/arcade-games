import { useState, useCallback, useMemo, useRef } from 'react';

/**
 * useGameStateMachine - Unified state machine hook for all games
 *
 * Provides consistent state management across all games with:
 * - Predictable state transitions
 * - Transition callbacks
 * - State history tracking
 * - Guard conditions for transitions
 */

// Default game states used across all games
export const GAME_STATES = {
  START: 'START',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
  WON: 'WON',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
};

// Default transitions map
const DEFAULT_TRANSITIONS = {
  [GAME_STATES.START]: {
    START_GAME: GAME_STATES.PLAYING,
  },
  [GAME_STATES.PLAYING]: {
    PAUSE: GAME_STATES.PAUSED,
    GAME_OVER: GAME_STATES.GAME_OVER,
    WIN: GAME_STATES.WON,
    LEVEL_COMPLETE: GAME_STATES.LEVEL_COMPLETE,
  },
  [GAME_STATES.PAUSED]: {
    RESUME: GAME_STATES.PLAYING,
    RESTART: GAME_STATES.PLAYING,
    QUIT: GAME_STATES.START,
  },
  [GAME_STATES.GAME_OVER]: {
    RESTART: GAME_STATES.PLAYING,
    QUIT: GAME_STATES.START,
  },
  [GAME_STATES.WON]: {
    CONTINUE: GAME_STATES.PLAYING,
    RESTART: GAME_STATES.PLAYING,
    QUIT: GAME_STATES.START,
  },
  [GAME_STATES.LEVEL_COMPLETE]: {
    NEXT_LEVEL: GAME_STATES.PLAYING,
    RESTART: GAME_STATES.PLAYING,
    QUIT: GAME_STATES.START,
  },
};

/**
 * @typedef {Object} GameStateMachineOptions
 * @property {string} initialState - Initial state (default: START)
 * @property {Object} transitions - Custom transitions map (merged with defaults)
 * @property {Object} guards - Guard functions for transitions { [event]: (
context) => boolean }
 * @property {Object} onEnter - Callbacks when entering a state { [state]: (prevState, event) => void }
 * @property {Object} onExit - Callbacks when exiting a state { [state]: (nextState, event) => void }
 * @property {Function} onTransition - Callback on any transition (prevState, nextState, event) => void
 * @property {boolean} trackHistory - Whether to track state history (default: false)
 * @property {number} maxHistoryLength - Max history entries to keep (default: 10)
 */

/**
 * useGameStateMachine hook
 * @param {GameStateMachineOptions} options - Configuration options
 * @returns {Object} - State machine API
 */
export const useGameStateMachine = (options = {}) => {
  const {
    initialState = GAME_STATES.START,
    transitions: customTransitions = {},
    guards = {},
    onEnter = {},
    onExit = {},
    onTransition,
    trackHistory = false,
    maxHistoryLength = 10,
  } = options;

  // Merge custom transitions with defaults
  const transitions = useMemo(() => {
    const merged = { ...DEFAULT_TRANSITIONS };
    Object.keys(customTransitions).forEach((state) => {
      merged[state] = {
        ...merged[state],
        ...customTransitions[state],
      };
    });
    return merged;
  }, [customTransitions]);

  // Current state
  const [state, setState] = useState(initialState);

  // State history (if tracking enabled)
  const [history, setHistory] = useState([]);

  // Context for guards and callbacks
  const contextRef = useRef({});

  // Previous state - using state instead of ref to avoid accessing ref during render
  const [prevState, setPrevState] = useState(null);

  /**
   * Update context (for use in guards)
   */
  const setContext = useCallback((newContext) => {
    if (typeof newContext === 'function') {
      contextRef.current = newContext(contextRef.current);
    } else {
      contextRef.current = { ...contextRef.current, ...newContext };
    }
  }, []);

  /**
   * Get current context
   */
  const getContext = useCallback(() => contextRef.current, []);

  /**
   * Check if a transition is valid
   */
  const canTransition = useCallback(
    (event) => {
      const stateTransitions = transitions[state];
      if (!stateTransitions || !stateTransitions[event]) {
        return false;
      }

      // Check guard if exists
      const guard = guards[event];
      if (guard && typeof guard === 'function') {
        return guard(contextRef.current, state);
      }

      return true;
    },
    [state, transitions, guards]
  );

  /**
   * Get possible events from current state
   */
  const getAvailableEvents = useCallback(() => {
    const stateTransitions = transitions[state];
    if (!stateTransitions) return [];
    return Object.keys(stateTransitions);
  }, [state, transitions]);

  /**
   * Perform a state transition
   */
  const send = useCallback(
    (event, payload = {}) => {
      const stateTransitions = transitions[state];

      if (!stateTransitions) {
        console.warn(`[GameStateMachine] No transitions defined for state: ${state}`);
        return false;
      }

      const nextState = stateTransitions[event];

      if (!nextState) {
        console.warn(`[GameStateMachine] Invalid event "${event}" for state "${state}"`);
        return false;
      }

      // Check guard
      const guard = guards[event];
      if (guard && typeof guard === 'function') {
        if (!guard(contextRef.current, state, payload)) {
          console.debug(`[GameStateMachine] Guard prevented transition: ${event}`);
          return false;
        }
      }

      // Call onExit for current state
      const exitCallback = onExit[state];
      if (exitCallback && typeof exitCallback === 'function') {
        exitCallback(nextState, event, payload);
      }

      // Update history if tracking
      if (trackHistory) {
        setHistory((prev) => {
          const newHistory = [
            ...prev,
            { from: state, to: nextState, event, timestamp: Date.now() },
          ];
          return newHistory.slice(-maxHistoryLength);
        });
      }

      // Store previous state
      setPrevState(state);

      // Transition to new state
      setState(nextState);

      // Call onEnter for new state
      const enterCallback = onEnter[nextState];
      if (enterCallback && typeof enterCallback === 'function') {
        enterCallback(state, event, payload);
      }

      // Call global onTransition
      if (onTransition && typeof onTransition === 'function') {
        onTransition(state, nextState, event, payload);
      }

      return true;
    },
    [state, transitions, guards, onExit, onEnter, onTransition, trackHistory, maxHistoryLength]
  );

  /**
   * Force set state (use sparingly, bypasses guards)
   */
  const forceState = useCallback(
    (newState) => {
      if (!transitions[newState]) {
        console.warn(`[GameStateMachine] Unknown state: ${newState}. Forcing anyway.`);
      }
      setPrevState(state);
      setState(newState);
    },
    [state, transitions]
  );

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setPrevState(state);
    setState(initialState);
    if (trackHistory) {
      setHistory([]);
    }
  }, [state, initialState, trackHistory]);

  /**
   * Check if currently in a specific state
   */
  const isState = useCallback((checkState) => state === checkState, [state]);

  /**
   * Check if in any of the provided states
   */
  const isAnyState = useCallback((...states) => states.includes(state), [state]);

  // Computed state checks
  const isPlaying = state === GAME_STATES.PLAYING;
  const isPaused = state === GAME_STATES.PAUSED;
  const isGameOver = state === GAME_STATES.GAME_OVER;
  const isWon = state === GAME_STATES.WON;
  const isStart = state === GAME_STATES.START;
  const isLevelComplete = state === GAME_STATES.LEVEL_COMPLETE;
  const isActive = isPlaying || isPaused;
  const isEnded = isGameOver || isWon;

  // Convenience action methods
  const startGame = useCallback((payload) => send('START_GAME', payload), [send]);
  const pause = useCallback((payload) => send('PAUSE', payload), [send]);
  const resume = useCallback((payload) => send('RESUME', payload), [send]);
  const restart = useCallback((payload) => send('RESTART', payload), [send]);
  const quit = useCallback((payload) => send('QUIT', payload), [send]);
  const gameOver = useCallback((payload) => send('GAME_OVER', payload), [send]);
  const win = useCallback((payload) => send('WIN', payload), [send]);
  const nextLevel = useCallback((payload) => send('NEXT_LEVEL', payload), [send]);
  const continueGame = useCallback((payload) => send('CONTINUE', payload), [send]);
  const levelComplete = useCallback((payload) => send('LEVEL_COMPLETE', payload), [send]);

  /**
   * Toggle pause/resume
   */
  const togglePause = useCallback(() => {
    if (isPlaying) {
      return pause();
    } else if (isPaused) {
      return resume();
    }
    return false;
  }, [isPlaying, isPaused, pause, resume]);

  return {
    // Current state
    state,
    prevState,

    // State checks
    isState,
    isAnyState,
    isPlaying,
    isPaused,
    isGameOver,
    isWon,
    isStart,
    isLevelComplete,
    isActive,
    isEnded,

    // Core actions
    send,
    canTransition,
    getAvailableEvents,
    forceState,
    reset,

    // Convenience actions
    startGame,
    pause,
    resume,
    restart,
    quit,
    gameOver,
    win,
    nextLevel,
    continueGame,
    levelComplete,
    togglePause,

    // Context management
    setContext,
    getContext,

    // History (if tracking enabled)
    history: trackHistory ? history : [],
  };
};

/**
 * Create a game-specific state machine hook with preset configuration
 * @param {GameStateMachineOptions} defaultOptions - Default options for this game type
 * @returns {Function} - Configured useGameStateMachine hook
 */
export const createGameStateMachine = (defaultOptions) => {
  return (overrideOptions = {}) => {
    return useGameStateMachine({
      ...defaultOptions,
      ...overrideOptions,
      transitions: {
        ...defaultOptions.transitions,
        ...overrideOptions.transitions,
      },
      guards: {
        ...defaultOptions.guards,
        ...overrideOptions.guards,
      },
      onEnter: {
        ...defaultOptions.onEnter,
        ...overrideOptions.onEnter,
      },
      onExit: {
        ...defaultOptions.onExit,
        ...overrideOptions.onExit,
      },
    });
  };
};

export default useGameStateMachine;
