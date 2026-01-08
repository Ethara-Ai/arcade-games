import { useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS, debugLog } from '../config';

export const useHighScore = () => {
  const [highScore, setHighScore] = useState(0);

  // Load high score on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem(STORAGE_KEYS.BRICKRUSH_HIGH_SCORE);
    if (savedHighScore !== null) {
      setHighScore(parseInt(savedHighScore, 10));
      debugLog('Loaded Brickrush high score:', savedHighScore);
    }
  }, []);

  // Save high score to localStorage
  const saveHighScore = useCallback((score) => {
    localStorage.setItem(STORAGE_KEYS.BRICKRUSH_HIGH_SCORE, score.toString());
    setHighScore(score);
    debugLog('Saved Brickrush high score:', score);
  }, []);

  // Update high score if current score is higher
  const updateHighScore = useCallback((currentScore) => {
    if (currentScore > highScore) {
      saveHighScore(currentScore);
      return true; // New high score
    }
    return false;
  }, [highScore, saveHighScore]);

  return {
    highScore,
    updateHighScore,
    loadHighScore: () => {
      const savedHighScore = localStorage.getItem(STORAGE_KEYS.BRICKRUSH_HIGH_SCORE);
      if (savedHighScore !== null) {
        setHighScore(parseInt(savedHighScore, 10));
      }
    },
  };
};

export default useHighScore;
