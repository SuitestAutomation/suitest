export type TextNode = {
	type: 'text',
	value: string,
};

export type SubjectNode = {
	type: 'subject',
	value: string,
};

export type InputNode = {
	type: 'input',
	value: string,
};

export type CodeNode = {
	type: 'code',
	value: string,
};

export type InlineTextNode = TextNode | SubjectNode | InputNode | CodeNode;

export type CodeBlockLanguage = 'javascript' | 'brightscript';

export type CodeBlockNode = {
	type: 'code-block',
	language?: CodeBlockLanguage,
	value: string,
};

export type SingleEntryStatus = 'success' | 'fail';

export type InlinePropertyNode = {
	type: 'prop',
	contentType: 'inline',
	name: InlineTextNode[],
	comparator?: string,
	expectedValue: InlineTextNode[],
	actualValue?: string | number | boolean,
	status?: SingleEntryStatus,
};

export type CodePropertyNode = {
	type: 'prop',
	contentType: 'block',
	name: InlineTextNode[],
	comparator?: string,
	expectedValue: CodeBlockNode,
	status?: SingleEntryStatus,
};

export type PropertyNode = InlinePropertyNode | CodePropertyNode;

export type PropertiesNode = {
	type: 'props',
	children: PropertyNode[],
};

export type ConditionNode = {
	type: 'condition',
	title: InlineTextNode[],
	children: Array<PropertiesNode | ConditionNode>,
	status?: SingleEntryStatus,
};

export type TestLineResultStatus = 'success' | 'fatal' | 'fail' | 'warning' | 'exit' | 'excluded' | 'aborted';

export type TestLineNode = {
	type: 'test-line',
	title: InlineTextNode[],
	children: Array<PropertiesNode | ConditionNode>,
	status?: TestLineResultStatus,
};

export type TestLineResultNode = {
	type: 'test-line-result',
	status: TestLineResultStatus,
	children: TestLineNode[],
	message?: Array<InlineTextNode | LinkNode>,
	screenshot?: string,
	docs?: string,
};

export type LinkNode = {
	type: 'link',
	href: string,
	value: string,
};

export type SingleNode =
	| InlineTextNode
	| CodeBlockNode
	| PropertyNode
	| PropertiesNode
	| ConditionNode
	| TestLineNode
	| TestLineResultNode
	| LinkNode;

export type Node =  SingleNode | SingleNode[];

export type Verbosity = 'quiet' | 'normal' | 'verbose';
