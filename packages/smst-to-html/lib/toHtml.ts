import {assertUnknownSectionNode} from '@suitest/smst';
import {
	CodeBlockNode,
	ConditionNode,
	InlineTextNode,
	PropertiesNode,
	TestLineNode,
	TestLineResultNode,
	SingleNode,
	Node, Verbosity,
} from '@suitest/smst/types/unistTestLine';

export const escapeHtml = (text: string): string => text.replace(/[&<"']/g, m => {
	switch (m) {
		case '&':
			return '&amp;';
		case '<':
			return '&lt;';
		case '"':
			return '&quot;';
		default: // single quote
			return '&#039;';
	}
});

export const escapeUrl = (url: string): string => {
	if (url.startsWith('javascript:')) {
		return '';
	}

	return url.replace(
		/[^\w. ]/gi,
		c => '&#x' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4)
	);
};

/**
 * Helper function to build HTML figure element
 * @param className - class name to be added to figure
 * @param content - body content of the figure, already renderer to string
 * @param titleNodes - optional figcaption
 * @param prefix - text to insert before figcaption
 * @param titleLast - render title at the end
 */
const renderFigure = (
	className: string,
	content: string,
	titleNodes?: Array<InlineTextNode | undefined>,
	prefix = '',
	titleLast = false
): string => {
	const output = [`<div class="${className}">`];

	const filteredNodes = titleNodes?.filter(node => typeof node !== 'undefined') as InlineTextNode[];
	if (filteredNodes?.length) {
		output.push(`<div class="${className}__header">${prefix + filteredNodes
			.map(n => renderNode(n, {verbosity: 'normal'})).join('')}</div>`);
	}

	output[titleLast ? 'unshift' : 'push'](content);
	output.push('</div>');

	return output.join('');
};

const renderHtmlCodeBlockNode = (node: CodeBlockNode): string => renderFigure(
	'suitest-test-line__code-block',
	`<pre><code class="language-${node.language}">${escapeHtml(node.value ?? '')}</code></pre>`
);

const renderHtmlPropsNode = (node: PropertiesNode, {verbosity}: {verbosity: Verbosity}): string => renderFigure(
	'suitest-test-line__props',
	[
		'<table>',
		...node.children.map(prop => {
			const row = [`<tr class="suitest-test-line__props__prop--${prop.status}">`];

			// Add name
			row.push(`<td>${toHtml(prop.name, {verbosity})}</td>`);

			// Add comparator
			row.push(`<td>${prop.comparator}</td>`);

			// Add expected value
			if (prop.contentType === 'inline') {
				// Render inline content
				row.push(`<td>${toHtml(prop.expectedValue, {verbosity})}</td>`);
			} else {
				// Add whole another row
				row.push(`<td/></tr><tr><td class="suitest-test-line__code-block-prop" colspan="3">${
					toHtml(prop.expectedValue, {verbosity})
				}</td>`);
			}

			// Add actual value
			if (prop.contentType === 'inline' && typeof prop.actualValue !== 'undefined') {
				// On a new row
				row.push(`</tr><tr><td/><td>→</td><td>${escapeHtml(prop.actualValue.toString())}</td>`);
			}

			row.push('</tr>');

			return row.join('');
		}),
		'</table>',
	].join('')
);

const renderHtmlConditionNode = (node: ConditionNode, {verbosity}: {verbosity: Verbosity}): string => renderFigure(
	['suitest-test-line__condition', `suitest-test-line__condition--${node.status}`].join(' '),
	node.children.map(n => renderNode(n, {verbosity})).join(''),
	node.title,
	'condition: '
);

const renderHtmlTestLineNode = (node: TestLineNode, {verbosity}: {verbosity: Verbosity}): string => {
	const out = [`<div class="suitest-test-line suitest-test-line--${node.status}">`];

	// Line title
	const title = toHtml(node.title ?? [], {verbosity});
	out.push(`<div class="suitest-test-line__title">${title}</div>`);

	if (verbosity !== 'quiet') {
		// Line extra details
		out.push(toHtml(node.children, {verbosity}));
		if (verbosity === 'verbose' && node.docs) {
			out.push(`<div class="suitest-test-line__docs">docs: ${toHtml(node.docs, {verbosity})}<div>`);
		}
	}

	out.push('</div>');

	return out.join('');
};

const renderHtmlTestLineResultNode = (node: TestLineResultNode, {verbosity}: {verbosity: Verbosity}): string => {
	const out = [`<div class="suitest-test-line__result suitest-test-line__result--${node.status}">`];

	// Body
	out.push(node.children.map(n => renderNode(n, {verbosity})).join(''));

	// Status
	const message = toHtml(node.message ?? [], {verbosity});
	if (message) {
		out.push(`<div class="suitest-test-line__result__message">${message}</div>`);
	}
	// Screenshot
	if (node.screenshot) {
		out.push(`<div class="suitest-test-line__result__screenshot">screenshot: <a href="${node.screenshot}" target="_blank">${node.screenshot}</a></div>`);
	}

	out.push('</div>');

	return out.join('');
};

const renderNode = (node: SingleNode, {verbosity}: {verbosity: Verbosity}): string => {
	switch (node.type) {
		case 'text':
			return escapeHtml(node.value ?? '');
		case 'code':
			return `<code class="suitest-test-line__text--code">${escapeHtml(node.value ?? '')}</code>`;
		case 'subject':
		case 'input':
			return `<span class="suitest-test-line__text--${node.type}">${escapeHtml(node.value ?? '')}</span>`;
		case 'code-block':
			return renderHtmlCodeBlockNode(node);
		case 'props':
			return renderHtmlPropsNode(node, {verbosity});
		case 'prop':
			throw new Error('Property node should not be rendered outside of Properties collection');
		case 'test-line':
			return renderHtmlTestLineNode(node, {verbosity});
		case 'condition':
			return renderHtmlConditionNode(node, {verbosity});
		case 'test-line-result':
			return renderHtmlTestLineResultNode(node, {verbosity});
		case 'link':
			return `<a class="suitest-test-line__text--link" href="${escapeUrl(node.href)}">${escapeHtml(node.value ? node.value : node.href)}</a>`;
		default:
			/* istanbul ignore next */
			return assertUnknownSectionNode(node);
	}
};

export const toHtml = (node: Node, options?: {verbosity?: Verbosity}): string => {
	const verbosity = options?.verbosity ?? 'normal';

	if (!Array.isArray(node)) {
		node = [node];
	}

	return node.filter(Boolean).map(n => renderNode(n, {verbosity})).join('');
};
