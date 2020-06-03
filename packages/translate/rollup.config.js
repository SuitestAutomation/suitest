import typescript from 'rollup-plugin-typescript2';
import { uglify } from "rollup-plugin-uglify";
import fs from 'fs';

const getConfig = (file, dir, format) => ({
	input: './lib/' + file,
	external: [
		'@suitest/smst',
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
			'@suitest/smst': '@suitest/smst',
			'unist-builder': 'ub',
		},
	},
})

const config = process.env.FORMAT === 'umd'
	? getConfig('index.ts', 'umd', 'umd')
	: fs.readdirSync('./lib').filter(fileName => fileName.match(/.tsx?$/)).map(fileName => getConfig(fileName, 'commonjs', 'cjs'))

export default config;
