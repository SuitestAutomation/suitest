/// <reference path="../types/intrinsicElements.d.ts" />
/// <reference path="../types/unistTestLine.d.ts" />
import {jsx} from './jsxFactory';
import {AppConfiguration} from '@suitest/types';

/**
 * Replace variables in text
 * @param text - text to replace variables in
 * @param variables - array of configuration variables
 */
export const replaceVariables = (text: string, variables: AppConfiguration['configVariables']): string =>
	text.replace(
		/<%([a-zA-Z0-9_]{1,20})%>/g,
		(wholeMatch, varName) =>
			variables.find(variable => variable.key === varName)?.value ?? wholeMatch
	);

/**
 * Replace variables and format the output to display both replaced and not replaced strings
 */
export const formatVariables = (text: string, variables: AppConfiguration['configVariables']): Node => {
	const resultText = replaceVariables(text, variables);

	if (resultText !== text) {
		// There was some replacing done
		return <fragment><bold>{resultText}</bold> (<code>{text}</code>)</fragment>;
	}

	return <bold>{text}</bold>;
};

/**
 * Replace variable and output timeout value as unist node
 */
export const formatTimeout = (timeout: number | string, variables: AppConfiguration['configVariables']): Node => {
	// Replace variables (if any) in timeout
	const t = typeof timeout === 'string' ? replaceVariables(timeout, variables) : String(timeout);
	// Get final value in ms as a number
	const ms = +t;

	if (isNaN(ms)) {
		// Wrong variable or other invalid value
		// Just display it as is
		return <bold>{String(timeout)}</bold>;
	}

	// Value to display to user, as string, in seconds
	const s = String(ms / 1000) + 's';

	if (String(timeout) !== t) {
		// Variable is used
		return <fragment><bold>{s}</bold> (<code>{String(timeout)}</code>)</fragment>;
	}

	// Not a variable
	return <bold>{s}</bold>;
};

export const formatCount = (count: number | string, variables: AppConfiguration['configVariables']): Node => {
	const countAsString = String(count);
	const countAsStringWithReplacedVars = typeof count === 'string' ? replaceVariables(count, variables) : countAsString;
	// Get final value in ms as a number
	const countAsNumberWithReplacedVars = +countAsStringWithReplacedVars;

	if (isNaN(countAsNumberWithReplacedVars)) {
		// Wrong variable or other invalid value
		// Just display it as is
		return <bold>{countAsString}</bold>;
	}

	if (countAsString !== countAsStringWithReplacedVars) {
		// Variable is used
		return <fragment><bold>{countAsStringWithReplacedVars}</bold>x (<code>{countAsString}</code>)</fragment>;
	}

	// Not a variable
	return <fragment><bold>{countAsString}</bold>x</fragment>;
};

export const escapeHtml = (text: string): string => text.replace(/[&<"']/g, function(m) {
	switch (m) {
		case '&':
			return '&amp;';
		case '<':
			return '&lt;';
		case '"':
			return '&quot;';
		default:
			return '&#039;';
	}
});
