module.exports = {
    verbose: true,
    setupTestFrameworkScriptFile: "./jest.setup.js",
    runner: "truffle-jest/lib/runner",
    globalSetup: "truffle-jest/lib/setup",
    globalTeardown: "truffle-jest/lib/teardown",
    testEnvironment: "truffle-jest/lib/environment"
  };
  