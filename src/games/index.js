// Game modules - each game follows the same structure:
// - Container component (state management)
// - Presentation components (rendering)
// - Custom hooks (game logic)

// Brickrush game
export { BrickrushGame } from './Brickrush';

// 1024 game (refactored)
export { Game1024 } from './1024';

// Snake game (refactored)
export { SnakeGame } from './Snake';

// Shared game components
export { default as Tile } from './Tile';
