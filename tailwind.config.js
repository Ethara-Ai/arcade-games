/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["Raleway", "Arial", "sans-serif"],
      },
      colors: {
        'game-bg': '#121212',
        'game-overlay': '#1e1e1e',
        'game-cyan': '#00d1ff',
        'game-pink': '#ff4081',
        'game-orange': '#f9a825',
        'game-blue': '#29b6f6',
        'game-green': '#66bb6a',
        'game-red': '#ff1744',
      },
      animation: {
        'gradient-move': 'gradientMove 4s linear infinite',
        'title-pulse': 'titlePulse 2s ease-in-out infinite alternate',
        'subtitle-glow': 'subtitleGlow 3s ease-in-out infinite alternate',
        'spin-slow': 'spin 1.2s linear infinite',
        'spinner-glow': 'spinnerGlow 2s ease-in-out infinite alternate',
        'progress-load': 'progressLoad 2.8s ease-out forwards',
        'progress-glow': 'progressGlow 1s ease-in-out infinite alternate',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'game-start': 'gameStart 0.8s ease-out forwards',
      },
      keyframes: {
        gradientMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        titlePulse: {
          '0%': { filter: 'drop-shadow(0 0 20px #00d1ff44)' },
          '100%': { filter: 'drop-shadow(0 0 30px #00d1ff66)' },
        },
        subtitleGlow: {
          '0%': { textShadow: '0 2px 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 209, 255, 0.2)' },
          '100%': { textShadow: '0 2px 15px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 209, 255, 0.4)' },
        },
        spinnerGlow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 209, 255, 0.4), 0 0 40px rgba(0, 209, 255, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 209, 255, 0.6), 0 0 60px rgba(0, 209, 255, 0.3)' },
        },
        progressLoad: {
          '0%': { width: '0%' },
          '30%': { width: '25%' },
          '60%': { width: '70%' },
          '90%': { width: '95%' },
          '100%': { width: '100%' },
        },
        progressGlow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 209, 255, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 209, 255, 0.8), 0 0 30px rgba(0, 209, 255, 0.4)' },
        },
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        gameStart: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
