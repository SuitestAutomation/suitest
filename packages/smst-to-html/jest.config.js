module.exports = {
	"preset": "ts-jest",
	"transform": {
		"^.+\\.(j|t)sx?$": ["ts-jest", {
			"diagnostics": {
				"warnOnly": true
			},
		}],
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
			"branches": 79, // Branches coverage is decreased because of issue with switch/case fallthrough invalid marked as not covered
			"functions": 95,
			"lines": 95,
			"statements": 89
		}
	},
	"moduleFileExtensions": [
		"js", "json", "jsx", "ts", "d.ts", "tsx", "node",
	],
};
