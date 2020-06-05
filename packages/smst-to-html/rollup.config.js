import getConfig from "../../rollupUtils";

const config = process.env.FORMAT === 'umd'
	? getConfig('toHtml.ts', 'umd', 'umd', ['@suitest/smst'], {'@suitest/smst': '@suitest/smst'})
	: getConfig('toHtml.ts', 'commonjs', 'cjs', ['@suitest/smst'], {'@suitest/smst': '@suitest/smst'})

export default config;
