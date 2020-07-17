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
			// TODO cover with unit tests completely
			"branches": 80,
			"functions": 80,
			"lines": 80,
			"statements": 80
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
