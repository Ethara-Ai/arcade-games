import { useEffect } from "react";

const GameSelector = ({ onSelectGame }) => {
  // Keyboard shortcuts to select games
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "1":
          onSelectGame("brickrush");
          break;
        case "2":
          onSelectGame("1024");
          break;
        case "3":
          onSelectGame("snake");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectGame]);

  return (
    <div className="game-selector fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-start md:justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-cyan-500/20 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-amber-500/15 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-green-500/15 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/2 left-1/3 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-pink-500/10 rounded-full blur-[40px] sm:blur-[60px] md:blur-[80px] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="relative z-10 text-center max-w-4xl mx-auto py-4 sm:py-6 md:py-8 w-full">
        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-400 bg-clip-text text-transparent"
          style={{
            fontFamily: '"Raleway", sans-serif',
            backgroundSize: "200% 200%",
            animation: "gradientMove 4s linear infinite",
          }}
        >
          Arcade Games        </h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-10">Choose your game</p>

        {/* Game Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-2 sm:px-4">
          {/* Brickrush Card */}
          <button
            onClick={() => onSelectGame("brickrush")}
            className="game-card glass-card group relative rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:border-cyan-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 text-left overflow-hidden"
          >
            {/* Glass gradient shine */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] rounded-xl sm:rounded-2xl"></div>

            {/* Keyboard shortcut badge */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 hidden sm:flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md glass-stat text-cyan-400 text-xs font-bold border-cyan-500/30">
              1
            </div>

            <div className="relative z-10 flex sm:block items-center gap-4 sm:gap-0">
              {/* Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center sm:mb-4 shadow-lg shadow-cyan-500/40 flex-shrink-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="4" width="4" height="2" rx="0.5" />
                  <rect x="7" y="4" width="4" height="2" rx="0.5" />
                  <rect x="12" y="4" width="4" height="2" rx="0.5" />
                  <rect x="17" y="4" width="4" height="2" rx="0.5" />
                  <rect x="2" y="7" width="4" height="2" rx="0.5" />
                  <rect x="7" y="7" width="4" height="2" rx="0.5" />
                  <rect x="12" y="7" width="4" height="2" rx="0.5" />
                  <rect x="17" y="7" width="4" height="2" rx="0.5" />
                  <circle cx="12" cy="15" r="1.5" />
                  <rect x="8" y="20" width="8" height="2" rx="1" />
                </svg>
              </div>

              <div className="flex-1 sm:flex-none">
                <h2
                  className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2"
                  style={{ fontFamily: '"Raleway", sans-serif' }}
                >
                  Brickrush
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
                  Classic brick breaker with power-ups and multiple levels
                </p>

                {/* Tags */}
                <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-4">
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 glass-stat text-cyan-400 text-[10px] sm:text-xs rounded-full border-cyan-500/20">
                    Arcade
                  </span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 glass-stat text-pink-400 text-[10px] sm:text-xs rounded-full border-pink-500/20">
                    Action
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* 1024 Card */}
          <button
            onClick={() => onSelectGame("1024")}
            className="game-card glass-card group relative rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:border-amber-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 text-left overflow-hidden"
          >
            {/* Glass gradient shine */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] rounded-xl sm:rounded-2xl"></div>

            {/* Keyboard shortcut badge */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 hidden sm:flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md glass-stat text-amber-400 text-xs font-bold border-amber-500/30">
              2
            </div>

            <div className="relative z-10 flex sm:block items-center gap-4 sm:gap-0">
              {/* Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center sm:mb-4 shadow-lg shadow-amber-500/40 flex-shrink-0">
                <span
                  className="text-white font-black text-sm sm:text-base md:text-xl"
                  style={{ fontFamily: '"Raleway", sans-serif' }}
                >
                  1024
                </span>
              </div>

              <div className="flex-1 sm:flex-none">
                <h2
                  className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2"
                  style={{ fontFamily: '"Raleway", sans-serif' }}
                >
                  1024
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">Slide and merge tiles to reach 1024</p>

                {/* Tags */}
                <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-4">
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 glass-stat text-amber-400 text-[10px] sm:text-xs rounded-full border-amber-500/20">
                    Puzzle
                  </span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 glass-stat text-cyan-400 text-[10px] sm:text-xs rounded-full border-cyan-500/20">
                    Strategy
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* Snake Card */}
          <button
            onClick={() => onSelectGame("snake")}
            className="game-card glass-card group relative rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:border-green-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 text-left overflow-hidden"
          >
            {/* Glass gradient shine */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] rounded-xl sm:rounded-2xl"></div>

            {/* Keyboard shortcut badge */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 hidden sm:flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md glass-stat text-green-400 text-xs font-bold border-green-500/30">
              3
            </div>

            <div className="relative z-10 flex sm:block items-center gap-4 sm:gap-0">
              {/* Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center sm:mb-4 shadow-lg shadow-green-500/40 flex-shrink-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 12c0 1.1-.9 2-2 2h-1v1c0 1.1-.9 2-2 2h-1v1c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-1H5c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2h1V9c0-1.1.9-2 2-2h1V6c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v1h1c1.1 0 2 .9 2 2v3z" />
                  <circle cx="10" cy="8" r="1" />
                  <circle cx="14" cy="8" r="1" />
                </svg>
              </div>

              <div className="flex-1 sm:flex-none">
                <h2
                  className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2"
                  style={{ fontFamily: '"Raleway", sans-serif' }}
                >
                  Snake
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
                  Classic snake game - eat, grow, survive!
                </p>

                {/* Tags */}
                <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-4">
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 glass-stat text-green-400 text-[10px] sm:text-xs rounded-full border-green-500/20">
                    Classic
                  </span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 glass-stat text-pink-400 text-[10px] sm:text-xs rounded-full border-pink-500/20">
                    Arcade
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Keyboard shortcut hint */}
        <p className="text-gray-500 text-[10px] sm:text-xs mt-4 sm:mt-6 md:mt-8 hidden sm:block">
          Press <kbd className="px-1.5 py-0.5 mx-0.5 rounded bg-gray-800 text-gray-400 font-mono">1</kbd>
          <kbd className="px-1.5 py-0.5 mx-0.5 rounded bg-gray-800 text-gray-400 font-mono">2</kbd>
          <kbd className="px-1.5 py-0.5 mx-0.5 rounded bg-gray-800 text-gray-400 font-mono">3</kbd>
          to quick start a game
        </p>
      </div>
    </div>
  );
};

export default GameSelector;
