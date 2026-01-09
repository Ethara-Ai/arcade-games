import PropTypes from 'prop-types';
import { IoArrowBack, IoPause, IoPlay } from 'react-icons/io5';
import { GAME_STATES } from '../../../constants';

/**
 * BrickrushMobileControls - Mobile control buttons for the Brickrush game
 * Displays back button, pause button, and touch area for launching the ball
 */
const BrickrushMobileControls = ({
  gameState,
  ballLaunched,
  hasBalls,
  onPause,
  onBack,
  onLaunchBall,
}) => {
  const isPlaying = gameState === GAME_STATES.PLAYING;
  const isPaused = gameState === GAME_STATES.PAUSED;
  const showControls = isPlaying || isPaused;

  return (
    <div className="mobile-controls">
      {/* Back Button - Black color to match dark UI */}
      <button
        onClick={onBack}
        className={`mobile-back-btn w-9 h-9 sm:w-11 sm:h-11 min-w-[36px] min-h-[36px] bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600/40 rounded-full text-white text-sm sm:text-base cursor-pointer shadow-lg shadow-black/40 transition-all duration-300 active:brightness-90 hover:border-gray-500/50 focus:outline-none flex-shrink-0 flex items-center justify-center ${showControls ? 'show' : ''}`}
        title="Back to Main Menu"
      >
        <IoArrowBack />
      </button>

      {/* Pause/Resume Button - Show when playing OR paused so user can resume */}
      <button
        onClick={onPause}
        className={`mobile-pause-btn aspect-square border-none rounded-full text-white cursor-pointer shadow-lg transition-all duration-300 active:brightness-90 focus:outline-none flex-shrink-0 ${
          isPaused
            ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-400/40'
            : 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-cyan-400/40'
        } ${showControls ? 'show' : ''}`}
        style={{
          bottom: 'clamp(16px, 4vh, 30px)',
          width: 'clamp(44px, 12vw, 56px)',
          fontSize: 'clamp(16px, 5vw, 22px)',
        }}
        title={isPaused ? 'Resume' : 'Pause'}
      >
        {isPaused ? <IoPlay /> : <IoPause />}
      </button>

      {/* Touch Area / Launch Hint */}
      <div
        onClick={onLaunchBall}
        onTouchEnd={(e) => {
          e.stopPropagation();
          onLaunchBall();
        }}
        className={`mobile-touch-area ${isPlaying && !ballLaunched && hasBalls ? 'show' : ''}`}
        style={{
          fontSize: 'clamp(12px, 3.5vw, 16px)',
          padding: 'clamp(8px, 2vw, 12px) clamp(14px, 4vw, 20px)',
          touchAction: 'manipulation',
        }}
      >
        Tap to Launch Ball
      </div>
    </div>
  );
};

BrickrushMobileControls.propTypes = {
  /** Current game state */
  gameState: PropTypes.oneOf(Object.values(GAME_STATES)).isRequired,
  /** Whether the ball has been launched */
  ballLaunched: PropTypes.bool.isRequired,
  /** Whether there are balls in play */
  hasBalls: PropTypes.bool.isRequired,
  /** Callback for pause action */
  onPause: PropTypes.func.isRequired,
  /** Callback for back action */
  onBack: PropTypes.func.isRequired,
  /** Callback for launching the ball */
  onLaunchBall: PropTypes.func.isRequired,
};

export default BrickrushMobileControls;
