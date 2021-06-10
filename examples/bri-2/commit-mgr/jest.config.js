module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true,
	forceExit: true,
	detectOpenHandles: true,
	transform: {
		'^.+\\.(t|j)sx?$': 'ts-jest'
	},
	transformIgnorePatterns: ['/tests/*', '/node_modules/*'],
	testRegex: 'tests/.*test.[jt]s$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	rootDir: './'
	//collectCoverage: true,
	//collectCoverageFrom: ['src/**/*.{js,ts}']
};
