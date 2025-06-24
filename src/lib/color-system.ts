
// Comprehensive color system utilities for consistent brand application

import { brandColors, getColorCombination } from './color-validation';

// Component-specific color presets
export const componentColors = {
  button: {
    primary: 'bg-electric-indigo text-ice-white hover:bg-electric-indigo/90',
    secondary: 'bg-white text-slate-gray border border-gray-200 hover:bg-gray-50',
    success: 'bg-neon-mint text-slate-gray hover:bg-neon-mint/90',
    ghost: 'hover:bg-gray-100 text-slate-gray',
    destructive: 'bg-red-500 text-ice-white hover:bg-red-500/90'
  },
  card: {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg border border-gray-100',
    muted: 'bg-gray-50 border border-gray-200',
    highlight: 'bg-electric-indigo/5 border border-electric-indigo/20'
  },
  input: {
    default: 'bg-white border border-gray-200 text-slate-gray placeholder:text-gray-500',
    focus: 'focus:border-electric-indigo focus:ring-2 focus:ring-electric-indigo/20',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
  },
  text: {
    heading: 'text-slate-gray',
    body: 'text-gray-600',
    caption: 'text-gray-500',
    accent: 'text-electric-indigo',
    success: 'text-neon-mint',
    error: 'text-red-500'
  }
} as const;

// Color theme generator for consistent application
export const generateTheme = (variant: 'light' | 'dark' = 'light') => {
  if (variant === 'light') {
    return {
      background: 'bg-ice-white',
      surface: 'bg-white',
      primary: 'bg-electric-indigo',
      secondary: 'bg-gray-100',
      accent: 'bg-neon-mint',
      text: {
        primary: 'text-slate-gray',
        secondary: 'text-gray-600',
        inverse: 'text-ice-white'
      },
      border: {
        default: 'border-gray-200',
        accent: 'border-electric-indigo'
      }
    };
  }
  
  // Future dark theme support
  return {
    background: 'bg-slate-gray',
    surface: 'bg-gray-800',
    primary: 'bg-electric-indigo',
    secondary: 'bg-gray-700',
    accent: 'bg-neon-mint',
    text: {
      primary: 'text-ice-white',
      secondary: 'text-gray-300',
      inverse: 'text-slate-gray'
    },
    border: {
      default: 'border-gray-600',
      accent: 'border-electric-indigo'
    }
  };
};

// Utility for creating consistent color schemes
export const createColorScheme = (baseColor: keyof typeof brandColors) => {
  const base = brandColors[baseColor];
  
  return {
    50: `${base}0D`,   // 5% opacity
    100: `${base}1A`,  // 10% opacity  
    200: `${base}33`,  // 20% opacity
    300: `${base}4D`,  // 30% opacity
    400: `${base}66`,  // 40% opacity
    500: base,         // Full color
    600: `${base}CC`,  // 80% opacity
    700: `${base}B3`,  // 70% opacity
    800: `${base}99`,  // 60% opacity
    900: `${base}80`   // 50% opacity
  };
};

// Brand-safe gradient generator
export const brandGradients = {
  primary: 'bg-gradient-to-r from-electric-indigo to-neon-mint',
  subtle: 'bg-gradient-to-r from-electric-indigo/10 to-neon-mint/10',
  hero: 'bg-gradient-to-br from-ice-white to-gray-50',
  card: 'bg-gradient-to-br from-white to-gray-50'
} as const;

// Export commonly used color combinations
export { componentColors as colors };
export type ComponentColors = typeof componentColors;
export type BrandGradient = keyof typeof brandGradients;
