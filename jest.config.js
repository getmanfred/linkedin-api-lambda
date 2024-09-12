module.exports = {
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ['lcov', 'text-summary', 'clover'],
  collectCoverageFrom: ['src/**/*.ts', '!src/test/**/*', '!src/**/*spec.ts', '!src/launch.ts']
};
