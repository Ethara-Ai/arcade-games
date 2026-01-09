# Arcade Games Collection

A collection of classic arcade games built with React, featuring modern design, smooth animations, and responsive layouts for both desktop and mobile devices.

## Games Included

### 1. Brickrush
A classic brick breaker game with power-ups and multiple levels. Break all the bricks using a paddle and ball while collecting power-ups to gain advantages.

### 2. 1024
A sliding puzzle game where you combine tiles with the same numbers to reach the target of 1024. Plan your moves carefully to avoid running out of space.

### 3. Snake
The timeless snake game where you guide a snake to eat food and grow longer. Avoid hitting walls or your own tail as the speed increases.

## Features

- Classic Gameplay: Faithful recreations of beloved arcade games
- Multiple Levels: Brickrush features 8 unique levels with different patterns
- Power-ups: Collect multiball and stretch paddle power-ups in Brickrush
- High Score System: Scores are persisted locally for each game
- Responsive Design: Optimized for desktop, tablet, and mobile devices
- Smooth Animations: Modern visual effects and transitions
- Multiple Control Options: Keyboard, mouse, and touch support
- Keyboard Shortcuts: Quick game selection and navigation
- Dark Theme: Eye-friendly dark interface

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/arcade-games.git
   ```

2. Navigate to the project directory:
   ```bash
   cd arcade-games
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

The application supports optional environment variables for configuration. Copy `.env.example` to `.env` and modify as needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_APP_NAME` | Arcade Games | Application name |
| `VITE_APP_VERSION` | 1.0.0 | Application version |
| `VITE_STORAGE_PREFIX` | arcade_ | Prefix for localStorage keys |
| `VITE_DEBUG_MODE` | false | Enable debug console logging |

## Controls

### Game Selector
| Key | Action |
|-----|--------|
| 1 | Open Brickrush |
| 2 | Open 1024 |
| 3 | Open Snake |

### Start Menu
| Key | Action |
|-----|--------|
| Enter | Start the game |

### Brickrush

#### Desktop
| Input | Action |
|-------|--------|
| Mouse Movement | Move paddle |
| Arrow Keys / A, D | Move paddle |
| Space / Click | Launch ball |
| P / Escape | Pause/Resume |

#### Mobile
| Input | Action |
|-------|--------|
| Touch and Drag | Move paddle |
| Tap | Launch ball |
| Pause Button | Pause game |

### 1024

#### Desktop
| Input | Action |
|-------|--------|
| Arrow Keys | Move tiles |
| W, A, S, D | Move tiles |
| P / Escape | Pause/Resume |

#### Mobile
| Input | Action |
|-------|--------|
| Swipe | Move tiles |

### Snake

#### Desktop
| Input | Action |
|-------|--------|
| Arrow Keys | Change direction |
| W, A, S, D | Change direction |
| P / Space | Pause/Resume |

#### Mobile
| Input | Action |
|-------|--------|
| Swipe | Change direction |
| Tap | Start game |

## Project Structure

```
arcade-games/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI pipeline for PRs
│       └── deploy.yml          # CD pipeline for deployment
├── src/
│   ├── components/
│   │   ├── controls/
│   │   │   ├── DesktopControls.jsx
│   │   │   └── MobileControls.jsx
│   │   ├── Game1024/
│   │   │   ├── Game1024.jsx
│   │   │   └── Tile.jsx
│   │   ├── menus/
│   │   │   ├── GameOverMenu.jsx
│   │   │   ├── LevelCompleteMenu.jsx
│   │   │   ├── MenuOverlay.jsx
│   │   │   ├── PauseMenu.jsx
│   │   │   └── StartMenu.jsx
│   │   ├── shared/
│   │   │   ├── GameResultCard.jsx
│   │   │   └── HowToPlayModal.jsx
│   │   ├── SnakeGame/
│   │   │   └── SnakeGame.jsx
│   │   ├── GameCanvas.jsx
│   │   ├── GameSelector.jsx
│   │   ├── LoadingScreen.jsx
│   │   └── TopBar.jsx
│   ├── config/
│   │   └── index.js            # Environment configuration
│   ├── constants/
│   │   ├── game1024Constants.js
│   │   ├── gameConstants.js
│   │   ├── patterns.js
│   │   └── snakeConstants.js
│   ├── hooks/
│   │   ├── useGameLoop.js
│   │   ├── useHighScore.js
│   │   ├── useKeyboard.js
│   │   └── useWindowSize.js
│   ├── utils/
│   │   └── game1024Logic.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

## Game Mechanics

### Brickrush

#### Bricks
- Regular bricks are destroyed with one hit
- Steel bricks (silver) are indestructible and reflect the ball
- Some bricks contain power-ups indicated by symbols

#### Power-ups
- M (Multiball): Spawns 2 additional balls
- S (Stretch Paddle): Temporarily increases paddle width for 10 seconds

#### Scoring
- Points = 10 x Current Level per brick destroyed
- Higher levels award more points per brick

#### Lives
- Start with 3 lives
- Lose a life when all balls fall below the paddle
- Game over when all lives are lost

### 1024

#### Gameplay
- Slide tiles in any direction using arrow keys or swipe
- Tiles with the same number merge when they collide
- Each merge adds the combined value to your score
- New tiles (2 or 4) appear after each move
- Reach 1024 to win, or continue playing for a higher score
- Game ends when no more moves are possible

### Snake

#### Gameplay
- Control the snake to eat food and grow longer
- Pink food gives 10 points
- Golden bonus food gives 50 points (appears randomly)
- Snake speeds up as you eat more food
- Game ends if you hit a wall or your own tail

## Tech Stack

- React 18 - UI framework with hooks
- Vite - Fast build tool and development server
- Tailwind CSS - Utility-first CSS framework
- HTML5 Canvas - Game rendering for Brickrush and Snake
- React Icons - Icon library

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |

## Building for Production

```bash
npm run build
```

The optimized production files will be generated in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

This will serve the production build locally for testing.

## Deployment

This project includes a GitHub Actions CI/CD pipeline for automatic deployment.

### CI Pipeline

The CI pipeline runs on all pull requests and pushes:
- Installs dependencies
- Builds the application
- Uploads build artifacts for pull requests

### CD Pipeline

The deployment pipeline triggers on:
- Push to `main` branch
- Manual workflow dispatch

### GitHub Secrets Configuration

Add the following secrets to your GitHub repository (Settings > Secrets and variables > Actions):

| Secret | Description |
|--------|-------------|
| `SSH_HOST` | Server hostname or IP address |
| `SSH_USER` | SSH username |
| `SSH_PRIVATE_KEY` | SSH private key for authentication |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## Performance

- Optimized canvas rendering with requestAnimationFrame
- Efficient React component updates
- Responsive images and assets
- Minimal bundle size with Vite tree-shaking

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome. Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## Acknowledgments

- Inspired by classic arcade games
- Built with modern web technologies
- Designed for accessibility and responsiveness