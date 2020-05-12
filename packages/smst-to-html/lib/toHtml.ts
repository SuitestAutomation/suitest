/// <reference path="../../smst/types/unistTestLine.d.ts" />
import {assertUnknownSectionNode} from '@suitest/smst/commonjs/jsxFactory';
import {escapeHtml} from './utils';

/**
 * Helper function to build HTML figure element
 * @param className - class name to be added to figure
 * @param content - body content of the figure, already renderer to string
 * @param titleNodes - optional figcaption
 * @param prefix - text to insert before figcaption
 */
const renderFigure = (className: string, content: string, titleNodes?: InlineTextNode[], prefix = ''): string => {
	const output = [`<figure class="${className}">`];

	if (titleNodes?.length) {
		output.push(`<figcaption>${prefix + titleNodes.map(renderNode).join('')}</figcaption>`);
	}

	output.push(content, '</figure>');

	return output.join('');
};

const renderHtmlCodeBlockNode = (node: CodeBlockNode): string => renderFigure(
	'suitest-test-line__code-block',
	`<pre><code>${node.value}</code></pre>`
);

const renderHtmlPropsNode = (node: PropertiesNode): string => renderFigure(
	'suitest-test-line__table',
	[
		'<table>',
		...node.children.map(prop => ([
			'<tr>',
				'<td>' + prop.name.map(renderNode).join('') + '</td>',
				'<td>' + prop.comparator + '</td>',
				'<td>' + toHtml(prop.expectedValue) + '</td>',
			'</tr>',
		].join(''))),
		'</table>',
	].join('')
);

const renderHtmlConditionNode = (node: ConditionNode): string => renderFigure(
	'suitest-test-line__condition',
	node.children.map(renderNode).join(''),
	node.title,
	'condition: '
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
		case 'subject':
		case 'input':
			return `<span class="suitest-test-line__text--${node.type}">${escapeHtml(node.value ?? '')}</span>`;
		case 'code-block':
			return renderHtmlCodeBlockNode(node);
		case 'props':
			return renderHtmlPropsNode(node);
		case 'prop':
			throw new Error('Property node should not be rendered outside of Properties collection');
		case 'test-line':
			return renderHtmlTestLineNode(node);
		case 'condition':
			return renderHtmlConditionNode(node);
		case 'test-line-result':
			return '';
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
