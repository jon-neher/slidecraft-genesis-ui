
// Build-time and runtime color compliance system
import { initColorChecker } from './color-audit';

// Initialize color checking system
export const initColorCompliance = () => {
  // Initialize runtime checker in development
  if (process.env.NODE_ENV === 'development') {
    initColorChecker();
    
    // Add global color violation detector (less aggressive)
    const detectColorViolations = () => {
      try {
        const allElements = document.querySelectorAll('*');
        const violations: HTMLElement[] = [];
        
        // Only check first 100 elements to avoid performance issues
        const elementsToCheck = Array.from(allElements).slice(0, 100);
        
        elementsToCheck.forEach((element) => {
          const computedStyle = window.getComputedStyle(element);
          const backgroundColor = computedStyle.backgroundColor;
          
          // Check for yellow/amber/orange colors in computed styles
          if (
            backgroundColor.includes('rgb(255, 255, 0)') || // yellow
            backgroundColor.includes('rgb(255, 193, 7)') ||  // amber
            backgroundColor.includes('rgb(255, 152, 0)') ||  // orange
            backgroundColor.includes('yellow') ||
            backgroundColor.includes('amber') ||
            backgroundColor.includes('orange')
          ) {
            violations.push(element as HTMLElement);
            console.warn('🚨 Computed style violation detected:', {
              element,
              backgroundColor,
              className: element.className
            });
          }
        });
        
        // Mark violations visually in development
        violations.forEach(element => {
          element.classList.add('color-violation');
        });
        
        return violations;
      } catch (error) {
        console.warn('Color compliance check failed:', error);
        return [];
      }
    };
    
    // Run initial check after DOM is ready with delay
    setTimeout(() => {
      detectColorViolations();
    }, 2000);
    
    // Less frequent checks to avoid performance issues
    const intervalId = setInterval(detectColorViolations, 10000);
    
    // Clean up interval when page unloads
    window.addEventListener('beforeunload', () => {
      clearInterval(intervalId);
    });
  }
};

// Component-level compliance check
export const checkComponentColors = (componentName: string, props: any) => {
  if (process.env.NODE_ENV === 'development' && props.className) {
    const className = props.className;
    const forbiddenPatterns = [
      /bg-yellow/,
      /bg-amber/,
      /bg-orange/,
      /text-yellow/,
      /text-amber/,
      /text-orange/,
      /border-yellow/,
      /border-amber/,
      /border-orange/
    ];
    
    forbiddenPatterns.forEach(pattern => {
      if (pattern.test(className)) {
        console.warn(`🚨 Color violation in ${componentName}:`, {
          className,
          pattern: pattern.toString(),
          component: componentName
        });
      }
    });
  }
};

// Safe color replacements
export const getSafeColorReplacement = (unsafeColor: string): string => {
  const replacements: Record<string, string> = {
    'bg-yellow-50': 'bg-electric-indigo/5',
    'bg-yellow-100': 'bg-electric-indigo/10',
    'bg-yellow-200': 'bg-neon-mint/20',
    'bg-yellow-300': 'bg-neon-mint/30',
    'bg-yellow-400': 'bg-neon-mint',
    'bg-yellow-500': 'bg-neon-mint',
    'bg-amber-50': 'bg-electric-indigo/5',
    'bg-amber-100': 'bg-electric-indigo/10',
    'bg-amber-200': 'bg-electric-indigo/20',
    'bg-amber-300': 'bg-electric-indigo/30',
    'bg-amber-400': 'bg-electric-indigo',
    'bg-amber-500': 'bg-electric-indigo',
    'bg-orange-50': 'bg-soft-coral/5',
    'bg-orange-100': 'bg-soft-coral/10',
    'bg-orange-200': 'bg-soft-coral/20',
    'bg-orange-300': 'bg-soft-coral/30',
    'bg-orange-400': 'bg-soft-coral',
    'bg-orange-500': 'bg-soft-coral',
    'text-yellow-600': 'text-slate-gray',
    'text-yellow-700': 'text-slate-gray',
    'text-yellow-800': 'text-slate-gray',
    'text-amber-600': 'text-electric-indigo',
    'text-amber-700': 'text-electric-indigo',
    'text-amber-800': 'text-slate-gray',
    'text-orange-600': 'text-slate-gray',
    'text-orange-700': 'text-slate-gray',
    'text-orange-800': 'text-slate-gray'
  };
  
  return replacements[unsafeColor] || 'bg-white';
};
