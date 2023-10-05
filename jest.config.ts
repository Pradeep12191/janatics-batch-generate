import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    testEnvironment: "node",
    moduleNameMapper : {
        '@routes/*': '<rootDir>/src/routes',
        '@mongoose-models/*': '<rootDir>/src/models',
        '@helpers/*': '<rootDir>/src/helpers',
        '@controller/(.*)': '<rootDir>/src/controller/$1'
    },
    preset: "@shelf/jest-mongodb",
    verbose: true,
    detectOpenHandles: true
};
export default config;