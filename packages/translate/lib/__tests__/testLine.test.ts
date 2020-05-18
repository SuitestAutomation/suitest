import {translateTestLine} from '../testLine';
import {appConfig, elements, snippets, testLinesExamples} from './testLinesExamples';

describe('Test Lines translation', () => {
	for (const [name, line] of Object.entries(testLinesExamples)) {
		it(`Should translate test line "${name}"`, () => {
			expect(translateTestLine({testLine: line(), appConfig, elements, snippets})).toMatchSnapshot();
		});
	}
});
