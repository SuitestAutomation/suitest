import {NOT_STARTED_REASON} from '../constants';
import {translateNotStartedReason} from '../notStartedReason';
import {toText} from '@suitest/smst-to-text';
import {toHtml} from '@suitest/smst-to-html';

describe('Testing not started reason translation.', () => {
	it(`${translateNotStartedReason.name} should throw an error for unknown code`, () => {
		// @ts-expect-error
		expect(() => translateNotStartedReason('unknownCode'))
			.toThrowError('Unknown not started reason received: unknownCode');
	});

	const notStartedReasons = Object.values(NOT_STARTED_REASON);
	for (const code of notStartedReasons) {
		it(`Should translate "${code}" code`, () => {
			expect(translateNotStartedReason(code)).toMatchSnapshot();
		});
	}

	describe('Translate to plain text: ', () => {
		for (const code of notStartedReasons) {
			it(`"${code}"`, () => {
				const reason = translateNotStartedReason(code);

				expect({
					title: toText(reason.title),
					description: reason.description ? toText(reason.description) : undefined,
				}).toMatchSnapshot();
			});
		}
	});


	describe('Translate to html: ', () => {
		for (const code of notStartedReasons) {
			it(`"${code}"`, () => {
				const reason = translateNotStartedReason(code);

				expect({
					title: toHtml(reason.title),
					description: toHtml(reason.title),
				}).toMatchSnapshot();
			});
		}
	});
});
