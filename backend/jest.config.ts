import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        diagnostics: false,
        isolatedModules: true,
      },
    ],
  },
  // Coverage
  collectCoverageFrom: [
    'routes/**/*.ts',
    'middleware/**/*.ts',
    'models/**/*.ts',
    'utils/**/*.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  // Silence server logs during tests
  setupFiles: ['<rootDir>/__tests__/setup.ts'],
  testTimeout: 30000,
};

export default config;
