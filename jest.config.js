module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/__tests__/**/*.e2e.js'],
  collectCoverageFrom: ['controllers/**/*.js', 'services/**/*.js', 'utils/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
