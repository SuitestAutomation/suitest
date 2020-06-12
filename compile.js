/**
 * A script to compress sources with Terser
 */
const fs = require('fs');
const path = require('path');
const util = require('util');
const terser = require('terser');

const distPath = path.resolve(process.cwd(), 'dist');

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const processFile = async filePath => {
	const contents = await readFile(filePath, 'utf8');
	const result = terser.minify(contents);

	if (result.error) {
		throw new Error(`Error in file ${filePath}: ${result.error}`);
	}

	await writeFile(filePath, result.code, 'utf8');
};

const main = async dir => {
	// Only support one level at the moment
	const files = await readDir(dir);
	const jsFiles = files
		.filter(file => file.endsWith('.js'))
		.map(file => path.resolve(dir, file));
	await Promise.all(jsFiles.map(processFile));
};

main(distPath).catch(e => {
	console.error(e);

	process.exit(1);
});
