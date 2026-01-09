import { IoTrophy } from 'react-icons/io5';
import PropTypes from 'prop-types';
import { getColorConfig } from '../utils/colorConfig';

/**
 * GameOverMenu - Generic game over menu component for all games
 * @param {string} title - Menu title (default: "Game Over")
 * @param {string} accentColor - Accent color theme ('cyan', 'green', 'amber', 'red', etc.)
 * @param {number} score - Current score
 * @param {number} highScore - High score
 * @param {function} onRestart - Callback when restart/play again button is clicked
 * @param {function} onMainMenu - Callback when main menu button is clicked
 * @param {string} restartText - Custom text for restart button (default: "Play Again")
 * @param {string} mainMenuText - Custom text for main menu button (default: "Main Menu")
 * @param {array} stats - Optional additional stats to display [{label, value}]
 */
const GameOverMenu = ({
  title = 'Game Over',
  accentColor = 'red',
  score = 0,
  highScore = 0,
  onRestart,
  onMainMenu,
  restartText = 'Play Again',
  mainMenuText = 'Main Menu',
  stats = [],
}) => {
  const isNewHighScore = score >= highScore && score > 0;

  // Get color configuration from shared utility
  const colors = getColorConfig(accentColor, 'red');

  // Default stats if none provided
  const displayStats =
    stats.length > 0
      ? stats
      : [
          { label: 'Score', value: score },
          { label: 'Best', value: highScore },
        ];

  return (
    <div className="fixed inset-0 glass-overlay flex flex-col items-center justify-center z-50 p-3 sm:p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 ${colors.glowBg} rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]`}
        ></div>
      </div>

      {/* Glass panel */}
      <div className="relative z-10 glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-md w-full mx-3 sm:mx-4">
        {/* Inner glass shine */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] rounded-2xl sm:rounded-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center justify-center gap-3 sm:gap-4">
          {/* Title */}
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black ${colors.titleColor} text-center`}
            style={{
              fontFamily: '"Raleway", sans-serif',
              textShadow: colors.titleShadow,
            }}
          >
            {title}
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
            {displayStats.map((stat, index) => (
              <div
                key={index}
                className={`glass-stat ${colors.statBorder} rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-center min-w-[90px] sm:min-w-[110px]`}
              >
                <div
                  className={`text-[9px] sm:text-[10px] ${colors.statText} font-semibold uppercase tracking-wider`}
                >
                  {stat.label}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-stretch justify-center gap-2 sm:gap-3 mt-1 sm:mt-2 w-full">
            <button
              onClick={onRestart}
              className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r ${colors.primaryGradient} text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:brightness-110 active:brightness-90 transition-all shadow-lg ${colors.primaryShadow} whitespace-nowrap`}
            >
              {restartText}
            </button>
            <button
              onClick={onMainMenu}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 glass-button text-gray-300 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:brightness-110 active:brightness-90 transition-all whitespace-nowrap"
            >
              {mainMenuText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

GameOverMenu.propTypes = {
  /** Menu title */
  title: PropTypes.string,
  /** Accent color theme */
  accentColor: PropTypes.oneOf(['cyan', 'green', 'amber', 'pink', 'red', 'yellow']),
  /** Current score */
  score: PropTypes.number,
  /** High score */
  highScore: PropTypes.number,
  /** Callback when restart/play again button is clicked */
  onRestart: PropTypes.func.isRequired,
  /** Callback when main menu button is clicked */
  onMainMenu: PropTypes.func.isRequired,
  /** Custom text for restart button */
  restartText: PropTypes.string,
  /** Custom text for main menu button */
  mainMenuText: PropTypes.string,
  /** Optional additional stats to display */
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
};

export default GameOverMenu;
