import typescript from 'rollup-plugin-typescript2';
import { uglify } from "rollup-plugin-uglify";

const getConfig = (file, dir, format) => ({
	input: './lib/' + file,
	external: [
		'unist-builder',
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
			'unist-builder': 'ub',
		},
	},
})

const config = process.env.FORMAT === 'umd'
	? getConfig('jsxFactory.ts', 'umd', 'umd')
	: getConfig('jsxFactory.ts', 'commonjs', 'cjs')

export default config;
