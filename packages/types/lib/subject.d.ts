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
	nameHint?: string,
};

export type CustomElementSubject = {
	type: 'element',
	val: CustomElementSubjectVal | CustomElementSubjectVal[],
};

type CustomElementSubjectVal = {
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

export type VideoSubject = {
	type: 'video',
};

export type ElementSubject = ApiElementSubject | IdElementSubject | CustomElementSubject | VideoSubject;

export type PSVideoSubject = {
	type: 'psVideo',
};

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
	val?: string,
};

export type OcrSubject = {
	type: 'ocr',
};

export type Subject = ApplicationSubject
	| CurrentLocationSubject
	| CookieSubject
	| ElementSubject
	| PSVideoSubject
	| NetworkRequestSubject
	| JavaScriptExpressionSubject
	| OcrSubject;
