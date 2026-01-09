import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { IoArrowBack } from 'react-icons/io5';
import HowToPlayModal from './HowToPlayModal';
import { getColorConfig } from '../utils/colorConfig';

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
  accentColor = 'cyan',
  onStart,
  onBack,
  instructions = [],
  controls = [],
  tips = [],
  startButtonText = 'Start Game',
}) => {
  const [showHelp, setShowHelp] = useState(false);

  // Get color configuration from shared utility
  const colors = getColorConfig(accentColor);

  // Enter key to start game
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !showHelp) {
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart, showHelp]);

  return (
    <div
      id="startMenu"
      className="fixed inset-0 z-50 flex items-center justify-center glass-overlay"
    >
      <div className="menu-content">
        {/* Glass panel container */}
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-md mx-3 sm:mx-4">
          {/* Header Row - Back Button + Title */}
          <div className="flex items-center gap-3 mb-3 sm:mb-4 md:mb-6">
            <button
              onClick={onBack}
              className={`w-8 h-8 sm:w-10 sm:h-10 min-w-[32px] min-h-[32px] bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600/40 rounded-full text-white flex items-center justify-center shadow-lg shadow-black/40 hover:brightness-110 hover:border-gray-500/50 active:brightness-90 transition-all text-sm sm:text-lg flex-shrink-0`}
              title="Back to Game Selector"
            >
              <IoArrowBack />
            </button>
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl font-black ${colors.titleColor}`}
              style={{ fontFamily: '"Raleway", sans-serif' }}
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
              className={`w-full sm:flex-1 bg-gradient-to-r ${colors.gradient} text-white border-none font-raleway font-semibold cursor-pointer rounded-lg sm:rounded-xl transition-all duration-300 hover:brightness-110 active:brightness-90 focus:outline-none px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg flex items-center justify-center`}
            >
              {startButtonText}
            </button>
            {(instructions.length > 0 || controls.length > 0 || tips.length > 0) && (
              <button
                onClick={() => setShowHelp(true)}
                className={`w-full sm:flex-1 flex items-center justify-center glass-button ${colors.titleColor} font-semibold cursor-pointer rounded-lg sm:rounded-xl transition-all duration-300 hover:brightness-110 active:brightness-90 focus:outline-none px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg ${colors.helpBorder} ${colors.helpHoverBorder}`}
              >
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

StartMenu.propTypes = {
  /** Game title displayed in the header */
  title: PropTypes.string.isRequired,
  /** Game description text */
  description: PropTypes.string.isRequired,
  /** Accent color theme */
  accentColor: PropTypes.oneOf(['cyan', 'green', 'amber', 'pink', 'red', 'yellow']),
  /** Callback when start button is clicked */
  onStart: PropTypes.func.isRequired,
  /** Callback when back button is clicked */
  onBack: PropTypes.func.isRequired,
  /** Array of instruction strings for HowToPlayModal */
  instructions: PropTypes.arrayOf(PropTypes.string),
  /** Array of control objects for HowToPlayModal */
  controls: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
    })
  ),
  /** Array of tip strings for HowToPlayModal */
  tips: PropTypes.arrayOf(PropTypes.string),
  /** Custom text for start button */
  startButtonText: PropTypes.string,
};

export default StartMenu;
