import '@testing-library/jest-dom';

if (!('IntersectionObserver' in window)) {
  class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error -- jsdom doesn't implement this API yet
  window.IntersectionObserver = IntersectionObserver;
}
