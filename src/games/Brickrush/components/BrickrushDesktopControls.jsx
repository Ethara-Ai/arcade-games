import PropTypes from 'prop-types';
import { IoArrowBack, IoPause, IoPlay, IoRefresh, IoHome, IoHelpCircle } from 'react-icons/io5';
import { GAME_STATES } from '../../../constants';

/**
 * BrickrushDesktopControls - Desktop control buttons for the Brickrush game
 * Displays back button, launch hint, pause hint, and action buttons
 */
const BrickrushDesktopControls = ({
  gameState,
  ballLaunched,
  hasBalls,
  isHelpOpen,
  onPauseResume,
  onRestart,
  _onMainMenu,
  onBack,
  onHowToPlay,
}) => {
  const isPlaying = gameState === GAME_STATES.PLAYING;
  const isPaused = gameState === GAME_STATES.PAUSED;
  const showControls = isPlaying || isPaused;

  return (
    <div className="desktop-controls">
      {/* Back Button */}
      <button
        onClick={onBack}
        className={`desktop-back-btn w-12 h-12 min-w-[48px] min-h-[48px] bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600/40 rounded-full text-white text-lg cursor-pointer shadow-lg shadow-black/40 transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-black/60 hover:border-gray-500/50 active:brightness-90 focus:outline-none flex-shrink-0 flex items-center justify-center ${showControls ? 'show' : ''}`}
        title="Back to Main Menu"
      >
        <IoArrowBack />
      </button>

      {/* Launch Hint - Hidden when help modal is open */}
      <div
        className={`desktop-launch-hint ${isPlaying && !ballLaunched && hasBalls && !isHelpOpen ? 'show' : ''}`}
      >
        Click/Press Space to launch the ball
      </div>

      {/* Pause Hint */}
      <div
        className={`desktop-pause-hint ${showControls ? 'show' : ''}`}
        style={{ display: showControls ? 'block' : 'none' }}
      >
        {isPaused ? 'Press P to Resume' : 'Press P to Pause'}
      </div>

      {/* Action Buttons - Icon only - Show when playing OR paused so user can resume */}
      <div
        className={`desktop-action-buttons ${showControls ? 'show' : ''}`}
        style={{ display: showControls ? 'flex' : 'none' }}
      >
        <button
          onClick={onHowToPlay}
          className="desktop-action-btn bg-gradient-to-r from-violet-500 to-purple-600 text-white border-none w-12 h-10 text-lg cursor-pointer rounded-lg font-medium shadow-lg shadow-violet-400/40 transition-all duration-200 flex items-center justify-center hover:brightness-110 hover:shadow-xl hover:shadow-violet-400/60 active:brightness-90 focus:outline-none"
          title="How to Play"
        >
          <IoHelpCircle />
        </button>
        <button
          onClick={onPauseResume}
          className={`desktop-action-btn ${
            isPaused
              ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-green-400/40'
              : 'bg-gradient-to-r from-orange-500 to-red-600 shadow-orange-400/40'
          } text-white border-none w-12 h-10 text-lg cursor-pointer rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center justify-center hover:brightness-110 active:brightness-90 focus:outline-none`}
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <IoPlay /> : <IoPause />}
        </button>
        <button
          onClick={onRestart}
          className="desktop-action-btn bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-none w-12 h-10 text-lg cursor-pointer rounded-lg font-medium shadow-lg shadow-cyan-400/40 transition-all duration-200 flex items-center justify-center hover:brightness-110 hover:shadow-xl hover:shadow-cyan-400/60 active:brightness-90 focus:outline-none"
          title="Restart"
        >
          <IoRefresh />
        </button>
        <button
          onClick={onBack}
          className="desktop-action-btn glass-button text-gray-300 border-none w-12 h-10 text-lg cursor-pointer rounded-lg font-medium transition-all duration-200 flex items-center justify-center hover:brightness-110 active:brightness-90 focus:outline-none"
          title="Back to Game Selector"
        >
          <IoHome />
        </button>
      </div>
    </div>
  );
};

BrickrushDesktopControls.propTypes = {
  /** Current game state */
  gameState: PropTypes.oneOf(Object.values(GAME_STATES)).isRequired,
  /** Whether the ball has been launched */
  ballLaunched: PropTypes.bool.isRequired,
  /** Whether there are balls in play */
  hasBalls: PropTypes.bool.isRequired,
  /** Callback for pause/resume toggle */
  onPauseResume: PropTypes.func.isRequired,
  /** Callback for restart action */
  onRestart: PropTypes.func.isRequired,
  /** Callback for main menu action (currently unused, kept for API consistency) */
  _onMainMenu: PropTypes.func,
  /** Callback for back action */
  onBack: PropTypes.func.isRequired,
  /** Callback for how to play action */
  onHowToPlay: PropTypes.func.isRequired,
  /** Whether the help modal is open */
  isHelpOpen: PropTypes.bool,
};

export default BrickrushDesktopControls;
