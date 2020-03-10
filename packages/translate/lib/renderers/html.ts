/// <reference path="../../types/unistTestLine.d.ts" />
import {assertUnknownSectionNode} from '../jsxFactory';
import {escapeHtml} from '../utils';

/**
 * Helper function to build HTML figure element
 * @param className - class name to be added to figure
 * @param content - body content of the figure, already renderer to string
 * @param titleNodes - optional figcaption
 * @param prefix - text to insert before figcaption
 */
const renderFigure = (className: string, content: string, titleNodes?: TextNode[], prefix = ''): string => {
	const output = [`<figure class="${className}">`];

	if (titleNodes?.length) {
		output.push(`<figcaption>${prefix + titleNodes.map(renderNode).join('')}</figcaption>`);
	}

	output.push(content, '</figure>');

	return output.join('');
};

const renderHtmlCodeBlockNode = (node: CodeBlockNode): string => renderFigure(
	'suitest-test-line__code-block',
	`<pre><code>${node.value}</code></pre>`,
	node.label
);

const renderHtmlDictionaryNode = (node: DictionaryNode): string => renderFigure(
	'suitest-test-line__dictionary',
	[
		'<dl>',
		...node.children.map(row => ([
			'<dt>',
			...row.children[0].children.map(renderNode),
			'</dt><dd>',
			...row.children[1].children.map(renderNode),
			'</dd>',
		]).join('')),
		'</dl>',
	].join(''),
	node.label
);

const renderHtmlTableNode = (node: TableNode): string => renderFigure(
	'suitest-test-line__table',
	[
		'<table>',
		...node.children.map(row => ([
			'<tr>',
			...row.children.map(cell => '<td>' + cell.children.map(renderNode).join('') + '</td>'),
			'</tr>',
		].join(''))),
		'</table>',
	].join(''),
	node.label
);

const renderHtmlConditionNode = (node: ConditionNode): string => renderFigure(
	'suitest-test-line__condition',
	node.children.map(renderNode).join(''),
	node.title,
	'Condition: '
);

const renderHtmlTestLineNode = (node: TestLineNode): string => renderFigure(
	'suitest-test-line',
	node.children.map(renderNode).join(''),
	node.title
);

const renderNode = (node: SingleNode): string => {
	switch (node.type) {
		case 'text':
			return escapeHtml(node.value ?? '');
		case 'code':
			return `<code class="suitest-test-line__text--code">${node.value ?? ''}</code>`;
		case 'bold':
		case 'emphasis':
			return `<span class="suitest-test-line__text--${node.type}">${escapeHtml(node.value ?? '')}</span>`;
		case 'paragraph':
			return `<p class="suitest-test-line__paragraph">${node.children.map(renderNode).join('')}</p>`;
		case 'code-block':
			return renderHtmlCodeBlockNode(node);
		case 'dictionary':
			return renderHtmlDictionaryNode(node);
		case 'table':
			return renderHtmlTableNode(node);
		case 'test-line':
			return renderHtmlTestLineNode(node);
		case 'condition':
			return renderHtmlConditionNode(node);
		case 'row':
		case 'cell':
			throw new Error('Cell and Row nodes can only be rendered as part of table or dictionary');
		case 'alert':
			// TODO implement
			return `<p class="suitest-test-line__paragraph">${node.children.map(renderNode).join('')}</p>`;
		default:
			/* istanbul ignore next */
			return assertUnknownSectionNode(node);
	}
};

export const toHtml = (node: Node): string => {
	if (!Array.isArray(node)) {
		node = [node];
	}

	return node.map(renderNode).join('');
};
