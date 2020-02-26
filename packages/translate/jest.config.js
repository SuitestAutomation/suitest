module.exports = {
    "preset": "ts-jest",
    "transform": {
        "^.+\\.(j|t)sx?$": "ts-jest"
    },
    "testMatch": [
        "<rootDir>/lib/__tests__/*.test.ts",
		"<rootDir>/lib/__tests__/*.test.tsx"
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
    },
	"moduleFileExtensions": [
		"js", "json", "jsx", "ts", "d.ts", "tsx", "node",
	],
};
