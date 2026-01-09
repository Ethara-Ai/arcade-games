import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  GAME_WIDTH,
  TARGET_ASPECT_RATIO,
  PADDLE_COLOR,
  BRICK_ROW_COUNT,
  BRICK_COLUMN_COUNT,
  POWERUP_TYPES,
  GAME_STATES,
} from '../../constants';

/**
 * BrickrushCanvas - Pure rendering component for the Brickrush game
 * Handles canvas setup, scaling, and drawing game objects
 */
const BrickrushCanvas = forwardRef(
  (
    {
      gameState,
      ballLaunched,
      fadeIn,
      getGameObjects,
      updateGame,
      updatePaddlePosition,
      launchBall,
    },
    ref
  ) => {
    const canvasRef = useRef(null);
    const gameScaleRef = useRef(1);
    const animationFrameRef = useRef(null);

    // Expose canvas ref and scale to parent
    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getScale: () => gameScaleRef.current,
      getRect: () => canvasRef.current?.getBoundingClientRect(),
    }));

    // Draw paddle
    const drawPaddle = useCallback((ctx, paddle) => {
      ctx.fillStyle = PADDLE_COLOR;
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }, []);

    // Draw ball
    const drawBall = useCallback((ctx, ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();
    }, []);

    // Draw bricks
    const drawBricks = useCallback((ctx, bricks, dropProgress) => {
      for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
          const brick = bricks[c]?.[r];
          if (brick && brick.status === 1) {
            let dropY = brick.y;
            if (dropProgress < 1) {
              const float = -80 - r * 30;
              dropY = float * (1 - dropProgress) + brick.y * dropProgress;
            }

            ctx.save();
            ctx.globalAlpha = dropProgress;
            ctx.fillStyle = brick.color;
            ctx.fillRect(brick.x, dropY, brick.width, brick.height);

            // Steel brick special styling
            if (brick.isSteel) {
              ctx.strokeStyle = '#a0a0a0';
              ctx.lineWidth = 2;
              ctx.strokeRect(brick.x, dropY, brick.width, brick.height);
              ctx.fillStyle = '#e0e0e0';
              ctx.fillRect(brick.x + 2, dropY + 2, brick.width - 4, 2);
            }

            // Power-up indicator
            if (brick.powerUp) {
              ctx.fillStyle = '#fff';
              if (brick.powerUp === POWERUP_TYPES.MULTIBALL) {
                ctx.beginPath();
                ctx.arc(
                  brick.x + brick.width / 2,
                  dropY + brick.height / 2,
                  Math.min(brick.width, brick.height) / 4,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              } else if (brick.powerUp === POWERUP_TYPES.STRETCH_PADDLE) {
                const size = Math.min(brick.width, brick.height) / 3;
                ctx.fillRect(
                  brick.x + brick.width / 2 - size / 2,
                  dropY + brick.height / 2 - size / 2,
                  size,
                  size / 4
                );
                ctx.fillRect(
                  brick.x + brick.width / 2 - size / 4,
                  dropY + brick.height / 2 - size / 2,
                  size / 4,
                  size
                );
              }
            }
            ctx.restore();
          }
        }
      }
    }, []);

    // Draw power-ups
    const drawPowerUps = useCallback((ctx, powerUps) => {
      for (const pu of powerUps) {
        ctx.fillStyle = pu.color;
        ctx.fillRect(pu.x, pu.y, pu.size, pu.size);
        ctx.fillStyle = '#fff';
        ctx.font = `${pu.size * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let letter = '?';
        if (pu.type === POWERUP_TYPES.MULTIBALL) letter = 'M';
        if (pu.type === POWERUP_TYPES.STRETCH_PADDLE) letter = 'S';
        ctx.fillText(letter, pu.x + pu.size / 2, pu.y + pu.size / 2);
      }
    }, []);

    // Main draw function
    const drawGame = useCallback(
      (ctx, gameObjects) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.save();
        ctx.scale(gameScaleRef.current, gameScaleRef.current);

        if (gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED) {
          drawPaddle(ctx, gameObjects.paddle);
          for (const ball of gameObjects.balls) {
            drawBall(ctx, ball);
          }
          drawBricks(ctx, gameObjects.bricks, gameObjects.brickDropProgress);
          drawPowerUps(ctx, gameObjects.powerUps);
        }

        ctx.restore();
      },
      [gameState, drawPaddle, drawBall, drawBricks, drawPowerUps]
    );

    // Game loop effect
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      const gameLoop = () => {
        // Update game state
        updateGame();

        // Get current game objects and draw
        const gameObjects = getGameObjects();
        drawGame(ctx, gameObjects);

        animationFrameRef.current = requestAnimationFrame(gameLoop);
      };

      animationFrameRef.current = requestAnimationFrame(gameLoop);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [updateGame, getGameObjects, drawGame]);

    // Resize canvas
    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Account for TopBar (~60px) and bottom controls (~60px) plus padding
      const uiElementsHeight = 140;
      const availableHeight = windowHeight - uiElementsHeight;
      const horizontalPadding = 40;
      const availableWidth = windowWidth - horizontalPadding;

      let newCanvasWidth, newCanvasHeight;

      if (availableWidth / availableHeight > TARGET_ASPECT_RATIO) {
        // Height constrained
        newCanvasHeight = availableHeight;
        newCanvasWidth = newCanvasHeight * TARGET_ASPECT_RATIO;
      } else {
        // Width constrained
        newCanvasWidth = availableWidth;
        newCanvasHeight = newCanvasWidth / TARGET_ASPECT_RATIO;
      }

      // Ensure we don't exceed available space
      newCanvasWidth = Math.min(newCanvasWidth, availableWidth);
      newCanvasHeight = Math.min(newCanvasHeight, availableHeight);

      // Maintain aspect ratio after constraints
      if (newCanvasWidth / newCanvasHeight > TARGET_ASPECT_RATIO) {
        newCanvasWidth = newCanvasHeight * TARGET_ASPECT_RATIO;
      } else {
        newCanvasHeight = newCanvasWidth / TARGET_ASPECT_RATIO;
      }

      canvas.width = newCanvasWidth;
      canvas.height = newCanvasHeight;
      canvas.style.width = `${newCanvasWidth}px`;
      canvas.style.height = `${newCanvasHeight}px`;

      const container = canvas.parentElement;
      if (container) {
        container.style.width = `${newCanvasWidth}px`;
        container.style.height = `${newCanvasHeight}px`;
      }

      gameScaleRef.current = canvas.width / GAME_WIDTH;
    }, []);

    // Handle resize
    useEffect(() => {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);

    // Handle mouse move for paddle
    useEffect(() => {
      const handleMouseMove = (e) => {
        if (window.innerWidth >= 768) {
          const canvas = canvasRef.current;
          if (canvas) {
            updatePaddlePosition(e.clientX, canvas.getBoundingClientRect(), gameScaleRef.current);
          }
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [updatePaddlePosition]);

    // Handle touch move for paddle
    useEffect(() => {
      const handleTouchMove = (e) => {
        if (window.innerWidth < 768) {
          e.preventDefault();
          if (e.touches.length > 0) {
            const canvas = canvasRef.current;
            if (canvas) {
              updatePaddlePosition(
                e.touches[0].clientX,
                canvas.getBoundingClientRect(),
                gameScaleRef.current
              );
            }
          }
        }
      };

      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      return () => document.removeEventListener('touchmove', handleTouchMove);
    }, [updatePaddlePosition]);

    // Handle click for launching ball (mouse only)
    const handleCanvasClick = useCallback(() => {
      if (gameState === GAME_STATES.PLAYING && !ballLaunched) {
        launchBall();
      }
    }, [gameState, ballLaunched, launchBall]);

    // Handle touch start for launching ball
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const handleTouchStart = (e) => {
        e.preventDefault();
        if (gameState === GAME_STATES.PLAYING && !ballLaunched) {
          launchBall();
        }
      };

      canvas.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      });
      return () => canvas.removeEventListener('touchstart', handleTouchStart);
    }, [gameState, ballLaunched, launchBall]);

    return (
      <canvas
        ref={canvasRef}
        className={`game-canvas ${fadeIn ? 'fade-in' : ''}`}
        onClick={handleCanvasClick}
      />
    );
  }
);

BrickrushCanvas.displayName = 'BrickrushCanvas';

export default BrickrushCanvas;
