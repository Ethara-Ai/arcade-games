import React from 'react';
import { IoClose, IoGameController } from 'react-icons/io5';

/**
 * How to Play Modal - Reusable component for all games
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

  const colorConfig = {
    cyan: {
      titleColor: 'text-cyan-400',
      accent: 'text-cyan-400',
      bgAccent: 'bg-cyan-500/10',
      borderAccent: 'border-cyan-500/20',
      buttonGradient: 'from-cyan-400 to-blue-500',
      buttonShadow: 'shadow-cyan-400/30',
      glow: 'bg-cyan-500/20',
    },
    green: {
      titleColor: 'text-green-400',
      accent: 'text-green-400',
      bgAccent: 'bg-green-500/10',
      borderAccent: 'border-green-500/20',
      buttonGradient: 'from-green-400 to-emerald-500',
      buttonShadow: 'shadow-green-400/30',
      glow: 'bg-green-500/20',
    },
  };

  const colors = colorConfig[accentColor] || colorConfig.cyan;

  return (
    <div 
      className="fixed inset-0 glass-overlay flex items-center justify-center z-[100] p-3 sm:p-4"
      onClick={onClose}
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 ${colors.glow} rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]`}></div>
      </div>

      {/* Glass panel */}
      <div 
        className="relative glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner glass shine */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] rounded-2xl sm:rounded-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full glass-button text-gray-400 hover:text-white active:scale-95 transition-all z-20"
        >
          <IoClose className="text-lg sm:text-xl" />
        </button>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${colors.bgAccent} flex items-center justify-center border ${colors.borderAccent}`}>
              <IoGameController className={`text-xl sm:text-2xl ${colors.accent}`} />
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
              <h3 className={`text-xs sm:text-sm font-semibold ${colors.accent} uppercase tracking-wider mb-2 sm:mb-3`}>
                Objective
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-1.5 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                    <span className={`${colors.accent} mt-0.5 sm:mt-1`}>•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Controls */}
          {controls.length > 0 && (
            <div className="mb-3 sm:mb-5">
              <h3 className={`text-xs sm:text-sm font-semibold ${colors.accent} uppercase tracking-wider mb-2 sm:mb-3`}>
                Controls
              </h3>
              <div className="grid gap-1.5 sm:gap-2">
                {controls.map((control, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between glass-stat rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 ${colors.borderAccent}`}
                  >
                    <span className="text-gray-400 text-xs sm:text-sm">{control.action}</span>
                    <kbd className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${colors.bgAccent} ${colors.accent} text-[10px] sm:text-xs font-mono border ${colors.borderAccent}`}>
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
              <h3 className={`text-xs sm:text-sm font-semibold ${colors.accent} uppercase tracking-wider mb-2 sm:mb-3`}>
                Tips
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm">
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
            className={`w-full py-2.5 sm:py-3 bg-gradient-to-r ${colors.buttonGradient} text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:scale-[1.02] active:scale-95 transition-transform ${colors.buttonShadow} shadow-lg mt-1 sm:mt-2`}
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModal;
