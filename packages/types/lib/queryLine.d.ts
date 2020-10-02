export type CookieQueryLine = {
	type: 'query',
	subject: {
		type: 'cookie',
		cookieName: string
	}
};

export type ElementQueryLine = {
	type: 'query',
	subject: {
		type: 'elementProps',
		selector: {
			apiId?: string,
			css?: string,
			xpath?: string,
			attributes?: string,
			text?: string,
			position?: string,
			size?: string,
			color?: string,
			video?: boolean,
			psVideo?: boolean,
			ifMultipleFoundReturn?: number,
		}
	}
};

export type JsExpressionQueryLine = {
	type: 'query',
	subject: {
		type: 'execute',
		execute: string
	}
};

export type LocationQueryLine = {
	type: 'query',
	subject: {
		type: 'location'
	}
};

export type QueryLine = CookieQueryLine | ElementQueryLine | JsExpressionQueryLine | LocationQueryLine;
