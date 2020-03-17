import {testLineToAst} from '../testLineToAst';
import {appConfig, elements, snippets, testLines} from './testLines';

describe('Test Lines translation', () => {
	for (const [name, line] of Object.entries(testLines)) {
		it(`Should translate test line "${name}"`, () => {
			expect(testLineToAst(line(), appConfig, elements, snippets)).toMatchSnapshot();
		});
	}
});
