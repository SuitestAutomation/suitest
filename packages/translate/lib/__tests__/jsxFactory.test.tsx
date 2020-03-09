/// <reference path="../../types/intrinsicElements.d.ts" />
/// <reference path="../../types/unistTestLine.d.ts" />
import {jsx, flatten} from '../jsxFactory';

describe('jsxFactory', () => {
	it('should accept JSX node and generate correct unist elements out of it', () => {
		const plain: PlainTextNode = {
			type: 'text',
			value: 'text',
		};
		expect(<text>text</text>).toEqual(plain);

		const bold: BoldTextNode = {
			type: 'bold',
			value: 'text',
		};
		expect(<bold>text</bold>).toEqual(bold);

		const emphasis: EmphasisTextNode = {
			type: 'emphasis',
			value: 'text',
		};
		expect(<emphasis>text</emphasis>).toEqual(emphasis);

		const code: CodeTextNode = {
			type: 'code',
			value: 'text',
		};
		expect(<code>text</code>).toEqual(code);
	});

	it('should process complex text nodes', () => {
		const jsxResult = <fragment>some <emphasis>emphasis</emphasis> and <bold>bold</bold> text</fragment>;
		const unist: Node[] = [
			{
				type: 'text',
				value: 'some ',
			},
			{
				type: 'emphasis',
				value: 'emphasis',
			},
			{
				type: 'text',
				value: ' and ',
			},
			{
				type: 'bold',
				value: 'bold',
			},
			{
				type: 'text',
				value: ' text',
			},
		];

		expect(jsxResult).toEqual(unist);
	});

	it('should filter out empty elements and merge same element types that are listed in sequence', () => {
		const jsxResult = <fragment>some {undefined} string <bold>bold</bold></fragment>;
		const unist: Node[] = [
			{
				type: 'text',
				value: 'some  string ',
			},
			{
				type: 'bold',
				value: 'bold',
			},
		];

		expect(jsxResult).toEqual(unist);
	});

	it('should unfold any nested text fragment into a single one', () => {
		const jsxResult = <fragment>
			<fragment>Some test</fragment> <emphasis>another</emphasis>
		</fragment>;
		const unist: Node[] = [
			{
				type: 'text',
				value: 'Some test ',
			},
			{
				type: 'emphasis',
				value: 'another',
			},
		];

		expect(jsxResult).toEqual(unist);
	});

	it('should throw if row element receives anything other than cell', () => {
		expect(() => <row><text>...</text></row>).toThrow();
	});

	it('should throw if table element receives anything other than row', () => {
		expect(() => <table><text>...</text></table>).toThrow();
	});

	it('should throw if dictionary element receives anything other than 2 row elements', () => {
		expect(() => <dictionary><text>...</text><text>...</text></dictionary>).toThrow();

		expect(() => <dictionary><row><cell>Test</cell></row></dictionary>).toThrow();
	});

	it('should save title property for test line and condition', () => {
		expect(<test-line title="Some title"><text>text</text></test-line>).toEqual({
			type: 'test-line',
			title: [{type: 'text', value: 'Some title'}],
			children: [{type: 'text', value: 'text'}],
		});

		expect(<test-line title={<fragment>Some <bold>bold</bold> title</fragment>}>
			<text>text</text>
		</test-line>).toEqual({
			type: 'test-line',
			title: [
				{type: 'text', value: 'Some '},
				{type: 'bold', value: 'bold'},
				{type: 'text', value: ' title'},
			],
			children: [{type: 'text', value: 'text'}],
		});

		expect(<condition title="Some title"><text>text</text></condition>).toEqual({
			type: 'condition',
			title: [{type: 'text', value: 'Some title'}],
			children: [{type: 'text', value: 'text'}],
		});

		expect(<condition title={<fragment>Some <bold>bold</bold> title</fragment>}>
			<text>text</text>
		</condition>).toEqual({
			type: 'condition',
			title: [
				{type: 'text', value: 'Some '},
				{type: 'bold', value: 'bold'},
				{type: 'text', value: ' title'},
			],
			children: [{type: 'text', value: 'text'}],
		});
	});

	it('should save label properly for code block, table and dictionary', () => {
		expect(<code-block>test</code-block>).toEqual({
			type: 'code-block',
			value: 'test',
		});

		expect(<code-block label="Label">test</code-block>).toEqual({
			type: 'code-block',
			label: [{type: 'text', value: 'Label'}],
			value: 'test',
		});

		expect(<code-block label={<bold>TEST</bold>}>test</code-block>).toEqual({
			type: 'code-block',
			label: [{type: 'bold', value: 'TEST'}],
			value: 'test',
		});

		expect(<table><row><cell>test</cell></row></table>).toEqual({
			type: 'table',
			children: [{type: 'row', children: [{type: 'cell', children: [{type: 'text', value: 'test'}]}]}],
		});

		expect(<table label="Label"><row><cell>test</cell></row></table>).toEqual({
			type: 'table',
			label: [{type: 'text', value: 'Label'}],
			children: [{type: 'row', children: [{type: 'cell', children: [{type: 'text', value: 'test'}]}]}],
		});

		expect(<table label={<bold>TEST</bold>}><row><cell>test</cell></row></table>).toEqual({
			type: 'table',
			label: [{type: 'bold', value: 'TEST'}],
			children: [{type: 'row', children: [{type: 'cell', children: [{type: 'text', value: 'test'}]}]}],
		});

		expect(<dictionary><row><cell>test</cell><cell>test</cell></row></dictionary>).toEqual({
			type: 'dictionary',
			children: [
				{
					type: 'row',
					children: [
						{
							type: 'cell',
							children: [{type: 'text', value: 'test'}],
						},
						{
							type: 'cell',
							children: [{type: 'text', value: 'test'}],
						},
					],
				},
			],
		});

		expect(<dictionary label="Label"><row><cell>test</cell><cell>test</cell></row></dictionary>).toEqual({
			type: 'dictionary',
			label: [{type: 'text', value: 'Label'}],
			children: [
				{
					type: 'row',
					children: [
						{
							type: 'cell',
							children: [{type: 'text', value: 'test'}],
						},
						{
							type: 'cell',
							children: [{type: 'text', value: 'test'}],
						},
					],
				},
			],
		});

		expect(<dictionary label={<bold>TEST</bold>}>
			<row><cell>test</cell><cell>test</cell></row>
		</dictionary>).toEqual({
			type: 'dictionary',
			label: [{type: 'bold', value: 'TEST'}],
			children: [
				{
					type: 'row',
					children: [
						{
							type: 'cell',
							children: [{type: 'text', value: 'test'}],
						},
						{
							type: 'cell',
							children: [{type: 'text', value: 'test'}],
						},
					],
				},
			],
		});
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
