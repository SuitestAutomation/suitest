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
			"branches": 20,
			"functions": 20,
			"lines": 20,
			"statements": 20
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
