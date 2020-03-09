/// <reference path="../../types/unistTestLine.d.ts" />
import {assertUnknownSectionNode, assertUnknownTextNode} from '../jsxFactory';

type RenderTextFunc = (node: TextNode) => string;

const nl = '\n';
const tab = '  ';

const format = {
	cancel: '\u001b[0m',
	green: '\u001b[32m',
	cyan: '\u001b[36m',
	underscore: '\u001b[4m',
};

/**
 * Render a single text node as plain text
 */
const renderPlainTextNode: RenderTextFunc = (node: TextNode): string => node.value;

/**
 * Render a single text node with TTI colors
 */
const renderFormattedTextNode: RenderTextFunc = (node: TextNode): string => {
	const value = node.value ?? '';

	switch (node.type) {
		case 'text':
			return value;
		case 'bold':
			return format.green + value + format.cancel;
		case 'emphasis':
			return format.underscore + value + format.cancel;
		case 'code':
			return format.cyan + value + format.cancel;
		default:
			return assertUnknownTextNode(node);
	}
};

/**
 * Split a single AST node into several based on provided length of the first node
 */
const splitNode = (textNode: TextNode, length: number): [TextNode, TextNode] => ([
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
const wrappedTextNodes = (textNodes: TextNode[], maxLineLength = 60): [number, TextNode[][]] => {
	// Keep function immutable
	textNodes = [...textNodes];

	const output: TextNode[][] = [[]];
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

const renderDictionary = (node: DictionaryNode, renderTextNode: RenderTextFunc, prefix = ''): string => {
	const label = node.label?.length ? nl + prefix + node.label.map(renderTextNode).join('') + nl : '';

	const renderedRowsWithMaxLength = node.children
		.map(row => row.children.map(cell => wrappedTextNodes(cell.children)));

	const maxTermLength = renderedRowsWithMaxLength
		.reduce<number>((acc, [[termLength]]) => acc > termLength ? acc : termLength, 0);

	return label + renderedRowsWithMaxLength.map(([[, term], [, definition]]) => {
		const lines: string[] = [];

		while (term.length || definition.length) {
			lines.push([
				prefix,
				(term.shift() ?? []).map(renderTextNode).join('').padStart(maxTermLength),
				(lines.length ? '  ' : ': '),
				(definition.shift() ?? []).map(renderTextNode).join(''),
			].join(''));
		}

		return lines.join(nl);
	}).join(nl) + nl;
};

const renderTable = (node: TableNode, renderTextNode: RenderTextFunc, prefix = ''): string => {
	const label = node.label?.length ? nl + prefix + node.label.map(renderTextNode).join('') + nl : '';

	const renderedRowsWithMaxLength = node.children
		.map(row => row.children.map(cell => wrappedTextNodes(cell.children)));

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
				'│ ',
				row.map(([, cell], i) => (cell.shift() ?? []).map(renderTextNode).join('').padEnd(columnWidth[i])).join(' │ '),
				' │',
			].join(''));
		}

		rows.push(rowLines.join(nl));
	});

	return label + prefix + '┌' + columnWidth.map(column => ''.padStart(column + 2, '─')).join('┬') + '┐' + nl +
		rows.join('\n' + prefix + '├' + columnWidth.map(column => ''.padStart(column + 2, '─')).join('┼') + '┤' + '\n') +
		nl + prefix + '└' + columnWidth.map(column => ''.padStart(column + 2, '─')).join('┴') + '┘';
};

const renderCodeBlock = (node: CodeBlockNode, renderTextNode: RenderTextFunc, prefix = ''): string => {
	let codeBlockPrefix = prefix;
	let label = '';

	if (node.label?.length) {
		label = nl + prefix + node.label.map(renderTextNode).join('');
		codeBlockPrefix += tab;
	}

	return label + nl + node.value.split(nl).map(line => codeBlockPrefix + '> ' + line).join(nl) + nl;
};

const renderNode = (node: SingleNode, renderTextNode: RenderTextFunc, prefix = ''): string => {
	switch (node.type) {
		case 'text':
		case 'code':
		case 'emphasis':
		case 'bold':
			return renderTextNode(node);
		case 'paragraph':
			return prefix + node.children.map(renderTextNode).join('') + nl;
		case 'code-block':
			return renderCodeBlock(node, renderTextNode, prefix);
		case 'dictionary':
			return renderDictionary(node, renderTextNode, prefix);
		case 'table':
			return renderTable(node, renderTextNode, prefix);
		case 'test-line':
			return renderTestLineOrCondition(node, renderTextNode);
		case 'condition':
			return nl + prefix + 'Condition: ' + renderTestLineOrCondition(node, renderTextNode, prefix + tab);
		case 'cell':
		case 'row':
			throw new Error('Cell and Row nodes can only be rendered as part of table or dictionary');
		default:
			return assertUnknownSectionNode(node);
	}
};

const renderTestLineOrCondition = (
	node: TestLineNode | ConditionNode,
	renderTextNode: RenderTextFunc,
	prefix = ''
): string => {
	const title = node.title.map(renderTextNode).join('');
	const body = node.children.map(child => renderNode(child, renderTextNode, prefix + tab)).join('');

	return title + nl + body;
};

export const toText = (node: Node, format = true): string => {
	const renderTextNode = format ? renderFormattedTextNode : renderPlainTextNode;

	if (!Array.isArray(node)) {
		node = [node];
	}

	return node.map(n => renderNode(n, renderTextNode)).join('');
};
