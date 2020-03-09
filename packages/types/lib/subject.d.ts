import {NumberComparator, StringComparator} from './comparator';

type UUID = string;

export type ApplicationSubject = {
	type: 'application',
};

export type CurrentLocationSubject = {
	type: 'location',
};

export type CookieSubject = {
	type: 'cookie',
	val: string,
};

export type ApiElementSubject = {
	type: 'element',
	apiId: string,
};

export type IdElementSubject = {
	type: 'element',
	elementId: UUID,
	name?: string, // TODO - drop it after feeds update
	nameHint?: string,
};

export type CustomElementSubject = {
	type: 'element',
	val: {
		css?: string,
		xpath?: string,
		attributes?: string,
		text?: string,
		position?: string,
		size?: string,
		color?: string,
		video?: boolean,
		ifMultipleFoundReturn?: number,
	},
};

export type VideoSubject = {
	type: 'video',
};

export type ElementSubject = ApiElementSubject | IdElementSubject | CustomElementSubject | VideoSubject;

export type NetworkRequestBodyInfo = {
	name: '@body',
	compare: '=',
	val: string,
};

export type NetworkRequestStatusInfo = {
	name: '@status',
	compare: NumberComparator,
	val: number | string,
};

export type NetworkRequestMethodInfo = {
	name: '@method',
	compare: StringComparator,
	val: string,
};

export type NetworkRequestHeaderInfo = {
	name: string,
	compare: StringComparator,
	val: string,
};

export type NetworkRequestInfo = NetworkRequestStatusInfo
	| NetworkRequestMethodInfo
	| NetworkRequestBodyInfo
	| NetworkRequestHeaderInfo;

export type NetworkRequestSubject = {
	type: 'network',
	compare: '=' | '~',
	val: string,
	requestInfo?: Array<NetworkRequestBodyInfo | NetworkRequestMethodInfo | NetworkRequestHeaderInfo>,
	responseInfo?: Array<NetworkRequestBodyInfo | NetworkRequestStatusInfo | NetworkRequestHeaderInfo>,
};

export type JavaScriptExpressionSubject = {
	type: 'javascript',
	val: string,
};

export type Subject = ApplicationSubject
	| CurrentLocationSubject
	| CookieSubject
	| ElementSubject
	| VideoSubject
	| NetworkRequestSubject
	| JavaScriptExpressionSubject;
