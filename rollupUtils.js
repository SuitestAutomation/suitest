import typescript from 'rollup-plugin-typescript2';
import { uglify } from "rollup-plugin-uglify";

const getConfig = (file, dir, format, externals = [], globals = {}) => ({
	input: './lib/' + file,
	external: [
		...externals,
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
			...globals,
		}
	},
});

export default getConfig;
