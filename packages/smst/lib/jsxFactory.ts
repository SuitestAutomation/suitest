/// <reference path="../types/intrinsicElements.d.ts" />
/// <reference path="../types/unistTestLine.d.ts" />
import ub from 'unist-builder';

const plainTypes = ['text', 'code', 'subject', 'input'];
const isTextNode = (input: SingleNode): input is TextNode => plainTypes.includes(input.type);

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
const normalizePlainChildren = (
	children: Array<SingleNode | string>,
	parentType: keyof JSX.IntrinsicElements
): SingleNode[] =>
	children.reduce((output: SingleNode[], child: SingleNode | string) => {
		if (typeof child === 'string') {
			// Wrap plain strings into text nodes
			child = ub(plainTypes.includes(parentType) ? parentType : 'text', child) as TextNode;
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

const processLabel = (label?: string | SingleNode | Array<string | SingleNode>): SingleNode[] | undefined => {
	if (typeof label !== 'undefined') {
		return normalizePlainChildren(flatten([label]), 'text');
	}

	return undefined;
};

const processPropertyNode = (props: {[key: string]: any} | null): PropertyNode => {
	if (!props) {
		throw new Error('Missing Prop parameters');
	}

	const name = processLabel(props.name) as InlineTextNode[];

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
		expectedValue: processLabel(props.expectedValue) as InlineTextNode[],
		actualValue: props.actualValue,
		comparator: props.comparator,
		status: props.status,
	});
};

const isPropChildren = (children: SingleNode[]): children is PropertyNode[] =>
	children.every(child => child.type === 'prop');

const isCodeBlockNode = (item: SingleNode | undefined): item is CodeBlockNode =>
	item?.type === 'code-block';

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
export const jsx = (
	type: keyof JSX.IntrinsicElements,
	props: {[key: string]: any} | null,
	...children: Array<Node | string>
): Node => {
	// Do not include empty children, to allow for ternary operations in JSX
	// Flatten the children - to support nested arrays in JSX and manage fragments
	const processedChildren = normalizePlainChildren(flatten(
		children.filter(child => typeof child !== 'undefined' && child !== null)
	), type);

	switch (type) {
		case 'text': // TODO nyc for some reason reports an uncovered branch here
		case 'subject':
		case 'input':
		case 'code':
			return processedChildren[0];
		case 'fragment':
			return processedChildren;
		case 'code-block':
			const language = (props as {language: 'javascript' | 'brightscript'})?.language ?? 'javascript';

			// Type casting because IntrinsicElements definition would not allow anything other then string
			return ub('code-block', {language}, (processedChildren[0] as TextNode).value);
		case 'prop':
			return processPropertyNode(props);
		case 'props':
			if (isPropChildren(processedChildren)) {
				return ub('props', processedChildren);
			}

			throw new TypeError('Props can only accept Prop as its child');
		case 'condition':
		case 'test-line':
			// Type casting for props because of IntrinsicElements definition
			const params: Omit<TestLineNode, 'type' | 'children'> = {
				title: processLabel((props as {title: any}).title) as InlineTextNode[],
			};

			if (props?.status) {
				params.status = props.status;
			}

			return ub(type, params, processedChildren) as ConditionNode | TestLineNode;
		case 'test-line-result':
			if (isTestLineNodeArray(processedChildren) || processedChildren.length === 1) {
				return ub('test-line-result', {
					status: props?.status,
					message: processLabel(props?.message) as InlineTextNode[],
				}, processedChildren as TestLineNode[]);
			}

			throw new TypeError('TestLineResult expects a single child of type TestLine');
		default:
			/* istanbul ignore next */
			return assertUnknownIntrinsicElementType(type);
	}
};
