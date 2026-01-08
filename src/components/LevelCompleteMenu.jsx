import { IoCheckmarkCircle } from "react-icons/io5";

const LevelCompleteMenu = ({ score, level, onNextLevel, onMainMenu }) => {
  return (
    <div className="fixed inset-0 glass-overlay flex flex-col items-center justify-center z-50 p-3 sm:p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-green-500/20 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]"></div>
      </div>

      {/* Glass panel */}
      <div className="relative z-10 glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-md w-full mx-3 sm:mx-4">
        {/* Inner glass shine */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] rounded-2xl sm:rounded-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center justify-center gap-3 sm:gap-4">
          {/* Icon */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40">
            <IoCheckmarkCircle className="text-white text-2xl sm:text-3xl md:text-4xl" />
          </div>

          {/* Title */}
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-green-400 text-center"
            style={{
              fontFamily: '"Raleway", sans-serif',
              textShadow: "0 0 30px rgba(74, 222, 128, 0.5)",
            }}
          >
            Level Complete!
          </h2>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 my-1 sm:my-2">
            <div className="glass-stat border-green-500/20 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-center min-w-[90px] sm:min-w-[110px]">
              <div className="text-[9px] sm:text-[10px] text-green-400 font-semibold uppercase tracking-wider">
                Level
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{level || "—"}</div>
            </div>
            <div className="glass-stat border-cyan-500/20 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-center min-w-[90px] sm:min-w-[110px]">
              <div className="text-[9px] sm:text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
                Score
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{score}</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-stretch justify-center gap-2 sm:gap-3 mt-1 sm:mt-2 w-full">
            <button
              onClick={onNextLevel}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-green-400/30 whitespace-nowrap"
            >
              Next Level
            </button>
            <button
              onClick={onMainMenu}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 glass-button text-gray-300 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:scale-105 active:scale-95 transition-transform whitespace-nowrap"
            >
              Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelCompleteMenu;
