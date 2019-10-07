module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/__fixtures__/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__fixtures__/'],
  setupFilesAfterEnv: ['../jest.setup.js'],
  rootDir: './build',
};
