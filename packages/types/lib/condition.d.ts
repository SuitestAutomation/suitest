import {
	ApplicationSubject,
	CookieSubject,
	CurrentLocationSubject,
	ElementSubject,
	JavaScriptExpressionSubject,
	NetworkRequestSubject,
} from './subject';
import {Comparator, StringComparator} from './comparator';

export type ApplicationExitedCondition = {
	subject: ApplicationSubject,
	type: 'exited',
};

export type CurrentLocationCondition = {
	subject: CurrentLocationSubject,
	type: StringComparator,
	val: string,
};

export type CookieCondition = {
	subject: CookieSubject,
	type: StringComparator,
	val: string,
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

export type ElementMatchesJavaScriptCondition = {
	subject: ElementSubject,
	type: 'matches',
	val: string,
};

export type ElementPropertiesCondition = {
	subject: ElementSubject,
	type: 'has',
	expression: Array<{
		property: string,
		type: Comparator,
		val: string | number,
		deviation?: number,
	}>,
};

export type ElementCondition = ElementExistsCondition
	| ElementDoesNotExistCondition
	| ElementVisibleCondition
	| ElementMatchesJavaScriptCondition
	| ElementPropertiesCondition;

export type JavaScriptExpressionCondition = {
	subject: JavaScriptExpressionSubject,
	type: StringComparator,
	val: string,
};

export type NetworkRequestCondition = {
	subject: NetworkRequestSubject,
	type: 'made' | '!made',
	searchStrategy: 'all' | 'notMatched',
};

export type Condition = ApplicationExitedCondition
	| CurrentLocationCondition
	| CookieCondition
	| ElementCondition
	| JavaScriptExpressionCondition
	| NetworkRequestCondition;
