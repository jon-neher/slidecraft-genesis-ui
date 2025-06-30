
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, jest } from '@jest/globals';
import ModernHero from './ModernHero';
import React from 'react';

jest.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ isSignedIn: false })
}));

jest.mock('./ClerkWaitlistForm', () => ({
  default: () => <div data-testid="clerk-form">Waitlist</div>
}));

jest.mock('./ThreadingAnimation', () => ({
  default: () => <div data-testid="threading" />
}));

describe('ModernHero', () => {
  it('renders headline and waitlist form', () => {
    render(
      <MemoryRouter>
        <ModernHero />
      </MemoryRouter>
    );
    expect(screen.getByText(/Turn your data into/i)).toBeInTheDocument();
    expect(screen.getByTestId('clerk-form')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Watch Demo/i })).toBeInTheDocument();
  });
});
