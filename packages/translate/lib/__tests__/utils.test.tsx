/// <reference path="../../types/intrinsicElements.d.ts" />
import {jsx} from '@suitest/smst/commonjs/jsxFactory.js';
import {AppConfiguration} from '@suitest/types';
import {formatCount, formatTimeout, formatVariables, replaceVariables} from '../utils';

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
				.toEqual(<fragment><bold>123</bold> (<code>{'<%var1%>'}</code>)</fragment>);
			expect(formatVariables('<%var1%> <%var2%>', vars))
				.toEqual(<fragment><bold>123 456</bold> (<code>{'<%var1%> <%var2%>'}</code>)</fragment>);
		});

		it('should leave text without variables untouched', () => {
			expect(formatVariables('no vars: var1, var2', vars)).toEqual(<bold>no vars: var1, var2</bold>);
			expect(formatVariables('<%var1> <var2%>', vars)).toEqual(<bold>{'<%var1> <var2%>'}</bold>);
		});

		it('should leave unknown variables untouched', () => {
			expect(formatVariables('<%unknown%>', vars)).toEqual(<bold>{'<%unknown%>'}</bold>);
		});
	});

	describe('formatTimeout util', () => {
		it('should format timeout with variables', () => {
			expect(formatTimeout('<%var1%>', vars))
				.toEqual(<fragment><bold>0.123s</bold> (<code>{'<%var1%>'}</code>)</fragment>);
			expect(formatTimeout('<%var1%><%var2%>', vars))
				.toEqual(<fragment><bold>123.456s</bold> (<code>{'<%var1%><%var2%>'}</code>)</fragment>);
		});

		it('should leave numbers without variables untouched', () => {
			expect(formatTimeout(1500, vars)).toEqual(<bold>1.5s</bold>);
			expect(formatTimeout(2000, vars)).toEqual(<bold>2s</bold>);
		});

		it('should display invalid values as is', () => {
			expect(formatTimeout('<%unknown%>', vars)).toEqual(<bold>{'<%unknown%>'}</bold>);
			expect(formatTimeout('abc', vars)).toEqual(<bold>abc</bold>);
		});
	});

	describe('formatCount util', () => {
		it('should format count with variables', () => {
			expect(formatCount('<%var1%>', vars))
				.toEqual(<fragment><bold>123</bold>x (<code>{'<%var1%>'}</code>)</fragment>);
			expect(formatCount('<%var1%><%var2%>', vars))
				.toEqual(<fragment><bold>123456</bold>x (<code>{'<%var1%><%var2%>'}</code>)</fragment>);
		});

		it('should leave numbers without variables untouched', () => {
			expect(formatCount(15, vars)).toEqual(<fragment><bold>15</bold>x</fragment>);
			expect(formatCount(2, vars)).toEqual(<fragment><bold>2</bold>x</fragment>);
		});

		it('should display invalid values as is', () => {
			expect(formatCount('<%unknown%>', vars)).toEqual(<bold>{'<%unknown%>'}</bold>);
			expect(formatCount('abc', vars)).toEqual(<bold>abc</bold>);
		});
	});
});
