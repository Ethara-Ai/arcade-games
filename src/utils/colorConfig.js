/**
 * Shared color configuration utility
 * Provides consistent theming across all game components
 */

// Available accent colors
export const ACCENT_COLORS = ['cyan', 'green', 'amber', 'pink', 'red', 'yellow'];

/**
 * Complete color configuration for each accent color
 * Used across menus, modals, cards, and other UI components
 */
export const colorConfig = {
  cyan: {
    // Text colors
    titleColor: 'text-cyan-400',
    text: 'text-cyan-400',
    statText: 'text-cyan-400',

    // Gradients
    gradient: 'from-cyan-400 to-blue-500',
    primaryGradient: 'from-cyan-400 to-blue-500',
    iconGradient: 'from-cyan-400 to-blue-500',

    // Borders
    border: 'border-cyan-500/10',
    borderAccent: 'border-cyan-500/20',
    statBorder: 'border-cyan-500/20',
    helpBorder: 'border-cyan-400/30',
    helpHoverBorder: 'hover:border-cyan-400/50',
    hoverBorder: 'hover:border-cyan-500/30',
    badgeBorder: 'border-cyan-500/30',
    speedBorder: 'border-cyan-500/20',

    // Shadows
    shadow: 'shadow-cyan-500/20',
    iconShadow: 'shadow-cyan-500/40',
    primaryShadow: 'shadow-cyan-400/30',
    primaryHoverShadow: 'hover:shadow-cyan-400/50',
    hoverShadow: 'hover:shadow-xl hover:shadow-cyan-400/60',
    activeShadow: 'active:shadow-lg active:shadow-cyan-400/40',
    buttonShadow: 'shadow-cyan-400/30',

    // Backgrounds
    bg: 'bg-cyan-500/10',
    bgAccent: 'bg-cyan-500/10',
    glowBg: 'bg-cyan-500/20',
    glow: 'bg-cyan-500/20',

    // Text shadows (inline styles)
    titleShadow: '0 0 30px rgba(0, 209, 255, 0.5)',

    // Badge
    badgeText: 'text-cyan-400',

    // Tag colors
    tagText: 'text-cyan-400',
    tagBorder: 'border-cyan-500/20',
  },

  green: {
    // Text colors
    titleColor: 'text-green-400',
    text: 'text-green-400',
    statText: 'text-green-400',

    // Gradients
    gradient: 'from-green-400 to-emerald-500',
    primaryGradient: 'from-green-400 to-emerald-500',
    iconGradient: 'from-green-400 to-emerald-500',

    // Borders
    border: 'border-green-500/10',
    borderAccent: 'border-green-500/20',
    statBorder: 'border-green-500/20',
    helpBorder: 'border-green-400/30',
    helpHoverBorder: 'hover:border-green-400/50',
    hoverBorder: 'hover:border-green-500/30',
    badgeBorder: 'border-green-500/30',
    speedBorder: 'border-green-500/20',

    // Shadows
    shadow: 'shadow-green-500/20',
    iconShadow: 'shadow-green-500/40',
    primaryShadow: 'shadow-green-400/30',
    primaryHoverShadow: 'hover:shadow-green-400/50',
    hoverShadow: 'hover:shadow-xl hover:shadow-green-400/60',
    activeShadow: 'active:shadow-lg active:shadow-green-400/40',
    buttonShadow: 'shadow-green-400/30',

    // Backgrounds
    bg: 'bg-green-500/10',
    bgAccent: 'bg-green-500/10',
    glowBg: 'bg-green-500/20',
    glow: 'bg-green-500/20',

    // Text shadows (inline styles)
    titleShadow: '0 0 30px rgba(74, 222, 128, 0.5)',

    // Badge
    badgeText: 'text-green-400',

    // Tag colors
    tagText: 'text-green-400',
    tagBorder: 'border-green-500/20',
  },

  amber: {
    // Text colors
    titleColor: 'text-amber-400',
    text: 'text-amber-400',
    statText: 'text-amber-400',

    // Gradients
    gradient: 'from-amber-400 to-orange-500',
    primaryGradient: 'from-amber-400 to-orange-500',
    iconGradient: 'from-amber-400 to-orange-500',

    // Borders
    border: 'border-amber-500/10',
    borderAccent: 'border-amber-500/20',
    statBorder: 'border-amber-500/20',
    helpBorder: 'border-amber-400/30',
    helpHoverBorder: 'hover:border-amber-400/50',
    hoverBorder: 'hover:border-amber-500/30',
    badgeBorder: 'border-amber-500/30',
    speedBorder: 'border-amber-500/20',

    // Shadows
    shadow: 'shadow-amber-500/20',
    iconShadow: 'shadow-amber-500/40',
    primaryShadow: 'shadow-amber-400/30',
    primaryHoverShadow: 'hover:shadow-amber-400/50',
    hoverShadow: 'hover:shadow-xl hover:shadow-amber-400/60',
    activeShadow: 'active:shadow-lg active:shadow-amber-400/40',
    buttonShadow: 'shadow-amber-400/30',

    // Backgrounds
    bg: 'bg-amber-500/10',
    bgAccent: 'bg-amber-500/10',
    glowBg: 'bg-amber-500/20',
    glow: 'bg-amber-500/20',

    // Text shadows (inline styles)
    titleShadow: '0 0 30px rgba(251, 191, 36, 0.5)',

    // Badge
    badgeText: 'text-amber-400',

    // Tag colors
    tagText: 'text-amber-400',
    tagBorder: 'border-amber-500/20',
  },

  pink: {
    // Text colors
    titleColor: 'text-pink-400',
    text: 'text-pink-400',
    statText: 'text-pink-400',

    // Gradients
    gradient: 'from-pink-400 to-rose-500',
    primaryGradient: 'from-pink-400 to-rose-500',
    iconGradient: 'from-pink-400 to-rose-500',

    // Borders
    border: 'border-pink-500/10',
    borderAccent: 'border-pink-500/20',
    statBorder: 'border-pink-500/20',
    helpBorder: 'border-pink-400/30',
    helpHoverBorder: 'hover:border-pink-400/50',
    hoverBorder: 'hover:border-pink-500/30',
    badgeBorder: 'border-pink-500/30',
    speedBorder: 'border-pink-500/20',

    // Shadows
    shadow: 'shadow-pink-500/20',
    iconShadow: 'shadow-pink-500/40',
    primaryShadow: 'shadow-pink-400/30',
    primaryHoverShadow: 'hover:shadow-pink-400/50',
    hoverShadow: 'hover:shadow-xl hover:shadow-pink-400/60',
    activeShadow: 'active:shadow-lg active:shadow-pink-400/40',
    buttonShadow: 'shadow-pink-400/30',

    // Backgrounds
    bg: 'bg-pink-500/10',
    bgAccent: 'bg-pink-500/10',
    glowBg: 'bg-pink-500/20',
    glow: 'bg-pink-500/20',

    // Text shadows (inline styles)
    titleShadow: '0 0 30px rgba(236, 72, 153, 0.5)',

    // Badge
    badgeText: 'text-pink-400',

    // Tag colors
    tagText: 'text-pink-400',
    tagBorder: 'border-pink-500/20',
  },

  red: {
    // Text colors
    titleColor: 'text-red-500',
    text: 'text-red-400',
    statText: 'text-cyan-400', // Red theme uses cyan for stats

    // Gradients
    gradient: 'from-cyan-400 to-blue-500', // Red theme uses cyan gradient for buttons
    primaryGradient: 'from-cyan-400 to-blue-500',
    iconGradient: 'from-red-400 to-rose-500',

    // Borders
    border: 'border-red-500/10',
    borderAccent: 'border-red-500/20',
    statBorder: 'border-cyan-500/20',
    helpBorder: 'border-red-400/30',
    helpHoverBorder: 'hover:border-red-400/50',
    hoverBorder: 'hover:border-red-500/30',
    badgeBorder: 'border-red-500/30',
    speedBorder: 'border-red-500/20',

    // Shadows
    shadow: 'shadow-red-400/40',
    iconShadow: 'shadow-red-500/40',
    primaryShadow: 'shadow-cyan-400/30',
    primaryHoverShadow: 'hover:shadow-cyan-400/50',
    hoverShadow: 'hover:shadow-xl hover:shadow-red-400/60',
    activeShadow: 'active:shadow-lg active:shadow-red-400/40',
    buttonShadow: 'shadow-red-400/30',

    // Backgrounds
    bg: 'bg-red-500/10',
    bgAccent: 'bg-red-500/10',
    glowBg: 'bg-red-500/20',
    glow: 'bg-red-500/20',

    // Text shadows (inline styles)
    titleShadow: '0 0 30px rgba(255, 23, 68, 0.5)',

    // Badge
    badgeText: 'text-red-400',

    // Tag colors
    tagText: 'text-red-400',
    tagBorder: 'border-red-500/20',
  },

  yellow: {
    // Text colors
    titleColor: 'text-yellow-400',
    text: 'text-yellow-400',
    statText: 'text-yellow-400',

    // Gradients
    gradient: 'from-yellow-400 to-orange-500',
    primaryGradient: 'from-yellow-400 to-orange-500',
    iconGradient: 'from-yellow-400 to-orange-500',

    // Borders
    border: 'border-yellow-500/10',
    borderAccent: 'border-yellow-500/20',
    statBorder: 'border-yellow-500/20',
    helpBorder: 'border-yellow-400/30',
    helpHoverBorder: 'hover:border-yellow-400/50',
    hoverBorder: 'hover:border-yellow-500/30',
    badgeBorder: 'border-yellow-500/30',
    speedBorder: 'border-yellow-500/20',

    // Shadows
    shadow: 'shadow-yellow-400/40',
    iconShadow: 'shadow-yellow-500/40',
    primaryShadow: 'shadow-yellow-400/30',
    primaryHoverShadow: 'hover:shadow-yellow-400/50',
    hoverShadow: 'hover:shadow-xl hover:shadow-yellow-400/60',
    activeShadow: 'active:shadow-lg active:shadow-yellow-400/40',
    buttonShadow: 'shadow-yellow-400/30',

    // Backgrounds
    bg: 'bg-yellow-500/10',
    bgAccent: 'bg-yellow-500/10',
    glowBg: 'bg-yellow-500/20',
    glow: 'bg-yellow-500/20',

    // Text shadows (inline styles)
    titleShadow: '0 0 30px rgba(251, 191, 36, 0.5)',

    // Badge
    badgeText: 'text-yellow-400',

    // Tag colors
    tagText: 'text-yellow-400',
    tagBorder: 'border-yellow-500/20',
  },
};

