import {translateStartupError, translateProgress} from '../index';

describe('Check exports.', () => {
	it(`${translateStartupError.name} should be available for export`, () => {
		expect(typeof translateStartupError).toBe('function');
	});

	it(`${translateProgress.name} should be available for export`, () => {
		expect(typeof translateProgress).toBe('function');
	});
});
