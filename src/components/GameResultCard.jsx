import { IoTrophy } from "react-icons/io5";

/**
 * Unified game result card overlay - used across all games for consistency
 * @param {string} type - 'gameover', 'win', 'levelcomplete', 'paused', 'start'
 * @param {string} title - Main headline text
 * @param {string} accentColor - Primary accent color ('cyan', 'green', 'red', 'yellow')
 * @param {array} stats - Array of {label, value} objects to display
 * @param {array} buttons - Array of {label, onClick, primary, color} objects
 * @param {boolean} isNewHighScore - Show trophy icon if true
 * @param {string} subtitle - Optional subtitle text
 */
const GameResultCard = ({
  _type = "gameover",
  title,
  accentColor = "cyan",
  stats = [],
  buttons = [],
  isNewHighScore = false,
  subtitle = "",
}) => {
  // Color configurations
  const colorConfig = {
    cyan: {
      titleColor: "text-cyan-400",
      titleShadow: "0 0 30px rgba(0, 209, 255, 0.5)",
      gradient: "from-cyan-400 to-blue-500",
      border: "border-cyan-500/20",
      shadow: "shadow-cyan-400/40",
      statText: "text-cyan-400",
      bgGlow: "bg-cyan-500/5",
    },
    green: {
      titleColor: "text-green-400",
      titleShadow: "0 0 30px rgba(74, 222, 128, 0.5)",
      gradient: "from-green-400 to-emerald-500",
      border: "border-green-500/20",
      shadow: "shadow-green-400/40",
      statText: "text-green-400",
      bgGlow: "bg-green-500/5",
    },
    red: {
      titleColor: "text-red-500",
      titleShadow: "0 0 30px rgba(255, 23, 68, 0.5)",
      gradient: "from-cyan-400 to-blue-500",
      border: "border-red-500/20",
      shadow: "shadow-red-400/40",
      statText: "text-cyan-400",
      bgGlow: "bg-red-500/5",
    },
    yellow: {
      titleColor: "text-yellow-400",
      titleShadow: "0 0 30px rgba(251, 191, 36, 0.5)",
      gradient: "from-yellow-400 to-orange-500",
      border: "border-yellow-500/20",
      shadow: "shadow-yellow-400/40",
      statText: "text-yellow-400",
      bgGlow: "bg-yellow-500/5",
    },
  };

  const colors = colorConfig[accentColor] || colorConfig.cyan;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${colors.bgGlow} rounded-full blur-3xl`}
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
        {subtitle && <p className="text-gray-300 text-center text-sm sm:text-base px-4">{subtitle}</p>}

        {/* Stats */}
        {stats.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 my-2">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-[#1e1e1e] ${colors.border} border rounded-xl px-4 py-2 text-center min-w-[90px]`}
              >
                <div className={`text-[10px] ${colors.statText} font-semibold uppercase tracking-wider`}>
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
              const btnGradient = button.color
                ? colorConfig[button.color]?.gradient || colors.gradient
                : colors.gradient;
              const btnShadow = button.color ? colorConfig[button.color]?.shadow || colors.shadow : colors.shadow;

              return (
                <button
                  key={index}
                  onClick={button.onClick}
                  className={`px-6 py-3 bg-gradient-to-r ${btnGradient} text-white rounded-xl font-semibold hover:brightness-110 active:brightness-90 transition-all shadow-lg ${btnShadow} text-sm sm:text-base whitespace-nowrap`}
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

export default GameResultCard;
