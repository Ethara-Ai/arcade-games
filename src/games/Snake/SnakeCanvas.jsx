import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  SNAKE_GRID_SIZE as GRID_SIZE,
  SNAKE_CELL_SIZE as CELL_SIZE,
  SNAKE_CANVAS_SIZE as CANVAS_SIZE,
  SNAKE_COLORS as COLORS,
  SNAKE_GAME_STATES,
} from '../../constants';

/**
 * SnakeCanvas - Presentation component for the Snake game
 * Handles canvas setup and rendering of game objects
 */
const SnakeCanvas = forwardRef(
  ({ gameState, getGameObjects, moveSnake, getGameSpeed, onGameOver, gameLoopRef }, ref) => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);

    // Expose canvas ref to parent
    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getContext: () => canvasRef.current?.getContext('2d'),
    }));

    // Draw the game
    const draw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const { snake, food, bonusFood } = getGameObjects();

      // Clear canvas with background color
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw grid lines
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
        ctx.stroke();
      }

      // Draw regular food
      if (food) {
        const foodColor = food.isBonus ? COLORS.bonusFood : COLORS.food;
        const glowColor = food.isBonus ? COLORS.bonusFoodGlow : COLORS.foodGlow;

        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 15;

        ctx.fillStyle = foodColor;
        ctx.beginPath();
        ctx.arc(
          food.x * CELL_SIZE + CELL_SIZE / 2,
          food.y * CELL_SIZE + CELL_SIZE / 2,
          CELL_SIZE / 2 - 2,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      // Draw bonus food
      if (bonusFood) {
        ctx.shadowColor = COLORS.bonusFoodGlow;
        ctx.shadowBlur = 20;

        ctx.fillStyle = COLORS.bonusFood;
        ctx.beginPath();
        ctx.arc(
          bonusFood.x * CELL_SIZE + CELL_SIZE / 2,
          bonusFood.y * CELL_SIZE + CELL_SIZE / 2,
          CELL_SIZE / 2 - 1,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      // Draw snake
      snake.forEach((segment, index) => {
        const isHead = index === 0;

        if (isHead) {
          ctx.shadowColor = COLORS.snakeGlow;
          ctx.shadowBlur = 10;
        }

        ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snakeBody;

        const x = segment.x * CELL_SIZE + 1;
        const y = segment.y * CELL_SIZE + 1;
        const size = CELL_SIZE - 2;
        const radius = isHead ? 6 : 4;

        ctx.beginPath();
        ctx.roundRect(x, y, size, size, radius);
        ctx.fill();

        ctx.shadowBlur = 0;
      });
    }, [getGameObjects]);

    // Game loop callback
    const gameLoopCallback = useCallback(() => {
      if (gameState !== SNAKE_GAME_STATES.PLAYING) return false;

      const continueGame = moveSnake();

      if (!continueGame) {
        onGameOver();
        return false;
      }

      draw();
      return true;
    }, [gameState, moveSnake, draw, onGameOver]);

    // Start/manage game loop
    useEffect(() => {
      if (gameState !== SNAKE_GAME_STATES.PLAYING) {
        // Clear any existing loop when not playing
        if (gameLoopRef.current) {
          clearTimeout(gameLoopRef.current);
          gameLoopRef.current = null;
        }
        return;
      }

      // Initial draw
      draw();

      const runLoop = () => {
        const shouldContinue = gameLoopCallback();
        if (shouldContinue) {
          gameLoopRef.current = setTimeout(runLoop, getGameSpeed());
        }
      };

      // Start the loop
      gameLoopRef.current = setTimeout(runLoop, getGameSpeed());

      return () => {
        if (gameLoopRef.current) {
          clearTimeout(gameLoopRef.current);
          gameLoopRef.current = null;
        }
      };
    }, [gameState, gameLoopCallback, getGameSpeed, draw, gameLoopRef]);

    // Draw initial state when game starts or resumes
    useEffect(() => {
      if (gameState === SNAKE_GAME_STATES.PLAYING || gameState === SNAKE_GAME_STATES.PAUSED) {
        draw();
      }
    }, [gameState, draw]);

    // Cleanup animation frame on unmount
    useEffect(() => {
      // Copy ref value to a variable for cleanup (fixes React warning)
      const frameId = animationFrameRef.current;

      return () => {
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="game-canvas rounded-lg sm:rounded-xl shadow-2xl"
        style={{
          imageRendering: 'pixelated',
          maxWidth: 'min(90vw, 400px)',
          maxHeight: 'min(90vw, 400px)',
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)',
        }}
      />
    );
  }
);

SnakeCanvas.displayName = 'SnakeCanvas';

export default SnakeCanvas;
