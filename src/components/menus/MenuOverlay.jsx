import React from 'react';
import { GAME_STATES } from '../../constants/gameConstants';
import StartMenu from './StartMenu';
import PauseMenu from './PauseMenu';
import GameOverMenu from './GameOverMenu';
import LevelCompleteMenu from './LevelCompleteMenu';

const MenuOverlay = ({
  gameState,
  score,
  highScore,
  isFadingOut,
  onStart,
  onResume,
  onRestart,
  onMainMenu,
  onNextLevel,
  onBack,
}) => {
  const shouldShow =
    gameState === GAME_STATES.START_MENU ||
    gameState === GAME_STATES.PAUSED ||
    gameState === GAME_STATES.GAME_OVER ||
    gameState === GAME_STATES.LEVEL_COMPLETE;

  if (!shouldShow && !isFadingOut) {
    return null;
  }

  return (
    <div
      className={`overlay ${isFadingOut ? 'fade-out' : ''}`}
      style={{ display: shouldShow || isFadingOut ? 'flex' : 'none' }}
    >
      {gameState === GAME_STATES.START_MENU && (
        <StartMenu onStart={onStart} onBack={onBack} />
      )}
      {gameState === GAME_STATES.PAUSED && (
        <PauseMenu
          onResume={onResume}
          onRestart={onRestart}
          onMainMenu={onMainMenu}
        />
      )}
      {gameState === GAME_STATES.GAME_OVER && (
        <GameOverMenu
          score={score}
          highScore={highScore}
          onRestart={onRestart}
          onMainMenu={onMainMenu}
        />
      )}
      {gameState === GAME_STATES.LEVEL_COMPLETE && (
        <LevelCompleteMenu
          score={score}
          onNextLevel={onNextLevel}
          onMainMenu={onMainMenu}
        />
      )}
    </div>
  );
};

export default MenuOverlay;
