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
	cancel: '\u001b[0m',
	subject: '\u001b[32m',	// green
	code: '\u001b[36m',	// cyan
	input: '\u001b[4m',	// underscore
	success: '\u001b[32m',	// green
	fail: '\u001b[31m',	// red
	fatal: '\u001b[31m',	// red
	warning: '\u001b[33m',	// yellow
	exit: '\u001b[34m',	// blue
};

const formatString = (text: string, type: string): string => {
	if (type in format) {
		return format[type as keyof typeof format] + text + format.cancel;
	}

	return text;
};

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
const wrapTextNodes = (
	textNodes: ExtendedInlineNodes[],
	renderTextNode: RenderTextFunc,
	maxLineLength = 60
): [number, string[]] => {
	// Keep function immutable
	textNodes = [...textNodes];

	const output: string[] = [''];
	let maxActualLength = 0;
	let currentLineLength = 0;

	let firstNode = textNodes.shift();
	while (firstNode) {
		if (firstNode.value.length < maxLineLength - currentLineLength) {
			// The whole textNode can fit into the line
			currentLineLength += firstNode.value.length;
			output[output.length - 1] += renderTextNode(firstNode);
			maxActualLength = currentLineLength > maxActualLength ? currentLineLength : maxActualLength;
		} else {
			// Need to split text node
			const splitNodes = splitNode(firstNode, maxLineLength - currentLineLength);
			currentLineLength = 0;
			output[output.length - 1] += renderTextNode(splitNodes[0]);
			output.push('');
			textNodes.splice(0, 1, splitNodes[1]);
			maxActualLength = maxLineLength;
		}

		firstNode = textNodes.shift();
	}

	return [maxActualLength, output];
};

const renderProps = (node: PropertiesNode, renderTextNode: RenderTextFunc, prefix = ''): string => {
	const columnsLength: [number, number, number] = [0, 0, 0];
	// Level 1 = table fragment (several rows)
	// Level 2 = single table row
	// Level 3 = lines in a single cell
	const table: string[][][] = [];

	// Go through each prop and instead produce a bunch of rows for table rendering
	for (const prop of node.children) {
		let currentRow: string[][] = [];
		table.push(currentRow);

		// Process first cell - property name
		const propNameColumn: ExtendedInlineNodes[] = [...prop.name];

		if (prop.status) {
			propNameColumn.splice(0, 0, renderStatus(prop.status));
		}

		const [nameCellLength, nameColumnContent] = wrapTextNodes(propNameColumn, renderTextNode);
		currentRow.push(nameColumnContent);

		if (nameCellLength > columnsLength[0]) {
			columnsLength[0] = nameCellLength;
		}

		// Process second column - comparator
		const comparatorCellLength = prop.comparator?.length ?? 0;
		currentRow.push([prop.comparator ?? '']);

		if (comparatorCellLength > columnsLength[1]) {
			columnsLength[1] = comparatorCellLength;
		}

		// Process third column - expected value
		if (prop.contentType === 'block') {
			// Render new line with a single cell - code cell
			currentRow = [];
			table.push(currentRow);

			// Currently there is only one type of block content in SMST - code block
			// If that ever changes, this has to be updated
			currentRow.push(prop.expectedValue.value.split(nl).map(line => tab + '> ' + line));
		} else {
			// Render non-code block value
			const [valueCellLength, valueColumnContent] = wrapTextNodes(prop.expectedValue, renderTextNode);
			currentRow.push(valueColumnContent);

			if (valueCellLength > columnsLength[2]) {
				columnsLength[2] = valueCellLength;
			}
		}

		// Add actual value to the mix as a separate row
		if (prop.contentType === 'inline' && prop.actualValue) {
			// Add new row
			currentRow = [];
			table.push(currentRow);

			// property name cell is empty, comparator cell is always an arrow
			currentRow.push([], ['→']);

			// Do not forget to increase total column width, in case previous row did not
			// have a comparator somehow
			if (columnsLength[1] === 0) {
				columnsLength[1] = 1;
			}

			// Render the actual value
			const [valueCellLength, valueColumnContent] = wrapTextNodes([{
				type: 'text' as const,
				value: String(prop.actualValue),
			}], renderTextNode);
			currentRow.push(valueColumnContent);

			if (valueCellLength > columnsLength[2]) {
				columnsLength[2] = valueCellLength;
			}
		}
	}

	// Now convert the table into a list of text lines
	const lines: string[] = [];

	for (const row of table) {
		while (row.some(cell => cell.length)) {
			// While there is a non-empty line in at least one cell
			lines.push(prefix + row
				.map((cell, columnIndex) => {
					const cellLine = cell.shift() ?? '';

					return cellLine.padEnd(columnsLength[columnIndex]);
				})
				.join(' ')
			);
		}
	}

	return lines.join(nl);
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
	const message = node.message
		? renderTextNode({type: node.status, value: node.message.map(renderTextNode).join('')})
		: '';
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
