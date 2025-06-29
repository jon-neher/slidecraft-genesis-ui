
// Comprehensive color audit system to prevent brand violations
import { brandColors, validateColorClass } from './color-validation';
import React from 'react';

export interface ColorViolation {
  file: string;
  line: number;
  className: string;
  violation: string;
  severity: 'error' | 'warning';
}

// Colors that are absolutely forbidden
const FORBIDDEN_COLORS = [
  'yellow', 'amber', 'orange', 'lime',
  'bg-yellow', 'text-yellow', 'border-yellow',
  'bg-amber', 'text-amber', 'border-amber',
  'bg-orange', 'text-orange', 'border-orange',
  'bg-lime', 'text-lime', 'border-lime'
];

// Safe background colors that should always be used
export const SAFE_BACKGROUNDS = {
  primary: 'bg-ice-white',
  secondary: 'bg-white',
  card: 'bg-white',
  muted: 'bg-gray-50',
  accent: 'bg-electric-indigo/5'
} as const;

// Real-time color audit for development
export const auditColorClass = (className: string): ColorViolation | null => {
  // Check for forbidden colors
  const hasForbiddenColor = FORBIDDEN_COLORS.some(forbidden => 
    className.toLowerCase().includes(forbidden.toLowerCase())
  );
  
  if (hasForbiddenColor) {
    return {
      file: 'runtime',
      line: 0,
      className,
      violation: `Forbidden color detected: ${className}`,
      severity: 'error'
    };
  }

  // Check for missing backgrounds on containers
  if (className.includes('container') || className.includes('card') || className.includes('panel')) {
    const hasBackground = className.includes('bg-');
    if (!hasBackground) {
      return {
        file: 'runtime',
        line: 0,
        className,
        violation: `Container missing explicit background: ${className}`,
        severity: 'warning'
      };
    }
  }

  return null;
};

// Component wrapper that enforces brand colors
export const withBrandColors = <T extends Record<string, unknown>>(
  Component: React.ComponentType<T>
): React.ComponentType<T> => {
  return (props: T) => {
    // Audit className prop if it exists
    if (props.className && typeof props.className === 'string') {
      const violation = auditColorClass(props.className);
      if (violation && violation.severity === 'error') {
        console.error('🚨 Brand Color Violation:', violation);
        // In development, replace with safe alternative
        if (process.env.NODE_ENV === 'development') {
          const safeClassName = props.className
            .replace(/bg-yellow[^\s]*/g, 'bg-neon-mint')
            .replace(/bg-amber[^\s]*/g, 'bg-electric-indigo/10')
            .replace(/bg-orange[^\s]*/g, 'bg-soft-coral/10')
            .replace(/text-yellow[^\s]*/g, 'text-slate-gray')
            .replace(/text-amber[^\s]*/g, 'text-electric-indigo')
            .replace(/text-orange[^\s]*/g, 'text-slate-gray');
          
          return React.createElement(Component, { ...props, className: safeClassName });
        }
      }
    }
    
    return React.createElement(Component, props);
  };
};

// Development-time color checker
export const initColorChecker = () => {
  if (process.env.NODE_ENV !== 'development') return;

  // Observer to watch for DOM changes and audit colors
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const element = mutation.target as HTMLElement;
        const className = element.className;
        
        if (className) {
          const violation = auditColorClass(className);
          if (violation && violation.severity === 'error') {
            console.error('🚨 Runtime Color Violation:', {
              element,
              className,
              message: violation.violation
            });
            
            // Add visual indicator in development
            element.style.outline = '2px solid red';
            element.title = `Color Violation: ${violation.violation}`;
          }
        }
      }
    });
  });

  // Start observing
  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['class']
  });

  console.log('🎨 Color audit system initialized');
};
