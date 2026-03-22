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
    'routes/authors.ts',
    'routes/categories.ts',
    'models/author.model.ts',
    'models/category.model.ts',
    'utils/AppError.ts',
    'utils/response.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  // Silence server logs during tests
  setupFiles: ['<rootDir>/__tests__/setup.ts'],
  testTimeout: 30000,
};

export default config;
