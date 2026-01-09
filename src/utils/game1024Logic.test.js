import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createEmptyGrid,
  getEmptyCells,
  addRandomTile,
  initializeGrid,
  move,
  gridsEqual,
  canMove,
  hasWon,
  getGameState,
  getHighestTile,
} from './game1024Logic';
import { GAME_1024_STATES } from '../constants';

describe('game1024Logic', () => {
  describe('createEmptyGrid', () => {
    it('should create a 4x4 grid filled with zeros', () => {
      const grid = createEmptyGrid();
      expect(grid).toHaveLength(4);
      grid.forEach((row) => {
        expect(row).toHaveLength(4);
        row.forEach((cell) => {
          expect(cell).toBe(0);
        });
      });
    });

    it('should create independent rows (not references)', () => {
      const grid = createEmptyGrid();
      grid[0][0] = 5;
      expect(grid[1][0]).toBe(0);
    });
  });

  describe('getEmptyCells', () => {
    it('should return all cells for an empty grid', () => {
      const grid = createEmptyGrid();
      const emptyCells = getEmptyCells(grid);
      expect(emptyCells).toHaveLength(16);
    });

    it('should return correct empty cells for a partially filled grid', () => {
      const grid = [
        [2, 0, 0, 0],
        [0, 4, 0, 0],
        [0, 0, 8, 0],
        [0, 0, 0, 16],
      ];
      const emptyCells = getEmptyCells(grid);
      expect(emptyCells).toHaveLength(12);
      expect(emptyCells).not.toContainEqual({ row: 0, col: 0 });
      expect(emptyCells).not.toContainEqual({ row: 1, col: 1 });
      expect(emptyCells).not.toContainEqual({ row: 2, col: 2 });
      expect(emptyCells).not.toContainEqual({ row: 3, col: 3 });
    });

    it('should return empty array for a full grid', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 128, 256],
      ];
      const emptyCells = getEmptyCells(grid);
      expect(emptyCells).toHaveLength(0);
    });
  });

  describe('addRandomTile', () => {
    it('should add a tile (2 or 4) to an empty cell', () => {
      const grid = createEmptyGrid();
      const newGrid = addRandomTile(grid);

      const emptyCellsBefore = getEmptyCells(grid).length;
      const emptyCellsAfter = getEmptyCells(newGrid).length;

      expect(emptyCellsAfter).toBe(emptyCellsBefore - 1);
    });

    it('should not modify the original grid', () => {
      const grid = createEmptyGrid();
      addRandomTile(grid);

      const emptyCells = getEmptyCells(grid);
      expect(emptyCells).toHaveLength(16);
    });

    it('should return the same grid if no empty cells', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 128, 256],
      ];
      const newGrid = addRandomTile(grid);
      expect(gridsEqual(grid, newGrid)).toBe(true);
    });

    it('should add either 2 or 4', () => {
      const grid = createEmptyGrid();
      const newGrid = addRandomTile(grid);

      let addedValue = 0;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (newGrid[row][col] !== 0) {
            addedValue = newGrid[row][col];
          }
        }
      }
      expect([2, 4]).toContain(addedValue);
    });
  });

  describe('initializeGrid', () => {
    it('should create a grid with exactly 2 tiles', () => {
      const grid = initializeGrid();
      const emptyCells = getEmptyCells(grid);
      expect(emptyCells).toHaveLength(14);
    });

    it('should have tiles that are 2 or 4', () => {
      const grid = initializeGrid();
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (grid[row][col] !== 0) {
            expect([2, 4]).toContain(grid[row][col]);
          }
        }
      }
    });
  });

  describe('gridsEqual', () => {
    it('should return true for identical grids', () => {
      const grid1 = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 128, 256],
      ];
      const grid2 = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 128, 256],
      ];
      expect(gridsEqual(grid1, grid2)).toBe(true);
    });

    it('should return false for different grids', () => {
      const grid1 = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 128, 256],
      ];
      const grid2 = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 128, 512],
      ];
      expect(gridsEqual(grid1, grid2)).toBe(false);
    });

    it('should return true for two empty grids', () => {
      const grid1 = createEmptyGrid();
      const grid2 = createEmptyGrid();
      expect(gridsEqual(grid1, grid2)).toBe(true);
    });
  });

  describe('move', () => {
    describe('LEFT', () => {
      it('should slide tiles to the left', () => {
        const grid = [
          [0, 0, 0, 2],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        const result = move(grid, 'LEFT');
        expect(result.grid[0][0]).toBe(2);
        expect(result.moved).toBe(true);
      });

      it('should merge equal tiles', () => {
        const grid = [
          [2, 2, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        const result = move(grid, 'LEFT');
        expect(result.grid[0][0]).toBe(4);
        expect(result.grid[0][1]).toBe(0);
        expect(result.score).toBe(4);
        expect(result.moved).toBe(true);
      });

      it('should merge multiple pairs', () => {
        const grid = [
          [2, 2, 4, 4],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        const result = move(grid, 'LEFT');
        expect(result.grid[0][0]).toBe(4);
        expect(result.grid[0][1]).toBe(8);
        expect(result.score).toBe(12);
      });

      it('should not merge already merged tiles', () => {
        const grid = [
          [2, 2, 2, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        const result = move(grid, 'LEFT');
        expect(result.grid[0][0]).toBe(4);
        expect(result.grid[0][1]).toBe(2);
      });

      it('should return moved=false if no movement possible', () => {
        const grid = [
          [2, 4, 8, 16],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        const result = move(grid, 'LEFT');
        expect(result.moved).toBe(false);
      });
    });

    describe('RIGHT', () => {
      it('should slide tiles to the right', () => {
        const grid = [
          [2, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        const result = move(grid, 'RIGHT');
        expect(result.grid[0][3]).toBe(2);
        expect(result.moved).toBe(true);
      });

      it('should merge equal tiles to the right', () => {
        const grid = [
          [0, 0, 2, 2],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        const result = move(grid, 'RIGHT');
        expect(result.grid[0][3]).toBe(4);
        expect(result.grid[0][2]).toBe(0);
        expect(result.score).toBe(4);
      });
    });

    describe('UP', () => {
      it('should slide tiles up', () => {
        const grid = [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [2, 0, 0, 0],
        ];
        const result = move(grid, 'UP');
        expect(result.grid[0][0]).toBe(2);
        expect(result.moved).toBe(true);
      });

      it('should merge equal tiles upward', () => {
        const grid = [
          [2, 0, 0, 0],
          [2, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        const result = move(grid, 'UP');
        expect(result.grid[0][0]).toBe(4);
        expect(result.grid[1][0]).toBe(0);
        expect(result.score).toBe(4);
      });
    });

    describe('DOWN', () => {
      it('should slide tiles down', () => {
        const grid = [
          [2, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        const result = move(grid, 'DOWN');
        expect(result.grid[3][0]).toBe(2);
        expect(result.moved).toBe(true);
      });

      it('should merge equal tiles downward', () => {
        const grid = [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [2, 0, 0, 0],
          [2, 0, 0, 0],
        ];
        const result = move(grid, 'DOWN');
        expect(result.grid[3][0]).toBe(4);
        expect(result.grid[2][0]).toBe(0);
        expect(result.score).toBe(4);
      });
    });
  });

  describe('canMove', () => {
    it('should return true if there are empty cells', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 128, 0],
      ];
      expect(canMove(grid)).toBe(true);
    });

    it('should return true if adjacent cells can merge horizontally', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 64, 256],
      ];
      expect(canMove(grid)).toBe(true);
    });

    it('should return true if adjacent cells can merge vertically', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 4, 128, 256],
      ];
      expect(canMove(grid)).toBe(true);
    });

    it('should return false if no moves possible', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 128, 256],
      ];
      expect(canMove(grid)).toBe(false);
    });
  });

  describe('hasWon', () => {
    it('should return true if grid contains 1024', () => {
      const grid = [
        [1024, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      expect(hasWon(grid)).toBe(true);
    });

    it('should return true if grid contains value greater than 1024', () => {
      const grid = [
        [2048, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      expect(hasWon(grid)).toBe(true);
    });

    it('should return false if no winning tile', () => {
      const grid = [
        [512, 256, 128, 64],
        [32, 16, 8, 4],
        [2, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      expect(hasWon(grid)).toBe(false);
    });
  });

  describe('getGameState', () => {
    it('should return WON when player reaches 1024 for first time', () => {
      const grid = [
        [1024, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      expect(getGameState(grid, false)).toBe(GAME_1024_STATES.WON);
    });

    it('should return PLAYING when player has already won before', () => {
      const grid = [
        [1024, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      expect(getGameState(grid, true)).toBe(GAME_1024_STATES.PLAYING);
    });

    it('should return GAME_OVER when no moves are possible', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 128, 256],
      ];
      expect(getGameState(grid, false)).toBe(GAME_1024_STATES.GAME_OVER);
    });

    it('should return PLAYING when game can continue', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 128, 0],
      ];
      expect(getGameState(grid, false)).toBe(GAME_1024_STATES.PLAYING);
    });
  });

  describe('getHighestTile', () => {
    it('should return the highest tile value', () => {
      const grid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [2, 4, 8, 16],
        [32, 64, 128, 512],
      ];
      expect(getHighestTile(grid)).toBe(512);
    });

    it('should return 0 for empty grid', () => {
      const grid = createEmptyGrid();
      expect(getHighestTile(grid)).toBe(0);
    });

    it('should handle grid with single tile', () => {
      const grid = [
        [0, 0, 0, 0],
        [0, 1024, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      expect(getHighestTile(grid)).toBe(1024);
    });
  });
});
