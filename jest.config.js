// eslint-disable-next-line no-undef
module.exports = {
    /** A preset that is used as a base for Jest's configuration */
    preset: 'ts-jest',

    /** The test environment that will be used for testing */
    testEnvironment: 'jsdom',

    /** The directory where Jest should output its coverage files */
    coverageDirectory: 'coverage',

    /**
     * Indicates whether the coverage information should be collected
     *  while executing the test.
     * Because this retrofits all executed files with coverage collection statements,
     *  it may significantly slow down your tests.
     */
    collectCoverage: false,

    /**
     * An array of glob patterns indicating a set of files
     *  for which coverage information should be collected
     */
    collectCoverageFrom: ['src/**/*'],

    /** This will be used to configure minimum threshold enforcement for coverage results */
    coverageThreshold: {
        global: {
            branches: 5,
            functions: 5,
            lines: 5,
            statements: 5,
        },
    },

    /**
     * A list of paths to modules that run some code to configure
     *  or set up the testing environment.
     * Each setupFile will be run once per test file.
     * Since every test runs in its own environment,
     *  these scripts will be executed in the testing
     *  environment immediately before executing the test code itself.
     */
    setupFiles: [
        /** Mock `canvas` when run unit test cases with Jest */
        'jest-canvas-mock',

        /** Mock `weblg` when run unit test cases with Jest */
        'jest-webgl-canvas-mock',

        /** Support TypeScript experimental decorators */
        '@abraham/reflection',
        './src/jest.setup.ts',
    ],
    testMatch: ['<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'],
};
