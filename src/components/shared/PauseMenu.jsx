import { useEffect } from "react";

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
}) => {
  // Color configurations
  const colorConfig = {
    cyan: {
      titleColor: "text-cyan-400",
      titleShadow: "0 0 30px rgba(0, 209, 255, 0.5)",
      primaryGradient: "from-cyan-400 to-blue-500",
      primaryShadow: "shadow-cyan-400/30",
      primaryHoverShadow: "hover:shadow-cyan-400/50",
    },
    green: {
      titleColor: "text-green-400",
      titleShadow: "0 0 30px rgba(74, 222, 128, 0.5)",
      primaryGradient: "from-green-400 to-emerald-500",
      primaryShadow: "shadow-green-400/30",
      primaryHoverShadow: "hover:shadow-green-400/50",
    },
    amber: {
      titleColor: "text-amber-400",
      titleShadow: "0 0 30px rgba(251, 191, 36, 0.5)",
      primaryGradient: "from-amber-400 to-orange-500",
      primaryShadow: "shadow-amber-400/30",
      primaryHoverShadow: "hover:shadow-amber-400/50",
    },
    pink: {
      titleColor: "text-pink-400",
      titleShadow: "0 0 30px rgba(236, 72, 153, 0.5)",
      primaryGradient: "from-pink-400 to-rose-500",
      primaryShadow: "shadow-pink-400/30",
      primaryHoverShadow: "hover:shadow-pink-400/50",
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
    <div id="pauseMenu" className="glass-overlay">
      <div className="menu-content">
        {/* Glass panel container */}
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-sm mx-3 sm:mx-4">
          <div
            className={`text-2xl sm:text-3xl md:text-4xl font-black ${colors.titleColor} mb-4 sm:mb-6 md:mb-8 text-center`}
            style={{
              fontFamily: '"Raleway", sans-serif',
              textShadow: colors.titleShadow,
            }}
          >
            {title}
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            <button
              onClick={onResume}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold cursor-pointer rounded-lg sm:rounded-xl shadow-lg shadow-green-400/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-400/50 active:scale-95 focus:outline-none py-3 sm:py-4 text-sm sm:text-base"
            >
              {resumeText}
            </button>
            <button
              onClick={onRestart}
              className={`w-full bg-gradient-to-r ${colors.primaryGradient} text-white font-semibold cursor-pointer rounded-lg sm:rounded-xl shadow-lg ${colors.primaryShadow} transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${colors.primaryHoverShadow} active:scale-95 focus:outline-none py-3 sm:py-4 text-sm sm:text-base`}
            >
              {restartText}
            </button>
            <button
              onClick={onMainMenu}
              className="w-full glass-button text-gray-300 font-semibold cursor-pointer rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none py-3 sm:py-4 text-sm sm:text-base"
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
