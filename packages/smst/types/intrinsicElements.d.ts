type SingleNode = import('./unistTestLine').SingleNode;
type Node = import('./unistTestLine').Node;
type CodeBlockLanguage = import('./unistTestLine').CodeBlockLanguage;
type SingleEntryStatus = import('./unistTestLine').SingleEntryStatus;
type TestLineResultStatus = import('./unistTestLine').TestLineResultStatus;
type ElementOrTextChildren = string | SingleNode | undefined | ElementOrTextChildren[];
type ElementChildren = SingleNode | undefined | ElementChildren[];
type StringOrStrings = string | string[];

declare namespace JSX {
	interface ElementChildrenAttribute {
		children: {},  // specify children name to use
	}

	// This is return value of ANY jsx element
	// TypeScript can't infer correct type, unfortunately,
	// so will simply put it to any node at all
	// https://www.typescriptlang.org/docs/handbook/jsx.html#the-jsx-result-type
	type Element = Node;

	interface IntrinsicElements {
		// Plain text, should accept only string or other textual elements to make
		// it easier to format text
		text: {children: StringOrStrings},
		subject: {children: StringOrStrings},
		input: {children: StringOrStrings},
		code: {children: StringOrStrings},
		fragment: {children: ElementOrTextChildren},
		'code-block': {
			children: StringOrStrings,
			language?: CodeBlockLanguage,
		},
		prop: {
			name: ElementChildren,
			comparator?: string,
			expectedValue: ElementChildren,
			actualValue?: string | number,
			status?: SingleEntryStatus,
		},
		props: {children: ElementChildren},
		condition: {
			title: ElementChildren,
			children?: ElementChildren,
			status?: SingleEntryStatus,
		},
		'test-line': {
			title: ElementChildren,
			children?: ElementChildren,
			status?: TestLineResultStatus,
		},
		'test-line-result': {
			status: TestLineResultStatus,
			children: ElementChildren,
			message?: ElementChildren,
			screenshot?: string,
		},
	}
}
