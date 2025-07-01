
// Client-side development check using Vite environment variables
export const isDev = import.meta.env?.DEV ?? true;

export function devLog(...args: unknown[]): void {
  if (isDev) {
    console.log(...args);
  }
}
