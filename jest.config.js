module.exports = {
    testEnvironment: 'jsdom',
    globals: {
        global: global,
    },
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '^.+\\.js$': 'babel-jest'
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    snapshotSerializers: [
        '<rootDir>/customSerializer.js'
    ]
};
