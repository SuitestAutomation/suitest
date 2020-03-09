import {translateCondition} from '../conditions';
import {appConfig, conditions, elements} from './testLines';

describe('conditions translation', () => {
	for (const [name, condition] of Object.entries(conditions)) {
		it(`should translate "${name}" line`, () => {
			expect(translateCondition(condition(), appConfig, elements)).toMatchSnapshot();
		});
	}
});
