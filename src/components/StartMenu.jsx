import { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import HowToPlayModal from "./HowToPlayModal";

const BRICKRUSH_INSTRUCTIONS = [
  "Break all the bricks to complete each level",
  "Collect power-ups that fall from broken bricks",
  "Don't let the ball fall below your paddle",
  "Grey steel bricks cannot be destroyed but reflect the ball",
];

const BRICKRUSH_CONTROLS = [
  { key: "← →", action: "Move paddle" },
  { key: "Mouse", action: "Move paddle (follow cursor)" },
  { key: "Space / Click", action: "Launch ball" },
  { key: "P / Esc", action: "Pause game" },
];

const BRICKRUSH_TIPS = [
  "Aim for the corners to clear more bricks",
  "Multi-ball power-ups help clear levels faster",
  "The ball speeds up as you progress",
];

const StartMenu = ({ onStart, onBack }) => {
  const [showHelp, setShowHelp] = useState(false);

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
    <div id="startMenu" className="fixed inset-0 z-50 flex items-center justify-center glass-overlay">
      <div className="menu-content">
        {/* Glass panel container */}
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-md mx-3 sm:mx-4">
          {/* Header Row - Back Button + Title */}
          <div className="flex items-center gap-3 mb-3 sm:mb-4 md:mb-6">
            <button
              onClick={onBack}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600/40 rounded-full text-white flex items-center justify-center shadow-lg shadow-black/40 hover:brightness-110 hover:border-gray-500/50 active:brightness-90 transition-all text-sm sm:text-lg flex-shrink-0"
              title="Back to Game Selector"
            >
              <IoArrowBack />
            </button>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"
              style={{ fontFamily: '"Raleway", sans-serif' }}
            >
              Brickrush
            </h1>
          </div>

          {/* Description */}
          <div className="glass-stat rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 md:mb-6 border-cyan-500/10">
            Break bricks, collect power-ups, and survive! Use keyboard or mouse
            to control the paddle.
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={onStart}
              className="w-full sm:flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-none font-raleway font-semibold cursor-pointer rounded-lg sm:rounded-xl transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-cyan-400/60 active:brightness-90 active:shadow-lg active:shadow-cyan-400/40 focus:outline-none px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg flex items-center justify-center"
            >
              Start Game
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="w-full sm:flex-1 flex items-center justify-center glass-button text-cyan-400 font-semibold cursor-pointer rounded-lg sm:rounded-xl transition-all duration-300 hover:brightness-110 active:brightness-90 focus:outline-none px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg border-cyan-400/30 hover:border-cyan-400/50"
            >
              How to Play
            </button>
          </div>
        </div>
      </div>

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        gameName="Brickrush"
        accentColor="cyan"
        instructions={BRICKRUSH_INSTRUCTIONS}
        controls={BRICKRUSH_CONTROLS}
        tips={BRICKRUSH_TIPS}
      />
    </div>
  );
};

export default StartMenu;
