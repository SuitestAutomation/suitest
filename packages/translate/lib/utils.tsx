import '../types/intrinsicElements';
import {jsx} from './jsxFactory';
import {AppConfiguration} from '@suitest/types';
import {Node} from '../types/unistTestLine';

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
		return <text-fragment><bold>{resultText}</bold> (<code>{text}</code>)</text-fragment>;
	}

	return <bold>{text}</bold>;
};
