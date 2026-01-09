import PropTypes from 'prop-types';
import { IoTrophy } from 'react-icons/io5';
import { getColorConfig } from '../utils/colorConfig';

/**
 * Unified game result card overlay - used across all games for consistency
 * @param {string} title - Main headline text
 * @param {string} accentColor - Primary accent color ('cyan', 'green', 'red', 'yellow', 'amber', 'pink')
 * @param {array} stats - Array of {label, value} objects to display
 * @param {array} buttons - Array of {label, onClick, primary, color} objects
 * @param {boolean} isNewHighScore - Show trophy icon if true
 * @param {string} subtitle - Optional subtitle text
 */
const GameResultCard = ({
  title,
  accentColor = 'cyan',
  stats = [],
  buttons = [],
  isNewHighScore = false,
  subtitle = '',
}) => {
  // Get color configuration from shared utility
  const colors = getColorConfig(accentColor);

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${colors.glowBg} rounded-full blur-3xl`}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-3 max-w-sm w-full">
        {/* Title */}
        <h2
          className={`text-3xl sm:text-4xl font-black ${colors.titleColor} text-center`}
          style={{
            fontFamily: '"Raleway", sans-serif',
            textShadow: colors.titleShadow,
          }}
        >
          {title}
        </h2>

        {/* New High Score Badge */}
        {isNewHighScore && (
          <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold animate-pulse">
            <IoTrophy className="text-lg" />
            <span>New High Score!</span>
            <IoTrophy className="text-lg" />
          </div>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-gray-300 text-center text-sm sm:text-base px-4">{subtitle}</p>
        )}

        {/* Stats */}
        {stats.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 my-2">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-[#1e1e1e] ${colors.statBorder} border rounded-xl px-4 py-2 text-center min-w-[90px]`}
              >
                <div
                  className={`text-[10px] ${colors.statText} font-semibold uppercase tracking-wider`}
                >
                  {stat.label}
                </div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        {buttons.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {buttons.map((button, index) => {
              const btnColors = button.color ? getColorConfig(button.color) : colors;

              return (
                <button
                  key={index}
                  onClick={button.onClick}
                  className={`px-6 py-3 bg-gradient-to-r ${btnColors.gradient} text-white rounded-xl font-semibold hover:brightness-110 active:brightness-90 transition-all shadow-lg ${btnColors.primaryShadow} text-sm sm:text-base whitespace-nowrap`}
                >
                  {button.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

GameResultCard.propTypes = {
  /** Main headline text */
  title: PropTypes.string.isRequired,
  /** Primary accent color */
  accentColor: PropTypes.oneOf(['cyan', 'green', 'red', 'yellow', 'amber', 'pink']),
  /** Array of stat objects to display */
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
  /** Array of button objects */
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      color: PropTypes.oneOf(['cyan', 'green', 'red', 'yellow', 'amber', 'pink']),
    })
  ),
  /** Show trophy icon if true */
  isNewHighScore: PropTypes.bool,
  /** Optional subtitle text */
  subtitle: PropTypes.string,
};

GameResultCard.defaultProps = {
  accentColor: 'cyan',
  stats: [],
  buttons: [],
  isNewHighScore: false,
  subtitle: '',
};

export default GameResultCard;
