import { memo } from "react";

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
const GameCard = memo(({
  title,
  description,
  onClick,
  accentColor = "cyan",
  shortcutKey,
  icon,
  tags = [],
}) => {
  const colorConfig = {
    cyan: {
      hoverBorder: "hover:border-cyan-500/30",
      shadow: "hover:shadow-cyan-500/20",
      gradient: "from-cyan-400 to-blue-500",
      iconShadow: "shadow-cyan-500/40",
      badgeText: "text-cyan-400",
      badgeBorder: "border-cyan-500/30",
    },
    amber: {
      hoverBorder: "hover:border-amber-500/30",
      shadow: "hover:shadow-amber-500/20",
      gradient: "from-amber-400 to-orange-500",
      iconShadow: "shadow-amber-500/40",
      badgeText: "text-amber-400",
      badgeBorder: "border-amber-500/30",
    },
    green: {
      hoverBorder: "hover:border-green-500/30",
      shadow: "hover:shadow-green-500/20",
      gradient: "from-green-400 to-emerald-500",
      iconShadow: "shadow-green-500/40",
      badgeText: "text-green-400",
      badgeBorder: "border-green-500/30",
    },
    pink: {
      hoverBorder: "hover:border-pink-500/30",
      shadow: "hover:shadow-pink-500/20",
      gradient: "from-pink-400 to-rose-500",
      iconShadow: "shadow-pink-500/40",
      badgeText: "text-pink-400",
      badgeBorder: "border-pink-500/30",
    },
  };

  const tagColorConfig = {
    cyan: { text: "text-cyan-400", border: "border-cyan-500/20" },
    amber: { text: "text-amber-400", border: "border-amber-500/20" },
    green: { text: "text-green-400", border: "border-green-500/20" },
    pink: { text: "text-pink-400", border: "border-pink-500/20" },
    yellow: { text: "text-yellow-400", border: "border-yellow-500/20" },
  };

  const colors = colorConfig[accentColor] || colorConfig.cyan;

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
            <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
              {description}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-4">
              {tags.map((tag, index) => {
                const tagColors = tagColorConfig[tag.color] || tagColorConfig.cyan;
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
});

GameCard.displayName = "GameCard";

export default GameCard;
