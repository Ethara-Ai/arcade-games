import PropTypes from 'prop-types';
import { IoArrowBack, IoPause, IoPlay, IoRefresh, IoHome, IoHelpCircle } from 'react-icons/io5';
import { GAME_STATES } from '../../../constants';

/**
 * BrickrushMobileControls - Mobile control buttons for the Brickrush game
 * Displays header row with back button on left and action buttons on right,
 * plus touch area for launching the ball
 */
const BrickrushMobileControls = ({
  gameState,
  ballLaunched,
  hasBalls,
  isHelpOpen,
  onPause,
  onBack,
  onLaunchBall,
  onRestart,
  onHowToPlay,
}) => {
  const isPlaying = gameState === GAME_STATES.PLAYING;
  const isPaused = gameState === GAME_STATES.PAUSED;
  const showControls = isPlaying || isPaused;

  return (
    <div className="mobile-controls">
      {/* Header Row - Back button on left, action buttons on right - positioned just below top bar */}
      <div
        className={`mobile-header-row ${showControls ? 'show' : ''}`}
        style={{
          position: 'fixed',
          top: '44px',
          left: 0,
          right: 0,
          display: showControls ? 'flex' : 'none',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px clamp(12px, 3vw, 20px)',
          zIndex: 30,
        }}
      >
        {/* Back Button - Left side */}
        <button
          onClick={onBack}
          className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600/40 rounded-full text-white text-sm sm:text-base cursor-pointer shadow-lg shadow-black/40 transition-all duration-300 active:brightness-90 hover:border-gray-500/50 focus:outline-none flex-shrink-0 flex items-center justify-center"
          title="Back to Main Menu"
          aria-label="Back to Main Menu"
        >
          <IoArrowBack />
        </button>

        {/* Action Buttons - Right side */}
        <div className="flex items-center gap-2">
          {/* How to Play Button */}
          <button
            onClick={onHowToPlay}
            className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] glass-button rounded-full text-cyan-400 flex items-center justify-center hover:brightness-110 active:brightness-90 transition-all flex-shrink-0"
            title="How to Play"
            aria-label="How to Play"
          >
            <IoHelpCircle className="text-xl" />
          </button>

          {/* Pause/Resume Button */}
          <button
            onClick={onPause}
            className={`w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] rounded-full text-white flex items-center justify-center shadow-lg hover:brightness-110 active:brightness-90 transition-all flex-shrink-0 ${
              isPaused
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-400/40'
                : 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-400/40'
            }`}
            title={isPaused ? 'Resume' : 'Pause'}
            aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <IoPlay /> : <IoPause />}
          </button>

          {/* New Game / Restart Button */}
          <button
            onClick={onRestart}
            className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full text-white flex items-center justify-center shadow-lg shadow-cyan-400/40 hover:brightness-110 active:brightness-90 transition-all flex-shrink-0"
            title="New Game"
            aria-label="Start New Game"
          >
            <IoRefresh />
          </button>

          {/* Home Button */}
          <button
            onClick={onBack}
            className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] glass-button rounded-full text-gray-300 flex items-center justify-center hover:brightness-110 active:brightness-90 transition-all flex-shrink-0"
            title="Back to Game Selector"
            aria-label="Back to Game Selector"
          >
            <IoHome />
          </button>
        </div>
      </div>

      {/* Touch Area / Launch Hint - Hidden when help modal is open */}
      <div
        onClick={onLaunchBall}
        onTouchEnd={(e) => {
          e.stopPropagation();
          onLaunchBall();
        }}
        className={`mobile-touch-area ${isPlaying && !ballLaunched && hasBalls && !isHelpOpen ? 'show' : ''}`}
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
  /** Whether the help modal is open */
  isHelpOpen: PropTypes.bool,
  /** Callback for pause action */
  onPause: PropTypes.func.isRequired,
  /** Callback for back action */
  onBack: PropTypes.func.isRequired,
  /** Callback for launching the ball */
  onLaunchBall: PropTypes.func.isRequired,
  /** Callback for restart/new game action */
  onRestart: PropTypes.func.isRequired,
  /** Callback for how to play action */
  onHowToPlay: PropTypes.func.isRequired,
};

export default BrickrushMobileControls;
