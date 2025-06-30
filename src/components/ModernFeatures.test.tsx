/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import ModernFeatures from './ModernFeatures';
import React from 'react';

beforeAll(() => {
  class StubObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error -- jsdom lacks IntersectionObserver
  global.IntersectionObserver = StubObserver;
});

describe('ModernFeatures', () => {
  it('renders all feature cards', () => {
    render(<ModernFeatures />);
    // four features defined in the component
    const cards = screen.getAllByRole('heading', { level: 3 });
    expect(cards).toHaveLength(4);
  });
});
