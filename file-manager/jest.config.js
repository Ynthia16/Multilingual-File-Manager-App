module.exports = {
  testEnvironment: 'node', // Set the environment for Node.js projects
  roots: ['<rootDir>/tests'], // Specify the directory for test files
  testMatch: ['**/*.test.js'], // Match test files with `.test.js` suffix
  collectCoverage: true, // Enable code coverage collection
  collectCoverageFrom: ['src/**/*.js'], // Specify the files to include in coverage
  coverageDirectory: 'coverage', // Output directory for coverage reports
  setupFilesAfterEnv: ['./jest.setup.js'], // (Optional) For global test setups
};
