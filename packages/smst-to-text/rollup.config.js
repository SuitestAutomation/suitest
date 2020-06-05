import getConfig from "../../rollupUtils";

const config = process.env.FORMAT === 'umd'
	? getConfig('toText.ts', 'umd', 'umd', ['@suitest/smst'], {'@suitest/smst': '@suitest/smst'})
	: getConfig('toText.ts', 'commonjs', 'cjs', ['@suitest/smst'], {'@suitest/smst': '@suitest/smst'})

export default config;
