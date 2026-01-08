import { GAME_STATES } from "../constants";

const TopBar = ({ gameState, score, level, lives }) => {
  const isVisible = gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="top-bar glass">
      <div className="top-bar-side flex items-center gap-2">
        <span className="text-cyan-400 text-xs uppercase tracking-wider">Score</span>
        <span className="font-bold text-white">{score}</span>
      </div>
      <div className="top-bar-center">
        <span className="text-gray-400">Level</span> <span className="text-cyan-400 font-bold">{level}</span>
      </div>
      <div className="top-bar-side flex items-center justify-end gap-2">
        <span className="text-cyan-400 text-xs uppercase tracking-wider">Lives</span>
        <span className="font-bold text-white">{lives}</span>
      </div>
    </div>
  );
};

export default TopBar;
