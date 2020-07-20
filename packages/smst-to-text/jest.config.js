module.exports = {
	"preset": "ts-jest",
	"transform": {
		"^.+\\.tsx?$": "ts-jest"
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
			"branches": 80, // Branches coverage is decreased because of issue with switch/case fallthrough invalid marked as not covered
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
