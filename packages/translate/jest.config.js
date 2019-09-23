module.exports = {
    "preset": "ts-jest",
    "transform": {
        "^.+\\.(j|t)s?$": "ts-jest"
    },
    "testMatch": [
        "<rootDir>/lib/__tests__/*.test.ts"
    ],
    "collectCoverageFrom": [
        "<rootDir>/lib/index.ts"
    ],
    "coverageThreshold": {
        "global": {
            "branches": 100,
            "functions": 100,
            "lines": 100,
            "statements": 100
        }
    }
};
