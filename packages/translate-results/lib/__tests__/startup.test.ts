import {translateStartupError} from '../startup';

describe('Testing startup errors translation.', () => {
	it(`${translateStartupError.name} should return "empty" object for unknown code`, () => {
		expect(translateStartupError('unknownCode' as any)).toStrictEqual({
			title: '',
		});
	});

	it(`${translateStartupError.name} should return object with translated title and description`, () => {
		expect(translateStartupError('noActivePlan')).toStrictEqual({
			title: 'Cannot continue: Your subscription has expired',
			description: 'Your subscription has expired, to continue using Suitest please [renew your subscription](https://the.suite.st/preferences/billing)',
		});
	});
});
