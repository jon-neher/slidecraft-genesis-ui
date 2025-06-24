
// Enhanced color validation system with comprehensive brand color support
export const brandColors = {
  // Primary Brand Colors
  'electric-indigo': '#5A2EFF',
  'slate-gray': '#3A3D4D', 
  'ice-white': '#FAFAFB',
  'neon-mint': '#30F2B3',
  'soft-coral': '#FF6B6B',
  
  // Neutral Colors
  'white': '#FFFFFF',
  'gray-50': '#F9FAFB',
  'gray-100': '#F3F4F6',
  'gray-200': '#E5E7EB',
  'gray-300': '#D1D5DB',
  'gray-400': '#9CA3AF',
  'gray-500': '#6B7280',
  'gray-600': '#4B5563',
  'gray-700': '#374151',
  'gray-800': '#1F2937',
  'gray-900': '#111827',
} as const;

export const colorTokens = {
  backgrounds: {
    primary: 'bg-ice-white',
    secondary: 'bg-white', 
    accent: 'bg-electric-indigo',
    success: 'bg-neon-mint',
    muted: 'bg-gray-50',
    card: 'bg-white'
  },
  text: {
    primary: 'text-slate-gray',
    secondary: 'text-gray-600',
    accent: 'text-electric-indigo',
    success: 'text-neon-mint',
    muted: 'text-gray-500',
    inverse: 'text-ice-white'
  },
  borders: {
    primary: 'border-gray-200',
    secondary: 'border-gray-300',
    accent: 'border-electric-indigo',
    success: 'border-neon-mint'
  }
} as const;

export type BrandColor = keyof typeof brandColors;
export type ColorToken = typeof colorTokens;

// Validation function to check if a color class uses approved brand colors
export const validateColorClass = (colorClass: string): boolean => {
  const approvedClasses = [
    ...Object.values(colorTokens.backgrounds),
    ...Object.values(colorTokens.text), 
    ...Object.values(colorTokens.borders),
    // Additional approved Tailwind classes using our brand colors
    'bg-electric-indigo', 'text-electric-indigo', 'border-electric-indigo',
    'bg-slate-gray', 'text-slate-gray', 'border-slate-gray',
    'bg-ice-white', 'text-ice-white', 'border-ice-white',
    'bg-neon-mint', 'text-neon-mint', 'border-neon-mint',
    'hover:bg-electric-indigo/90', 'hover:bg-neon-mint/90',
    'bg-transparent', 'text-transparent'
  ];
  
  return approvedClasses.some(approved => colorClass.includes(approved));
};

// Helper to get consistent color combinations for components
export const getColorCombination = (variant: 'default' | 'accent' | 'success' | 'muted') => {
  switch (variant) {
    case 'accent':
      return {
        background: 'bg-electric-indigo',
        text: 'text-ice-white',
        border: 'border-electric-indigo',
        hover: 'hover:bg-electric-indigo/90'
      };
    case 'success':
      return {
        background: 'bg-neon-mint',
        text: 'text-slate-gray',
        border: 'border-neon-mint',
        hover: 'hover:bg-neon-mint/90'
      };
    case 'muted':
      return {
        background: 'bg-gray-50',
        text: 'text-gray-600',
        border: 'border-gray-200',
        hover: 'hover:bg-gray-100'
      };
    default:
      return {
        background: 'bg-white',
        text: 'text-slate-gray',
        border: 'border-gray-200',
        hover: 'hover:bg-gray-50'
      };
  }
};

// Utility to generate safe color classes
export const safeColor = {
  bg: {
    primary: 'bg-ice-white',
    secondary: 'bg-white',
    accent: 'bg-electric-indigo',
    success: 'bg-neon-mint',
    muted: 'bg-gray-50'
  },
  text: {
    primary: 'text-slate-gray',
    secondary: 'text-gray-600', 
    accent: 'text-electric-indigo',
    success: 'text-neon-mint',
    inverse: 'text-ice-white'
  },
  border: {
    primary: 'border-gray-200',
    accent: 'border-electric-indigo',
    success: 'border-neon-mint'
  }
} as const;

// Build-time color validation (for development)
export const auditColors = (cssClasses: string[]): string[] => {
  const violations = cssClasses.filter(cls => 
    cls.includes('yellow') || 
    cls.includes('orange') || 
    cls.includes('amber') ||
    (cls.includes('bg-') && !validateColorClass(cls)) ||
    (cls.includes('text-') && !validateColorClass(cls))
  );
  
  if (violations.length > 0) {
    console.warn('⚠️ Brand color violations found:', violations);
  }
  
  return violations;
};
