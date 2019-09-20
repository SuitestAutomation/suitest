import {translateNotStartedReason, translateProgress} from '../index';

describe('Check exports.', () => {
	it(`${translateNotStartedReason.name} should be available for export`, () => {
		expect(typeof translateNotStartedReason).toBe('function');
	});

	it(`${translateProgress.name} should be available for export`, () => {
		expect(typeof translateProgress).toBe('function');
	});
});
