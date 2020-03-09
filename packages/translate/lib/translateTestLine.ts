import {AppConfiguration, Elements, Snippets, TestLine} from '@suitest/types';

import {testLineToAst as toAST} from './testLineToAst';
import {toText} from './renderers/text';
import {toHtml} from './renderers/html';

export const testLineToPlainText = (
	lineDefinition: TestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	snippets?: Snippets
): string => {
	const translation = toAST(lineDefinition, appConfig, elements, snippets);

	return toText(translation, false);
};

export const testLineToFormattedText = (
	lineDefinition: TestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	snippets?: Snippets
): string => {
	const translation = toAST(lineDefinition, appConfig, elements, snippets);

	return toText(translation, true);
};

export const testLineToHtml = (
	lineDefinition: TestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	snippets?: Snippets
): string => {
	const translation = toAST(lineDefinition, appConfig, elements, snippets);

	return toHtml(translation);
};