/**
 * Tag-specific color configuration for game cards
 */
export const tagColorConfig = {
  cyan: { text: 'text-cyan-400', border: 'border-cyan-500/20' },
  amber: { text: 'text-amber-400', border: 'border-amber-500/20' },
  green: { text: 'text-green-400', border: 'border-green-500/20' },
  pink: { text: 'text-pink-400', border: 'border-pink-500/20' },
  yellow: { text: 'text-yellow-400', border: 'border-yellow-500/20' },
  red: { text: 'text-red-400', border: 'border-red-500/20' },
};

/**
 * Get color configuration for an accent color with fallback
 * @param {string} accentColor - The accent color name
 * @param {string} fallback - Fallback color if accent not found (default: 'cyan')
 * @returns {Object} Color configuration object
 */
export const getColorConfig = (accentColor, fallback = 'cyan') => {
  return colorConfig[accentColor] || colorConfig[fallback];
};

/**
 * Get tag color configuration with fallback
 * @param {string} tagColor - The tag color name
 * @param {string} fallback - Fallback color if not found (default: 'cyan')
 * @returns {Object} Tag color configuration object
 */
export const getTagColorConfig = (tagColor, fallback = 'cyan') => {
  return tagColorConfig[tagColor] || tagColorConfig[fallback];
};

export default colorConfig;
