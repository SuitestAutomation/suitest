export type CookieQueryLine = {
	type: 'query',
	subject: {
		type: 'cookie',
		cookieName: string,
	},
};

export type ElementSelector = ElementSelectorObject | ElementSelectorObject[];
export type ElementSelectorObject = {
	apiId?: string,
	css?: string,
	xpath?: string,
	handle?: string,
	attributes?: string,
	text?: string,
	linkText?: string,
	partialLinkText?: string,
	position?: string,
	size?: string,
	color?: string,
	video?: boolean,
	psVideo?: boolean,
	active?: boolean,
	ifMultipleFoundReturn?: number,
};

export type ElementQueryLine = {
	type: 'query',
	subject: {
		type: 'elementProps',
		selector: ElementSelector,
	},
};

export type JsExpressionQueryLine = {
	type: 'query',
	subject: {
		type: 'execute',
		execute: string,
	},
};

export type LocationQueryLine = {
	type: 'query',
	subject: {
		type: 'location',
	},
};

export type CssPropertiesQueryLine = {
	type: 'query',
	subject: {
		selector: ElementSelector,
		type: 'elementCssProps',
		elementCssProps: string[],
	},
};

export type ElementHandleQueryLine = {
	type: 'query',
	subject: {
		selector: ElementSelector,
		type: 'elementHandle',
		multiple: boolean,
	},
};

export type ElementAttributesQueryLine = {
	type: 'query',
	subject: {
		selector: ElementSelector,
		type: 'elementAttributes',
		attributes: string[],
	},
};

export type QueryLine =
	| CookieQueryLine
	| ElementQueryLine
	| JsExpressionQueryLine
	| LocationQueryLine
	| CssPropertiesQueryLine
	| ElementHandleQueryLine
	| ElementAttributesQueryLine;
