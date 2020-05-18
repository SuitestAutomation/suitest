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
        "<rootDir>/lib/**/*.{ts,tsx}",
		"!<rootDir>/lib/__tests__/**/*"
    ],
    "coverageThreshold": {
        "global": {
            "branches": 90,
            "functions": 95,
            "lines": 95,
            "statements": 95
        }
    },
	"moduleFileExtensions": [
		"js", "json", "jsx", "ts", "d.ts", "tsx", "node",
	],
	"globals": {
		"ts-jest": {
			"diagnostics": {
				"warnOnly": true
			},
		},
	},
};
