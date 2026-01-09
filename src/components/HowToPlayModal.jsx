import PropTypes from 'prop-types';
import { IoClose, IoGameController } from 'react-icons/io5';
import { getColorConfig } from '../utils/colorConfig';

/**
 * How to Play Modal - Reusable component for all games
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Callback when modal is closed
 * @param {string} gameName - Name of the game
 * @param {string} accentColor - Accent color theme ('cyan', 'green', 'amber', 'pink')
 * @param {array} instructions - Array of instruction strings
 * @param {array} controls - Array of {key, action} objects
 * @param {array} tips - Array of tip strings
 */
const HowToPlayModal = ({
  isOpen,
  onClose,
  gameName,
  accentColor = 'cyan',
  instructions = [],
  controls = [],
  tips = [],
}) => {
  if (!isOpen) return null;

  // Get color configuration from shared utility
  const colors = getColorConfig(accentColor);

  return (
    <div
      className="fixed inset-0 glass-overlay flex items-center justify-center z-[100] p-3 sm:p-4"
      onClick={onClose}
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 ${colors.glow} rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]`}
        ></div>
      </div>

      {/* Glass panel */}
      <div
        className="relative glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner glass shine */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] rounded-2xl sm:rounded-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 aspect-square flex items-center justify-center rounded-full glass-button text-gray-400 hover:text-white hover:brightness-110 active:brightness-90 transition-all z-20 flex-shrink-0"
        >
          <IoClose className="text-lg sm:text-xl" />
        </button>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${colors.bgAccent} flex items-center justify-center border ${colors.borderAccent}`}
            >
              <IoGameController className={`text-xl sm:text-2xl ${colors.text}`} />
            </div>
            <div>
              <h2
                className={`text-xl sm:text-2xl font-black ${colors.titleColor}`}
                style={{ fontFamily: '"Raleway", sans-serif' }}
              >
                How to Play
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">{gameName}</p>
            </div>
          </div>

          {/* Instructions */}
          {instructions.length > 0 && (
            <div className="mb-3 sm:mb-5">
              <h3
                className={`text-xs sm:text-sm font-semibold ${colors.text} uppercase tracking-wider mb-2 sm:mb-3`}
              >
                Objective
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {instructions.map((instruction, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-1.5 sm:gap-2 text-gray-300 text-xs sm:text-sm"
                  >
                    <span className={`${colors.text} mt-0.5 sm:mt-1`}>•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Controls */}
          {controls.length > 0 && (
            <div className="mb-3 sm:mb-5">
              <h3
                className={`text-xs sm:text-sm font-semibold ${colors.text} uppercase tracking-wider mb-2 sm:mb-3`}
              >
                Controls
              </h3>
              <div className="grid gap-1.5 sm:gap-2">
                {controls.map((control, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between glass-stat rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 ${colors.borderAccent}`}
                  >
                    <span className="text-gray-400 text-xs sm:text-sm">{control.action}</span>
                    <kbd
                      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${colors.bgAccent} ${colors.text} text-[10px] sm:text-xs font-mono border ${colors.borderAccent}`}
                    >
                      {control.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {tips.length > 0 && (
            <div className="mb-3 sm:mb-5">
              <h3
                className={`text-xs sm:text-sm font-semibold ${colors.text} uppercase tracking-wider mb-2 sm:mb-3`}
              >
                Tips
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm"
                  >
                    <span className="text-yellow-400 mt-0 sm:mt-0.5">💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Got It Button */}
          <button
            onClick={onClose}
            className={`w-full py-2.5 sm:py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:brightness-110 active:brightness-90 transition-all ${colors.buttonShadow} shadow-lg mt-1 sm:mt-2`}
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

HowToPlayModal.propTypes = {
  /** Whether the modal is open */
  isOpen: PropTypes.bool.isRequired,
  /** Callback when modal is closed */
  onClose: PropTypes.func.isRequired,
  /** Name of the game */
  gameName: PropTypes.string.isRequired,
  /** Accent color theme */
  accentColor: PropTypes.oneOf(['cyan', 'green', 'amber', 'pink', 'red', 'yellow']),
  /** Array of instruction strings */
  instructions: PropTypes.arrayOf(PropTypes.string),
  /** Array of control objects */
  controls: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
    })
  ),
  /** Array of tip strings */
  tips: PropTypes.arrayOf(PropTypes.string),
};

export default HowToPlayModal;
