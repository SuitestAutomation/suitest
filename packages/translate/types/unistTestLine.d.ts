declare type PlainTextNode = {
	type: 'text',
	value: string,
};
declare type BoldTextNode = {
	type: 'bold',
	value: string,
};
declare type EmphasisTextNode = {
	type: 'emphasis',
	value: string,
};
declare type CodeTextNode = {
	type: 'code',
	value: string,
};
declare type TextNode = PlainTextNode | BoldTextNode | EmphasisTextNode | CodeTextNode;
declare type ParagraphNode = {
	type: 'paragraph',
	children: TextNode[],
};
declare type CellNode = {
	type: 'cell',
	children: TextNode[],
};
declare type RowNode = {
	type: 'row',
	children: CellNode[],
};
declare type TableNode = {
	type: 'table',
	label?: TextNode[],
	children: RowNode[],
};
declare type DictionaryRowNode = {
	type: 'row',
	children: [CellNode, CellNode],
};
declare type DictionaryNode = {
	type: 'dictionary',
	label?: TextNode[],
	children: DictionaryRowNode[],
};
declare type CodeBlockNode = {
	type: 'code-block',
	label?: TextNode[],
	value: string,
};
declare type AlertNode = {
	type: 'alert',
	level: 'error' | 'fatal' | 'fail' | 'warning' | 'exit' | 'excluded',
	children: TextNode[],
};
declare type SectionNode = ParagraphNode
	| TableNode
	| DictionaryNode
	| CodeBlockNode
	| ConditionNode
	| AlertNode;
declare type TestLineNode = {
	type: 'test-line',
	title: TextNode[],
	children: SectionNode[],
};
declare type ConditionNode = {
	type: 'condition',
	title: TextNode[],
	children: SectionNode[],
};
declare type SingleNode = ConditionNode | TestLineNode | SectionNode | CellNode | RowNode | TextNode;
declare type Node =  SingleNode | SingleNode[];
