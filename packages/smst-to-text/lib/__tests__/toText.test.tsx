import {jsx} from '@suitest/smst';
import {toText} from '../toText';

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

	function runTests(formatted = false): void {
		it('should handle code blocks', () => {
			expect(toText(simpleCodeBlock, formatted)).toMatchSnapshot();
			expect(toText(longCodeBlock, formatted)).toMatchSnapshot();
		});

		it('should handle props', () => {
			expect(toText(simpleProps, formatted)).toMatchSnapshot();
			expect(toText(longProps, formatted)).toMatchSnapshot();
			expect(toText(<props>
				<prop
					name={<text>test</text>}
					expectedValue={<text>short</text>}
					actualValue="long long long"
				/>
			</props>, formatted)).toMatchSnapshot();
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
			</props>)).toMatchSnapshot();
		});

		it('should throw if trying to render a single prop', () => {
			expect(() => toText(<prop name={<text>prop</text>} expectedValue={<text>test</text>} />)).toThrow();
		});

		it('should render condition', () => {
			expect(toText(simpleCondition, formatted)).toMatchSnapshot();
			expect(toText(longCondition, formatted)).toMatchSnapshot();
		});

		it('should render test line', () => {
			expect(toText(simpleLine, formatted)).toMatchSnapshot();
			expect(toText(longLine, formatted)).toMatchSnapshot();
		});

		it('should render test line results', () => {
			expect(toText(failResult(), formatted)).toMatchSnapshot();
			expect(toText(warningResult(), formatted)).toMatchSnapshot();
			expect(toText(exitResult(), formatted)).toMatchSnapshot();
			expect(toText(excludedResult(), formatted)).toMatchSnapshot();
			expect(toText(fatalResult(), formatted)).toMatchSnapshot();
			expect(toText(successResultWithScreenshot(), formatted)).toMatchSnapshot();
		});

		it('should render test line results with screenshots', () => {
			const screenshot = 'path/to/screenshot.png';
			expect(toText(failResult(screenshot), formatted)).toMatchSnapshot();
			expect(toText(warningResult(screenshot), formatted)).toMatchSnapshot();
			expect(toText(exitResult(screenshot), formatted)).toMatchSnapshot();
			expect(toText(excludedResult(screenshot), formatted)).toMatchSnapshot();
			expect(toText(fatalResult(screenshot), formatted)).toMatchSnapshot();
			expect(toText(successResultWithScreenshot(screenshot), formatted)).toMatchSnapshot();
		});
	}

	describe('plain text renderer', () => {
		it('should handle textual nodes', () => {
			expect(toText(plainText, false)).toEqual('TEXT');
			expect(toText(subjectText, false)).toEqual('SUBJECT');
			expect(toText(inputText, false)).toEqual('INPUT');
			expect(toText(codeText, false)).toEqual('CODE');
			expect(toText(mixedText, false)).toEqual('TEXT SUBJ TEXT');
			expect(toText(emptyText, false)).toEqual('');
		});

		runTests(false);
	});

	describe('formatted text renderer', () => {
		it('should handle textual nodes', () => {
			expect(toText(plainText, true)).toEqual('TEXT');
			expect(toText(subjectText, true)).toEqual('\u001b[32mSUBJECT\u001b[0m');
			expect(toText(inputText, true)).toEqual('\u001b[4mINPUT\u001b[0m');
			expect(toText(codeText, true)).toEqual('\u001b[36mCODE\u001b[0m');
			expect(toText(mixedText, true)).toEqual('TEXT \u001b[32mSUBJ\u001b[0m TEXT');
			expect(toText(emptyText, true)).toEqual('');
		});

		runTests(true);
	});

	describe('wrapped title and error messages', () => {
		const renderLongTexts = (format: boolean): void => {
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
			</test-line-result>, format)).toMatchSnapshot();
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
			</test-line-result>, format)).toMatchSnapshot();
		};

		renderLongTexts(true);
		renderLongTexts(false);
	});

	it('render link', () => {
		expect(toText(<link href="http://some.url">Some URL</link>)).toEqual('Some URL (http://some.url)');
		expect(toText(<link href="http://some.url">http://some.url</link>)).toEqual('http://some.url');
		expect(toText(<link href="http://some.url"/>)).toEqual('http://some.url');
	});
});
