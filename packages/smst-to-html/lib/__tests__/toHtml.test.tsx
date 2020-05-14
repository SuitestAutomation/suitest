import {jsx} from '@suitest/smst/commonjs/jsxFactory';
import {toHtml} from '../toHtml';

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

	const failResult = <test-line-result status="fail" message={<text>Condition was not met</text>}>
		<test-line
			title={<text>Assert application has exited</text>}
			status="fail"
		/>
	</test-line-result>;
	const warningResult = <test-line-result status="warning">
		<test-line
			title={<text>Assert application has exited</text>}
			status="warning"
		/>
	</test-line-result>;
	const exitResult = <test-line-result status="exit">
		<test-line
			title={<text>Assert application has exited</text>}
			status="exit"
		/>
	</test-line-result>;
	const excludedResult = <test-line-result status="excluded">
		<test-line
			title={<text>Assert application has exited</text>}
			status="excluded"
		/>
	</test-line-result>;
	const fatalResult = <test-line-result status="fatal">
		<test-line
			title={<text>Assert application has exited</text>}
			status="fatal"
		/>
	</test-line-result>;

	describe('html renderer', () => {
		it('should handle textual nodes', () => {
			expect(toHtml(plainText)).toEqual('TEXT');
			expect(toHtml(subjectText)).toEqual('<span class="suitest-test-line__text--bold">SUBJECT</span>');
			expect(toHtml(inputText)).toEqual('<span class="suitest-test-line__text--emphasis">INPUT</span>');
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
			expect(toHtml(failResult)).toMatchSnapshot();
			expect(toHtml(warningResult)).toMatchSnapshot();
			expect(toHtml(exitResult)).toMatchSnapshot();
			expect(toHtml(excludedResult)).toMatchSnapshot();
			expect(toHtml(fatalResult)).toMatchSnapshot();
		});
	});
});
