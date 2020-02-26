import '../types/intrinsicElements.d.ts';
import * as assert from 'assert';
import * as ub from 'unist-builder';
import {
	ConditionNode,
	DictionaryNode,
	Node,
	TableNode,
	TestLineNode,
	TextFragmentNode,
	TextNode,
} from '../types/unistTestLine';

type Label = string | TextNode | TextFragmentNode;

const plainTypes = ['text-fragment', 'text', 'code', 'bold', 'emphasis'];

const buildTextFragment = (children: any[]): TextFragmentNode =>
	ub('text-fragment', children.map(child => {
		if (typeof  child === 'string') {
			return ub('text', child);
		}

		assert(plainTypes.includes(child.type), 'Text fragment can only accept textual children');

		return child;
	}).reduce((newChildren, child) => {
		// Recursively process nested text fragments
		const childrenToProcess = child.type === 'text-fragment'
			? (jsx('text-fragment', {}, ...child.children) as TextFragmentNode).children
			: [child];

		childrenToProcess.forEach((nestedChild: TextNode | string) => {
			if (typeof nestedChild === 'string') {
				nestedChild = ub('text', nestedChild);
			}

			const lastChild = newChildren[newChildren.length - 1];

			if (lastChild?.type === nestedChild.type) {
				lastChild.value += nestedChild.value;
			} else {
				newChildren.push(nestedChild);
			}
		});

		return newChildren;
	}, []));

const buildTable = (children: any[], label?: Label): TableNode => {
	children.forEach(child =>
		assert(child.type === 'row', 'Table can accepts only Row as it\'s child')
	);

	const tableLabel = typeof label === 'string' ? ub('text', label) : label;

	return ub('table', {label: tableLabel}, children);
};

const buildDictionary = (children: any[], label?: Label): DictionaryNode => {
	children.forEach(child => {
		assert(child.type === 'row', 'Dictionary can accepts only Row as it\'s child');
		assert(child.children.length === 2, 'Dictionary expects exactly 2 child nodes');
	});

	const dictLabel = typeof label === 'string' ? ub('text', label) : label;

	return ub('dictionary', {label: dictLabel}, children);
};

const assertUnknownIntrinsicElementType = (type: never): never => {
	throw new Error(`Unknown intrinsic element type ${type}`);
};

/**
 * A factory for JSX elements. Maps React-style JSX to unist-style nodes.
 * "any" is used for children and props because TypeScript can't infer JSX element types
 * anyway and always returns whatever is provided in JSX.Element type/interface.
 * Some validation is added to ensure correct data at least runtime.
 */
export const jsx = (type: Node['type'], props: {[key: string]: any}, ...children: any[]): Node => {
	// Do not include empty children, to allow for ternary operations in
	children = children.filter(Boolean);

	switch (type) {
		case 'text':
		case 'bold':
		case 'emphasis':
		case 'code':
			// Can have multiple string children, e.g. if got <text>some {variable}</text>
			// Validation of children is done statically by typescript
			return ub(type, children.join(''));
		case 'text-fragment':
			return buildTextFragment(children);
		case 'row':
			children.forEach(child =>
				assert(child.type === 'cell', 'Row can accepts only Cell as it\'s child')
			);

			return ub('row', children);
		case 'table':
			return buildTable(children, props?.label);
		case 'dictionary':
			return buildDictionary(children, props?.label);
		case 'cell':
		case 'paragraph':
		case 'warning-block':
		case 'error-block':
			// Pass children through test fragment logic to it's wrapped correctly
			return ub(type, buildTextFragment(children).children);
		case 'condition':
		case 'test-line':
			const title = typeof props.title === 'string' ? ub('text', props.title) : props.title;

			return ub(type, {title}, children) as ConditionNode | TestLineNode;
		case 'code-block':
			const codeBlockLabel = typeof props?.label === 'string' ? ub('text', props.label) : props?.label;

			// Code block is a special case - block that can receive only strings as children
			return ub('code-block', {label: codeBlockLabel}, children.join(''));
		default:
			return assertUnknownIntrinsicElementType(type);
	}
};
