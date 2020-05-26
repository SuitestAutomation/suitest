// Reference is needed so that whenever this file is imported by consumer, intrinsic types are always included
/// <reference path="../types/intrinsicElements.d.ts" />
import ub from 'unist-builder';
import {
	CodeBlockNode,
	ConditionNode,
	InlineTextNode,
	Node,
	PropertyNode,
	SingleNode,
	TestLineNode,
	TextNode,
	InlinePropertyNode,
	CodePropertyNode,
} from '../types/unistTestLine';

const plainTypes = ['text', 'code', 'subject', 'input'];
const isTextNode = (input?: JSX.SmstFlatNode): input is TextNode =>
	typeof input === 'object' && input !== null && plainTypes.includes(input.type);

type DeepArrayOrOne<T> = T | Array<T | DeepArrayOrOne<T>>;
export const flatten = <T extends any>(input: DeepArrayOrOne<T>): T[] => {
	if (Array.isArray(input)) {
		return input.reduce((acc: T[], item: DeepArrayOrOne<T>) => acc.concat(flatten(item)), []);
	}

	return [input];
};

/**
 * Normalize textual children - make them flat and merge sequential text items of same type
 */
function normalizePlainChildren
	<R extends SingleNode, K extends keyof JSX.IntrinsicElements = R['type']>
	(children: JSX.SmstFlatNode[], parentType: K): R[];
function normalizePlainChildren(
	children: JSX.SmstFlatNode[],
	parentType: keyof JSX.IntrinsicElements
): SingleNode[] {
	return children.reduce((output: SingleNode[], child) => {
		if (child === undefined || child === null) {
			return output;
		}

		if (typeof child === 'string' || typeof child === 'boolean' || typeof child === 'number') {
			// Wrap plain strings into text nodes
			child = ub(plainTypes.includes(parentType) ? parentType : 'text', String(child)) as InlineTextNode;
		}

		// Nested child is a textual node
		const lastChild = output[output.length - 1];

		if (isTextNode(child) && lastChild?.type === child.type) {
			// Textual node with same time as the previous one - merge them
			output.splice(output.length - 1, 1, {
				type: child.type,
				value: lastChild.value + child.value,
			});
		} else {
			output.push(child);
		}

		return output;
	}, []);
}

const processTextNode = (label: JSX.SmstNode): TextNode[] =>
	normalizePlainChildren<TextNode>(flatten([label]), 'text');

const processPropertyNode = (props: JSX.ElementsProps['prop']): InlinePropertyNode | CodePropertyNode => {
	const name = processTextNode(props.name);

	if (isCodeBlockNode(props.expectedValue)) {
		return ub('prop', {
			name,
			contentType: 'block',
			expectedValue: props.expectedValue,
			comparator: props.comparator,
			status: props.status,
		});
	}

	return ub('prop', {
		name,
		contentType: 'inline',
		expectedValue: processTextNode(props.expectedValue),
		actualValue: props.actualValue,
		comparator: props.comparator,
		status: props.status,
	});
};

const isPropChildren = (children: SingleNode[]): children is PropertyNode[] =>
	children.every(child => child.type === 'prop');

const isCodeBlockNode = (item: JSX.SmstNode): item is CodeBlockNode =>
	!Array.isArray(item) && typeof item === 'object' && item !== null && item.type === 'code-block';

const isTestLineNodeArray = (children: SingleNode[]): children is TestLineNode[] =>
	children.every(child => child.type === 'test-line');

/* istanbul ignore next */
const assertUnknownIntrinsicElementType = (type: never): never => {
	throw new Error(`Unknown intrinsic element type ${type}`);
};

/* istanbul ignore next */
export const assertUnknownSectionNode = (node: never): never => {
	throw new Error('Unknown node type: ' + JSON.stringify(node));
};

/* istanbul ignore next */
export const assertUnknownTextNode = (node: never): never => {
	throw new Error('Unknown plain text node: ' + JSON.stringify(node));
};

/**
 * A factory for JSX elements. Maps React-style JSX to unist-style nodes.
 * "any" is used for children and props because TypeScript can't infer JSX element types
 * anyway and always returns whatever is provided in JSX.Element type/interface.
 * Some validation is added to ensure correct data at least runtime.
 */
export function jsx
	<K extends keyof JSX.ElementsProps>
	(type: K, props: JSX.ElementsProps[K], ...children: Array<JSX.ElementsChildren[K]>): Node;
export function jsx(
	type: keyof JSX.ElementsProps,
	props: JSX.ElementsProps[keyof JSX.ElementsProps],
	...children: JSX.SmstNode[]
): Node {
	// Do not include empty children, to allow for ternary operations in JSX
	// Flatten the children - to support nested arrays in JSX and manage fragments
	const processedChildren = normalizePlainChildren(flatten(children), type);

	switch (type) {
		case 'text':
		case 'subject':
		case 'input':
		case 'code':
			return processedChildren[0];
		case 'fragment':
			return processedChildren;
		case 'code-block':
			const codeBlockProps = props as JSX.ElementsProps['code-block'];
			const codeBlockChildren = processedChildren[0] as CodeBlockNode;
			const language = codeBlockProps?.language ?? 'javascript';

			// Type casting because IntrinsicElements definition would not allow anything other then string
			return ub('code-block', {language}, codeBlockChildren.value) as CodeBlockNode;
		case 'prop':
			// props can't be null because it's defined in intrinsicElements
			return processPropertyNode(props as JSX.ElementsProps['prop']);
		case 'props':
			if (isPropChildren(processedChildren)) {
				return ub('props', processedChildren);
			}

			throw new TypeError('Props can only accept Prop as its child');
		case 'condition':
		case 'test-line':
			const testLineProps = props as JSX.ElementsProps['test-line'];
			// Type casting for props because of IntrinsicElements definition
			const params: Omit<TestLineNode, 'type' | 'children'> = {
				title: processTextNode(testLineProps.title),
			};

			if (testLineProps.status) {
				params.status = testLineProps.status;
			}

			return ub(type, params, processedChildren) as ConditionNode | TestLineNode;
		case 'test-line-result':
			const testLineResultProps = props as JSX.ElementsProps['test-line-result'];
			if (isTestLineNodeArray(processedChildren) && processedChildren.length === 1) {
				return ub('test-line-result', {
					status: testLineResultProps.status,
					message: processTextNode(testLineResultProps.message),
					screenshot: props?.screenshot,
				}, processedChildren);
			}

			throw new TypeError('TestLineResult expects a single child of type TestLine');
		default:
			/* istanbul ignore next */
			return assertUnknownIntrinsicElementType(type);
	}
}
