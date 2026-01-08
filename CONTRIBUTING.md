# Contributing to Arcade Games Collection

Thank you for your interest in contributing to this project. This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please:

- Be respectful and considerate in all interactions
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community and project

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/arcade-games.git
   cd arcade-games
   ```
3. Add the upstream repository as a remote:
   ```bash
   git remote add upstream https://github.com/originalowner/arcade-games.git
   ```
4. Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How to Contribute

There are many ways to contribute to this project:

- Report bugs and issues
- Suggest new features or improvements
- Write or improve documentation
- Submit pull requests with bug fixes
- Add new games or game features
- Improve code quality and test coverage
- Help with code reviews

## Development Setup

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm (version 9 or higher)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Code Style Guidelines

### General Principles

- Write clean, readable, and maintainable code
- Follow the existing code style and patterns
- Keep functions small and focused on a single task
- Use meaningful variable and function names
- Add comments for complex logic, but prefer self-documenting code

### JavaScript/React

- Use functional components with hooks
- Use ES6+ syntax (arrow functions, destructuring, template literals)
- Prefer const over let, avoid var
- Use meaningful component and prop names
- Keep components focused and reusable
- Extract complex logic into custom hooks or utility functions

### File Naming

- Use PascalCase for component files (e.g., GameCanvas.jsx)
- Use camelCase for utility and hook files (e.g., useGameLoop.js)
- Use camelCase for constant files (e.g., gameConstants.js)

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use consistent spacing and sizing scales
- Group related classes logically

### Project Structure

```
src/
├── components/     # React components
│   ├── controls/   # Control-related components
│   ├── menus/      # Menu components
│   ├── shared/     # Reusable shared components
│   └── [Game]/     # Game-specific components
├── constants/      # Game constants and configuration
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── App.jsx         # Main application component
├── index.css       # Global styles
└── main.jsx        # Application entry point
```

## Commit Guidelines

### Commit Message Format

Use clear, descriptive commit messages following this format:

```
type: short description

Optional longer description explaining the change in more detail.
```

### Commit Types

- `feat`: New feature or functionality
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, whitespace)
- `refactor`: Code refactoring without functionality changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates

### Examples

```
feat: add keyboard shortcuts for game selection

fix: resolve paddle movement lag on mobile devices

docs: update README with new game controls

refactor: extract game logic into separate utility functions
```

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Update documentation if needed
3. Test your changes thoroughly on different devices and browsers
4. Create a pull request with a clear title and description
5. Link any related issues in the PR description
6. Wait for code review and address any feedback
7. Once approved, your PR will be merged

### Pull Request Template

When creating a PR, include:

- Summary of changes
- Type of change (bug fix, feature, etc.)
- How the changes were tested
- Screenshots or recordings for UI changes
- Any breaking changes or migration steps

## Reporting Bugs

When reporting a bug, please include:

### Bug Report Template

**Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to...
2. Click on...
3. Observe...

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- Browser and version
- Device type (desktop/mobile/tablet)
- Operating system
- Screen size (if relevant)

**Screenshots**
If applicable, add screenshots to help explain the problem.

**Additional Context**
Any other relevant information.

## Suggesting Features

When suggesting a new feature, please include:

### Feature Request Template

**Description**
A clear description of the feature you would like.

**Use Case**
Explain why this feature would be useful and who would benefit.

**Proposed Solution**
If you have ideas on how to implement it, share them here.

**Alternatives Considered**
Any alternative solutions or features you have considered.

**Additional Context**
Any other relevant information, mockups, or examples.

## Questions and Support

If you have questions or need help:

1. Check existing issues and documentation first
2. Open a new issue with the "question" label
3. Provide as much context as possible

## Recognition

Contributors who make significant contributions will be recognized in the project documentation.

Thank you for contributing to Arcade Games Collection.
