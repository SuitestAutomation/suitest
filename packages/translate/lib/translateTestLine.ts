import {AppConfiguration, Elements, Snippets, TestLine} from '@suitest/types';

import {testLineToAst as toAST} from './testLineToAst';
import {toText} from './renderers/text';
import {toHtml} from './renderers/html';
import {TestLineResult} from '@suitest/types/lib';

export const testLineToPlainText = ({
	lineDefinition, appConfig, elements, snippets, lineResult,
}: {
	lineDefinition: TestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	snippets?: Snippets,
	lineResult?: TestLineResult,
}): string => {
	const translation = toAST({testLine: lineDefinition, appConfig, elements, snippets, lineResult});

	return toText(translation, false);
};

export const testLineToFormattedText = ({
	lineDefinition, appConfig, elements, snippets, lineResult,
}: {
	lineDefinition: TestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	snippets?: Snippets,
	lineResult?: TestLineResult,
}): string => {
	const translation = toAST({testLine: lineDefinition, appConfig, elements, snippets, lineResult});

	return toText(translation, true);
};

export const testLineToHtml = ({
   lineDefinition, appConfig, elements, snippets, lineResult,
}: {
	lineDefinition: TestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	snippets?: Snippets,
	lineResult?: TestLineResult,
}): string => {
	const translation = toAST({testLine: lineDefinition, appConfig, elements, snippets, lineResult});

	return toHtml(translation);
};
