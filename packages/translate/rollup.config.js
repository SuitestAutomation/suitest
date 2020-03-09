import typescript from 'rollup-plugin-typescript2';
import { uglify } from "rollup-plugin-uglify";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: './lib/index.ts',
	plugins: [
		resolve(),
		commonjs(),
		uglify(),
		typescript({tsconfigOverride: {compilerOptions: {module: 'ES2015'}}}),
	],
	output: {
		file: `./${process.env.FORMAT}/index.js`,
		name: 'translate',
		format: process.env.FORMAT,
		compact: process.env.FORMAT === 'umd',
	},
};
