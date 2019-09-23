import {NOT_STARTED_REASON} from '../constants';
import {translateNotStartedReason} from '../notStartedReason';

describe('Testing not started reason translation.', () => {
	it(`${translateNotStartedReason.name} should throw an error for unknown code`, () => {
		expect(() => translateNotStartedReason('unknownCode' as any))
			.toThrowError('Unknown not started reason received: unknownCode');
	});

	it(`${translateNotStartedReason.name} should return object with translated title and description`, () => {
		expect(translateNotStartedReason('noActivePlan')).toStrictEqual({
			title: 'Cannot continue: Your subscription has expired',
			description: 'Your subscription has expired, to continue using Suitest please [renew your subscription](https://the.suite.st/preferences/billing)',
		});
	});

	for (const code of Object.values(NOT_STARTED_REASON)) {
		it(`Should translate "${code}" code`, () => {
			expect(translateNotStartedReason(code)).toMatchSnapshot();
		});
	}
});
