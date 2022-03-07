import {jsx} from '@suitest/smst';
import {escapeControlChars, toText, wrapTextNodes} from '../toText';
import {Verbosity} from '@suitest/smst/types/unistTestLine';

describe('AST renderers', () => {
	const plainText = <text>TEXT</text>;
	const subjectText = <subject>SUBJECT</subject>;
	const inputText = <input>INPUT</input>;
	const codeText = <code>CODE</code>;
	const mixedText = <fragment>TEXT <subject>SUBJ</subject> TEXT</fragment>;
	const emptyText = <text>{''}</text>;

	const simpleCodeBlock = <code-block>someJS();</code-block>;
	const longCodeBlock = <code-block>
		someJS(); someJS(); someJS(); someJS();{'\n'}someJS(); someJS(); someJS();{'\n'}someJS(); someJS(); someJS();
	</code-block>;

	const simpleProps = <props>
		<prop
			name={<text>prop name</text>}
			expectedValue={<text>expected value</text>}
			comparator="="
		/>
		<prop
			name={<text>prop name</text>}
			expectedValue={simpleCodeBlock}
			comparator=""
		/>
	</props>;
	const longProps = <props>
		<prop
			name={<text>prop name prop name prop name prop name prop name</text>}
			expectedValue={<text>expected value expected value expected value expected value expected value</text>}
			comparator="~"
			actualValue="expected value expected value expected value expected value expected value"
			status="fail"
		/>
		<prop
			name={<text>JavaScript expression</text>}
			expectedValue={longCodeBlock}
			comparator=""
			status="success"
		/>
	</props>;

	const simpleCondition = <condition
		title={<fragment>condition: element <subject>My element</subject> exists</fragment>}
	/>;
	const longCondition = <condition
		title={<fragment>condition: element <subject>My element</subject> exists</fragment>}
		status="fail"
	>{longProps}</condition>;
	const simpleLine = <test-line
		title={<fragment>Assert element <subject>My element</subject> is visible</fragment>}
	/>;
	const simpleLineExcluded = <test-line
		status="excluded"
		title={<fragment>Assert element <subject>My element</subject> is visible</fragment>}
	/>;
	const longLine = <test-line
		title={<fragment>Press <input>OK</input>, <input>LEFT</input> only if condition is met</fragment>}
	>
		{simpleCondition}
	</test-line>;

	const failResult = (screenshot?: string): JSX.Element => <test-line-result
		status="fail"
		message={<text>Condition was not met</text>}
		screenshot={screenshot}
		docs="http://suite.st/docs/"
	>
		<test-line
			title={<fragment>Run test <subject>My test</subject> until condition is met max 5x every 5s</fragment>}
			status="fail"
		>{longCondition}</test-line>
	</test-line-result>;
	const warningResult = (screenshot?: string): JSX.Element => <test-line-result
		status="warning"
		message={<text>Some warning message</text>}
		screenshot={screenshot}
		docs="http://suite.st/docs/"
	>
		<test-line
			title={<text>Assert application has exited</text>}
			status="warning"
		/>
	</test-line-result>;
	const exitResult = (screenshot?: string): JSX.Element => <test-line-result
		status="exit"
		message={<text>Condition was met</text>}
		screenshot={screenshot}
	>
		<test-line
			title={<text>Assert application has exited</text>}
			status="exit"
		/>
	</test-line-result>;
	const excludedResult = (screenshot?: string): JSX.Element => <test-line-result
		status="excluded"
		message={<text>Line was not executed</text>}
		screenshot={screenshot}
	>
		<test-line
			title={<fragment>Press <input>OK</input> only if condition is met</fragment>}
			status="excluded"
		>{simpleCondition}</test-line>
	</test-line-result>;
	const fatalResult = (screenshot?: string): JSX.Element => <test-line-result
		status="fatal"
		message={<text>Some generic error message</text>}
		screenshot={screenshot}
	>
		<test-line
			title={<text>Assert application has exited</text>}
			status="fatal"
		/>
	</test-line-result>;
	const successResultWithScreenshot = (screenshot?: string): JSX.Element => <test-line-result
		status="success"
		screenshot={screenshot}
	>
		<test-line
			title={<text>Assert application has exited</text>}
			status="success"
		/>
	</test-line-result>;
	const abortedResult = (screenshot?: string): JSX.Element => <test-line-result
		status="aborted"
		message={<text>Execution was aborted.</text>}
		screenshot={screenshot}
	>
		<test-line
			title={<fragment>Sleep 10s</fragment>}
			status="aborted"
		/>
	</test-line-result>;

	function runTests(options: {format: boolean, verbosity: Verbosity}): void {
		it('should handle code blocks', () => {
			expect(toText(simpleCodeBlock, options)).toMatchSnapshot();
			expect(toText(longCodeBlock, options)).toMatchSnapshot();
		});

		it('should render results with different verbosity level', () => {
			expect(toText(simpleLine, {...options, verbosity: 'verbose'})).toMatchSnapshot();
			expect(toText(failResult(), {...options, verbosity: 'quiet'})).toMatchSnapshot();
		});

		it('should handle props', () => {
			expect(toText(simpleProps, options)).toMatchSnapshot();
			expect(toText(longProps, options)).toMatchSnapshot();
			expect(toText(<props>
				<prop
					name={<text>test</text>}
					expectedValue={<text>short</text>}
					actualValue="long long long"
				/>
			</props>, options)).toMatchSnapshot();
			expect(toText(<props>
				<prop
					name={<text>Empty string</text>}
					expectedValue={<text>{''}</text>}
					actualValue={''}
					comparator={'contains'}
				/>
				<prop
					name={<text>Empty number</text>}
					expectedValue={<text>0</text>}
					actualValue={NaN}
					comparator={'>'}
				/>
				<prop
					name={<text>Empty code block</text>}
					expectedValue={<fragment><code>{'looooooooooooooo oooooooo ooooooo ooooo ooooo oooooooooo oooo oooo ng'}</code> (and some next text block)</fragment>}
					comparator={'='}
				/>
			</props>, options)).toMatchSnapshot();
			expect(toText(<props>
				<prop
					status="fail"
					name={<fragment>request <text>header</text> name</fragment>}
					comparator="="
					expectedValue="another header"
				/>
				<prop
					status="success"
					name={<fragment>request <text>header</text> some name</fragment>}
					comparator="="
					expectedValue="another header"
				/>
				<prop
					name={<fragment>request <text>header</text> some loong name</fragment>}
					comparator="="
					expectedValue="another header"
				/>
				<prop
					status="fail"
					name={<fragment>request <text>header</text> another name</fragment>}
					comparator="="
					expectedValue="another header"
				/>
			</props>, options)).toMatchSnapshot();
		});

		it('should throw if trying to render a single prop', () => {
			expect(() => toText(<prop name={<text>prop</text>} expectedValue={<text>test</text>} />, options))
				.toThrow();
		});

		it('should render condition', () => {
			expect(toText(simpleCondition, options)).toMatchSnapshot();
			expect(toText(longCondition, options)).toMatchSnapshot();
		});

		it('should render test line', () => {
			expect(toText(simpleLine, options)).toMatchSnapshot();
			expect(toText(longLine, options)).toMatchSnapshot();
			expect(toText(simpleLineExcluded, options)).toMatchSnapshot();
		});

		it('should render test line results', () => {
			expect(toText(failResult(), options)).toMatchSnapshot();
			expect(toText(warningResult(), options)).toMatchSnapshot();
			expect(toText(exitResult(), options)).toMatchSnapshot();
			expect(toText(excludedResult(), options)).toMatchSnapshot();
			expect(toText(fatalResult(), options)).toMatchSnapshot();
			expect(toText(successResultWithScreenshot(), options)).toMatchSnapshot();
			expect(toText(abortedResult(), options)).toMatchSnapshot();
		});

		it('should render test line results with screenshots', () => {
			const screenshot = 'path/to/screenshot.png';
			expect(toText(failResult(screenshot), options)).toMatchSnapshot();
			expect(toText(warningResult(screenshot), options)).toMatchSnapshot();
			expect(toText(exitResult(screenshot), options)).toMatchSnapshot();
			expect(toText(excludedResult(screenshot), options)).toMatchSnapshot();
			expect(toText(fatalResult(screenshot), options)).toMatchSnapshot();
			expect(toText(successResultWithScreenshot(screenshot), options)).toMatchSnapshot();
			expect(toText(abortedResult(), options)).toMatchSnapshot();

			expect(toText(failResult(screenshot), {...options, verbosity: 'quiet'})).toMatchSnapshot();
			expect(toText(warningResult(screenshot), {...options, verbosity: 'quiet'})).toMatchSnapshot();
			expect(toText(exitResult(screenshot), {...options, verbosity: 'quiet'})).toMatchSnapshot();
			expect(toText(abortedResult(), {...options, verbosity: 'quiet'})).toMatchSnapshot();

			expect(toText(failResult(screenshot), {...options, verbosity: 'verbose'})).toMatchSnapshot();
			expect(toText(warningResult(screenshot), {...options, verbosity: 'verbose'})).toMatchSnapshot();
			expect(toText(exitResult(screenshot), {...options, verbosity: 'verbose'})).toMatchSnapshot();
			expect(toText(abortedResult(), {...options, verbosity: 'verbose'})).toMatchSnapshot();
		});
	}

	describe('plain text renderer', () => {
		const options = {format: false, verbosity: 'normal' as const};
		it('should handle textual nodes', () => {
			expect(toText(plainText, options)).toEqual('TEXT');
			expect(toText(subjectText, options)).toEqual('SUBJECT');
			expect(toText(inputText, options)).toEqual('INPUT');
			expect(toText(codeText, options)).toEqual('CODE');
			expect(toText(mixedText, options)).toEqual('TEXT SUBJ TEXT');
			expect(toText(emptyText, options)).toEqual('');
		});

		runTests(options);
	});

	describe('formatted text renderer', () => {
		const options = {format: true, verbosity: 'normal' as const};
		it('should handle textual nodes', () => {
			expect(toText(plainText, options)).toEqual('TEXT');
			expect(toText(subjectText, options)).toEqual('\u001b[32mSUBJECT\u001b[0m');
			expect(toText(inputText, options)).toEqual('\u001b[4mINPUT\u001b[0m');
			expect(toText(codeText, options)).toEqual('\u001b[36mCODE\u001b[0m');
			expect(toText(mixedText, options)).toEqual('TEXT \u001b[32mSUBJ\u001b[0m TEXT');
			expect(toText(emptyText, options)).toEqual('');
		});

		runTests(options);
	});

	describe('wrapped title and error messages', () => {
		const renderLongTexts = (format: boolean): void => {
			const options = {format, verbosity: 'normal' as const};
			expect(toText(<test-line-result
				status="fail"
				message={<text>Subject does not exist a very loooo oooooo ooooo ooooooo oooooo oooooo oooong error
					message, possibly including "description" part for notStarterReason</text>}
			>
				<test-line
					title={<fragment>Run test
						<subject>My loooooooooo ooooo ooo oooooo ooooooo ooooooo ooooooo ooooo ooooo ng!
							test</subject> until condition is met max 5x every 5s</fragment>}
					status="fail"
				>{longCondition}</test-line>
			</test-line-result>, options)).toMatchSnapshot();
			expect(toText(<test-line-result
				status="fail"
				message={<text>Subject does not exist a very not so loooooooong error message,
					possibly including "description" part for notStarterReason</text>}
			>
				<test-line
					title={<fragment>Run test <subject>My not so loooooooooong! test</subject> until condition
						is met max 5x every 5s</fragment>}
					status="fail"
				>{longCondition}</test-line>
			</test-line-result>, options)).toMatchSnapshot();
		};

		renderLongTexts(true);
		renderLongTexts(false);
	});

	it('render line result with messages that contains links', () => {
		expect(toText(
			<test-line-result
				status="fail"
				message={<fragment>Some unknown error, pls check <link href="http://some.url">docs</link></fragment>}
			>
				{simpleLine}
			</test-line-result>
		)).toMatchSnapshot();
	});

	it('render link', () => {
		const options = {format: true, verbosity: 'normal' as const};
		expect(toText(<link href="http://some.url">Some URL</link>, options)).toEqual('Some URL (http://some.url)');
		expect(toText(<link href="http://some.url">http://some.url</link>, options)).toEqual('http://some.url');
		expect(toText(<link href="http://some.url"/>, options)).toEqual('http://some.url');
	});

	describe('escape control chars util', () => {
		it('should escape all ASCII control chars and leave normal text untouched', () => {
			expect(escapeControlChars('\u0001 \u001F~\u007F\u00A0\u009F'))
				.toEqual('\uFFFD \uFFFD~\uFFFD \uFFFD');
		});

		it('should be used in toText function when rendering textual content without formatting', () => {
			const options = {format: false, verbosity: 'normal' as const};
			expect(toText(<text>{'\u0001'}</text>, options)).toEqual('\uFFFD');
			expect(toText(<subject>{'\u0001'}</subject>, options)).toEqual('\uFFFD');
			expect(toText(<input>{'\u0001'}</input>, options)).toEqual('\uFFFD');
			expect(toText(<code>{'\u0001'}</code>, options)).toEqual('\uFFFD');
		});

		it('should be used in toText function when rendering textual content with formatting', () => {
			const options = {format: true, verbosity: 'normal' as const};
			expect(toText(<text>{'\u0001'}</text>, options)).toEqual('\uFFFD');
			expect(toText(<subject>{'\u0001'}</subject>, options)).toEqual('\u001b[32m\uFFFD\u001b[0m');
			expect(toText(<input>{'\u0001'}</input>, options)).toEqual('\u001b[4m\uFFFD\u001b[0m');
			expect(toText(<code>{'\u0001'}</code>, options)).toEqual('\u001b[36m\uFFFD\u001b[0m');
		});
	});

	describe('text wrapper util', () => {
		it('should wrap long text', () => {
			expect(wrapTextNodes(
				[{type: 'text', value: '1234567890'}],
				node => node.value,
				5
			)).toEqual([5, ['12345', '67890']]);

			expect(wrapTextNodes(
				[{type: 'text', value: '1234567890'}],
				node => node.value,
				6
			)).toEqual([6, ['123456', '7890']]);
		});

		it('should not wrap short text', () => {
			expect(wrapTextNodes(
				[{type: 'text', value: '123'}],
				node => node.value,
				5
			)).toEqual([3, ['123']]);
		});

		it('should handle newline characters correctly', () => {
			expect(wrapTextNodes(
				[{type: 'text', value: '123\n456\r789\r\n0'}],
				node => node.value,
				5
			)).toEqual([3, ['123', '456', '789', '0']]);
		});

		it('should calculate correct length for the control characters to prevent misalignment', () => {
			expect(wrapTextNodes(
				[{type: 'text', value: '123\u001b4'}],
				node => escapeControlChars(node.value),
				3
			)).toEqual([3, ['123', '\uFFFD4']]);
		});
	});
});
