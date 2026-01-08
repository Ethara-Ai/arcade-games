const PauseMenu = ({ onResume, onRestart, onMainMenu }) => {
  return (
    <div id="pauseMenu" className="glass-overlay">
      <div className="menu-content">
        {/* Glass panel container */}
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-sm mx-3 sm:mx-4">
          <div
            className="text-2xl sm:text-3xl md:text-4xl font-black text-cyan-400 mb-4 sm:mb-6 md:mb-8 text-center"
            style={{
              fontFamily: '"Raleway", sans-serif',
              textShadow: "0 0 30px rgba(0, 209, 255, 0.5)",
            }}
          >
            Paused
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            <button
              onClick={onResume}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold cursor-pointer rounded-lg sm:rounded-xl shadow-lg shadow-green-400/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-400/50 active:scale-95 focus:outline-none py-3 sm:py-4 text-sm sm:text-base"
            >
              Resume (P)
            </button>
            <button
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold cursor-pointer rounded-lg sm:rounded-xl shadow-lg shadow-cyan-400/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/50 active:scale-95 focus:outline-none py-3 sm:py-4 text-sm sm:text-base"
            >
              Restart
            </button>
            <button
              onClick={onMainMenu}
              className="w-full glass-button text-gray-300 font-semibold cursor-pointer rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none py-3 sm:py-4 text-sm sm:text-base"
            >
              Main Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
