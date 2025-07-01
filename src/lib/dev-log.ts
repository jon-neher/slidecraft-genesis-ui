
// Client-side development check
export const isDev = false;

export function devLog(...args: unknown[]): void {
  if (isDev) {
    console.log(...args);
  }
}
