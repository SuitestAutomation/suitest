import {PROGRESS_STATUS} from '../constants';
import {translateProgress} from '../progress';
import {toText} from '@suitest/smst-to-text';
import {toHtml} from '@suitest/smst-to-html';

describe('Interactive progress explanation.', () => {
	// No need for deep testing because translateProgress with code will return the same result as translateStartupError
	it('Should return translation if code is valid', () => {
		expect(translateProgress({code: 'noActivePlan'})).toMatchSnapshot();
		expect(translateProgress({code: 'noActivePlan', status: 'actionFailed'})).toMatchSnapshot();
	});

	const progressStatuses = Object.values(PROGRESS_STATUS);
	for (const status of progressStatuses) {
		it(`Should translate "${status}" status`, () => {
			expect(translateProgress({status})).toMatchSnapshot();
		});
	}

	describe('Translate progress to text: ', () => {
		for (const status of progressStatuses) {
			it(`"${status}"`, () => {
				const progress = translateProgress({ status });
				expect({ title: toText(progress.title, {verbosity: 'normal', format: true}) }).toMatchSnapshot();
			});
		}
	});

	describe('Translate progress to html: ', () => {
		for (const status of progressStatuses) {
			it(`"${status}"`, () => {
				const progress = translateProgress({ status });
				expect({ title: toHtml(progress.title, {verbosity: 'normal'}) }).toMatchSnapshot();
			});
		}
	});

	it('Should handle unknown statuses/codes', () => {
		// @ts-expect-error
		expect(() => translateProgress({status: 'unknownStatus'}))
			.toThrowError('Unknown status code received: unknownStatus');

		// @ts-expect-error
		expect(() => translateProgress({status: 'unknownStatus', code: 'unknownCode'}))
			.toThrowError('Unknown not started reason received: unknownCode');
		// @ts-expect-error
		expect(() => translateProgress({code: 'unknownCode'}))
			.toThrowError('Unknown not started reason received: unknownCode');

		// status valid and code undefined
		expect(translateProgress({status: 'openingApp', code: undefined})).toMatchSnapshot();
		// code is valid and status undefined
		expect(translateProgress({status: undefined, code: 'candyBoxOffline'})).toMatchSnapshot();

		expect(() => translateProgress({})).toThrowError('A status is expected.');
	});
});
