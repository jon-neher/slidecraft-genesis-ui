// Simplified development check that avoids using `import.meta` so tests can run
// in environments where ECMAScript modules aren't enabled.
// Jest sets `process.env.NODE_ENV` to "test", so this is considered a
// development environment.
export const isDev =
  typeof process !== 'undefined' && process.env
    ? process.env.NODE_ENV !== 'production'
    : true;

export function devLog(...args: unknown[]): void {
  if (isDev) {
    console.log(...args);
  }
}
