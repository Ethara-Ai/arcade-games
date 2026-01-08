import { GRID_SIZE, WINNING_TILE, GAME_1024_STATES } from '../constants/game1024Constants';

// Create empty grid
export const createEmptyGrid = () => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
};

// Get empty cells
export const getEmptyCells = (grid) => {
  const emptyCells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells;
};

// Add random tile (2 or 4, with 90% chance for 2)
export const addRandomTile = (grid) => {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) return grid;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newValue = Math.random() < 0.9 ? 2 : 4;

  const newGrid = grid.map(row => [...row]);
  newGrid[randomCell.row][randomCell.col] = newValue;
  return newGrid;
};

// Initialize game with 2 random tiles
export const initializeGrid = () => {
  let grid = createEmptyGrid();
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return grid;
};

// Slide and merge a single row to the left
const slideRowLeft = (row) => {
  // Remove zeros
  let newRow = row.filter(val => val !== 0);
  let score = 0;

  // Merge adjacent equal values
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      score += newRow[i];
      newRow.splice(i + 1, 1);
    }
  }

  // Pad with zeros
  while (newRow.length < GRID_SIZE) {
    newRow.push(0);
  }

  return { row: newRow, score };
};

// Rotate grid 90 degrees clockwise
const rotateGrid = (grid) => {
  const newGrid = createEmptyGrid();
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      newGrid[col][GRID_SIZE - 1 - row] = grid[row][col];
    }
  }
  return newGrid;
};

// Move tiles in a direction
export const move = (grid, direction) => {
  let workingGrid = grid.map(row => [...row]);
  let totalScore = 0;
  let rotations = 0;

  // Rotate grid so we always slide left
  switch (direction) {
    case 'UP':
      rotations = 3;  // 270° clockwise = 90° counter-clockwise
      break;
    case 'RIGHT':
      rotations = 2;  // 180°
      break;
    case 'DOWN':
      rotations = 1;  // 90° clockwise
      break;
    case 'LEFT':
    default:
      rotations = 0;  // No rotation needed
  }

  // Rotate to align for left slide
  for (let i = 0; i < rotations; i++) {
    workingGrid = rotateGrid(workingGrid);
  }

  // Slide all rows left
  const newGrid = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    const result = slideRowLeft(workingGrid[row]);
    newGrid.push(result.row);
    totalScore += result.score;
  }

  // Rotate back
  let finalGrid = newGrid;
  for (let i = 0; i < (4 - rotations) % 4; i++) {
    finalGrid = rotateGrid(finalGrid);
  }

  // Check if grid changed
  const gridChanged = !gridsEqual(grid, finalGrid);

  return {
    grid: finalGrid,
    score: totalScore,
    moved: gridChanged,
  };
};

// Check if two grids are equal
export const gridsEqual = (grid1, grid2) => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid1[row][col] !== grid2[row][col]) {
        return false;
      }
    }
  }
  return true;
};

// Check if any moves are possible
export const canMove = (grid) => {
  // Check for empty cells
  if (getEmptyCells(grid).length > 0) return true;

  // Check for adjacent equal values
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const value = grid[row][col];
      // Check right
      if (col < GRID_SIZE - 1 && grid[row][col + 1] === value) return true;
      // Check down
      if (row < GRID_SIZE - 1 && grid[row + 1][col] === value) return true;
    }
  }

  return false;
};

// Check for winning tile
export const hasWon = (grid) => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] >= WINNING_TILE) return true;
    }
  }
  return false;
};

// Get game state
export const getGameState = (grid, hasWonBefore) => {
  if (!hasWonBefore && hasWon(grid)) {
    return GAME_1024_STATES.WON;
  }
  if (!canMove(grid)) {
    return GAME_1024_STATES.GAME_OVER;
  }
  return GAME_1024_STATES.PLAYING;
};

// Get highest tile value
export const getHighestTile = (grid) => {
  let highest = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] > highest) {
        highest = grid[row][col];
      }
    }
  }
  return highest;
};
