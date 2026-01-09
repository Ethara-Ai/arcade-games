import { useEffect } from "react";
import { IoRemove, IoAdd } from "react-icons/io5";

/**
 * PauseMenu - Generic pause menu component for all games
 * @param {string} title - Menu title (default: "Paused")
 * @param {string} accentColor - Accent color theme ('cyan', 'green', 'amber', etc.)
 * @param {function} onResume - Callback when resume button is clicked
 * @param {function} onRestart - Callback when restart button is clicked
 * @param {function} onMainMenu - Callback when main menu button is clicked
 * @param {string} resumeText - Custom text for resume button (default: "Resume (P)")
 * @param {string} restartText - Custom text for restart button (default: "Restart")
 * @param {string} mainMenuText - Custom text for main menu button (default: "Main Menu")
 * @param {object} speedControl - Optional speed control config { speedLevel, minSpeed, maxSpeed, onIncrease, onDecrease, label }
 */
const PauseMenu = ({
  title = "Paused",
  accentColor = "cyan",
  onResume,
  onRestart,
  onMainMenu,
  resumeText = "Resume (P)",
  restartText = "Restart",
  mainMenuText = "Main Menu",
  speedControl = null,
}) => {
  // Color configurations
  const colorConfig = {
    cyan: {
      titleColor: "text-cyan-400",
      titleShadow: "0 0 30px rgba(0, 209, 255, 0.5)",
      primaryGradient: "from-cyan-400 to-blue-500",
      primaryShadow: "shadow-cyan-400/30",
      primaryHoverShadow: "hover:shadow-cyan-400/50",
      speedBorder: "border-cyan-500/20",
    },
    green: {
      titleColor: "text-green-400",
      titleShadow: "0 0 30px rgba(74, 222, 128, 0.5)",
      primaryGradient: "from-green-400 to-emerald-500",
      primaryShadow: "shadow-green-400/30",
      primaryHoverShadow: "hover:shadow-green-400/50",
      speedBorder: "border-green-500/20",
    },
    amber: {
      titleColor: "text-amber-400",
      titleShadow: "0 0 30px rgba(251, 191, 36, 0.5)",
      primaryGradient: "from-amber-400 to-orange-500",
      primaryShadow: "shadow-amber-400/30",
      primaryHoverShadow: "hover:shadow-amber-400/50",
      speedBorder: "border-amber-500/20",
    },
    pink: {
      titleColor: "text-pink-400",
      titleShadow: "0 0 30px rgba(236, 72, 153, 0.5)",
      primaryGradient: "from-pink-400 to-rose-500",
      primaryShadow: "shadow-pink-400/30",
      primaryHoverShadow: "hover:shadow-pink-400/50",
      speedBorder: "border-pink-500/20",
    },
  };

  const colors = colorConfig[accentColor] || colorConfig.cyan;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        e.preventDefault();
        onResume?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onResume]);

  return (
    <div id="pauseMenu" className="fixed inset-0 z-50 flex items-center justify-center glass-overlay">
      <div className="menu-content">
        {/* Glass panel container */}
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-sm mx-3 sm:mx-4">
          <div
            className={`text-2xl sm:text-3xl md:text-4xl font-black ${colors.titleColor} mb-4 sm:mb-6 text-center`}
            style={{
              fontFamily: '"Raleway", sans-serif',
              textShadow: colors.titleShadow,
            }}
          >
            {title}
          </div>

          {/* Speed Control Section - Only shown if speedControl prop is provided */}
          {speedControl && (
            <div className="mb-4 sm:mb-6">
              <div className={`glass-stat ${colors.speedBorder} rounded-xl p-3 sm:p-4 flex items-center justify-between gap-4`}>
                <button
                  onClick={speedControl.onDecrease}
                  disabled={speedControl.speedLevel <= speedControl.minSpeed}
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    speedControl.speedLevel <= speedControl.minSpeed
                      ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                      : `bg-gradient-to-br ${colors.primaryGradient} text-white hover:brightness-110 active:brightness-90`
                  }`}
                  title="Decrease Speed"
                  aria-label="Decrease Speed"
                >
                  <IoRemove className="text-xl" />
                </button>
                <div className="text-center flex-1">
                  <div className={`text-xs ${colors.titleColor} font-semibold uppercase tracking-wider mb-1`}>
                    {speedControl.label || "Speed"}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-1">
                    {speedControl.speedLevel}
                    <span className="text-sm text-gray-400">/{speedControl.maxSpeed}</span>
                  </div>
                </div>
                <button
                  onClick={speedControl.onIncrease}
                  disabled={speedControl.speedLevel >= speedControl.maxSpeed}
                  className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    speedControl.speedLevel >= speedControl.maxSpeed
                      ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                      : `bg-gradient-to-br ${colors.primaryGradient} text-white hover:brightness-110 active:brightness-90`
                  }`}
                  title="Increase Speed"
                  aria-label="Increase Speed"
                >
                  <IoAdd className="text-xl" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:gap-3">
            <button
              onClick={onResume}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold cursor-pointer rounded-lg sm:rounded-xl shadow-lg shadow-green-400/30 transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-green-400/50 active:brightness-90 focus:outline-none py-3 sm:py-4 text-sm sm:text-base"
            >
              {resumeText}
            </button>
            <button
              onClick={onRestart}
              className={`w-full bg-gradient-to-r ${colors.primaryGradient} text-white font-semibold cursor-pointer rounded-lg sm:rounded-xl shadow-lg ${colors.primaryShadow} transition-all duration-300 hover:brightness-110 hover:shadow-xl ${colors.primaryHoverShadow} active:brightness-90 focus:outline-none py-3 sm:py-4 text-sm sm:text-base`}
            >
              {restartText}
            </button>
            <button
              onClick={onMainMenu}
              className="w-full glass-button text-gray-300 font-semibold cursor-pointer rounded-lg sm:rounded-xl transition-all duration-300 hover:brightness-110 active:brightness-90 focus:outline-none py-3 sm:py-4 text-sm sm:text-base"
            >
              {mainMenuText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
