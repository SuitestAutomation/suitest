import {sortNetworkInfo, translateCondition, translateElementProperty} from '../condition';
import {appConfig, conditions, elements} from './testLinesExamples';
import {NetworkRequestInfo} from '@suitest/types/lib';

describe('conditions translation', () => {
	for (const [name, condition] of Object.entries(conditions)) {
		it(`should translate "${name}" line`, () => {
			expect(translateCondition(condition(), false, appConfig, elements)).toMatchSnapshot();
		});

		it(`should translate "${name}" line without variables`, () => {
			expect(translateCondition(condition(), false, undefined, elements)).toMatchSnapshot();
		});
	}

	describe('translateElementProperty function', () => {
		it('should normalize property names', () => {
			expect(translateElementProperty('videoUrl')).toEqual('video URL');
			expect(translateElementProperty('url')).toEqual('URL');
			expect(translateElementProperty('color')).toEqual('text color');
			expect(translateElementProperty('zIndex')).toEqual('z-index');
			expect(translateElementProperty('automationId')).toEqual('automation ID');
			expect(translateElementProperty('scaleX')).toEqual('scale X');
			expect(translateElementProperty('scaleY')).toEqual('scale Y');
			expect(translateElementProperty('translationX')).toEqual('translation X');
			expect(translateElementProperty('translationY')).toEqual('translation Y');
			expect(translateElementProperty('pivotX')).toEqual('pivot X');
			expect(translateElementProperty('pivotY')).toEqual('pivot Y');
			expect(translateElementProperty('tagInt')).toEqual('tag');
			expect(translateElementProperty('fontURI')).toEqual('font URI');
			expect(translateElementProperty('proposalURL')).toEqual('proposal URL');
		});

		it('should automatically convert camelCase to separate words for other values', () => {
			expect(translateElementProperty('foo')).toEqual('foo');
			expect(translateElementProperty('fooBar')).toEqual('foo bar');
			expect(translateElementProperty('fooBarBaz')).toEqual('foo bar baz');
			expect(translateElementProperty('fooBAR')).toEqual('foo b a r');
		});
	});

	describe('sortNetworkInfo function', () => {
		it('should produce a correct sorting', () => {
			const input: NetworkRequestInfo[] = [{
				name: '@body',
				compare: '=',
				val: 'foo',
			}, {
				name: '@method',
				compare: '=',
				val: 'GET',
			}, {
				name: '@status',
				compare: '=',
				val: 200,
			}, {
				name: 'AAA',
				compare: '=',
				val: 'aaa',
			}, {
				name: 'XXX',
				compare: '=',
				val: 'xxx',
			}];

			expect(sortNetworkInfo(input[0], input[1])).toEqual(1);
			expect(sortNetworkInfo(input[1], input[0])).toEqual(-1);
			expect(sortNetworkInfo(input[3], input[4])).toEqual(-1);
			expect(sortNetworkInfo(input[4], input[3])).toEqual(1);
			expect(sortNetworkInfo(input[2], input[3])).toEqual(-1);
			expect(sortNetworkInfo(input[3], input[2])).toEqual(1);
			expect(sortNetworkInfo(input[0], input[4])).toEqual(1);
			expect(sortNetworkInfo(input[4], input[0])).toEqual(-1);
		});
	});
});
