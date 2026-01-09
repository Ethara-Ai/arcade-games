import { useState, useCallback } from "react";
import { STORAGE_KEYS, debugLog } from "../config";

/**
 * useHighScore - Generic hook for managing high scores across games
 * @param {string} storageKey - The localStorage key to use (defaults to Brickrush for backward compatibility)
 * @param {string} gameName - Optional game name for debug logging
 * @returns {Object} - { highScore, updateHighScore, loadHighScore, resetHighScore }
 */
export const useHighScore = (
  storageKey = STORAGE_KEYS.BRICKRUSH_HIGH_SCORE,
  gameName = "Game",
) => {
  // Use lazy initialization to load high score from localStorage
  const [highScore, setHighScore] = useState(() => {
    const savedHighScore = localStorage.getItem(storageKey);
    if (savedHighScore !== null) {
      debugLog(`Loaded ${gameName} high score:`, savedHighScore);
      return parseInt(savedHighScore, 10);
    }
    return 0;
  });

  // Save high score to localStorage
  const saveHighScore = useCallback(
    (score) => {
      localStorage.setItem(storageKey, score.toString());
      setHighScore(score);
      debugLog(`Saved ${gameName} high score:`, score);
    },
    [storageKey, gameName],
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
    [highScore, saveHighScore],
  );

  // loadHighScore - refresh from localStorage
  const loadHighScore = useCallback(() => {
    const savedHighScore = localStorage.getItem(storageKey);
    if (savedHighScore !== null) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, [storageKey]);

  // resetHighScore - clear the high score
  const resetHighScore = useCallback(() => {
    localStorage.removeItem(storageKey);
    setHighScore(0);
    debugLog(`Reset ${gameName} high score`);
  }, [storageKey, gameName]);

  return {
    highScore,
    updateHighScore,
    loadHighScore,
    resetHighScore,
  };
};

export default useHighScore;
