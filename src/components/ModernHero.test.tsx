
/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, jest } from '@jest/globals';
import ModernHero from './ModernHero';
import React from 'react';

jest.mock('framer-motion', () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props} />,
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props} />,
  },
}));

jest.mock('@clerk/clerk-react', () => ({
  __esModule: true,
  useUser: () => ({ isSignedIn: false }),
}));

jest.mock('./ClerkWaitlistForm', () => ({
  __esModule: true,
  default: () => <div data-testid="clerk-form">Waitlist</div>,
}));

jest.mock('./ThreadingAnimation', () => ({
  __esModule: true,
  default: () => <div data-testid="threading" />,
}));

describe('ModernHero', () => {
  it('renders headline and waitlist form', () => {
    render(
      <MemoryRouter>
        <ModernHero />
      </MemoryRouter>
    );
    
    // Use more specific queries that don't rely on jest-dom matchers
    const headline = screen.getByText(/Turn your data into/i);
    const waitlistForm = screen.getByTestId('clerk-form');
    const demoButton = screen.getByRole('button', { name: /Watch Demo/i });
    
    expect(headline).toBeDefined();
    expect(waitlistForm).toBeDefined();
    expect(demoButton).toBeDefined();
  });
});
