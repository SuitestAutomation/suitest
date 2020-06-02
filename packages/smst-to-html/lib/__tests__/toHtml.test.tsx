import {jsx} from '@suitest/smst';
import {toHtml, escapeHtml} from '../toHtml';

describe('AST renderers', () => {
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
		title={<fragment>condition: element <subject>My element</subject> exists</fragment>}
	/>;
	const longCondition = <condition
		title={<fragment>condition: element <subject>My element</subject> exists</fragment>}
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
	>
		<test-line
			title={<text>Assert application has exited</text>}
			status="fail"
		/>
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

	describe('html renderer', () => {
		it('should handle textual nodes', () => {
			expect(toHtml(plainText)).toEqual('TEXT');
			expect(toHtml(subjectText)).toEqual('<span class="suitest-test-line__text--subject">SUBJECT</span>');
			expect(toHtml(inputText)).toEqual('<span class="suitest-test-line__text--input">INPUT</span>');
			expect(toHtml(codeText)).toEqual('<code class="suitest-test-line__text--code">CODE</code>');
		});

		it('should handle code blocks', () => {
			expect(toHtml(simpleCodeBlock)).toMatchSnapshot();
			expect(toHtml(longCodeBlock)).toMatchSnapshot();
		});

		it('should handle tables', () => {
			expect(toHtml(simpleProps)).toMatchSnapshot();
			expect(toHtml(longProps)).toMatchSnapshot();
		});

		it('should render condition', () => {
			expect(toHtml(simpleCondition)).toMatchSnapshot();
			expect(toHtml(longCondition)).toMatchSnapshot();
		});

		it('should render test line', () => {
			expect(toHtml(simpleLine)).toMatchSnapshot();
			expect(toHtml(longLine)).toMatchSnapshot();
		});

		it('should render alerts', () => {
			expect(toHtml(failResult())).toMatchSnapshot();
			expect(toHtml(warningResult())).toMatchSnapshot();
			expect(toHtml(exitResult())).toMatchSnapshot();
			expect(toHtml(excludedResult())).toMatchSnapshot();
			expect(toHtml(fatalResult())).toMatchSnapshot();
		});

		it('should render results with screenshots', () => {
			const screenshot = 'path/to/screenshot.png';
			expect(toHtml(failResult(screenshot))).toMatchSnapshot();
			expect(toHtml(warningResult(screenshot))).toMatchSnapshot();
			expect(toHtml(exitResult(screenshot))).toMatchSnapshot();
			expect(toHtml(excludedResult(screenshot))).toMatchSnapshot();
			expect(toHtml(fatalResult(screenshot))).toMatchSnapshot();
		});

		it('should render link', () => {
			expect(toHtml(<link href="http://some.url">Some URL</link>)).toMatchSnapshot();
			expect(toHtml(<link href="http://some.url">http://some.url</link>)).toMatchSnapshot();
			expect(toHtml(<link href="http://some.url"/>)).toMatchSnapshot();
		});
	});

	describe('escape html tags', () => {
		const script = '<script>alert("xss")</script>';
		expect(toHtml(<fragment>{script}</fragment>)).toMatchSnapshot();
		expect(toHtml(<subject>{script}</subject>)).toMatchSnapshot();
		expect(toHtml(<input>{script}</input>)).toMatchSnapshot();
		expect(toHtml(<code>{script}</code>)).toMatchSnapshot();
		expect(toHtml(<code-block>{script}</code-block>)).toMatchSnapshot();
		expect(toHtml(<text>{script}</text>)).toMatchSnapshot();
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
	});
});
