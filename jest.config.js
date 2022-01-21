/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
