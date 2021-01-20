import {jsx} from '@suitest/smst';
import {toHtml, escapeHtml, escapeUrl} from '../toHtml';

describe('AST renderers', () => {
	const defaultOptions = {verbosity: 'normal' as const};
	const plainText = <fragment>TEXT</fragment>;
	const subjectText = <subject>SUBJECT</subject>;
	const inputText = <input>INPUT</input>;
	const codeText = <code>CODE</code>;

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
			status="fail"
		/>
	</props>;

	const simpleCondition = <condition
		title={<fragment>element <subject>My element</subject> exists</fragment>}
	/>;
	const longCondition = <condition
		title={<fragment>element <subject>My element</subject> exists</fragment>}
	>{longProps}</condition>;
	const simpleLine = <test-line
		title={<fragment>Assert element <subject>My element</subject> is visible</fragment>}
	/>;
	const longLine = <test-line title={<fragment>Assert element <subject>My element</subject></fragment>}>
		{simpleCondition}
	</test-line>;

	const failResult = (screenshot?: string): JSX.Element => <test-line-result
		status="fail"
		message={<text>Condition was not met</text>}
		screenshot={screenshot}
		docs="//link/to/docs"
	>
		<test-line
			title={<fragment>Assert element <subject>My element</subject></fragment>}
			status="fail"
		>
			<condition
				title={<fragment>element <subject>My element</subject> exists</fragment>}
				status="fail"
			/>
		</test-line>
	</test-line-result>;
	const warningResult = (screenshot?: string): JSX.Element => <test-line-result
		status="warning"
		screenshot={screenshot}
	>
		<test-line
			title={<text>Assert application has exited</text>}
			status="warning"
		/>
	</test-line-result>;
	const exitResult = (screenshot?: string): JSX.Element => <test-line-result
		status="exit"
		screenshot={screenshot}
	>
		<test-line
			title={<text>Assert application has exited</text>}
			status="exit"
		/>
	</test-line-result>;
	const excludedResult = (screenshot?: string): JSX.Element => <test-line-result
		status="excluded"
		screenshot={screenshot}
	>
		<test-line
			title={<text>Assert application has exited</text>}
			status="excluded"
		/>
	</test-line-result>;
	const fatalResult = (screenshot?: string): JSX.Element => <test-line-result
		status="fatal"
		screenshot={screenshot}
	>
		<test-line
			title={<text>Assert application has exited</text>}
			status="fatal"
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

	describe('html renderer', () => {
		it('should handle textual nodes', () => {
			expect(toHtml(plainText, defaultOptions)).toEqual('TEXT');
			expect(toHtml(subjectText, defaultOptions)).toEqual('<span class="suitest-test-line__text--subject">SUBJECT</span>');
			expect(toHtml(inputText, defaultOptions)).toEqual('<span class="suitest-test-line__text--input">INPUT</span>');
			expect(toHtml(codeText, defaultOptions)).toEqual('<code class="suitest-test-line__text--code">CODE</code>');
		});

		it('should handle code blocks', () => {
			expect(toHtml(simpleCodeBlock, defaultOptions)).toMatchSnapshot();
			expect(toHtml(longCodeBlock, defaultOptions)).toMatchSnapshot();
		});

		it('should handle tables', () => {
			expect(toHtml(simpleProps, defaultOptions)).toMatchSnapshot();
			expect(toHtml(longProps, defaultOptions)).toMatchSnapshot();
		});

		it('should render condition', () => {
			expect(toHtml(simpleCondition, defaultOptions)).toMatchSnapshot();
			expect(toHtml(longCondition, defaultOptions)).toMatchSnapshot();
		});

		it('should render test line', () => {
			expect(toHtml(simpleLine, defaultOptions)).toMatchSnapshot();
			expect(toHtml(longLine, defaultOptions)).toMatchSnapshot();
		});

		it('should render alerts', () => {
			expect(toHtml(failResult(), defaultOptions)).toMatchSnapshot();
			expect(toHtml(warningResult(), defaultOptions)).toMatchSnapshot();
			expect(toHtml(exitResult(), defaultOptions)).toMatchSnapshot();
			expect(toHtml(excludedResult(), defaultOptions)).toMatchSnapshot();
			expect(toHtml(fatalResult(), defaultOptions)).toMatchSnapshot();
			expect(toHtml(abortedResult(), defaultOptions)).toMatchSnapshot();
		});

		it('should render results with quiet level', () => {
			expect(toHtml(failResult(), {verbosity: 'quiet'})).toMatchSnapshot();
			expect(toHtml(warningResult(), {verbosity: 'quiet'})).toMatchSnapshot();
			expect(toHtml(exitResult(), {verbosity: 'quiet'})).toMatchSnapshot();
			expect(toHtml(excludedResult(), {verbosity: 'quiet'})).toMatchSnapshot();
			expect(toHtml(fatalResult(), {verbosity: 'quiet'})).toMatchSnapshot();
			expect(toHtml(abortedResult(), { verbosity: 'quiet'})).toMatchSnapshot();
		});

		it('should render test lines with quiet level', () => {
			expect(toHtml(failResult(), {verbosity: 'quiet'})).toMatchSnapshot();
		});

		it('should render test lines with normal level', () => {
			expect(toHtml(failResult(), {verbosity: 'normal'})).toMatchSnapshot();
		});

		it('should render test lines with verbose level', () => {
			expect(toHtml(failResult(), {verbosity: 'verbose'})).toMatchSnapshot();
		});

		it('should render results with screenshots', () => {
			const screenshot = 'path/to/screenshot.png';
			expect(toHtml(failResult(screenshot), defaultOptions)).toMatchSnapshot();
			expect(toHtml(warningResult(screenshot), defaultOptions)).toMatchSnapshot();
			expect(toHtml(exitResult(screenshot), defaultOptions)).toMatchSnapshot();
			expect(toHtml(excludedResult(screenshot), defaultOptions)).toMatchSnapshot();
			expect(toHtml(fatalResult(screenshot), defaultOptions)).toMatchSnapshot();
			expect(toHtml(abortedResult(screenshot), defaultOptions)).toMatchSnapshot();
		});

		it('should render link', () => {
			expect(toHtml(<link href="http://some.url">Some URL</link>, defaultOptions)).toMatchSnapshot();
			expect(toHtml(<link href="http://some.url">http://some.url</link>, defaultOptions)).toMatchSnapshot();
			expect(toHtml(<link href="http://some.url"/>, defaultOptions)).toMatchSnapshot();
		});
	});

	describe('escape html tags', () => {
		const script = '<script>alert("xss")</script>';
		expect(toHtml(<fragment>{script}</fragment>, defaultOptions)).toMatchSnapshot();
		expect(toHtml(<subject>{script}</subject>, defaultOptions)).toMatchSnapshot();
		expect(toHtml(<input>{script}</input>, defaultOptions)).toMatchSnapshot();
		expect(toHtml(<code>{script}</code>, defaultOptions)).toMatchSnapshot();
		expect(toHtml(<code-block>{script}</code-block>, defaultOptions)).toMatchSnapshot();
		expect(toHtml(<text>{script}</text>, defaultOptions)).toMatchSnapshot();
	});

	describe('escape URLs', () => {
		expect(<link href={'?<script>alert("xss")</script>'}>TEST</link>).toMatchSnapshot();
	});

	describe('Translation utils', () => {
		describe('escapeHtml util', () => {
			it('should escape special characters', () => {
				expect(escapeHtml('& < " \'')).toEqual('&amp; &lt; &quot; &#039;');
			});

			it('should replace entities even if they repeat', () => {
				expect(escapeHtml('&&&')).toEqual('&amp;&amp;&amp;');
			});
		});

		describe('escapeUri util', () => {
			it('should escape special characters', () => {
				expect(escapeUrl('& < " \'')).toEqual('&#x0026 &#x003c &#x0022 &#x0027');
			});

			it('should replace entities even if they repeat', () => {
				expect(escapeUrl('&&&')).toEqual('&#x0026&#x0026&#x0026');
			});

			it('should return nothing if URL starts with javascript:', () => {
				expect(escapeUrl('javascript:alert("xss")')).toEqual('');
			});
		});
	});
});
