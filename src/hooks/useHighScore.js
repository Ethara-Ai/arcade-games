import { useState, useCallback } from 'react';
import { STORAGE_KEYS, debugLog } from '../config';
import { safeGetInt, safeSetItem, safeRemoveItem } from '../utils/safeStorage';

/**
 * useHighScore - Generic hook for managing high scores across games
 *
 * Features:
 * - Safe localStorage access (won't crash in private browsing or when storage is full)
 * - Automatic persistence
 * - Debug logging when enabled
 *
 * @param {string} storageKey - The localStorage key to use (defaults to Brickrush for backward compatibility)
 * @param {string} gameName - Optional game name for debug logging
 * @returns {Object} - { highScore, updateHighScore, loadHighScore, resetHighScore }
 */
export const useHighScore = (storageKey = STORAGE_KEYS.BRICKRUSH_HIGH_SCORE, gameName = 'Game') => {
  // Use lazy initialization to load high score from localStorage safely
  const [highScore, setHighScore] = useState(() => {
    const savedHighScore = safeGetInt(storageKey, 0);
    debugLog(`Loaded ${gameName} high score:`, savedHighScore);
    return savedHighScore;
  });

  // Save high score to localStorage safely
  const saveHighScore = useCallback(
    (score) => {
      const success = safeSetItem(storageKey, score.toString());
      if (success) {
        setHighScore(score);
        debugLog(`Saved ${gameName} high score:`, score);
      } else {
        // Still update state even if storage failed
        setHighScore(score);
        debugLog(`Failed to save ${gameName} high score to storage, but updated state:`, score);
      }
      return success;
    },
    [storageKey, gameName]
  );

  // Update high score if current score is higher
  const updateHighScore = useCallback(
    (currentScore) => {
      if (currentScore > highScore) {
        saveHighScore(currentScore);
        return true; // New high score
      }
      return false;
    },
    [highScore, saveHighScore]
  );

  // loadHighScore - refresh from localStorage
  const loadHighScore = useCallback(() => {
    const savedHighScore = safeGetInt(storageKey, 0);
    setHighScore(savedHighScore);
    debugLog(`Reloaded ${gameName} high score:`, savedHighScore);
    return savedHighScore;
  }, [storageKey, gameName]);

  // resetHighScore - clear the high score
  const resetHighScore = useCallback(() => {
    const success = safeRemoveItem(storageKey);
    setHighScore(0);
    debugLog(
      `Reset ${gameName} high score`,
      success ? '(storage cleared)' : '(storage clear failed)'
    );
    return success;
  }, [storageKey, gameName]);

  // Check if a score would be a new high score
  const isNewHighScore = useCallback((score) => score > highScore, [highScore]);

  // Get the difference between a score and the high score
  const getScoreDifference = useCallback((score) => score - highScore, [highScore]);

  return {
    highScore,
    updateHighScore,
    loadHighScore,
    resetHighScore,
    saveHighScore,
    isNewHighScore,
    getScoreDifference,
  };
};

export default useHighScore;
