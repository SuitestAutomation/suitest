import {PROGRESS_STATUS, translateProgress} from '../progress';

describe('Interactive progress explanation.', () => {
	// No need for deep testing because translateProgress with code will return the same result as translateStartupError
	it('Should return translation if code is valid', () => {
		const res = {
			title: 'Cannot continue: Your subscription has expired',
			description: 'Your subscription has expired, to continue using Suitest please [renew your subscription](https://the.suite.st/preferences/billing)',
		};
		expect(translateProgress({code: 'noActivePlan'})).toStrictEqual(res);
		expect(translateProgress({code: 'noActivePlan', status: 'actionFailed'})).toStrictEqual(res);
	});

	describe('Translation result for', () => {
		for (const status of Object.values(PROGRESS_STATUS)) {
			it(`"${status}" status`, () => {
				expect(translateProgress({status})).toMatchSnapshot();
			});
		}
	});

	it('Translation result for unknown statuses/codes', () => {
		expect(translateProgress({status: 'unknownStatus'} as any)).toBe(undefined);
		expect(translateProgress({status: 'unknownStatus', code: 'unknownCode'} as any)).toBe(undefined);
		expect(translateProgress({code: 'unknownCode'} as any)).toBe(undefined);
	});
});
