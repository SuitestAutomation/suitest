declare type TextNode = {
	type: 'text',
	value: string,
};

declare type SubjectNode = {
	type: 'subject',
	value: string,
};

declare type InputNode = {
	type: 'input',
	value: string,
};

declare type CodeNode = {
	type: 'code',
	value: string,
};

declare type InlineTextNode = TextNode | SubjectNode | InputNode | CodeNode;

declare type CodeBlockLanguage = 'javascript' | 'brightscript';

declare type CodeBlockNode = {
	type: 'code-block',
	language?: CodeBlockLanguage,
	value: string,
};

declare type SingleEntryStatus = 'success' | 'fail';

declare type InlinePropertyNode = {
	type: 'prop',
	contentType: 'inline',
	name: InlineTextNode[],
	comparator?: string,
	expectedValue: InlineTextNode[],
	actualValue?: string | number,
	status?: SingleEntryStatus,
};

declare type CodePropertyNode = {
	type: 'prop',
	contentType: 'block',
	name: InlineTextNode[],
	comparator?: string,
	expectedValue: CodeBlockNode,
	status?: SingleEntryStatus,
};

declare type PropertyNode = InlinePropertyNode | CodePropertyNode;

declare type PropertiesNode = {
	type: 'props',
	children: PropertyNode[],
};

declare type ConditionNode = {
	type: 'condition',
	title: InlineTextNode[],
	children: Array<PropertiesNode | ConditionNode>,
	status?: SingleEntryStatus,
};

declare type TestLineResultStatus = 'success' | 'fatal' | 'fail' | 'warning' | 'exit' | 'excluded';

declare type TestLineNode = {
	type: 'test-line',
	title: InlineTextNode[],
	children: Array<PropertiesNode | ConditionNode>,
	status?: TestLineResultStatus,
};

declare type TestLineResultNode = {
	type: 'test-line-result',
	status: TestLineResultStatus,
	children: TestLineNode[],
	message?: InlineTextNode[],
};

declare type SingleNode = InlineTextNode
	| CodeBlockNode
	| PropertyNode
	| PropertiesNode
	| ConditionNode
	| TestLineNode
	| TestLineResultNode;

declare type Node =  SingleNode | SingleNode[];
