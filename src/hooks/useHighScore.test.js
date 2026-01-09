import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHighScore } from './useHighScore';

// Mock the config module
vi.mock('../config', () => ({
  STORAGE_KEYS: {
    BRICKRUSH_HIGH_SCORE: 'brickrush_high_score',
  },
  debugLog: vi.fn(),
}));

describe('useHighScore', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.getItem.mockReturnValue(null);
  });

  it('should initialize with 0 when no saved high score exists', () => {
    localStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useHighScore());

    expect(result.current.highScore).toBe(0);
  });

  it('should load saved high score from localStorage on initialization', () => {
    localStorage.getItem.mockReturnValue('500');

    const { result } = renderHook(() => useHighScore());

    expect(result.current.highScore).toBe(500);
  });

  it('should update high score when current score is higher', () => {
    localStorage.getItem.mockReturnValue('100');

    const { result } = renderHook(() => useHighScore());

    let isNewHighScore;
    act(() => {
      isNewHighScore = result.current.updateHighScore(200);
    });

    expect(isNewHighScore).toBe(true);
    expect(result.current.highScore).toBe(200);
    expect(localStorage.setItem).toHaveBeenCalledWith('brickrush_high_score', '200');
  });

  it('should not update high score when current score is lower', () => {
    localStorage.getItem.mockReturnValue('500');

    const { result } = renderHook(() => useHighScore());

    let isNewHighScore;
    act(() => {
      isNewHighScore = result.current.updateHighScore(300);
    });

    expect(isNewHighScore).toBe(false);
    expect(result.current.highScore).toBe(500);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('should not update high score when current score equals high score', () => {
    localStorage.getItem.mockReturnValue('500');

    const { result } = renderHook(() => useHighScore());

    let isNewHighScore;
    act(() => {
      isNewHighScore = result.current.updateHighScore(500);
    });

    expect(isNewHighScore).toBe(false);
    expect(result.current.highScore).toBe(500);
  });

  it('should reload high score from localStorage when loadHighScore is called', () => {
    localStorage.getItem.mockReturnValue('100');

    const { result } = renderHook(() => useHighScore());

    expect(result.current.highScore).toBe(100);

    // Simulate localStorage being updated externally
    localStorage.getItem.mockReturnValue('999');

    act(() => {
      result.current.loadHighScore();
    });

    expect(result.current.highScore).toBe(999);
  });

  it('should return all expected properties and functions', () => {
    const { result } = renderHook(() => useHighScore());

    expect(result.current).toHaveProperty('highScore');
    expect(result.current).toHaveProperty('updateHighScore');
    expect(result.current).toHaveProperty('loadHighScore');
    expect(typeof result.current.updateHighScore).toBe('function');
    expect(typeof result.current.loadHighScore).toBe('function');
  });
});
