import { useRef, useCallback, useEffect } from "react";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PADDLE_BASE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_MARGIN_BOTTOM,
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
  ANIMATION_TIMINGS,
} from "../../constants";
import {
  handleBallPaddleCollision,
  handleBallBrickCollision,
  moveBalls as moveBallsPhysics,
  updatePowerUps as updatePowerUpsPhysics,
} from "../../utils/gamePhysics";

/**
 * Custom hook for Brickrush game state and logic
 * Separates game logic from rendering concerns
 *
 * Refactored to fix:
 * - Memory leaks from untracked animation frames
 * - Verbose ref syncing with multiple effects
 * - Proper cleanup on unmount
 */
export const useBrickrushGame = ({
  gameState,
  score,
  lives,
  currentLevel,
  ballLaunched,
  keys,
  onScoreChange,
  onLivesChange,
  onLevelChange,
  onBallLaunchedChange,
  onGameOver,
  onLevelComplete,
}) => {
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

  // Animation frame tracking for proper cleanup (fixes memory leak)
  const brickDropAnimationFrameRef = useRef(null);
  const paddleStretchAnimationFrameRef = useRef(null);
  const paddleShrinkAnimationFrameRef = useRef(null);

  // Consolidated refs for values needed in game loop (avoid stale closures)
  // Using a single ref object reduces the number of effects needed
  const gameValuesRef = useRef({
    gameState,
    score,
    lives,
    currentLevel,
    ballLaunched,
    keys,
  });

  // Single effect to keep all game values in sync
  useEffect(() => {
    gameValuesRef.current = {
      gameState,
      score,
      lives,
      currentLevel,
      ballLaunched,
      keys,
    };
  }, [gameState, score, lives, currentLevel, ballLaunched, keys]);

  // Cleanup all animation frames on unmount
  useEffect(() => {
    return () => {
      // Clean up brick drop animation
      if (brickDropAnimationFrameRef.current) {
        cancelAnimationFrame(brickDropAnimationFrameRef.current);
        brickDropAnimationFrameRef.current = null;
      }

      // Clean up paddle stretch animation
      if (paddleStretchAnimationFrameRef.current) {
        cancelAnimationFrame(paddleStretchAnimationFrameRef.current);
        paddleStretchAnimationFrameRef.current = null;
      }

      // Clean up paddle shrink animation
      if (paddleShrinkAnimationFrameRef.current) {
        cancelAnimationFrame(paddleShrinkAnimationFrameRef.current);
        paddleShrinkAnimationFrameRef.current = null;
      }

      // Clean up paddle stretch timeout
      if (paddleStretchTimeoutRef.current) {
        clearTimeout(paddleStretchTimeoutRef.current);
        paddleStretchTimeoutRef.current = null;
      }
    };
  }, []);

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

        const brickX =
          c * (BRICK_BASE_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
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
        const steelPatternIndex = Math.min(
          level - 1,
          STEEL_BRICK_PATTERNS.length - 1,
        );
        const isSteel =
          level >= 2 &&
          STEEL_BRICK_PATTERNS[steelPatternIndex] &&
          STEEL_BRICK_PATTERNS[steelPatternIndex][r] &&
          STEEL_BRICK_PATTERNS[steelPatternIndex][r][c] === 1;

        if (!isSteel && Math.random() < powerUpChance) {
          powerUpType =
            Math.random() < 0.5
              ? POWERUP_TYPES.MULTIBALL
              : POWERUP_TYPES.STRETCH_PADDLE;
        }

        bricks[c][r] = {
          x: brickX,
          y: brickY,
          width: BRICK_BASE_WIDTH,
          height: BRICK_HEIGHT,
          color: isSteel
            ? STEEL_BRICK_COLOR
            : BRICK_COLORS[r % BRICK_COLORS.length],
          status: 1,
          powerUp: powerUpType,
          isSteel: isSteel,
        };
      }
    }
    return bricks;
  }, []);

  // Reset paddle and ball
  const resetPaddleAndBall = useCallback(() => {
    const paddle = paddleRef.current;
    paddle.x = GAME_WIDTH / 2 - paddle.width / 2;
    paddle.y = GAME_HEIGHT - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM;

    ballsRef.current = [];

    if (gameValuesRef.current.gameState === GAME_STATES.PLAYING) {
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

    // Clear paddle stretch timeout
    if (paddleStretchTimeoutRef.current) {
      clearTimeout(paddleStretchTimeoutRef.current);
      paddleStretchTimeoutRef.current = null;
    }

    // Clear any ongoing animations
    if (paddleStretchAnimationFrameRef.current) {
      cancelAnimationFrame(paddleStretchAnimationFrameRef.current);
      paddleStretchAnimationFrameRef.current = null;
    }
    if (paddleShrinkAnimationFrameRef.current) {
      cancelAnimationFrame(paddleShrinkAnimationFrameRef.current);
      paddleShrinkAnimationFrameRef.current = null;
    }

    activePowerUpsRef.current = [];
    bricksRef.current = createBricks(1);
    resetPaddleAndBall();
  }, [createBricks, resetPaddleAndBall]);

  // Launch ball
  const launchBall = useCallback(() => {
    if (
      !gameValuesRef.current.ballLaunched &&
      gameValuesRef.current.gameState === GAME_STATES.PLAYING &&
      ballsRef.current.length > 0
    ) {
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

  // Start brick drop animation with proper cleanup
  const startBrickDropAnimation = useCallback(() => {
    // Cancel any existing animation
    if (brickDropAnimationFrameRef.current) {
      cancelAnimationFrame(brickDropAnimationFrameRef.current);
      brickDropAnimationFrameRef.current = null;
    }

    brickDropProgressRef.current = 0;
    brickDropAnimatingRef.current = true;
    const duration = ANIMATION_TIMINGS?.BRICK_DROP_DURATION || 700;
    const startTime = performance.now();

    const animateDrop = (now) => {
      const elapsed = now - startTime;
      brickDropProgressRef.current = Math.min(1, elapsed / duration);

      if (brickDropProgressRef.current < 1) {
        // Store the frame ID for cleanup
        brickDropAnimationFrameRef.current = requestAnimationFrame(animateDrop);
      } else {
        brickDropProgressRef.current = 1;
        brickDropAnimatingRef.current = false;
        brickDropAnimationFrameRef.current = null;
      }
    };

    // Start animation and store frame ID
    brickDropAnimationFrameRef.current = requestAnimationFrame(animateDrop);
  }, []);

  // Start next level
  const startNextLevel = useCallback(() => {
    if (levelTransitioningRef.current) return;
    levelTransitioningRef.current = true;

    // Notify parent about level complete for transition overlay
    if (onLevelComplete) {
      onLevelComplete(() => {
        const newLevel = gameValuesRef.current.currentLevel + 1;
        onLevelChange(newLevel);

        // Reset paddle width
        paddleRef.current.width = PADDLE_BASE_WIDTH;

        // Clear paddle stretch timeout
        if (paddleStretchTimeoutRef.current) {
          clearTimeout(paddleStretchTimeoutRef.current);
          paddleStretchTimeoutRef.current = null;
        }

        // Clear paddle animations
        if (paddleStretchAnimationFrameRef.current) {
          cancelAnimationFrame(paddleStretchAnimationFrameRef.current);
          paddleStretchAnimationFrameRef.current = null;
        }
        if (paddleShrinkAnimationFrameRef.current) {
          cancelAnimationFrame(paddleShrinkAnimationFrameRef.current);
          paddleShrinkAnimationFrameRef.current = null;
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
        levelTransitioningRef.current = false;
      });
    }
  }, [
    onLevelChange,
    onBallLaunchedChange,
    createBricks,
    startBrickDropAnimation,
    onLevelComplete,
  ]);

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

  // Activate power-up with proper animation cleanup
  const activatePowerUp = useCallback((powerUp) => {
    const paddle = paddleRef.current;

    if (powerUp.type === POWERUP_TYPES.MULTIBALL) {
      if (
        ballsRef.current.length === 0 ||
        gameValuesRef.current.gameState !== GAME_STATES.PLAYING
      )
        return;

      const originalBall = ballsRef.current[0];
      const spawnX = paddle.x + paddle.width / 2;
      const spawnY = paddle.y - BALL_RADIUS;

      if (gameValuesRef.current.ballLaunched && originalBall) {
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
      // Cancel any existing paddle animations
      if (paddleStretchAnimationFrameRef.current) {
        cancelAnimationFrame(paddleStretchAnimationFrameRef.current);
        paddleStretchAnimationFrameRef.current = null;
      }
      if (paddleShrinkAnimationFrameRef.current) {
        cancelAnimationFrame(paddleShrinkAnimationFrameRef.current);
        paddleShrinkAnimationFrameRef.current = null;
      }

      const startWidth = paddle.width;
      const endWidth = PADDLE_STRETCH_WIDTH;
      const startTime = Date.now();
      const stretchDuration = ANIMATION_TIMINGS?.PADDLE_STRETCH_IN || 300;

      const animateStretch = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / stretchDuration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        paddle.width = startWidth + (endWidth - startWidth) * easeProgress;

        if (progress < 1) {
          paddleStretchAnimationFrameRef.current =
            requestAnimationFrame(animateStretch);
        } else {
          paddleStretchAnimationFrameRef.current = null;
        }
      };

      paddleStretchAnimationFrameRef.current =
        requestAnimationFrame(animateStretch);

      // Clear existing timeout
      if (paddleStretchTimeoutRef.current) {
        clearTimeout(paddleStretchTimeoutRef.current);
      }

      // Set timeout to shrink paddle back
      paddleStretchTimeoutRef.current = setTimeout(() => {
        const shrinkStartWidth = paddle.width;
        const shrinkEndWidth = PADDLE_BASE_WIDTH;
        const shrinkStartTime = Date.now();
        const shrinkDuration = ANIMATION_TIMINGS?.PADDLE_SHRINK_OUT || 300;

        const animateShrink = () => {
          const elapsed = Date.now() - shrinkStartTime;
          const progress = Math.min(elapsed / shrinkDuration, 1);
          const easeProgress = progress * progress * progress;
          paddle.width =
            shrinkStartWidth +
            (shrinkEndWidth - shrinkStartWidth) * easeProgress;

          if (progress < 1) {
            paddleShrinkAnimationFrameRef.current =
              requestAnimationFrame(animateShrink);
          } else {
            paddleShrinkAnimationFrameRef.current = null;
          }
        };

        paddleShrinkAnimationFrameRef.current =
          requestAnimationFrame(animateShrink);
        paddleStretchTimeoutRef.current = null;
      }, PADDLE_STRETCH_DURATION);
    }
  }, []);

  // Update paddle position from mouse/touch
  const updatePaddlePosition = useCallback((clientX, canvasRect, gameScale) => {
    const paddle = paddleRef.current;
    const targetX = (clientX - canvasRect.left) / gameScale - paddle.width / 2;

    paddle.x = Math.max(0, Math.min(targetX, GAME_WIDTH - paddle.width));

    if (!gameValuesRef.current.ballLaunched && ballsRef.current.length > 0) {
      ballsRef.current[0] = {
        ...ballsRef.current[0],
        x: paddle.x + paddle.width / 2,
        y: paddle.y - BALL_RADIUS,
      };
    }
  }, []);

  // Update game state (called each frame)
  const updateGame = useCallback(() => {
    const values = gameValuesRef.current;

    if (values.gameState !== GAME_STATES.PLAYING) return;

    // Filter invalid balls
    ballsRef.current = ballsRef.current.filter(
      (ball) =>
        ball && typeof ball.x === "number" && typeof ball.y === "number",
    );

    // Reset if no balls and not launched
    if (ballsRef.current.length === 0 && !values.ballLaunched) {
      resetPaddleAndBall();
    }

    // Update paddle from keyboard
    const paddle = paddleRef.current;
    const currentKeys = values.keys;
    if (currentKeys["ArrowLeft"] || currentKeys["a"] || currentKeys["A"]) {
      paddle.x = Math.max(0, paddle.x - PADDLE_SPEED);
    }
    if (currentKeys["ArrowRight"] || currentKeys["d"] || currentKeys["D"]) {
      paddle.x = Math.min(GAME_WIDTH - paddle.width, paddle.x + PADDLE_SPEED);
    }

    if (!values.ballLaunched && ballsRef.current.length > 0) {
      ballsRef.current[0] = {
        ...ballsRef.current[0],
        x: paddle.x + paddle.width / 2,
        y: paddle.y - BALL_RADIUS,
      };
    }

    // Move balls using physics helper
    if (values.ballLaunched) {
      const moveResult = moveBallsPhysics(
        ballsRef.current,
        GAME_WIDTH,
        GAME_HEIGHT,
      );
      ballsRef.current = moveResult.balls;

      // Check if all balls are lost
      if (moveResult.lostBalls.length > 0 && ballsRef.current.length === 0) {
        const newLives = values.lives - 1;
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
    ballsRef.current = handleBallPaddleCollision(
      ballsRef.current,
      paddleRef.current,
    );

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
        onScoreChange(values.score + 10 * values.currentLevel);
        spawnPowerUp(hit.originalBrick);
      }

      // Check if level complete
      if (collisionResult.allCleared && bricksRef.current.length > 0) {
        startNextLevel();
      }
    }

    // Update power-ups using physics helper
    const powerUpResult = updatePowerUpsPhysics(
      activePowerUpsRef.current,
      paddleRef.current,
      GAME_HEIGHT,
    );
    activePowerUpsRef.current = powerUpResult.activePowerUps;

    // Activate collected power-ups
    for (const pu of powerUpResult.collectedPowerUps) {
      activatePowerUp(pu);
    }
  }, [
    resetPaddleAndBall,
    onLivesChange,
    onGameOver,
    onScoreChange,
    spawnPowerUp,
    startNextLevel,
    activatePowerUp,
  ]);

  // Get current game objects for rendering
  const getGameObjects = useCallback(
    () => ({
      paddle: paddleRef.current,
      balls: ballsRef.current,
      bricks: bricksRef.current,
      powerUps: activePowerUpsRef.current,
      brickDropProgress: brickDropProgressRef.current,
    }),
    [],
  );

  // Initialize bricks when game starts
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING && bricksRef.current.length === 0) {
      bricksRef.current = createBricks(currentLevel);
    }
  }, [gameState, currentLevel, createBricks]);

  return {
    // Actions
    initGame,
    launchBall,
    updateGame,
    updatePaddlePosition,
    resetPaddleAndBall,
    startNextLevel,

    // Getters
    getGameObjects,
    getBalls: () => ballsRef.current,

    // Refs for direct access if needed
    paddleRef,
    ballsRef,
    bricksRef,
    activePowerUpsRef,
    brickDropProgressRef,
    gameValuesRef,
  };
};

export default useBrickrushGame;
