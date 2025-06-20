
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModernHero from './ModernHero';
import React from 'react';

vi.mock('./ClerkWaitlistForm', () => ({
  default: () => <div data-testid="clerk-form">Waitlist</div>
}));

vi.mock('./ThreadingAnimation', () => ({
  default: () => <div data-testid="threading" />
}));

describe('ModernHero', () => {
  it('renders headline and waitlist form', () => {
    render(<ModernHero />);
    expect(screen.getByText(/Turn your data into/i)).toBeInTheDocument();
    expect(screen.getByTestId('clerk-form')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Watch Demo/i })).toBeInTheDocument();
  });
});
