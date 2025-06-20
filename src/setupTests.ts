import '@testing-library/jest-dom';

if (!('IntersectionObserver' in window)) {
  class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-ignore
  window.IntersectionObserver = IntersectionObserver;
}
