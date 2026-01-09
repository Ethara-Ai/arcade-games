import { useEffect, useState, useCallback } from "react";
import {
  IoArrowBack,
  IoHelpCircle,
  IoPause,
  IoPlay,
  IoRefresh,
} from "react-icons/io5";
import { GAME_1024_STATES } from "../../constants";
import {
  StartMenu,
  PauseMenu,
  GameOverMenu,
  HowToPlayModal,
} from "../../components/shared";
import { useGame1024 } from "./hooks/useGame1024";
import { Game1024Board } from "./components";

// Game-specific content for menus
const GAME_1024_INSTRUCTIONS = [
  "Slide tiles in any direction using arrow keys or swipe",
  "When two tiles with the same number collide, they merge",
  "Create a tile with the number 1024 to win",
  "The game ends when no more moves are possible",
];

const GAME_1024_CONTROLS = [
  { key: "↑ ↓ ← →", action: "Move tiles" },
  { key: "W A S D", action: "Move tiles (alternative)" },
  { key: "Swipe", action: "Move tiles (touch)" },
];

const GAME_1024_TIPS = [
  "Keep your highest tile in a corner",
  "Build a chain of decreasing numbers",
  "Plan several moves ahead",
  "Don't chase small merges randomly",
];

/**
 * Game1024 - Container component for the 1024 game
 * Manages game state and composes UI components
 */
const Game1024 = ({ onBack }) => {
  // Game logic hook
  const {
    grid,
    score,
    bestScore,
    gameState,
    highestTile,
    handleStartGame,
    handleResume,
    handlePauseToggle,
    handleNewGame,
    handleContinue,
    handleKeyDown,
    handleTouchStart,
    handleTouchEnd,
  } = useGame1024();

  // UI state
  const [showHelp, setShowHelp] = useState(false);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e) => {
      handleKeyDown(e, showHelp);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKeyDown, showHelp]);

  // Check if game is active (playing or paused)
  const isGameActive =
    gameState === GAME_1024_STATES.PLAYING ||
    gameState === GAME_1024_STATES.PAUSED;

  const isPaused = gameState === GAME_1024_STATES.PAUSED;

  // Handle main menu navigation
  const handleMainMenu = useCallback(() => {
    onBack();
  }, [onBack]);

  return (
    <div className="game-1024-container flex flex-col items-center justify-center min-h-screen overflow-hidden p-4 bg-[#0a0a0a]">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Header with controls - visible when game is active */}
      {isGameActive && (
        <div className="relative z-20 flex items-center justify-between w-full max-w-[min(90vw,400px)] mb-4">
          {/* Back button - Black color to match dark UI */}
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600/40 rounded-full text-white flex items-center justify-center shadow-lg shadow-black/40 hover:scale-105 hover:border-gray-500/50 active:scale-95 transition-transform"
            title="Back to Game Selector"
          >
            <IoArrowBack />
          </button>

          {/* Title */}
          <h1
            className="text-2xl sm:text-3xl font-black text-amber-400"
            style={{
              fontFamily: '"Raleway", sans-serif',
              textShadow: "0 0 30px rgba(251, 191, 36, 0.5)",
            }}
          >
            1024
          </h1>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp(true)}
              className="w-10 h-10 glass-button rounded-full text-amber-400 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              title="How to Play"
            >
              <IoHelpCircle className="text-xl" />
            </button>
            <button
              onClick={handlePauseToggle}
              className={`w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform ${isPaused
                  ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-400/40"
                  : "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-400/40"
                }`}
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? <IoPlay /> : <IoPause />}
            </button>
            <button
              onClick={handleNewGame}
              className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full text-white flex items-center justify-center shadow-lg shadow-amber-400/40 hover:scale-105 active:scale-95 transition-transform"
              title="New Game"
            >
              <IoRefresh />
            </button>
          </div>
        </div>
      )}

      {/* Game Board - visible when game is active */}
      {isGameActive && (
        <div className="relative z-10">
          <Game1024Board
            grid={grid}
            score={score}
            bestScore={bestScore}
            highestTile={highestTile}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            accentColor="amber"
          />
        </div>
      )}

      {/* Start Menu */}
      {gameState === GAME_1024_STATES.START && (
        <StartMenu
          title="1024"
          description="Slide and merge tiles to reach 1024! Use arrow keys or swipe to move all tiles in a direction. When two tiles with the same number collide, they merge into one."
          accentColor="amber"
          onStart={handleStartGame}
          onBack={onBack}
          instructions={GAME_1024_INSTRUCTIONS}
          controls={GAME_1024_CONTROLS}
          tips={GAME_1024_TIPS}
        />
      )}

      {/* Pause Menu */}
      {gameState === GAME_1024_STATES.PAUSED && (
        <PauseMenu
          title="Paused"
          accentColor="amber"
          onResume={handleResume}
          onRestart={handleNewGame}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* Game Over Menu */}
      {gameState === GAME_1024_STATES.GAME_OVER && (
        <GameOverMenu
          title="Game Over"
          accentColor="amber"
          score={score}
          highScore={bestScore}
          onRestart={handleNewGame}
          onMainMenu={handleMainMenu}
          stats={[
            { label: "Score", value: score },
            { label: "Best", value: bestScore },
            { label: "Top Tile", value: highestTile },
          ]}
        />
      )}

      {/* Win Screen */}
      {gameState === GAME_1024_STATES.WON && (
        <div className="fixed inset-0 glass-overlay flex flex-col items-center justify-center z-50 p-4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 glass-panel rounded-3xl p-8 max-w-md w-full">
            <div className="flex flex-col items-center gap-4">
              <h2
                className="text-4xl font-black text-amber-400 text-center"
                style={{
                  fontFamily: '"Raleway", sans-serif',
                  textShadow: "0 0 30px rgba(251, 191, 36, 0.5)",
                }}
              >
                🎉 You Win! 🎉
              </h2>
              <p className="text-gray-300 text-center">
                Congratulations! You reached 1024!
              </p>

              <div className="flex gap-4 my-2">
                <div className="glass-stat border-amber-500/20 rounded-xl px-6 py-3 text-center">
                  <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                    Score
                  </div>
                  <div className="text-2xl font-bold text-white">{score}</div>
                </div>
              </div>

              <div className="flex gap-3 mt-2 w-full">
                <button
                  onClick={handleContinue}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-amber-400/30"
                >
                  Keep Playing
                </button>
                <button
                  onClick={handleNewGame}
                  className="flex-1 px-6 py-3 glass-button text-gray-300 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-transform"
                >
                  New Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        gameName="1024"
        accentColor="amber"
        instructions={GAME_1024_INSTRUCTIONS}
        controls={GAME_1024_CONTROLS}
        tips={GAME_1024_TIPS}
      />
    </div>
  );
};

export default Game1024;
