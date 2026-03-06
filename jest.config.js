const nextJest = require('next/jest.js');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^next-intl(.*)$': '<rootDir>/src/__mocks__/next-intl.tsx',
  },
  testPathIgnorePatterns: ['<rootDir>/e2e/', '<rootDir>/.next/'],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/generated/**',
    '!src/app/**',
    '!src/e2e/**',
  ],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};

module.exports = createJestConfig(customConfig);
