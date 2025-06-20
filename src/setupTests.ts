import '@testing-library/jest-dom';

if (!('IntersectionObserver' in window)) {
  class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error jsdom lacks IntersectionObserver
  window.IntersectionObserver = IntersectionObserver;
}
