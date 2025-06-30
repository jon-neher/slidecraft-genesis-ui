
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import ModernFeatures from './ModernFeatures';
import React from 'react';

describe('ModernFeatures', () => {
  it('renders all feature cards', () => {
    render(<ModernFeatures />);
    // four features defined in the component
    const cards = screen.getAllByRole('heading', { level: 3 });
    expect(cards).toHaveLength(4);
  });
});
