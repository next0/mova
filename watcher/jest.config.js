/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    preset: 'ts-jest/presets/default-esm',
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
    testEnvironment: 'node',
    moduleDirectories: ['src', 'examples', 'node_modules'],
    transform: {},
};
