import { memo } from 'react';
import PropTypes from 'prop-types';
import { getColorConfig, getTagColorConfig } from '../utils/colorConfig';

/**
 * GameCard - Reusable card component for game selection
 * @param {string} title - Game title
 * @param {string} description - Game description
 * @param {function} onClick - Click handler
 * @param {string} accentColor - Accent color ('cyan', 'amber', 'green', 'pink')
 * @param {string} shortcutKey - Keyboard shortcut key to display
 * @param {React.ReactNode} icon - Icon component or element
 * @param {array} tags - Array of {label, color} for tag badges
 */
const GameCard = memo(
  ({
    title,
    description = '',
    onClick,
    accentColor = 'cyan',
    shortcutKey = null,
    icon = null,
    tags = [],
  }) => {
    // Get color configuration from shared utility
    const colors = getColorConfig(accentColor);

    return (
      <button
        onClick={onClick}
        className={`game-card glass-card group relative rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 ${colors.hoverBorder} transition-all duration-300 active:brightness-90 sm:hover:brightness-110 text-left overflow-hidden focus:outline-none focus-visible:outline-none`}
      >
        {/* Glass gradient shine */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-${accentColor}-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] rounded-xl sm:rounded-2xl"></div>

        {/* Keyboard shortcut badge */}
        {shortcutKey && (
          <div
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 hidden sm:flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md glass-stat ${colors.badgeText} text-xs font-bold ${colors.badgeBorder}`}
          >
            {shortcutKey}
          </div>
        )}

        <div className="relative z-10 flex sm:block items-center gap-4 sm:gap-0">
          {/* Icon */}
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${colors.gradient} rounded-lg sm:rounded-xl flex items-center justify-center sm:mb-4 flex-shrink-0`}
          >
            {icon}
          </div>

          <div className="flex-1 sm:flex-none">
            <h2
              className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2"
              style={{ fontFamily: '"Raleway", sans-serif' }}
            >
              {title}
            </h2>
            {description && (
              <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">{description}</p>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-4">
                {tags.map((tag, index) => {
                  const tagColors = getTagColorConfig(tag.color);
                  return (
                    <span
                      key={index}
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 glass-stat ${tagColors.text} text-[10px] sm:text-xs rounded-full ${tagColors.border}`}
                    >
                      {tag.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </button>
    );
  }
);

GameCard.displayName = 'GameCard';

GameCard.propTypes = {
  /** Game title */
  title: PropTypes.string.isRequired,
  /** Game description */
  description: PropTypes.string,
  /** Click handler */
  onClick: PropTypes.func.isRequired,
  /** Accent color theme */
  accentColor: PropTypes.oneOf(['cyan', 'amber', 'green', 'pink', 'red', 'yellow']),
  /** Keyboard shortcut key to display */
  shortcutKey: PropTypes.string,
  /** Icon component or element */
  icon: PropTypes.node,
  /** Array of tag objects for badges */
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.oneOf(['cyan', 'amber', 'green', 'pink', 'yellow', 'red']),
    })
  ),
};

export default GameCard;
