module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['<rootDir>/src/server/search_contacts.test.ts'],
  globals: {
    'ts-jest': { useESM: true, tsconfig: 'tsconfig.json' }
  }
}
