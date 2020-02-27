export type PlainTextNode = {
	type: 'text',
	value: string,
};
export type BoldTextNode = {
	type: 'bold',
	value: string,
};
export type EmphasisTextNode = {
	type: 'emphasis',
	value: string,
};
export type CodeTextNode = {
	type: 'code',
	value: string,
};
export type TextFragmentNode = {
	type: 'text-fragment',
	children: TextNode[],
};
export type TextNode = PlainTextNode | BoldTextNode | EmphasisTextNode | CodeTextNode;
export type ParagraphNode = {
	type: 'paragraph',
	children: TextNode[],
};
export type CellNode = {
	type: 'cell',
	children: Array<TextNode | SectionNode>,
};
export type RowNode = {
	type: 'row',
	children: CellNode[],
};
export type TableNode = {
	type: 'table',
	label?: TextNode | TextFragmentNode,
	children: RowNode[],
};
export type DictionaryRowNode = {
	type: 'row',
	children: [CellNode, CellNode],
};
export type DictionaryNode = {
	type: 'dictionary',
	label?: TextNode | TextFragmentNode,
	children: DictionaryRowNode[],
};
export type CodeBlockNode = {
	type: 'code-block',
	label?: TextNode | TextFragmentNode,
	value: string,
};
export type ErrorBlockNode = {
	type: 'error-block',
	children: TextNode[],
};
export type WarningBlockNode = {
	type: 'warning-block',
	children: TextNode[],
};
export type SectionNode = ParagraphNode
	| TableNode
	| DictionaryNode
	| CodeBlockNode
	| ErrorBlockNode
	| WarningBlockNode
	| ConditionNode;
export type TestLineNode = {
	type: 'test-line',
	title: TextNode | TextFragmentNode,
	children: SectionNode[],
};
export type ConditionNode = {
	type: 'condition',
	title: TextNode | TextFragmentNode,
	children: SectionNode[],
};
export type Node = ConditionNode | TestLineNode | SectionNode | CellNode | RowNode | TextFragmentNode | TextNode;
