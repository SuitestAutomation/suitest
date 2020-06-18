import {jsx} from '@suitest/smst';
import {toText} from '../toText';
import {LinkNode, Verbosity} from '@suitest/smst/types/unistTestLine';

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
		docs={<link href="http://suite.st/docs/"/> as LinkNode}
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
				/>
				<prop
					name={<text>Empty number</text>}
					expectedValue={<text>0</text>}
					actualValue={NaN}
				/>
				<prop
					name={<text>Empty code block</text>}
					expectedValue={<fragment><code>{'looooooooooooooo oooooooo ooooooo ooooo ooooo oooooooooo oooo oooo ng'}</code> (and some next text block)</fragment>}
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
		});

		it('should render test line results', () => {
			expect(toText(failResult(), options)).toMatchSnapshot();
			expect(toText(warningResult(), options)).toMatchSnapshot();
			expect(toText(exitResult(), options)).toMatchSnapshot();
			expect(toText(excludedResult(), options)).toMatchSnapshot();
			expect(toText(fatalResult(), options)).toMatchSnapshot();
			expect(toText(successResultWithScreenshot(), options)).toMatchSnapshot();
		});

		it('should render test line results with screenshots', () => {
			const screenshot = 'path/to/screenshot.png';
			expect(toText(failResult(screenshot), options)).toMatchSnapshot();
			expect(toText(warningResult(screenshot), options)).toMatchSnapshot();
			expect(toText(exitResult(screenshot), options)).toMatchSnapshot();
			expect(toText(excludedResult(screenshot), options)).toMatchSnapshot();
			expect(toText(fatalResult(screenshot), options)).toMatchSnapshot();
			expect(toText(successResultWithScreenshot(screenshot), options)).toMatchSnapshot();

			expect(toText(failResult(screenshot), {...options, verbosity: 'quiet'})).toMatchSnapshot();
			expect(toText(warningResult(screenshot), {...options, verbosity: 'quiet'})).toMatchSnapshot();
			expect(toText(exitResult(screenshot), {...options, verbosity: 'quiet'})).toMatchSnapshot();

			expect(toText(failResult(screenshot), {...options, verbosity: 'verbose'})).toMatchSnapshot();
			expect(toText(warningResult(screenshot), {...options, verbosity: 'verbose'})).toMatchSnapshot();
			expect(toText(exitResult(screenshot), {...options, verbosity: 'verbose'})).toMatchSnapshot();
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

	it('render link', () => {
		const options = {format: true, verbosity: 'normal' as const};
		expect(toText(<link href="http://some.url">Some URL</link>, options)).toEqual('Some URL (http://some.url)');
		expect(toText(<link href="http://some.url">http://some.url</link>, options)).toEqual('http://some.url');
		expect(toText(<link href="http://some.url"/>, options)).toEqual('http://some.url');
	});
});
