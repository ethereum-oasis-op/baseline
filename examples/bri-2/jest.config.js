module.exports = {
	testEnvironment: 'node',
	verbose: true,
	forceExit: true,
	detectOpenHandles: true,
	testRegex: 'tests/.*test.[jt]s$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	rootDir: './'
	//collectCoverage: true,
	//collectCoverageFrom: ['src/**/*.{js,ts}']
};
