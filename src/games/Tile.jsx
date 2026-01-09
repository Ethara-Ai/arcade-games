import { TILE_COLORS } from '../constants';

const Tile = ({ value, row, col }) => {
  const colors = TILE_COLORS[value] || TILE_COLORS[2048];

  const getFontSize = () => {
    if (value < 100) return 'text-xl sm:text-2xl md:text-3xl lg:text-4xl';
    if (value < 1000) return 'text-lg sm:text-xl md:text-2xl lg:text-3xl';
    return 'text-base sm:text-lg md:text-xl lg:text-2xl';
  };

  // Add glow effect for higher value tiles
  const getGlowStyle = () => {
    if (value >= 1024) {
      return {
        boxShadow: `0 0 20px ${colors.bg}, 0 0 40px ${colors.bg}50`,
      };
    }
    if (value >= 128) {
      return {
        boxShadow: `0 0 15px ${colors.bg}80`,
      };
    }
    if (value > 0) {
      return {
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      };
    }
    return {};
  };

  return (
    <div
      className={`tile absolute flex items-center justify-center rounded-md sm:rounded-lg font-black transition-all duration-100 ${getFontSize()}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        width: 'calc(25% - 6px)',
        height: 'calc(25% - 6px)',
        left: `calc(${col * 25}% + 3px)`,
        top: `calc(${row * 25}% + 3px)`,
        transform: value > 0 ? 'scale(1)' : 'scale(0)',
        fontFamily: '"Raleway", Arial, sans-serif',
        border: value > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
        ...getGlowStyle(),
      }}
    >
      {value > 0 ? value : ''}
    </div>
  );
};

export default Tile;
