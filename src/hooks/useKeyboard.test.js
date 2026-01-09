import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboard } from './useKeyboard';

describe('useKeyboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty keys object', () => {
    const { result } = renderHook(() => useKeyboard());

    expect(result.current.keys).toEqual({});
  });

  it('should track key down events', () => {
    const { result } = renderHook(() => useKeyboard());

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });

    expect(result.current.keys['ArrowLeft']).toBe(true);
  });

  it('should track key up events', () => {
    const { result } = renderHook(() => useKeyboard());

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });

    expect(result.current.keys['ArrowLeft']).toBe(true);

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    });

    expect(result.current.keys['ArrowLeft']).toBe(false);
  });

  it('should track multiple keys simultaneously', () => {
    const { result } = renderHook(() => useKeyboard());

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    });

    expect(result.current.keys['ArrowLeft']).toBe(true);
    expect(result.current.keys['ArrowUp']).toBe(true);
  });

  describe('isKeyPressed', () => {
    it('should return true for pressed key', () => {
      const { result } = renderHook(() => useKeyboard());

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      });

      expect(result.current.isKeyPressed('a')).toBe(true);
    });

    it('should return false for unpressed key', () => {
      const { result } = renderHook(() => useKeyboard());

      expect(result.current.isKeyPressed('a')).toBe(false);
    });
  });

  describe('isLeftPressed', () => {
    it('should return true when ArrowLeft is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      });

      expect(result.current.isLeftPressed()).toBe(true);
    });

    it('should return true when lowercase "a" is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      });

      expect(result.current.isLeftPressed()).toBe(true);
    });

    it('should return true when uppercase "A" is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }));
      });

      expect(result.current.isLeftPressed()).toBe(true);
    });

    it('should return false when no left key is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      expect(result.current.isLeftPressed()).toBeFalsy();
    });
  });

  describe('isRightPressed', () => {
    it('should return true when ArrowRight is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      });

      expect(result.current.isRightPressed()).toBe(true);
    });

    it('should return true when lowercase "d" is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
      });

      expect(result.current.isRightPressed()).toBe(true);
    });

    it('should return true when uppercase "D" is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'D' }));
      });

      expect(result.current.isRightPressed()).toBe(true);
    });

    it('should return false when no right key is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      expect(result.current.isRightPressed()).toBeFalsy();
    });
  });

  describe('isSpacePressed', () => {
    it('should return true when space is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      });

      expect(result.current.isSpacePressed()).toBe(true);
    });

    it('should return false when space is not pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      expect(result.current.isSpacePressed()).toBeFalsy();
    });
  });

  describe('isPausePressed', () => {
    it('should return true when lowercase "p" is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
      });

      expect(result.current.isPausePressed()).toBe(true);
    });

    it('should return true when uppercase "P" is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'P' }));
      });

      expect(result.current.isPausePressed()).toBe(true);
    });

    it('should return true when Escape is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });

      expect(result.current.isPausePressed()).toBe(true);
    });

    it('should return false when no pause key is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      expect(result.current.isPausePressed()).toBeFalsy();
    });
  });

  describe('isEnterPressed', () => {
    it('should return true when Enter is pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      });

      expect(result.current.isEnterPressed()).toBe(true);
    });

    it('should return false when Enter is not pressed', () => {
      const { result } = renderHook(() => useKeyboard());

      expect(result.current.isEnterPressed()).toBeFalsy();
    });
  });

  describe('cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useKeyboard());
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('return value', () => {
    it('should return all expected properties and functions', () => {
      const { result } = renderHook(() => useKeyboard());

      expect(result.current).toHaveProperty('keys');
      expect(result.current).toHaveProperty('isKeyPressed');
      expect(result.current).toHaveProperty('isLeftPressed');
      expect(result.current).toHaveProperty('isRightPressed');
      expect(result.current).toHaveProperty('isSpacePressed');
      expect(result.current).toHaveProperty('isPausePressed');
      expect(result.current).toHaveProperty('isEnterPressed');
      expect(typeof result.current.isKeyPressed).toBe('function');
      expect(typeof result.current.isLeftPressed).toBe('function');
      expect(typeof result.current.isRightPressed).toBe('function');
      expect(typeof result.current.isSpacePressed).toBe('function');
      expect(typeof result.current.isPausePressed).toBe('function');
      expect(typeof result.current.isEnterPressed).toBe('function');
    });
  });
});
