import PropTypes from 'prop-types';

/**
 * LevelTransition - A purely presentational transition overlay component
 *
 * This component only renders based on props - no internal state management.
 * Use the useLevelTransition hook for managing the transition state.
 *
 * @param {Object} props
 * @param {boolean} props.visible - Whether the overlay is visible
 * @param {number} props.opacity - Current opacity (0-1)
 * @param {string} props.accentColor - Color theme ('cyan', 'green', 'amber', 'pink')
 * @param {string} props.message - Optional message to display
 * @param {number} props.transitionDuration - CSS transition duration in ms
 */
const LevelTransition = ({
  visible = false,
  opacity = 0,
  accentColor = 'cyan',
  message = '',
  transitionDuration = 500,
}) => {
  // Color configurations
  const colorConfig = {
    cyan: {
      bg: 'bg-cyan-900/95',
      glow: 'bg-cyan-500/30',
      text: 'text-cyan-400',
    },
    green: {
      bg: 'bg-emerald-900/95',
      glow: 'bg-green-500/30',
      text: 'text-green-400',
    },
    amber: {
      bg: 'bg-amber-900/95',
      glow: 'bg-amber-500/30',
      text: 'text-amber-400',
    },
    pink: {
      bg: 'bg-pink-900/95',
      glow: 'bg-pink-500/30',
      text: 'text-pink-400',
    },
  };

  const colors = colorConfig[accentColor] || colorConfig.cyan;

  // Don't render if not visible
  if (!visible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${colors.bg}`}
      style={{
        opacity,
        transition: `opacity ${transitionDuration}ms ease-in-out`,
      }}
    >
      {/* Animated glow effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${colors.glow} rounded-full blur-[100px] animate-pulse`}
        />
      </div>

      {/* Optional message */}
      {message && (
        <div className="relative z-10 text-center">
          <p
            className={`text-2xl sm:text-3xl font-bold ${colors.text}`}
            style={{
              fontFamily: '"Raleway", sans-serif',
              textShadow: '0 0 20px currentColor',
            }}
          >
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

LevelTransition.propTypes = {
  /** Whether the overlay is visible */
  visible: PropTypes.bool,
  /** Current opacity (0-1) */
  opacity: PropTypes.number,
  /** Color theme */
  accentColor: PropTypes.oneOf(['cyan', 'green', 'amber', 'pink']),
  /** Optional message to display */
  message: PropTypes.string,
  /** CSS transition duration in ms */
  transitionDuration: PropTypes.number,
};

export default LevelTransition;
