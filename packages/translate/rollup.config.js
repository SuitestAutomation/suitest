import fs from 'fs';
import getConfig from "../../rollupUtils";

const config = process.env.FORMAT === 'umd'
	? getConfig('index.ts', 'umd', 'umd', ['@suitest/smst', 'unist-builder'], {'@suitest/smst': '@suitest/smst', 'unist-builder': 'ub'})
	: fs.readdirSync('./lib')
		.filter(fileName => fileName.match(/.tsx?$/))
		.map(fileName => getConfig(fileName, 'commonjs', 'cjs', ['@suitest/smst', 'unist-builder'], {'@suitest/smst': '@suitest/smst', 'unist-builder': 'ub'}))

export default config;
