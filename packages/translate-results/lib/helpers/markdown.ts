import {FormattedString} from '../types';

// TODO: create UT and add examples to JSDOC

export function bold(str: string): FormattedString {
	return `**${str}**`;
}

export function link(str: string, link: string): FormattedString {
	return `[${str}](${link})`;
}

export function preview(alt: string, src: string): FormattedString {
	return `![${alt}](${src})`;
}

/**
 * @example
 * code('let test = "var"') -> ```let test = "var"```
 *
 * code('let test = "var"', {inline: true}) -> `let test = "var"`
 *
 * @example
 * code(`
 * function hello(n = "world") {
 *     return "Hello, " + n;
 * }`) -> ```
 * function hello(n = "world") {
 *     return "Hello, " + n;
 * }```
 *
 * @example
 * code(`
 * function hello(n = "world") {
 *     return "Hello, " + n;
 * }`, {lang: "javascript"}) -> ```javascript
 * function hello(n = "world") {
 *     return "Hello, " + n;
 * }```
 *
 */
export function code(
	c: string,
	{inline = false, lang}: {inline?: boolean, lang?: 'javascript'} = {}
): FormattedString {
	if (inline) {
		return '`' + c + '`';
	}

	return '```' + (lang ? `${lang}\n` : '') + c + '```';
}
