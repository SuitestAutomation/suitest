import typescript from 'rollup-plugin-typescript2';
import { uglify } from "rollup-plugin-uglify";

export default {
	input: './lib/jsxFactory.ts',
	external: [
		'unist-builder',
	],
	plugins: [
		uglify(),
		typescript({tsconfigOverride: {compilerOptions: {module: 'ES2015'}}}),
	],
	output: {
		file: `./${process.env.FORMAT}/jsxFactory.js`,
		name: 'translate',
		format: process.env.FORMAT,
		compact: process.env.FORMAT === 'umd',
		globals: {
			'unist-builder': 'ub',
		},
	},
};
