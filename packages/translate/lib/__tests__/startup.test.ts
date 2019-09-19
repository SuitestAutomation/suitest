import {NOT_STARTED_REASON} from '../constants';
import {translateStartupError} from '../startup';

describe('Testing startup errors translation.', () => {
	it(`${translateStartupError.name} should return undefined for unknown code`, () => {
		expect(translateStartupError('unknownCode' as any)).toBe(undefined);
	});

	it(`${translateStartupError.name} should return object with translated title and description`, () => {
		expect(translateStartupError('noActivePlan')).toStrictEqual({
			title: 'Cannot continue: Your subscription has expired',
			description: 'Your subscription has expired, to continue using Suitest please [renew your subscription](https://the.suite.st/preferences/billing)',
		});
	});

	describe('Startup error translations for', () => {
		for (const code of Object.values(NOT_STARTED_REASON)) {
			it(`"${code}" code`, () => {
				expect(translateStartupError(code)).toMatchSnapshot();
			});
		}
	});
});
