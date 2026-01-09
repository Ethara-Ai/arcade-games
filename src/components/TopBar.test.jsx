import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TopBar from './TopBar';
import { GAME_STATES } from '../constants';

describe('TopBar', () => {
  // Step 1: Test that TopBar renders when game is playing
  // The TopBar should be visible during active gameplay
  it('renders when game state is PLAYING', () => {
    render(<TopBar gameState={GAME_STATES.PLAYING} score={100} level={2} lives={3} />);
    
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Level')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Lives')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  // Step 2: Test TopBar renders when paused
  // TopBar should remain visible when game is paused
  it('renders when game state is PAUSED', () => {
    render(<TopBar gameState={GAME_STATES.PAUSED} score={250} level={3} lives={2} />);
    
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  // Step 3: Test TopBar does not render for other game states
  // It should be hidden during menus and game over states
  it('does not render when game state is START_MENU', () => {
    const { container } = render(
      <TopBar gameState={GAME_STATES.START_MENU} score={0} level={1} lives={3} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('does not render when game state is GAME_OVER', () => {
    const { container } = render(
      <TopBar gameState={GAME_STATES.GAME_OVER} score={500} level={5} lives={0} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('does not render when game state is LEVEL_COMPLETE', () => {
    const { container } = render(
      <TopBar gameState={GAME_STATES.LEVEL_COMPLETE} score={300} level={2} lives={3} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  // Step 4: Test that score, level, and lives update correctly
  // Ensures dynamic values are displayed properly
  it('displays correct values for score, level, and lives', () => {
    render(<TopBar gameState={GAME_STATES.PLAYING} score={9999} level={10} lives={5} />);
    
    expect(screen.getByText('9999')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
