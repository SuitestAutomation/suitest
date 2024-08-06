import {
	ApplicationSubject,
	CookieSubject,
	CurrentLocationSubject,
	ElementSubject,
	JavaScriptExpressionSubject,
	NetworkRequestSubject,
	PSVideoSubject,
	OcrSubject,
} from './subject';
import {Comparator, StringComparator, JavaScriptComparator, ExistComparator} from './comparator';

export type ApplicationExitedCondition = {
	subject: ApplicationSubject,
	type: 'exited',
};

export type CurrentLocationCondition = {
	subject: CurrentLocationSubject,
	type: StringComparator | JavaScriptComparator,
	val: string,
};

export type CookieCondition =
	| CookieValueCondition
	| CookiePropertiesCondition;

export type CookieValueCondition = {
	subject: CookieSubject,
	type: StringComparator | JavaScriptComparator | ExistComparator,
	val: string,
};

export type CookiePropertiesCondition = {
	subject: CookieSubject,
	type: 'withProperties',
	properties: CookieProperty[],
};

export type CookieProperty = {
	property: 'value' | 'domain' | 'path' | 'httpOnly' | 'secure',
	type: StringComparator,
	val: string | boolean,
};

export type ElementExistsCondition = {
	subject: ElementSubject,
	type: 'exists',
};

export type ElementDoesNotExistCondition = {
	subject: ElementSubject,
	type: '!exists',
};

export type ElementVisibleCondition = {
	subject: ElementSubject,
	type: 'visible',
};

export type ElementNotVisibleCondition = {
	subject: ElementSubject,
	type: '!visible',
};

export type ElementMatchesJavaScriptCondition = {
	subject: ElementSubject,
	type: 'matches',
	val: string,
};

export type ElementPropertiesCondition = {
	subject: ElementSubject | PSVideoSubject,
	type: 'has',
	expression: ElementProperty[],
};

export type ElementProperty = {
	property: string,
	type: Comparator,
	val?: string | number, // can be avoided in case of inherited: true
	deviation?: number,
	inherited?: boolean,
};

export type ElementCondition = ElementExistsCondition
	| ElementDoesNotExistCondition
	| ElementVisibleCondition
	| ElementNotVisibleCondition
	| ElementMatchesJavaScriptCondition
	| ElementPropertiesCondition;

export type PSVideoHadNoErrorCondition = {
	subject: PSVideoSubject,
	type: 'hadNoError',
	searchStrategy: 'all' | 'currentUrl',
};

export type JavaScriptExpressionCondition = {
	subject: JavaScriptExpressionSubject,
	type: StringComparator,
	val?: string,
};

export type NetworkRequestCondition = {
	subject: NetworkRequestSubject,
	type: 'made' | '!made',
	searchStrategy: 'all' | 'notMatched',
};

export type OcrCondition = {
	subject: OcrSubject,
	type: 'ocrComparators',
	comparators: OcrComparator[],
};

export type OcrComparator = {
	val: string,
	type: StringComparator,
	region?: [number, number, number, number],
	readAs?: 'single-line' | 'single-word' | 'single-block',
	align?: boolean,
	color?: 'dark' | 'light',
	whitelist?: string,
	blacklist?: string,
};


export type Condition = ApplicationExitedCondition
	| CurrentLocationCondition
	| CookieCondition
	| ElementCondition
	| PSVideoHadNoErrorCondition
	| JavaScriptExpressionCondition
	| NetworkRequestCondition
	| OcrCondition;
