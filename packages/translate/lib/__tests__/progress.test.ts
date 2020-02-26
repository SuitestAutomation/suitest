import {PROGRESS_STATUS} from '../constants';
import {translateProgress} from '../progress';

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

	for (const status of Object.values(PROGRESS_STATUS)) {
		if (status === 'actionFailed') {
			continue;
		}

		it(`Should translate "${status}" status`, () => {
			expect(translateProgress({status})).toMatchSnapshot();
		});
	}

	it('Should throw an error if actionFailed message does not deliver code', () => {
		expect(() => translateProgress({status: 'actionFailed'}))
			.toThrowError('A code is expected when receiving "actionFailed" progress status');
	});

	it('Should handle unknown statuses/codes', () => {
		expect(() => translateProgress({status: 'unknownStatus'} as any))
			.toThrowError('Unknown status code received: unknownStatus');

		expect(() => translateProgress({status: 'unknownStatus', code: 'unknownCode'} as any))
			.toThrowError('Unknown not started reason received: unknownCode');
		expect(() => translateProgress({code: 'unknownCode'} as any))
			.toThrowError('Unknown not started reason received: unknownCode');

		// status valid and code undefined
		expect(translateProgress({status: 'openingApp', code: undefined})).toStrictEqual({
			title: 'Trying to open app…',
		});
		// code is valid and status undefined
		expect(translateProgress({status: undefined, code: 'candyBoxOffline'})).toStrictEqual({
			description: 'Check that the cable plugged into the CandyBox delivers Internet connection or reboot the CandyBox and allow about 5 minutes for it to initialize',
			title: 'Cannot continue: CandyBox controlling this device is offline',
		});
	});
});
