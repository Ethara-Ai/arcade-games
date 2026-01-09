import PropTypes from 'prop-types';
import { GAME_STATES } from '../../../constants';
import { StartMenu, PauseMenu, GameOverMenu, LevelCompleteMenu } from '../../../components';

// Brickrush-specific content for the How to Play modal
const BRICKRUSH_INSTRUCTIONS = [
  'Break all the bricks to complete each level',
  'Collect power-ups that fall from broken bricks',
  "Don't let the ball fall below your paddle",
  'Grey steel bricks cannot be destroyed but reflect the ball',
];

const BRICKRUSH_CONTROLS = [
  { key: '← →', action: 'Move paddle' },
  { key: 'Mouse', action: 'Move paddle (follow cursor)' },
  { key: 'Space / Click', action: 'Launch ball' },
  { key: 'P / Esc', action: 'Pause game' },
];

const BRICKRUSH_TIPS = [
  'Aim for the corners to clear more bricks',
  'Multi-ball power-ups help clear levels faster',
  'The ball speeds up as you progress',
];

/**
 * BrickrushMenuOverlay - Manages menu display for Brickrush game
 * Uses shared generic menu components with Brickrush-specific configuration
 */
const BrickrushMenuOverlay = ({
  gameState,
  score,
  highScore,
  level = 1,
  isFadingOut = false,
  onStart,
  onResume,
  onRestart,
  onMainMenu,
  onNextLevel,
  onBack,
}) => {
  const shouldShow =
    gameState === GAME_STATES.START_MENU ||
    gameState === GAME_STATES.PAUSED ||
    gameState === GAME_STATES.GAME_OVER ||
    gameState === GAME_STATES.LEVEL_COMPLETE;

  if (!shouldShow && !isFadingOut) {
    return null;
  }

  return (
    <div
      className={`overlay ${isFadingOut ? 'fade-out' : ''}`}
      style={{ display: shouldShow || isFadingOut ? 'flex' : 'none' }}
    >
      {gameState === GAME_STATES.START_MENU && (
        <StartMenu
          title="Brickrush"
          description="Break bricks, collect power-ups, and survive! Use keyboard or mouse to control the paddle."
          accentColor="cyan"
          onStart={onStart}
          onBack={onBack}
          instructions={BRICKRUSH_INSTRUCTIONS}
          controls={BRICKRUSH_CONTROLS}
          tips={BRICKRUSH_TIPS}
          startButtonText="Start Game"
        />
      )}

      {gameState === GAME_STATES.PAUSED && (
        <PauseMenu
          title="Paused"
          accentColor="cyan"
          onResume={onResume}
          onRestart={onRestart}
          onMainMenu={onMainMenu}
          resumeText="Resume (P)"
          restartText="Restart"
          mainMenuText="Main Menu"
        />
      )}

      {gameState === GAME_STATES.GAME_OVER && (
        <GameOverMenu
          title="Game Over"
          accentColor="red"
          score={score}
          highScore={highScore}
          onRestart={onRestart}
          onMainMenu={onMainMenu}
          restartText="Play Again"
          mainMenuText="Main Menu"
        />
      )}

      {gameState === GAME_STATES.LEVEL_COMPLETE && (
        <LevelCompleteMenu
          title="Level Complete!"
          accentColor="green"
          score={score}
          level={level}
          onNextLevel={onNextLevel}
          onMainMenu={onMainMenu}
          nextLevelText="Next Level"
          mainMenuText="Main Menu"
        />
      )}
    </div>
  );
};

BrickrushMenuOverlay.propTypes = {
  /** Current game state */
  gameState: PropTypes.oneOf(Object.values(GAME_STATES)).isRequired,
  /** Current score */
  score: PropTypes.number.isRequired,
  /** High score */
  highScore: PropTypes.number.isRequired,
  /** Current level */
  level: PropTypes.number,
  /** Whether menu is fading out */
  isFadingOut: PropTypes.bool,
  /** Callback when start button is clicked */
  onStart: PropTypes.func.isRequired,
  /** Callback when resume button is clicked */
  onResume: PropTypes.func.isRequired,
  /** Callback when restart button is clicked */
  onRestart: PropTypes.func.isRequired,
  /** Callback when main menu button is clicked */
  onMainMenu: PropTypes.func.isRequired,
  /** Callback when next level button is clicked */
  onNextLevel: PropTypes.func.isRequired,
  /** Callback when back button is clicked */
  onBack: PropTypes.func.isRequired,
};

export default BrickrushMenuOverlay;
