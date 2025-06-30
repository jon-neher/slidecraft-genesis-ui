export const isDev = (() => {
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) {
    return process.env.NODE_ENV !== 'production';
  }
  try {
    // Vite exposes import.meta.env.DEV
    return (
      (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV ?? false
    );
  } catch {
    // Fallback to true in unknown environments
    return true;
  }
})();

export function devLog(...args: unknown[]): void {
  if (isDev) {
    console.log(...args);
  }
}
