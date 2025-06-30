
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  // Use the Node environment by default; React tests override this with a
  // file-level directive so server tests can access native globals like `Request`.
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: './tsconfig.jest.json',
    },
  },
  // Add better handling for DOM environments
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
};

export default config;
