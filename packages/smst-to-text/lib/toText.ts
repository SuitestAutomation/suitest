/// <reference path="../../smst/types/unistTestLine.d.ts" />

import {assertUnknownSectionNode} from '@suitest/smst/commonjs/jsxFactory';

type RenderTextFunc = (node: ExtendedInlineNodes) => string;

type ExtendedInlineNodes = InlineTextNode | {
	type: TestLineResultStatus | SingleEntryStatus,
	value: string,
};

const nl = '\n';
const tab = '  ';

const format = {
	cancel: 	'\u001b[0m',
	subject:	'\u001b[32m',	// green
	code: 		'\u001b[36m',	// cyan
	input:		'\u001b[4m',	// underscore
	success:	'\u001b[32m',	// green
	fail: 		'\u001b[31m',	// red
	fatal: 		'\u001b[31m',	// red
	warning: 	'\u001b[33m',	// yellow
	exit: 		'\u001b[34m',	// blue
};

const formatString = (text: string, type: string): string => {
	if (type in format) {
		return format[type as keyof typeof format] + text + format.cancel;
	}

	return text;
};

const isCodeBlock = (item: InlineTextNode[] | CodeBlockNode): item is CodeBlockNode =>
	!Array.isArray(item) && item.type === 'code-block';

/**
 * Render a single text node as plain text
 */
const renderPlainTextNode: RenderTextFunc = (node: ExtendedInlineNodes): string => node.value;

/**
 * Render a single text node with ANSI styling
 */
const renderFormattedTextNode: RenderTextFunc = (node: ExtendedInlineNodes): string =>
	formatString(node.value ?? '', node.type);

const renderStatus = (type: TestLineResultStatus | SingleEntryStatus): ExtendedInlineNodes => {
	let value = '';

	switch (type) {
		case 'success':
			value = '✔ ';
			break;
		case 'fail':
		case 'fatal':
			value = '✖ ';
			break;
		case 'warning':
			value = '‼ ';
			break;
		case 'excluded':
		case 'exit':
			value = '» ';
			break;
	}

	return {type, value};
};

/**
 * Split a single AST node into several based on provided length of the first node
 */
const splitNode = (textNode: ExtendedInlineNodes, length: number): [ExtendedInlineNodes, ExtendedInlineNodes] => ([
	{
		...textNode,
		value: textNode.value.slice(0, length),
	},
	{
		...textNode,
		value: textNode.value.slice(length),
	},
]);

/**
 * Wrapped textual nodes to fit max length
 * @TODO consider wrapping by word and not by any character
 */
const wrappedTextNodes = (textNodes: ExtendedInlineNodes[], maxLineLength = 60): [number, ExtendedInlineNodes[][]] => {
	// Keep function immutable
	textNodes = [...textNodes];

	const output: ExtendedInlineNodes[][] = [[]];
	let maxActualLength = 0;
	let currentLineLength = 0;

	while (textNodes.length) {
		const firstNode = textNodes.shift()!;

		if (firstNode.value.length < maxLineLength - currentLineLength) {
			// The whole textNode can fit into the line
			currentLineLength += firstNode.value.length;
			output[output.length - 1].push(firstNode);
			maxActualLength = currentLineLength > maxActualLength ? currentLineLength : maxActualLength;
		} else {
			// Need to split text node
			const splitNodes = splitNode(firstNode, maxLineLength - currentLineLength);
			currentLineLength = 0;
			output[output.length - 1].push(splitNodes[0]);
			output.push([]);
			textNodes.splice(0, 1, splitNodes[1]);
			maxActualLength = maxLineLength;
		}
	}

	return [maxActualLength, output];
};

const renderProps = (node: PropertiesNode, renderTextNode: RenderTextFunc, prefix = ''): string => {
	// Go through each prop and instead produce a bunch of rows for table rendering
	const renderedRowsWithMaxLength = node.children
		.map(prop => {
			const propNameColumn: ExtendedInlineNodes[] = [...prop.name];

			if (prop.status) {
				propNameColumn.splice(0, 0, renderStatus(prop.status));
			}

			const out: any[] = [];

			out.push(wrappedTextNodes(propNameColumn));
			out.push(wrappedTextNodes([{type: 'text', value: prop.comparator ?? ''}]));

			if (isCodeBlock(prop.expectedValue)) {
				// If it's a code block - use custom logic to display correct offsets
				// debugger;
				const rows = prop.expectedValue.value.split(nl).map(row => ([{type: 'text', value: '> ' + row}]));
				out.push([
					rows.map(r => r[0].value.length).reduce((acc, item) => acc > item ? acc : item, 0),
					rows,
				]);
			} else {
				// Render non-code block value
				out.push(wrappedTextNodes(prop.expectedValue));
			}

			return out;
		});

	const columnWidth = renderedRowsWithMaxLength.reduce<number[]>((acc, row) => {
		row.forEach(([cellLength], i) => {
			if (cellLength > (acc[i] ?? 0)) {
				acc[i] = cellLength;
			}
		});

		return acc;
	}, []);

	const rows: string[] = [];

	renderedRowsWithMaxLength.map(row => {
		const rowLines = [];

		while (row.some(cell => cell[1].length)) {
			rowLines.push([
				prefix,
				row.map(([, cell], i) => (cell.shift() ?? []).map(renderTextNode).join('').padEnd(columnWidth[i])).join(' '),
			].join(''));
		}

		rows.push(rowLines.join(nl));
	});

	return rows.join(nl);
};

const renderNode = (node: SingleNode, renderTextNode: RenderTextFunc, prefix = ''): string => {
	switch (node.type) {
		case 'text':
		case 'code':
		case 'subject':
		case 'input':
			return renderTextNode(node);
		case 'props':
			return renderProps(node, renderTextNode, prefix);
		case 'prop':
			throw new Error('Prop node can only be rendered as part of Props');
		case 'code-block':
			throw new Error('CodeBlock node can only be rendered as part of Props');
		case 'test-line':
			return renderTestLineOrCondition(node, renderTextNode);
		case 'condition':
			return nl + prefix + renderTestLineOrCondition(node, renderTextNode, prefix + tab);
		case 'test-line-result':
			return renderTestLineResult(node, renderTextNode, prefix);
		default:
			/* istanbul ignore next */
			return assertUnknownSectionNode(node);
	}
};

const renderTestLineOrCondition = (
	node: TestLineNode | ConditionNode,
	renderTextNode: RenderTextFunc,
	prefix = ''
): string => {
	const status = node.status ? renderTextNode(renderStatus(node.status)) : '';
	const title = node.title.map(renderTextNode).join('');
	const body = node.children.map(child => renderNode(child, renderTextNode, prefix + tab)).join('');

	return status + title + nl + body;
};

const renderTestLineResult = (node: TestLineResultNode, renderTextNode: RenderTextFunc, prefix = ''): string => {
	const message = node.message ? renderTextNode({type: node.status, value: node.message}) : '';
	const body = renderTestLineOrCondition(node.children[0], renderTextNode, prefix + tab);

	return [body, message].filter(Boolean).join(nl);
};

export const toText = (node: Node, format = true): string => {
	const renderTextNode = format ? renderFormattedTextNode : renderPlainTextNode;

	if (!Array.isArray(node)) {
		node = [node];
	}

	return node.map(n => renderNode(n, renderTextNode)).join('');
};
