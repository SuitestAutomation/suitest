import typescript from 'rollup-plugin-typescript2';
import { uglify } from "rollup-plugin-uglify";

const getConfig = (file, dir, format) => ({
	input: './lib/' + file,
	external: [
		'@suitest/smst',
	],
	plugins: [
		typescript({tsconfigOverride: {compilerOptions: {module: 'ES2015'}}}),
		uglify(),
	],
	output: {
		dir: `./${dir}`,
		name: 'translate',
		format: format,
		compact: true,
		globals: {
			'@suitest/smst': '@suitest/smst'
		}
	},
})

const config = process.env.FORMAT === 'umd'
	? getConfig('toText.ts', 'umd', 'umd')
	: getConfig('toText.ts', 'commonjs', 'cjs')

export default config;
