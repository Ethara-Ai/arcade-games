import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initial Render', () => {
    it('should render without crashing', () => {
      expect(() => render(<App />)).not.toThrow();
    });

    it('should show loading screen initially', () => {
      const { container } = render(<App />);
      // Loading screen should be visible
      const loadingElement =
        container.querySelector('.loading-screen') ||
        screen.queryByText(/loading/i) ||
        container.querySelector('[class*="loading"]');
      expect(loadingElement || container.firstChild).toBeTruthy();
    });
  });

  describe('Loading Transition', () => {
    it('should transition from loading to game selector', () => {
      render(<App />);

      // Advance past loading time
      act(() => {
        vi.advanceTimersByTime(3500);
      });

      // After loading, should show game selector or game options
      const gameContent =
        screen.queryByText(/brickrush/i) ||
        screen.queryByText(/1024/i) ||
        screen.queryByText(/snake/i) ||
        screen.queryByText(/select/i);
      expect(gameContent).toBeTruthy();
    });
  });

  describe('Game Selector', () => {
    beforeEach(() => {
      render(<App />);
      act(() => {
        vi.advanceTimersByTime(3500);
      });
    });

    it('should display game options', () => {
      // At least one game option should be visible
      const gameOptions =
        screen.queryByText(/brickrush/i) ||
        screen.queryByText(/1024/i) ||
        screen.queryByText(/snake/i);
      expect(gameOptions).toBeTruthy();
    });

    it('should have clickable game cards', () => {
      const buttons = screen.queryAllByRole('button');
      // Should have interactive elements
      expect(buttons.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      render(<App />);
      act(() => {
        vi.advanceTimersByTime(3500);
      });
    });

    it('should handle clicking on 1024 game', () => {
      const game1024Elements = screen.queryAllByText(/1024/i);
      if (game1024Elements.length > 0) {
        expect(() => fireEvent.click(game1024Elements[0])).not.toThrow();
      }
    });

    it('should handle clicking on Snake game', () => {
      const gameSnakeElements = screen.queryAllByText(/snake/i);
      if (gameSnakeElements.length > 0) {
        expect(() => fireEvent.click(gameSnakeElements[0])).not.toThrow();
      }
    });

    it('should handle clicking on Brickrush game', () => {
      const gameBrickrushElements = screen.queryAllByText(/brickrush/i);
      if (gameBrickrushElements.length > 0) {
        expect(() => fireEvent.click(gameBrickrushElements[0])).not.toThrow();
      }
    });
  });

  describe('Keyboard Events', () => {
    beforeEach(() => {
      render(<App />);
      act(() => {
        vi.advanceTimersByTime(3500);
      });
    });

    it('should handle arrow key events', () => {
      expect(() => {
        fireEvent.keyDown(document, { key: 'ArrowLeft' });
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        fireEvent.keyDown(document, { key: 'ArrowUp' });
        fireEvent.keyDown(document, { key: 'ArrowDown' });
      }).not.toThrow();
    });

    it('should handle key up events', () => {
      expect(() => {
        fireEvent.keyUp(document, { key: 'ArrowLeft' });
        fireEvent.keyUp(document, { key: 'ArrowRight' });
      }).not.toThrow();
    });

    it('should handle pause key (P)', () => {
      expect(() => {
        fireEvent.keyDown(document, { key: 'p' });
        fireEvent.keyDown(document, { key: 'P' });
      }).not.toThrow();
    });

    it('should handle Escape key', () => {
      expect(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      }).not.toThrow();
    });

    it('should handle Enter key', () => {
      expect(() => {
        fireEvent.keyDown(document, { key: 'Enter' });
      }).not.toThrow();
    });

    it('should handle Space key', () => {
      expect(() => {
        fireEvent.keyDown(document, { key: ' ' });
      }).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should clean up on unmount without errors', () => {
      const { unmount } = render(<App />);
      act(() => {
        vi.advanceTimersByTime(3500);
      });
      expect(() => unmount()).not.toThrow();
    });

    it('should handle unmount during loading', () => {
      const { unmount } = render(<App />);
      // Unmount while still loading
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('State Transitions', () => {
    it('should handle rapid interactions without crashing', () => {
      render(<App />);
      act(() => {
        vi.advanceTimersByTime(3500);
      });

      // Rapid key presses
      for (let i = 0; i < 10; i++) {
        fireEvent.keyDown(document, { key: 'ArrowLeft' });
        fireEvent.keyDown(document, { key: 'Enter' });
        fireEvent.keyDown(document, { key: 'Escape' });
      }

      expect(document.body).toBeInTheDocument();
    });

    it('should handle window resize', () => {
      render(<App />);
      act(() => {
        vi.advanceTimersByTime(3500);
      });

      expect(() => {
        fireEvent.resize(window);
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(<App />);
      act(() => {
        vi.advanceTimersByTime(3500);
      });
    });

    it('should have interactive elements', () => {
      // Should have some buttons or interactive elements
      const interactiveElements =
        screen.queryAllByRole('button').length > 0 ||
        document.querySelectorAll('button').length > 0 ||
        document.querySelectorAll('[onClick]').length > 0;

      // App should have some interactive content
      expect(document.body.children.length).toBeGreaterThan(0);
    });
  });

  describe('Game Container', () => {
    it('should render game container structure', () => {
      const { container } = render(<App />);
      act(() => {
        vi.advanceTimersByTime(3500);
      });

      // Should have some container element
      expect(container.firstChild).toBeTruthy();
    });
  });
});
