import getConfig from "../../rollupUtils";

const config = process.env.FORMAT === 'umd'
	? getConfig('jsxFactory.ts', 'umd', 'umd', ['unist-builder'], {'unist-builder': 'ub'})
	: getConfig('jsxFactory.ts', 'commonjs', 'cjs', ['unist-builder'], {'unist-builder': 'ub'})

export default config;
