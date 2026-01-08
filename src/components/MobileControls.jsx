import { IoArrowBack, IoPause } from "react-icons/io5";
import { GAME_STATES } from "../constants";

const MobileControls = ({ gameState, ballLaunched, hasBalls, onPause, onBack, onLaunchBall }) => {
  const isPlaying = gameState === GAME_STATES.PLAYING;
  const isPaused = gameState === GAME_STATES.PAUSED;
  const showControls = isPlaying || isPaused;

  return (
    <div className="mobile-controls">
      {/* Back Button */}
      <button
        onClick={onBack}
        className={`mobile-back-btn bg-gradient-to-br from-cyan-400 to-blue-500 border-none rounded-full text-white text-sm sm:text-base cursor-pointer shadow-lg shadow-cyan-400/40 transition-all duration-300 transform active:scale-95 focus:outline-none ${showControls ? "show" : ""}`}
        title="Back to Main Menu"
        style={{
          width: "clamp(36px, 10vw, 44px)",
          height: "clamp(36px, 10vw, 44px)",
        }}
      >
        <IoArrowBack />
      </button>

      {/* Pause Button */}
      <button
        onClick={onPause}
        className={`mobile-pause-btn bg-gradient-to-br from-cyan-400 to-blue-500 border-none rounded-full text-white cursor-pointer shadow-lg shadow-cyan-400/40 transition-all duration-300 active:scale-95 focus:outline-none ${isPlaying ? "show" : ""}`}
        style={{
          bottom: "clamp(16px, 4vh, 30px)",
          width: "clamp(44px, 12vw, 56px)",
          height: "clamp(44px, 12vw, 56px)",
          fontSize: "clamp(16px, 5vw, 22px)",
        }}
      >
        <IoPause />
      </button>

      {/* Touch Area / Launch Hint */}
      <div
        onClick={onLaunchBall}
        onTouchEnd={(e) => {
          e.stopPropagation();
          onLaunchBall();
        }}
        className={`mobile-touch-area ${isPlaying && !ballLaunched && hasBalls ? "show" : ""}`}
        style={{
          fontSize: "clamp(12px, 3.5vw, 16px)",
          padding: "clamp(8px, 2vw, 12px) clamp(14px, 4vw, 20px)",
          touchAction: "manipulation",
        }}
      >
        Tap to Launch Ball
      </div>
    </div>
  );
};

export default MobileControls;
