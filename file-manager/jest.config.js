module.exports = {
  testEnvironment: 'node', 
  roots: ['<rootDir>/tests'], 
  testMatch: ['**/*.test.js'], 
  collectCoverage: true, 
  collectCoverageFrom: ['src/**/*.js'], 
  coverageDirectory: 'coverage', 
};
