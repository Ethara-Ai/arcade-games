/**
 * Game Physics Helper Module
 * Pure functions for collision detection and physics calculations
 * These functions return new objects instead of mutating in place
 */

/**
 * Check and handle ball-paddle collision
 * @param {Array} balls - Array of ball objects
 * @param {Object} paddle - Paddle object with x, y, width, height
 * @returns {Array} - New array of balls with updated positions/velocities
 */
export function handleBallPaddleCollision(balls, paddle) {
  return balls.map((ball) => {
    if (
      ball.x + ball.radius > paddle.x &&
      ball.x - ball.radius < paddle.x + paddle.width &&
      ball.y + ball.radius > paddle.y &&
      ball.y - ball.radius < paddle.y + paddle.height &&
      ball.dy > 0
    ) {
      let collidePoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      collidePoint = Math.max(-1, Math.min(1, collidePoint));
      const angle = collidePoint * (Math.PI / 3);

      let newDy = -ball.speed * Math.cos(angle);
      if (newDy >= 0) {
        newDy = -Math.abs(ball.speed * Math.cos(angle) || ball.speed * 0.1);
      }

      return {
        ...ball,
        y: paddle.y - ball.radius,
        dx: ball.speed * Math.sin(angle),
        dy: newDy,
      };
    }
    return ball;
  });
}

/**
 * Check and handle ball-brick collisions
 * @param {Array} balls - Array of ball objects
 * @param {Array} bricks - 2D array of brick objects
 * @param {number} brickRowCount - Number of brick rows
 * @param {number} brickColumnCount - Number of brick columns
 * @param {number} ballInitialSpeed - Initial ball speed for max speed calculation
 * @returns {Object} - { balls, bricks, bricksHit: [{brick, col, row}], allCleared }
 */
export function handleBallBrickCollision(balls, bricks, brickRowCount, brickColumnCount, ballInitialSpeed) {
  const newBricks = bricks.map((col) => col.map((brick) => (brick ? { ...brick } : null)));
  const bricksHit = [];
  let allBricksCleared = true;

  const newBalls = balls.map((ball) => {
    let updatedBall = { ...ball };
    
    // Skip if ball is in collision cooldown
    if (updatedBall.collisionCooldown && updatedBall.collisionCooldown > 0) {
      return { ...updatedBall, collisionCooldown: updatedBall.collisionCooldown - 1 };
    }

    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brick = newBricks[c]?.[r];
        if (!brick || brick.status !== 1) continue;

        if (!brick.isSteel) {
          allBricksCleared = false;
        }

        if (
          updatedBall.x + updatedBall.radius > brick.x &&
          updatedBall.x - updatedBall.radius < brick.x + brick.width &&
          updatedBall.y + updatedBall.radius > brick.y &&
          updatedBall.y - updatedBall.radius < brick.y + brick.height
        ) {
          // Calculate collision side and overlap amounts
          const ballCenterX = updatedBall.x;
          const ballCenterY = updatedBall.y;
          const brickCenterX = brick.x + brick.width / 2;
          const brickCenterY = brick.y + brick.height / 2;
          
          const overlapX =
            updatedBall.radius + brick.width / 2 - Math.abs(ballCenterX - brickCenterX);
          const overlapY =
            updatedBall.radius + brick.height / 2 - Math.abs(ballCenterY - brickCenterY);

          let newDx = updatedBall.dx;
          let newDy = updatedBall.dy;
          let newX = updatedBall.x;
          let newY = updatedBall.y;

          // Determine collision direction and push ball out of brick
          if (overlapX < overlapY && overlapX > 0) {
            // Horizontal collision
            newDx = -updatedBall.dx;
            // Push ball out horizontally
            if (ballCenterX < brickCenterX) {
              newX = brick.x - updatedBall.radius - 1;
            } else {
              newX = brick.x + brick.width + updatedBall.radius + 1;
            }
          } else {
            // Vertical collision
            newDy = -updatedBall.dy;
            // Push ball out vertically
            if (ballCenterY < brickCenterY) {
              newY = brick.y - updatedBall.radius - 1;
            } else {
              newY = brick.y + brick.height + updatedBall.radius + 1;
            }
          }

          // Only destroy non-steel bricks
          if (!brick.isSteel) {
            newBricks[c][r] = { ...brick, status: 0 };
            bricksHit.push({ brick: newBricks[c][r], col: c, row: r, originalBrick: brick });

            // Increase ball speed when breaking a brick
            const newSpeed = Math.min(updatedBall.speed + 0.1, ballInitialSpeed * 2);
            const currentMagnitude = Math.sqrt(newDx * newDx + newDy * newDy);
            if (currentMagnitude > 0) {
              newDx = (newDx / currentMagnitude) * newSpeed;
              newDy = (newDy / currentMagnitude) * newSpeed;
            }

            updatedBall = { 
              ...updatedBall, 
              x: newX,
              y: newY,
              dx: newDx, 
              dy: newDy, 
              speed: newSpeed,
              collisionCooldown: 3  // Cooldown frames to prevent multiple hits
            };
          } else {
            updatedBall = { 
              ...updatedBall, 
              x: newX,
              y: newY,
              dx: newDx, 
              dy: newDy,
              collisionCooldown: 3
            };
          }

          // Only handle one brick collision per ball per frame
          return updatedBall;
        }
      }
    }

    return updatedBall;
  });

  // Recheck if all non-steel bricks are cleared
  allBricksCleared = true;
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = newBricks[c]?.[r];
      if (brick && brick.status === 1 && !brick.isSteel) {
        allBricksCleared = false;
        break;
      }
    }
    if (!allBricksCleared) break;
  }

  return {
    balls: newBalls,
    bricks: newBricks,
    bricksHit,
    allCleared: allBricksCleared,
  };
}

