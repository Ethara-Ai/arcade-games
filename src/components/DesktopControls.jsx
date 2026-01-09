import { IoArrowBack, IoPause, IoPlay, IoRefresh, IoHome } from "react-icons/io5";
import { GAME_STATES } from "../constants";

const DesktopControls = ({ gameState, ballLaunched, hasBalls, onPauseResume, onRestart, onMainMenu, onBack }) => {
  const isPlaying = gameState === GAME_STATES.PLAYING;
  const isPaused = gameState === GAME_STATES.PAUSED;
  const showControls = isPlaying || isPaused;

  return (
    <div className="desktop-controls">
      {/* Back Button - Black color to match dark UI */}
      <button
        onClick={onBack}
        className={`desktop-back-btn bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600/40 rounded-full text-white text-lg cursor-pointer shadow-lg shadow-black/40 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-black/60 hover:border-gray-500/50 active:scale-95 focus:outline-none ${showControls ? "show" : ""}`}
        title="Back to Main Menu"
      >
        <IoArrowBack />
      </button>

      {/* Launch Hint */}
      <div className={`desktop-launch-hint ${isPlaying && !ballLaunched && hasBalls ? "show" : ""}`}>
        Click/Press Space to launch the ball
      </div>

      {/* Pause Hint */}
      <div
        className={`desktop-pause-hint ${showControls ? "show" : ""}`}
        style={{ display: showControls ? "block" : "none" }}
      >
        {isPaused ? "Press P to Resume" : "Press P to Pause"}
      </div>

      {/* Action Buttons - Icon only */}
      <div
        className={`desktop-action-buttons ${isPlaying ? "show" : ""}`}
        style={{ display: isPlaying ? "flex" : "none" }}
      >
        <button
          onClick={onPauseResume}
          className={`desktop-action-btn ${isPaused
              ? "bg-gradient-to-r from-green-500 to-green-400 shadow-green-400/40"
              : "bg-gradient-to-r from-orange-500 to-red-600 shadow-orange-400/40"
            } text-white border-none w-12 h-10 text-lg cursor-pointer rounded-lg font-medium shadow-lg transition-all duration-200 transform flex items-center justify-center hover:scale-105 active:scale-95 focus:outline-none`}
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <IoPlay /> : <IoPause />}
        </button>
        <button
          onClick={onRestart}
          className="desktop-action-btn bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-none w-12 h-10 text-lg cursor-pointer rounded-lg font-medium shadow-lg shadow-cyan-400/40 transition-all duration-200 transform flex items-center justify-center hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/60 active:scale-95 focus:outline-none"
          title="Restart"
        >
          <IoRefresh />
        </button>
        <button
          onClick={onMainMenu}
          className="desktop-action-btn glass-button text-gray-300 border-none w-12 h-10 text-lg cursor-pointer rounded-lg font-medium transition-all duration-200 transform flex items-center justify-center hover:scale-105 active:scale-95 focus:outline-none"
          title="Main Menu"
        >
          <IoHome />
        </button>
      </div>
    </div>
  );
};

export default DesktopControls;
