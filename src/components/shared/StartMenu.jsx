import { useState, useEffect } from "react";
import { IoHelpCircle, IoArrowBack } from "react-icons/io5";
import HowToPlayModal from "./HowToPlayModal";

/**
 * StartMenu - Generic start menu component for all games
 * @param {string} title - Game title
 * @param {string} description - Game description text
 * @param {string} accentColor - Accent color theme ('cyan', 'green', 'amber', etc.)
 * @param {function} onStart - Callback when start button is clicked
 * @param {function} onBack - Callback when back button is clicked
 * @param {array} instructions - Array of instruction strings for HowToPlayModal
 * @param {array} controls - Array of {key, action} objects for HowToPlayModal
 * @param {array} tips - Array of tip strings for HowToPlayModal
 * @param {string} startButtonText - Custom text for start button (default: "Start Game")
 */
const StartMenu = ({
  title,
  description,
  accentColor = "cyan",
  onStart,
  onBack,
  instructions = [],
  controls = [],
  tips = [],
  startButtonText = "Start Game",
}) => {
  const [showHelp, setShowHelp] = useState(false);

  // Color configurations
  const colorConfig = {
    cyan: {
      gradient: "from-cyan-400 to-blue-500",
      shadow: "shadow-cyan-400/40",
      hoverShadow: "hover:shadow-cyan-400/60",
      titleColor: "text-cyan-400",
      titleShadow: "0 0 30px rgba(0, 209, 255, 0.5)",
      border: "border-cyan-500/10",
      helpBorder: "border-cyan-400/30",
      helpHoverBorder: "hover:border-cyan-400/50",
    },
    green: {
      gradient: "from-green-400 to-emerald-500",
      shadow: "shadow-green-400/40",
      hoverShadow: "hover:shadow-green-400/60",
      titleColor: "text-green-400",
      titleShadow: "0 0 30px rgba(74, 222, 128, 0.5)",
      border: "border-green-500/10",
      helpBorder: "border-green-400/30",
      helpHoverBorder: "hover:border-green-400/50",
    },
    amber: {
      gradient: "from-amber-400 to-orange-500",
      shadow: "shadow-amber-400/40",
      hoverShadow: "hover:shadow-amber-400/60",
      titleColor: "text-amber-400",
      titleShadow: "0 0 30px rgba(251, 191, 36, 0.5)",
      border: "border-amber-500/10",
      helpBorder: "border-amber-400/30",
      helpHoverBorder: "hover:border-amber-400/50",
    },
    pink: {
      gradient: "from-pink-400 to-rose-500",
      shadow: "shadow-pink-400/40",
      hoverShadow: "hover:shadow-pink-400/60",
      titleColor: "text-pink-400",
      titleShadow: "0 0 30px rgba(236, 72, 153, 0.5)",
      border: "border-pink-500/10",
      helpBorder: "border-pink-400/30",
      helpHoverBorder: "hover:border-pink-400/50",
    },
  };

  const colors = colorConfig[accentColor] || colorConfig.cyan;

  // Enter key to start game
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !showHelp) {
        onStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onStart, showHelp]);

  return (
    <div id="startMenu" className="glass-overlay">
      <div className="menu-content">
        {/* Glass panel container */}
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-md mx-3 sm:mx-4">
          {/* Header Row - Back Button + Title */}
          <div className="flex items-center gap-3 mb-3 sm:mb-4 md:mb-6">
            <button
              onClick={onBack}
              className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${colors.gradient} rounded-full text-white flex items-center justify-center shadow-lg ${colors.shadow} hover:scale-105 active:scale-95 transition-transform text-sm sm:text-lg flex-shrink-0`}
              title="Back to Game Selector"
            >
              <IoArrowBack />
            </button>
            <h1
              className={`game-title text-2xl sm:text-3xl md:text-4xl font-black ${colors.titleColor}`}
              style={{
                fontFamily: '"Raleway", sans-serif',
                textShadow: colors.titleShadow,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Description */}
          <div
            className={`glass-stat rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 md:mb-6 ${colors.border}`}
          >
            {description}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={onStart}
              className={`w-full sm:w-auto bg-gradient-to-r ${colors.gradient} text-white border-none font-raleway font-semibold cursor-pointer rounded-lg sm:rounded-xl shadow-lg ${colors.shadow} transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${colors.hoverShadow} active:scale-95 focus:outline-none px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg flex items-center justify-center gap-2`}
            >
              {startButtonText}
            </button>
            {(instructions.length > 0 ||
              controls.length > 0 ||
              tips.length > 0) && (
              <button
                onClick={() => setShowHelp(true)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 glass-button ${colors.titleColor} font-semibold cursor-pointer rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg ${colors.helpBorder} ${colors.helpHoverBorder}`}
              >
                <IoHelpCircle className="text-lg sm:text-xl" />
                How to Play
              </button>
            )}
          </div>
        </div>
      </div>

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        gameName={title}
        accentColor={accentColor}
        instructions={instructions}
        controls={controls}
        tips={tips}
      />
    </div>
  );
};

export default StartMenu;
