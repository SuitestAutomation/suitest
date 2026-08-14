import {jsx} from '@suitest/smst';
import {toText} from '@suitest/smst-to-text';
import {AppConfiguration} from '@suitest/types';
import {
	formatCount,
	formatTimeout,
	formatVariables,
	formatVariableWithUnit,
	replaceVariables,
} from '../utils';

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
		{
			key: 'emptyVar',
			value: '',
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

		it('should replace variables with empty values', () => {
			expect(replaceVariables('<%emptyVar%>', vars)).toEqual('');
		});

		it('should leave text without changes if variables undefined', () => {
			expect(replaceVariables('some text')).toEqual('some text');
			expect(replaceVariables('<%someVar%> lalala')).toEqual('<%someVar%> lalala');
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

		it('should format partially replaced variables', () => {
			expect(formatVariables('<%var1%> <%unknown%>', vars))
				.toEqual(
					<fragment>
						<input>{'123 <%unknown%>'}</input> (<code>{'<%var1%> <%unknown%>'}</code>)
					</fragment>,
				);
		});

		it('should format variables with empty values', () => {
			const result = formatVariables('<%emptyVar%>', vars);

			expect(result).toEqual(
				<fragment><input>[EMPTY STRING]</input> (<code>{'<%emptyVar%>'}</code>)</fragment>,
			);
			expect(toText(result, {format: false, verbosity: 'normal'}))
				.toEqual('[EMPTY STRING] (<%emptyVar%>)');
		});

		it('should preserve resolved values when empty and non-empty variables are mixed', () => {
			const result = formatVariables('<%emptyVar%> <%var1%>', vars);

			expect(toText(result, {format: false, verbosity: 'normal'}))
				.toEqual(' 123 (<%emptyVar%> <%var1%>)');
		});

		it('should display empty values inside text', () => {
			const result = formatVariables('before <%emptyVar%> after', vars);

			expect(toText(result, {format: false, verbosity: 'normal'}))
				.toEqual('before  after (before <%emptyVar%> after)');
		});

		it('should leave text as it is when variables undefined', () => {
			expect(formatVariables('some text')).toEqual(<input>some text</input>);
			expect(formatVariables('<%someVar%>')).toEqual(<input>{'<%someVar%>'}</input>);
		});
	});

	describe('formatVariableWithUnit util', () => {
		it('should append the unit to a resolved variable value', () => {
			expect(formatVariableWithUnit('<%var1%>', 'px', vars))
				.toEqual(<fragment><input>123px</input> (<code>{'<%var1%>'}</code>)</fragment>);
		});

		it('should display an empty variable value without the unit', () => {
			expect(formatVariableWithUnit('<%emptyVar%>', 'px', vars))
				.toEqual(
					<fragment><input>[EMPTY STRING]</input> (<code>{'<%emptyVar%>'}</code>)</fragment>,
				);
		});

		it('should append the unit to a value resolved from empty and non-empty variables', () => {
			expect(formatVariableWithUnit('<%emptyVar%><%var1%>', 'px', vars))
				.toEqual(
					<fragment><input>123px</input> (<code>{'<%emptyVar%><%var1%>'}</code>)</fragment>,
				);
		});

		it('should return undefined when no variable was resolved', () => {
			expect(formatVariableWithUnit('<%unknown%>', 'px', vars)).toBeUndefined();
			expect(formatVariableWithUnit('<%var1%>', 'px')).toBeUndefined();
		});
	});

	describe('formatTimeout util', () => {
		it('should format timeout with variables', () => {
			expect(formatTimeout('<%var1%>', vars))
				.toEqual(<fragment><input>0.123s</input> (<code>{'<%var1%>'}</code>)</fragment>);
			expect(formatTimeout('<%var1%><%var2%>', vars))
				.toEqual(<fragment><input>123.456s</input> (<code>{'<%var1%><%var2%>'}</code>)</fragment>);
		});

		it('should display empty variable values instead of formatting them as zero', () => {
			expect(formatTimeout('<%emptyVar%>', vars))
				.toEqual(
					<fragment><input>[EMPTY STRING]</input> (<code>{'<%emptyVar%>'}</code>)</fragment>,
				);
		});

		it('should preserve numeric formatting when empty and non-empty variables are mixed', () => {
			expect(formatTimeout('<%emptyVar%><%var1%>', vars))
				.toEqual(
					<fragment><input>0.123s</input> (<code>{'<%emptyVar%><%var1%>'}</code>)</fragment>,
				);
		});

		it('should leave numbers without variables untouched', () => {
			expect(formatTimeout(1500, vars)).toEqual(<input>1.5s</input>);
			expect(formatTimeout(2000, vars)).toEqual(<input>2s</input>);
		});

		it('should display invalid values as is', () => {
			expect(formatTimeout('<%unknown%>', vars)).toEqual(<input>{'<%unknown%>'}</input>);
			expect(formatTimeout('abc', vars)).toEqual(<input>abc</input>);
		});

		it('should working without variables', () => {
			expect(formatTimeout('<%var1%>')).toEqual(<input>{'<%var1%>'}</input>);
			expect(formatTimeout('abc')).toEqual(<input>abc</input>);
			expect(formatTimeout('300')).toEqual(<input>0.3s</input>);
		});
	});

	describe('formatCount util', () => {
		it('should format count with variables', () => {
			expect(formatCount('<%var1%>', vars))
				.toEqual(<fragment><input>123</input>x (<code>{'<%var1%>'}</code>)</fragment>);
			expect(formatCount('<%var1%><%var2%>', vars))
				.toEqual(<fragment><input>123456</input>x (<code>{'<%var1%><%var2%>'}</code>)</fragment>);
		});

		it('should display empty variable values instead of formatting them as zero', () => {
			expect(formatCount('<%emptyVar%>', vars))
				.toEqual(
					<fragment><input>[EMPTY STRING]</input> (<code>{'<%emptyVar%>'}</code>)</fragment>,
				);
		});

		it('should preserve numeric formatting when empty and non-empty variables are mixed', () => {
			expect(formatCount('<%emptyVar%><%var1%>', vars))
				.toEqual(
					<fragment><input>123</input>x (<code>{'<%emptyVar%><%var1%>'}</code>)</fragment>,
				);
		});

		it('should leave numbers without variables untouched', () => {
			expect(formatCount(15, vars)).toEqual(<fragment><input>15</input>x</fragment>);
			expect(formatCount(2, vars)).toEqual(<fragment><input>2</input>x</fragment>);
		});

		it('should display invalid values as is', () => {
			expect(formatCount('<%unknown%>', vars)).toEqual(<input>{'<%unknown%>'}</input>);
			expect(formatCount('abc', vars)).toEqual(<input>abc</input>);
		});

		it('should return formatted numbers with undefined variables', () => {
			expect(formatCount(15)).toEqual(<fragment><input>15</input>x</fragment>);
			expect(formatCount('<%unknown%>')).toEqual(<input>{'<%unknown%>'}</input>);
			expect(formatCount('abc')).toEqual(<input>abc</input>);
		});
	});
});
