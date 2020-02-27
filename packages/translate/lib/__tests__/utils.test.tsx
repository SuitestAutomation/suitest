import '../../types/intrinsicElements';
import {jsx} from '../jsxFactory';
import {AppConfiguration} from '@suitest/types';
import {formatVariables, replaceVariables} from '../utils';

describe('Translation utils', () => {
	const vars: AppConfiguration['configVariables'] = [
		{
			key: 'var1',
			value: '123',
		},
		{
			key: 'var2',
			value: '456',
		},
	];

	describe('replaceVariables util', () => {
		it('should replace variables according to definition', () => {
			expect(replaceVariables('<%var1%>', vars)).toEqual('123');
			expect(replaceVariables('<%var1%> <%var2%>', vars)).toEqual('123 456');
		});

		it('should leave text without variables untouched', () => {
			expect(replaceVariables('no vars: var1, var2', vars)).toEqual('no vars: var1, var2');
			expect(replaceVariables('<%var1> <var2%>', vars)).toEqual('<%var1> <var2%>');
		});

		it('should leave unknown variables untouched', () => {
			expect(replaceVariables('<%unknown%>', vars)).toEqual('<%unknown%>');
		});
	});

	describe('formatVariables util', () => {
		it('should format variables in string', () => {
			expect(formatVariables('<%var1%>', vars))
				.toEqual(<text-fragment><bold>123</bold> (<code>{'<%var1%>'}</code>)</text-fragment>);
			expect(formatVariables('<%var1%> <%var2%>', vars))
				.toEqual(<text-fragment><bold>123 456</bold> (<code>{'<%var1%> <%var2%>'}</code>)</text-fragment>);
		});

		it('should leave text without variables untouched', () => {
			expect(formatVariables('no vars: var1, var2', vars)).toEqual(<bold>no vars: var1, var2</bold>);
			expect(formatVariables('<%var1> <var2%>', vars)).toEqual(<bold>{'<%var1> <var2%>'}</bold>);
		});

		it('should leave unknown variables untouched', () => {
			expect(formatVariables('<%unknown%>', vars)).toEqual(<bold>{'<%unknown%>'}</bold>);
		});
	});
});
