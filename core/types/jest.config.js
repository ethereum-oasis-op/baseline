module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    "./examples/",
    "./reference-implementations/",
    "./node_modules/",
  ],
};