/**
 * Move balls and handle wall collisions
 * @param {Array} balls - Array of ball objects
 * @param {number} gameWidth - Game canvas width
 * @param {number} gameHeight - Game canvas height
 * @returns {Object} - { balls, lostBalls } where lostBalls are balls that fell off screen
 */
export function moveBalls(balls, gameWidth, gameHeight) {
  const activeBalls = [];
  const lostBalls = [];

  for (const ball of balls) {
    let newBall = {
      ...ball,
      x: ball.x + ball.dx,
      y: ball.y + ball.dy,
    };

    // Wall collision - left and right
    if (newBall.x + newBall.radius > gameWidth || newBall.x - newBall.radius < 0) {
      newBall = {
        ...newBall,
        dx: -newBall.dx,
        x: Math.max(newBall.radius, Math.min(newBall.x, gameWidth - newBall.radius)),
      };
    }

    // Wall collision - top
    if (newBall.y - newBall.radius < 0) {
      newBall = {
        ...newBall,
        dy: -newBall.dy,
        y: newBall.radius,
      };
    }

    // Ball falls off screen
    if (newBall.y + newBall.radius > gameHeight) {
      lostBalls.push(newBall);
    } else {
      activeBalls.push(newBall);
    }
  }

  return { balls: activeBalls, lostBalls };
}

/**
 * Update power-ups position and check paddle collision
 * @param {Array} powerUps - Array of power-up objects
 * @param {Object} paddle - Paddle object
 * @param {number} gameHeight - Game canvas height
 * @returns {Object} - { activePowerUps, collectedPowerUps }
 */
export function updatePowerUps(powerUps, paddle, gameHeight) {
  const activePowerUps = [];
  const collectedPowerUps = [];

  for (const pu of powerUps) {
    const newPu = { ...pu, y: pu.y + pu.dy };

    // Check collision with paddle
    if (
      newPu.x < paddle.x + paddle.width &&
      newPu.x + newPu.size > paddle.x &&
      newPu.y < paddle.y + paddle.height &&
      newPu.y + newPu.size > paddle.y
    ) {
      collectedPowerUps.push(newPu);
    } else if (newPu.y + newPu.size > gameHeight) {
      // Power-up fell off screen, just remove it
    } else {
      activePowerUps.push(newPu);
    }
  }

  return { activePowerUps, collectedPowerUps };
}
