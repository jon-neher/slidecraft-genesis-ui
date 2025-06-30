import '@testing-library/jest-dom';

// Guard usage of `window` so this file can run in both Node and jsdom
if (typeof window !== 'undefined') {
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

  // Provide `fetch` for jsdom tests when missing
  if (typeof window.fetch === 'undefined') {
    // Node 18+ exposes fetch globally; copy it to both the window object and
    // the Node global so `jest.spyOn(global, 'fetch')` works.
    const nodeFetch = globalThis.fetch as typeof fetch;
    window.fetch = nodeFetch;
    if (typeof (globalThis as { fetch?: typeof fetch }).fetch === 'undefined') {
      Object.defineProperty(globalThis, 'fetch', {
        value: nodeFetch,
        writable: true,
        configurable: true,
      });
    } else {
      // Ensure the property is configurable for jest.spyOn
      const desc = Object.getOwnPropertyDescriptor(globalThis, 'fetch');
      if (desc && !desc.configurable) {
        Object.defineProperty(globalThis, 'fetch', {
          value: nodeFetch,
          writable: true,
          configurable: true,
        });
      }
    }
  }
}
