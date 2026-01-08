# Project Prompt

I need you to act as a Senior React Developer to help me build an Arcade Games Collection featuring three classic games: Brickrush (a breakout-style brick breaker), 1024 (a sliding tile puzzle), and Snake. I am looking for a production-ready solution that follows a strict component-based architecture with multiple reusable components rather than putting everything into a single file.

First, please break the interface down into logical, reusable components such as a game selector screen, individual game components, menu overlays, control handlers, and shared UI elements. Organize them as if they were in a real project folder structure with separate directories for components, constants, hooks, and utilities. For the styling, use Tailwind CSS to ensure the application is responsive and modern, with support for desktop, tablet, and mobile devices.

Regarding the Brickrush game functionality, implement a canvas-based game that automatically adjusts the dimensions of the playfield while maintaining the aspect ratio. Create a dynamic paddle that can be controlled using mouse movement on desktop and touch drag on mobile. Implement a power-up system including multiball and stretchable paddle features. The game must include ball angle physics and brick collision detection optimized for performance on mobile devices. Design multiple levels with different brick patterns and include steel bricks that are indestructible.

For the 1024 game, implement a grid-based sliding tile puzzle where tiles with the same number merge when they collide. The game should support arrow key controls on desktop and swipe gestures on mobile. Include smooth tile animations for movement and merging, and detect win and game over conditions based on the grid state.

For the Snake game, create a canvas-based implementation where the snake grows when eating food. Implement two types of food: regular food and bonus food with different point values. The snake should speed up progressively as the score increases. Support arrow key and WASD controls on desktop with swipe gestures for mobile.

The application should include a game selector screen with animated elements and keyboard shortcuts for quick game selection. Each game must have overlay menus including start menu, pause menu, game over screen, and level complete screen with responsive touch targets and keyboard shortcuts. Implement state management using React hooks and refs to handle game state, scores, and user interactions. Ensure that high scores for each game persist via localStorage so that progress is not lost on page refresh.

Finally, please write clean, modular code with helpful comments explaining how the components interface with one another. Use functional components with React hooks throughout the project. Implement custom hooks for reusable game logic such as keyboard handling, window resizing, and game loops. Start by providing the directory structure, followed by the code for each file.
