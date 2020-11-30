module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    "/__tests__/gen-shield-bytecode.js",
  ]
};
