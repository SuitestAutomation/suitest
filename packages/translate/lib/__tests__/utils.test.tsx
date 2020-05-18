/// <reference path="../../../smst/types/intrinsicElements.d.ts" />
import {jsx} from '@suitest/smst';
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
				.toEqual(<fragment><input>123</input> (<code>{'<%var1%>'}</code>)</fragment>);
			expect(formatVariables('<%var1%> <%var2%>', vars))
				.toEqual(<fragment><input>123 456</input> (<code>{'<%var1%> <%var2%>'}</code>)</fragment>);
		});

		it('should leave text without variables untouched', () => {
			expect(formatVariables('no vars: var1, var2', vars)).toEqual(<input>no vars: var1, var2</input>);
			expect(formatVariables('<%var1> <var2%>', vars)).toEqual(<input>{'<%var1> <var2%>'}</input>);
		});

		it('should leave unknown variables untouched', () => {
			expect(formatVariables('<%unknown%>', vars)).toEqual(<input>{'<%unknown%>'}</input>);
		});
	});

	describe('formatTimeout util', () => {
		it('should format timeout with variables', () => {
			expect(formatTimeout('<%var1%>', vars))
				.toEqual(<fragment><input>0.123s</input> (<code>{'<%var1%>'}</code>)</fragment>);
			expect(formatTimeout('<%var1%><%var2%>', vars))
				.toEqual(<fragment><input>123.456s</input> (<code>{'<%var1%><%var2%>'}</code>)</fragment>);
		});

		it('should leave numbers without variables untouched', () => {
			expect(formatTimeout(1500, vars)).toEqual(<input>1.5s</input>);
			expect(formatTimeout(2000, vars)).toEqual(<input>2s</input>);
		});

		it('should display invalid values as is', () => {
			expect(formatTimeout('<%unknown%>', vars)).toEqual(<input>{'<%unknown%>'}</input>);
			expect(formatTimeout('abc', vars)).toEqual(<input>abc</input>);
		});
	});

	describe('formatCount util', () => {
		it('should format count with variables', () => {
			expect(formatCount('<%var1%>', vars))
				.toEqual(<fragment><input>123</input>x (<code>{'<%var1%>'}</code>)</fragment>);
			expect(formatCount('<%var1%><%var2%>', vars))
				.toEqual(<fragment><input>123456</input>x (<code>{'<%var1%><%var2%>'}</code>)</fragment>);
		});

		it('should leave numbers without variables untouched', () => {
			expect(formatCount(15, vars)).toEqual(<fragment><input>15</input>x</fragment>);
			expect(formatCount(2, vars)).toEqual(<fragment><input>2</input>x</fragment>);
		});

		it('should display invalid values as is', () => {
			expect(formatCount('<%unknown%>', vars)).toEqual(<input>{'<%unknown%>'}</input>);
			expect(formatCount('abc', vars)).toEqual(<input>abc</input>);
		});
	});
});
