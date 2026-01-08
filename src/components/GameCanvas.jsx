import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  TARGET_ASPECT_RATIO,
  PADDLE_BASE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_MARGIN_BOTTOM,
  PADDLE_COLOR,
  PADDLE_STRETCH_WIDTH,
  PADDLE_STRETCH_DURATION,
  PADDLE_SPEED,
  BALL_RADIUS,
  BALL_INITIAL_SPEED,
  BALL_COLOR,
  BRICK_ROW_COUNT,
  BRICK_COLUMN_COUNT,
  BRICK_PADDING,
  BRICK_OFFSET_TOP,
  BRICK_OFFSET_LEFT,
  BRICK_BASE_WIDTH,
  BRICK_HEIGHT,
  BRICK_COLORS,
  STEEL_BRICK_COLOR,
  POWERUP_SIZE,
  POWERUP_SPEED,
  POWERUP_TYPES,
  POWERUP_COLORS,
  GAME_STATES,
  BRICK_PATTERNS,
  STEEL_BRICK_PATTERNS,
} from "../constants";
import {
  handleBallPaddleCollision,
  handleBallBrickCollision,
  moveBalls as moveBallsPhysics,
  updatePowerUps as updatePowerUpsPhysics,
} from "../utils/gamePhysics";

const GameCanvas = forwardRef(
  (
    {
      gameState,
      score,
      lives,
      currentLevel,
      ballLaunched,
      onScoreChange,
      onLivesChange,
      onLevelChange,
      onBallLaunchedChange,
      onGameOver,
      _onNextLevel,
      keys,
      fadeIn,
    },
    ref,
  ) => {
    const canvasRef = useRef(null);
    const gameScaleRef = useRef(1);
    const animationFrameRef = useRef(null);

    // Game objects refs
    const paddleRef = useRef({
      x: GAME_WIDTH / 2 - PADDLE_BASE_WIDTH / 2,
      y: GAME_HEIGHT - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM,
      width: PADDLE_BASE_WIDTH,
      height: PADDLE_HEIGHT,
      dx: 0,
    });

    const ballsRef = useRef([]);
    const bricksRef = useRef([]);
    const activePowerUpsRef = useRef([]);
    const paddleStretchTimeoutRef = useRef(null);
    const brickDropProgressRef = useRef(1);
    const brickDropAnimatingRef = useRef(false);
    const levelTransitioningRef = useRef(false);

    // Refs for values needed in game loop
    const gameStateRef = useRef(gameState);
    const scoreRef = useRef(score);
    const livesRef = useRef(lives);
    const currentLevelRef = useRef(currentLevel);
    const ballLaunchedRef = useRef(ballLaunched);
    const keysRef = useRef(keys);

    // Keep refs in sync with props
    useEffect(() => {
      gameStateRef.current = gameState;
    }, [gameState]);
    useEffect(() => {
      scoreRef.current = score;
    }, [score]);
    useEffect(() => {
      livesRef.current = lives;
    }, [lives]);
    useEffect(() => {
      currentLevelRef.current = currentLevel;
    }, [currentLevel]);
    useEffect(() => {
      ballLaunchedRef.current = ballLaunched;
    }, [ballLaunched]);
    useEffect(() => {
      keysRef.current = keys;
    }, [keys]);

    // Create bricks for current level
    const createBricks = useCallback((level) => {
      const bricks = [];
      const patternIndex = Math.min(level - 1, BRICK_PATTERNS.length - 1);
      const selectedPattern = BRICK_PATTERNS[patternIndex];

      for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        bricks[c] = [];
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
          if (selectedPattern[r][c] === 0) {
            bricks[c][r] = null;
            continue;
          }

          const brickX = c * (BRICK_BASE_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
          const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
          let powerUpType = null;

          // Calculate power-up chance based on level
          let powerUpChance = 0.25;
          if (level <= 3) {
            powerUpChance = 0.25 - (level - 1) * 0.05;
          } else if (level <= 6) {
            powerUpChance = 0.1 - (level - 4) * 0.02;
          } else {
            powerUpChance = Math.max(0.02, 0.04 - (level - 7) * 0.005);
          }

          // Check if steel brick
          const steelPatternIndex = Math.min(level - 1, STEEL_BRICK_PATTERNS.length - 1);
          const isSteel =
            level >= 2 &&
            STEEL_BRICK_PATTERNS[steelPatternIndex] &&
            STEEL_BRICK_PATTERNS[steelPatternIndex][r] &&
            STEEL_BRICK_PATTERNS[steelPatternIndex][r][c] === 1;

          if (!isSteel && Math.random() < powerUpChance) {
            powerUpType = Math.random() < 0.5 ? POWERUP_TYPES.MULTIBALL : POWERUP_TYPES.STRETCH_PADDLE;
          }

          bricks[c][r] = {
            x: brickX,
            y: brickY,
            width: BRICK_BASE_WIDTH,
            height: BRICK_HEIGHT,
            color: isSteel ? STEEL_BRICK_COLOR : BRICK_COLORS[r % BRICK_COLORS.length],
            status: 1,
            powerUp: powerUpType,
            isSteel: isSteel,
          };
        }
      }
      return bricks;
    }, []);

    // Reset paddle and ball (defined before initGame to avoid circular dependency)
    const resetPaddleAndBall = useCallback(() => {
      const paddle = paddleRef.current;
      paddle.x = GAME_WIDTH / 2 - paddle.width / 2;
      paddle.y = GAME_HEIGHT - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM;

      ballsRef.current = [];

      if (gameStateRef.current === GAME_STATES.PLAYING) {
        ballsRef.current = [
          {
            x: paddle.x + paddle.width / 2,
            y: paddle.y - BALL_RADIUS,
            radius: BALL_RADIUS,
            speed: BALL_INITIAL_SPEED,
            dx: 0,
            dy: 0,
            color: BALL_COLOR,
          },
        ];
      }
      onBallLaunchedChange(false);
    }, [onBallLaunchedChange]);

    // Initialize game
    const initGame = useCallback(() => {
      paddleRef.current = {
        x: GAME_WIDTH / 2 - PADDLE_BASE_WIDTH / 2,
        y: GAME_HEIGHT - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM,
        width: PADDLE_BASE_WIDTH,
        height: PADDLE_HEIGHT,
        dx: 0,
      };

      if (paddleStretchTimeoutRef.current) {
        clearTimeout(paddleStretchTimeoutRef.current);
        paddleStretchTimeoutRef.current = null;
      }

      activePowerUpsRef.current = [];
      bricksRef.current = createBricks(1);
      resetPaddleAndBall();
    }, [createBricks, resetPaddleAndBall]);

    // Launch ball
    const launchBall = useCallback(() => {
      if (!ballLaunchedRef.current && gameStateRef.current === GAME_STATES.PLAYING && ballsRef.current.length > 0) {
        const ball = ballsRef.current[0];
        const launchAngle = (Math.random() * Math.PI) / 2 + Math.PI / 4;
        ballsRef.current[0] = {
          ...ball,
          dx: ball.speed * Math.cos(launchAngle),
          dy: -ball.speed * Math.sin(launchAngle),
        };
        onBallLaunchedChange(true);
      }
    }, [onBallLaunchedChange]);

    // Start brick drop animation
    const startBrickDropAnimation = useCallback(() => {
      brickDropProgressRef.current = 0;
      brickDropAnimatingRef.current = true;
      const duration = 700;
      const startTime = performance.now();

      const animateDrop = (now) => {
        const elapsed = now - startTime;
        brickDropProgressRef.current = Math.min(1, elapsed / duration);
        if (brickDropProgressRef.current < 1) {
          requestAnimationFrame(animateDrop);
        } else {
          brickDropProgressRef.current = 1;
          brickDropAnimatingRef.current = false;
        }
      };
      requestAnimationFrame(animateDrop);
    }, []);

    // Start next level
    const startNextLevel = useCallback(() => {
      if (levelTransitioningRef.current) return;
      levelTransitioningRef.current = true;

      // Create transition overlay
      const gameContainer = canvasRef.current?.parentElement;
      if (gameContainer) {
        const overlay = document.createElement("div");
        overlay.className = "level-transition-overlay";
        overlay.style.opacity = "0";
        gameContainer.appendChild(overlay);

        setTimeout(() => {
          overlay.style.opacity = "1";
          setTimeout(() => {
            const newLevel = currentLevelRef.current + 1;
            onLevelChange(newLevel);

            paddleRef.current.width = PADDLE_BASE_WIDTH;
            if (paddleStretchTimeoutRef.current) {
              clearTimeout(paddleStretchTimeoutRef.current);
              paddleStretchTimeoutRef.current = null;
            }
            activePowerUpsRef.current = [];
            onBallLaunchedChange(false);

            paddleRef.current.x = GAME_WIDTH / 2 - paddleRef.current.width / 2;
            ballsRef.current = [
              {
                x: paddleRef.current.x + paddleRef.current.width / 2,
                y: paddleRef.current.y - BALL_RADIUS,
                radius: BALL_RADIUS,
                speed: BALL_INITIAL_SPEED,
                dx: 0,
                dy: 0,
                color: BALL_COLOR,
              },
            ];

            bricksRef.current = createBricks(newLevel);
            startBrickDropAnimation();

            overlay.style.opacity = "0";
            setTimeout(() => {
              overlay.remove();
              levelTransitioningRef.current = false;
            }, 500);
          }, 500);
        }, 10);
      }
    }, [onLevelChange, onBallLaunchedChange, createBricks, startBrickDropAnimation]);

    // Expose methods to parent (must be after function declarations)
    useImperativeHandle(ref, () => ({
      initGame,
      resetPaddleAndBall,
      launchBall,
      getBalls: () => ballsRef.current,
      startNextLevel,
    }));

    // Spawn power-up from brick
    const spawnPowerUp = useCallback((brick) => {
      if (brick.powerUp) {
        activePowerUpsRef.current.push({
          x: brick.x + brick.width / 2 - POWERUP_SIZE / 2,
          y: brick.y + brick.height / 2,
          size: POWERUP_SIZE,
          type: brick.powerUp,
          color: POWERUP_COLORS[brick.powerUp],
          dy: POWERUP_SPEED,
        });
      }
    }, []);

    // Activate power-up
    const activatePowerUp = useCallback((powerUp) => {
      const paddle = paddleRef.current;

      if (powerUp.type === POWERUP_TYPES.MULTIBALL) {
        if (ballsRef.current.length === 0 || gameStateRef.current !== GAME_STATES.PLAYING) return;

        const originalBall = ballsRef.current[0];
        const spawnX = paddle.x + paddle.width / 2;
        const spawnY = paddle.y - BALL_RADIUS;

        if (ballLaunchedRef.current && originalBall) {
          for (let i = 0; i < 2; i++) {
            ballsRef.current.push({
              x: spawnX,
              y: spawnY,
              radius: BALL_RADIUS,
              speed: originalBall.speed,
              dx: (Math.random() - 0.5) * originalBall.speed * 0.8,
              dy: -Math.abs(originalBall.speed * 0.6),
              color: BALL_COLOR,
            });
          }
        }
      } else if (powerUp.type === POWERUP_TYPES.STRETCH_PADDLE) {
        const startWidth = paddle.width;
        const endWidth = PADDLE_STRETCH_WIDTH;
        const startTime = Date.now();
        const duration = 300;

        const animateStretch = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          paddle.width = startWidth + (endWidth - startWidth) * easeProgress;

          if (progress < 1) {
            requestAnimationFrame(animateStretch);
          }
        };

        animateStretch();

        if (paddleStretchTimeoutRef.current) {
          clearTimeout(paddleStretchTimeoutRef.current);
        }

        paddleStretchTimeoutRef.current = setTimeout(() => {
          const shrinkStartWidth = paddle.width;
          const shrinkEndWidth = PADDLE_BASE_WIDTH;
          const shrinkStartTime = Date.now();
          const shrinkDuration = 300;

          const animateShrink = () => {
            const elapsed = Date.now() - shrinkStartTime;
            const progress = Math.min(elapsed / shrinkDuration, 1);
            const easeProgress = progress * progress * progress;
            paddle.width = shrinkStartWidth + (shrinkEndWidth - shrinkStartWidth) * easeProgress;

            if (progress < 1) {
              requestAnimationFrame(animateShrink);
            }
          };

          animateShrink();
          paddleStretchTimeoutRef.current = null;
        }, PADDLE_STRETCH_DURATION);
      }
    }, []);

    // Update paddle position from mouse/touch
    const updatePaddlePosition = useCallback((clientX) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const paddle = paddleRef.current;
      const targetX = (clientX - rect.left) / gameScaleRef.current - paddle.width / 2;

      paddle.x = Math.max(0, Math.min(targetX, GAME_WIDTH - paddle.width));

      if (!ballLaunchedRef.current && ballsRef.current.length > 0) {
        ballsRef.current[0] = {
          ...ballsRef.current[0],
          x: paddle.x + paddle.width / 2,
          y: paddle.y - BALL_RADIUS,
        };
      }
    }, []);

    // Draw paddle
    const drawPaddle = useCallback((ctx) => {
      const paddle = paddleRef.current;
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
    const drawBricks = useCallback((ctx) => {
      const bricks = bricksRef.current;
      const dropProgress = brickDropProgressRef.current;

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
              ctx.strokeStyle = "#a0a0a0";
              ctx.lineWidth = 2;
              ctx.strokeRect(brick.x, dropY, brick.width, brick.height);
              ctx.fillStyle = "#e0e0e0";
              ctx.fillRect(brick.x + 2, dropY + 2, brick.width - 4, 2);
            }

            // Power-up indicator
            if (brick.powerUp) {
              ctx.fillStyle = "#fff";
              if (brick.powerUp === POWERUP_TYPES.MULTIBALL) {
                ctx.beginPath();
                ctx.arc(
                  brick.x + brick.width / 2,
                  dropY + brick.height / 2,
                  Math.min(brick.width, brick.height) / 4,
                  0,
                  Math.PI * 2,
                );
                ctx.fill();
              } else if (brick.powerUp === POWERUP_TYPES.STRETCH_PADDLE) {
                const size = Math.min(brick.width, brick.height) / 3;
                ctx.fillRect(brick.x + brick.width / 2 - size / 2, dropY + brick.height / 2 - size / 2, size, size / 4);
                ctx.fillRect(brick.x + brick.width / 2 - size / 4, dropY + brick.height / 2 - size / 2, size / 4, size);
              }
            }
            ctx.restore();
          }
        }
      }
    }, []);

    // Draw power-ups
    const drawPowerUps = useCallback((ctx) => {
      for (const pu of activePowerUpsRef.current) {
        ctx.fillStyle = pu.color;
        ctx.fillRect(pu.x, pu.y, pu.size, pu.size);
        ctx.fillStyle = "#fff";
        ctx.font = `${pu.size * 0.8}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let letter = "?";
        if (pu.type === POWERUP_TYPES.MULTIBALL) letter = "M";
        if (pu.type === POWERUP_TYPES.STRETCH_PADDLE) letter = "S";
        ctx.fillText(letter, pu.x + pu.size / 2, pu.y + pu.size / 2);
      }
    }, []);

    // Main draw function
    const drawGame = useCallback(
      (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.save();
        ctx.scale(gameScaleRef.current, gameScaleRef.current);

        if (gameStateRef.current === GAME_STATES.PLAYING || gameStateRef.current === GAME_STATES.PAUSED) {
          drawPaddle(ctx);
          for (const ball of ballsRef.current) {
            drawBall(ctx, ball);
          }
          drawBricks(ctx);
          drawPowerUps(ctx);
        }

        ctx.restore();
      },
      [drawPaddle, drawBall, drawBricks, drawPowerUps],
    );

    // Game loop effect
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      const gameLoop = () => {
        // Update game state
        if (gameStateRef.current === GAME_STATES.PLAYING) {
          // Filter invalid balls
          ballsRef.current = ballsRef.current.filter(
            (ball) => ball && typeof ball.x === "number" && typeof ball.y === "number",
          );

          // Reset if no balls and not launched
          if (ballsRef.current.length === 0 && !ballLaunchedRef.current) {
            resetPaddleAndBall();
          }

          // Update paddle from keyboard
          const paddle = paddleRef.current;
          const currentKeys = keysRef.current;
          if (currentKeys["ArrowLeft"] || currentKeys["a"] || currentKeys["A"]) {
            paddle.x = Math.max(0, paddle.x - PADDLE_SPEED);
          }
          if (currentKeys["ArrowRight"] || currentKeys["d"] || currentKeys["D"]) {
            paddle.x = Math.min(GAME_WIDTH - paddle.width, paddle.x + PADDLE_SPEED);
          }

          if (!ballLaunchedRef.current && ballsRef.current.length > 0) {
            ballsRef.current[0] = {
              ...ballsRef.current[0],
              x: paddle.x + paddle.width / 2,
              y: paddle.y - BALL_RADIUS,
            };
          }

          // Move balls using physics helper
          if (ballLaunchedRef.current) {
            const moveResult = moveBallsPhysics(ballsRef.current, GAME_WIDTH, GAME_HEIGHT);
            ballsRef.current = moveResult.balls;

            // Check if all balls are lost
            if (moveResult.lostBalls.length > 0 && ballsRef.current.length === 0) {
              const newLives = livesRef.current - 1;
              onLivesChange(newLives);

              if (newLives <= 0) {
                onGameOver();
              } else {
                resetPaddleAndBall();
                activePowerUpsRef.current = [];
              }
            }
          }

          // Ball-paddle collision using physics helper
          ballsRef.current = handleBallPaddleCollision(ballsRef.current, paddleRef.current);

          // Ball-brick collision using physics helper
          if (brickDropProgressRef.current >= 1) {
            const collisionResult = handleBallBrickCollision(
              ballsRef.current,
              bricksRef.current,
              BRICK_ROW_COUNT,
              BRICK_COLUMN_COUNT,
              BALL_INITIAL_SPEED,
            );

            ballsRef.current = collisionResult.balls;
            bricksRef.current = collisionResult.bricks;

            // Handle hit bricks
            for (const hit of collisionResult.bricksHit) {
              onScoreChange(scoreRef.current + 10 * currentLevelRef.current);
              spawnPowerUp(hit.originalBrick);
            }

            // Check if level complete
            if (collisionResult.allCleared && bricksRef.current.length > 0) {
              startNextLevel();
            }
          }

          // Update power-ups using physics helper
          const powerUpResult = updatePowerUpsPhysics(activePowerUpsRef.current, paddleRef.current, GAME_HEIGHT);
          activePowerUpsRef.current = powerUpResult.activePowerUps;

          // Activate collected power-ups
          for (const pu of powerUpResult.collectedPowerUps) {
            activatePowerUp(pu);
          }
        }

        // Draw
        drawGame(ctx);

        animationFrameRef.current = requestAnimationFrame(gameLoop);
      };

      animationFrameRef.current = requestAnimationFrame(gameLoop);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [
      resetPaddleAndBall,
      onLivesChange,
      onGameOver,
      onScoreChange,
      spawnPowerUp,
      startNextLevel,
      activatePowerUp,
      drawGame,
    ]);

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
      window.addEventListener("resize", resizeCanvas);
      return () => window.removeEventListener("resize", resizeCanvas);
    }, [resizeCanvas]);

    // Handle mouse move
    useEffect(() => {
      const handleMouseMove = (e) => {
        if (window.innerWidth >= 768) {
          updatePaddlePosition(e.clientX);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      return () => document.removeEventListener("mousemove", handleMouseMove);
    }, [updatePaddlePosition]);

    // Handle touch move
    useEffect(() => {
      const handleTouchMove = (e) => {
        if (window.innerWidth < 768) {
          e.preventDefault();
          if (e.touches.length > 0) {
            updatePaddlePosition(e.touches[0].clientX);
          }
        }
      };

      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      return () => document.removeEventListener("touchmove", handleTouchMove);
    }, [updatePaddlePosition]);

    // Handle click for launching ball (mouse only)
    const handleCanvasClick = useCallback(() => {
      if (gameStateRef.current === GAME_STATES.PLAYING && !ballLaunchedRef.current && ballsRef.current.length > 0) {
        launchBall();
      }
    }, [launchBall]);

    // Handle touch start for launching ball (with passive: false to allow preventDefault)
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const handleTouchStart = (e) => {
        e.preventDefault();
        if (gameStateRef.current === GAME_STATES.PLAYING && !ballLaunchedRef.current && ballsRef.current.length > 0) {
          launchBall();
        }
      };

      canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
      return () => canvas.removeEventListener("touchstart", handleTouchStart);
    }, [launchBall]);

    // Initialize bricks on mount or level change
    useEffect(() => {
      if (gameState === GAME_STATES.PLAYING && bricksRef.current.length === 0) {
        bricksRef.current = createBricks(currentLevel);
      }
    }, [gameState, currentLevel, createBricks]);

    return <canvas ref={canvasRef} className={`game-canvas ${fadeIn ? "fade-in" : ""}`} onClick={handleCanvasClick} />;
  },
);

GameCanvas.displayName = "GameCanvas";

export default GameCanvas;
