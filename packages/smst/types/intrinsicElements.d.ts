type SingleNode = import('./unistTestLine').SingleNode;
type Node = import('./unistTestLine').Node;
type LinkNode = import('./unistTestLine').LinkNode;
type CodeBlockLanguage = import('./unistTestLine').CodeBlockLanguage;
type SingleEntryStatus = import('./unistTestLine').SingleEntryStatus;
type TestLineResultStatus = import('./unistTestLine').TestLineResultStatus;
type StringOrStrings = string | string[];

declare namespace JSX {
	interface ElementChildrenAttribute {
		children: {},  // specify children name to use
	}

	// This is return value of ANY jsx element
	// TypeScript can't infer correct type, unfortunately,
	// so will simply put it to any node at all
	// https://www.typescriptlang.org/docs/handbook/jsx.html#the-jsx-result-type
	type Element = SingleNode;

	type SmstText = string | number;
	type SmstElement = Node | SmstText | boolean | null | undefined;
	type SmstNode = SmstElement | SmstElement[];
	type SmstFlatNode = SingleNode | SmstText | boolean | null | undefined;

	interface IntrinsicElements {
		// Plain text, should accept only string or other textual elements to make
		// it easier to format text
		text: {children: StringOrStrings},
		subject: {children: StringOrStrings},
		input: {children: StringOrStrings},
		code: {children: StringOrStrings},
		fragment: {children: SmstNode},
		'code-block': {
			children: StringOrStrings,
			language?: CodeBlockLanguage,
		},
		prop: {
			name: SmstNode,
			comparator?: string,
			expectedValue: SmstNode,
			actualValue?: string | number | boolean,
			status?: SingleEntryStatus,
		},
		props: {children: SmstNode},
		condition: {
			title: SmstNode,
			children?: SmstNode,
			status?: SingleEntryStatus,
		},
		'test-line': {
			title: SmstNode,
			children?: SmstNode,
			status?: TestLineResultStatus,
		},
		'test-line-result': {
			status: TestLineResultStatus,
			children: SmstNode,
			message?: SmstNode,
			screenshot?: string,
			docs?: string,
		},
		link: {
			href: string,
			children?: StringOrStrings,
		},
	}

	type ElementsProps = {
		text: Omit<IntrinsicElements['text'], 'children'>,
		subject: Omit<IntrinsicElements['subject'], 'children'>,
		input: Omit<IntrinsicElements['input'], 'children'>,
		code: Omit<IntrinsicElements['code'], 'children'>,
		fragment: Omit<IntrinsicElements['fragment'], 'children'>,
		'code-block': Omit<IntrinsicElements['code-block'], 'children'> | null,
		prop: IntrinsicElements['prop'],
		props: Omit<IntrinsicElements['props'], 'children'>,
		condition: Omit<IntrinsicElements['condition'], 'children'>,
		'test-line': Omit<IntrinsicElements['test-line'], 'children'>,
		'test-line-result': Omit<IntrinsicElements['test-line-result'], 'children'>,
		link: Omit<IntrinsicElements['link'], 'children'>,
	};

	type ElementsChildren = {
		text: IntrinsicElements['text']['children'],
		subject: IntrinsicElements['subject']['children'],
		input: IntrinsicElements['input']['children'],
		code: IntrinsicElements['code']['children'],
		fragment: IntrinsicElements['fragment']['children'],
		'code-block': IntrinsicElements['code-block']['children'],
		prop: void,
		props: IntrinsicElements['props']['children'],
		condition: IntrinsicElements['condition']['children'],
		'test-line': IntrinsicElements['test-line']['children'],
		'test-line-result': IntrinsicElements['test-line-result']['children'],
		link: IntrinsicElements['link']['children'],
	};
}
