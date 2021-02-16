module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    "default",
    ["./node_modules/jest-html-reporter", {
        "pageTitle": "[bri-2] Baseline Dashboard Tests",
        "outputPath": "../dashboard/public/baseline-dashboard-tests-report.html"
    }]
  ]
};
