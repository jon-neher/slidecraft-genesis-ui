
// Color validation utility to ensure consistent color usage
export const colorTokens = {
  backgrounds: {
    primary: 'bg-white',
    secondary: 'bg-gray-50',
    accent: 'bg-electric-indigo',
    muted: 'bg-gray-100'
  },
  text: {
    primary: 'text-slate-gray',
    secondary: 'text-gray-600',
    accent: 'text-electric-indigo',
    muted: 'text-gray-500'
  },
  borders: {
    primary: 'border-gray-200',
    secondary: 'border-gray-300',
    accent: 'border-electric-indigo'
  }
} as const;

export type ColorToken = typeof colorTokens;

// Validation function to check if a color class is valid
export const validateColorClass = (colorClass: string): boolean => {
  const allColors = Object.values(colorTokens).flatMap(category => Object.values(category));
  return allColors.includes(colorClass as any);
};

// Helper to get consistent color combinations
export const getColorCombination = (variant: 'default' | 'accent' | 'muted') => {
  switch (variant) {
    case 'accent':
      return {
        background: colorTokens.backgrounds.accent,
        text: 'text-white',
        border: colorTokens.borders.accent
      };
    case 'muted':
      return {
        background: colorTokens.backgrounds.muted,
        text: colorTokens.text.muted,
        border: colorTokens.borders.secondary
      };
    default:
      return {
        background: colorTokens.backgrounds.primary,
        text: colorTokens.text.primary,
        border: colorTokens.borders.primary
      };
  }
};
