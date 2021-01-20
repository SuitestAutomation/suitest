import {CodeBlockNode, CodeNode, InputNode, Node, SubjectNode, TextNode} from '../../types/unistTestLine';
import {jsx, flatten} from '../jsxFactory';

describe('jsxFactory', () => {
	it('should accept JSX node and generate correct unist elements out of it', () => {
		const plain: TextNode = {
			type: 'text',
			value: 'text',
		};
		expect(<text>text</text>).toEqual(plain);

		const subj: SubjectNode = {
			type: 'subject',
			value: 'text',
		};
		expect(<subject>text</subject>).toEqual(subj);

		const input: InputNode = {
			type: 'input',
			value: 'text',
		};
		expect(<input>text</input>).toEqual(input);

		const code: CodeNode = {
			type: 'code',
			value: 'text',
		};
		expect(<code>text</code>).toEqual(code);

		const codeBlock: CodeBlockNode = {
			type: 'code-block',
			language: 'javascript',
			value: 'test',
		};
		expect(<code-block>test</code-block>).toEqual(codeBlock);
		expect(<code-block language="javascript">test</code-block>).toEqual(codeBlock);

		// Has to produce empty text node instead of just skipping the element altogether
		const emptyText = {
			type: 'text',
			value: '',
		};
		expect(<text>{''}</text>).toEqual(emptyText);
	});

	it('should process complex text nodes', () => {
		const jsxResult = <fragment>some <subject>subject</subject> and <input>input</input> text</fragment>;
		const unist: Node[] = [
			{
				type: 'text',
				value: 'some ',
			},
			{
				type: 'subject',
				value: 'subject',
			},
			{
				type: 'text',
				value: ' and ',
			},
			{
				type: 'input',
				value: 'input',
			},
			{
				type: 'text',
				value: ' text',
			},
		];

		expect(jsxResult).toEqual(unist);
	});

	it('should filter out empty elements and merge same element types that are listed in sequence', () => {
		const jsxResult = <fragment>some {undefined} string <input>input</input></fragment>;
		const unist: Node[] = [
			{
				type: 'text',
				value: 'some  string ',
			},
			{
				type: 'input',
				value: 'input',
			},
		];

		expect(jsxResult).toEqual(unist);
	});

	it('should unfold any nested text fragment into a single one', () => {
		const jsxResult = <fragment>
			<fragment>Some test</fragment> <subject>another</subject>
		</fragment>;
		const unist: Node[] = [
			{
				type: 'text',
				value: 'Some test ',
			},
			{
				type: 'subject',
				value: 'another',
			},
		];

		expect(jsxResult).toEqual(unist);
	});

	it('should create correct Prop element', () => {
		expect(<prop
			name={<text>prop name</text>}
			expectedValue={<text>expected value</text>}
			actualValue="actual value"
			comparator="="
			status="success"
		/>).toMatchSnapshot();

		expect(<prop
			name={<text>prop name</text>}
			expectedValue={<code-block>expected value</code-block>}
			status="fail"
		/>).toMatchSnapshot();
	});

	it('should create correct Props element', () => {
		expect(<props><prop name={<text>test</text>} expectedValue={<text>test</text>}/></props>)
			.toMatchSnapshot();
	});

	it('should throw if props element receives anything other than row', () => {
		expect(() => <props><text>...</text></props>).toThrow();
	});

	it('should save title property for test line and condition', () => {
		expect(<test-line
			title={<text>Some title</text>}
			status="success"
		>
			<text>text</text>
		</test-line>).toEqual({
			type: 'test-line',
			title: [{type: 'text', value: 'Some title'}],
			status: 'success',
			children: [{type: 'text', value: 'text'}],
		});

		expect(<test-line title={<fragment>Some <subject>subject</subject> title</fragment>}>
			<text>text</text>
		</test-line>).toEqual({
			type: 'test-line',
			title: [
				{type: 'text', value: 'Some '},
				{type: 'subject', value: 'subject'},
				{type: 'text', value: ' title'},
			],
			children: [{type: 'text', value: 'text'}],
		});

		expect(<condition
			title={<text>Some title</text>}
			status="success"
		>
			<text>text</text>
		</condition>).toEqual({
			type: 'condition',
			title: [{type: 'text', value: 'Some title'}],
			status: 'success',
			children: [{type: 'text', value: 'text'}],
		});

		expect(<condition title={<fragment>Some <input>input</input> title</fragment>}>
			<text>text</text>
		</condition>).toEqual({
			type: 'condition',
			title: [
				{type: 'text', value: 'Some '},
				{type: 'input', value: 'input'},
				{type: 'text', value: ' title'},
			],
			children: [{type: 'text', value: 'text'}],
		});
	});

	it('should translate test line result line correctly', () => {
		expect(<test-line-result
			status="fail"
			message={<text>Some text</text>}
		>
			<test-line title={<text>Some title</text>}/>
		</test-line-result>).toMatchSnapshot();
		expect(<test-line-result
			status="fail"
			message={<text>Some text</text>}
			screenshot="some/path/to/screenshot.png"
			docs="//link/to/docs"
		>
			<test-line title={<text>Some title</text>}/>
		</test-line-result>).toMatchSnapshot();
	});

	it('should translate link correctly', () => {
		expect(<link href="http://some.url">link to some url</link>).toMatchSnapshot();
	});

	it('should throw error if test result get anything other then a single test line', () => {
		expect(() => <test-line-result status="success"><text>test</text></test-line-result>).toThrowError();
		expect(() => <test-line-result status="success">
			<test-line title={<text>test</text>}/>
			<test-line title={<text>test</text>}/>
		</test-line-result>).toThrowError();
	});

	describe('flatten util', () => {
		it('should flatten array of any depth', () => {
			expect(flatten([1, [2, [3, 4], 5], 6])).toEqual([1, 2, 3, 4, 5, 6]);
		});

		it('should always return an array, even if input is not', () => {
			expect(flatten('whatever')).toEqual(['whatever']);
		});
	});
});
