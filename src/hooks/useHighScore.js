import { useState, useCallback } from "react";
import { STORAGE_KEYS, debugLog } from "../config";

export const useHighScore = () => {
  // Use lazy initialization to load high score from localStorage
  const [highScore, setHighScore] = useState(() => {
    const savedHighScore = localStorage.getItem(STORAGE_KEYS.BRICKRUSH_HIGH_SCORE);
    if (savedHighScore !== null) {
      debugLog("Loaded Brickrush high score:", savedHighScore);
      return parseInt(savedHighScore, 10);
    }
    return 0;
  });

  // Save high score to localStorage
  const saveHighScore = useCallback((score) => {
    localStorage.setItem(STORAGE_KEYS.BRICKRUSH_HIGH_SCORE, score.toString());
    setHighScore(score);
    debugLog("Saved Brickrush high score:", score);
  }, []);

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

  // loadHighScore is now a no-op since we use lazy initialization
  // but kept for API compatibility
  const loadHighScore = useCallback(() => {
    const savedHighScore = localStorage.getItem(STORAGE_KEYS.BRICKRUSH_HIGH_SCORE);
    if (savedHighScore !== null) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  return {
    highScore,
    updateHighScore,
    loadHighScore,
  };
};

export default useHighScore;
