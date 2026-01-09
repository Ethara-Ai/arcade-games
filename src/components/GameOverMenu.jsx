import { IoTrophy } from "react-icons/io5";

const GameOverMenu = ({ score, highScore, onRestart, onMainMenu }) => {
  const isNewHighScore = score >= highScore && score > 0;

  return (
    <div className="fixed inset-0 glass-overlay flex flex-col items-center justify-center z-50 p-3 sm:p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-red-500/20 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]"></div>
      </div>

      {/* Glass panel */}
      <div className="relative z-10 glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-md w-full mx-3 sm:mx-4">
        {/* Inner glass shine */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] rounded-2xl sm:rounded-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center justify-center gap-3 sm:gap-4">
          {/* Title */}
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-red-500 text-center"
            style={{
              fontFamily: '"Raleway", sans-serif',
              textShadow: "0 0 30px rgba(255, 23, 68, 0.5)",
            }}
          >
            Game Over
          </h2>

          {/* New High Score Badge */}
          {isNewHighScore && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-yellow-400 text-xs sm:text-sm font-semibold animate-pulse glass-stat px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              <IoTrophy className="text-base sm:text-lg" />
              <span>New High Score!</span>
              <IoTrophy className="text-base sm:text-lg" />
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 my-1 sm:my-2">
            <div className="glass-stat border-cyan-500/20 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-center min-w-[90px] sm:min-w-[110px]">
              <div className="text-[9px] sm:text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
                Score
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{score}</div>
            </div>
            <div className="glass-stat border-cyan-500/20 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-center min-w-[90px] sm:min-w-[110px]">
              <div className="text-[9px] sm:text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">Best</div>
              <div className="text-xl sm:text-2xl font-bold text-white">{highScore}</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-stretch justify-center gap-2 sm:gap-3 mt-1 sm:mt-2 w-full">
            <button
              onClick={onRestart}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:brightness-110 active:brightness-90 transition-all shadow-lg shadow-cyan-400/30 whitespace-nowrap"
            >
              Play Again
            </button>
            <button
              onClick={onMainMenu}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 glass-button text-gray-300 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:brightness-110 active:brightness-90 transition-all whitespace-nowrap"
            >
              Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverMenu;
