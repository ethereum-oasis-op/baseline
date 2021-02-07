module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    "default",
    ["./node_modules/jest-html-reporter", {
        "pageTitle": "[bri-2] Baseline commit-mgr Tests",
        "outputPath": "./public/baseline-commit-mgr-tests-report.html"
    }]
]
};
