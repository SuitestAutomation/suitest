/// <reference path="../types/intrinsicElements.d.ts" />
/// <reference path="../types/unistTestLine.d.ts" />
import {jsx} from './jsxFactory';
import {
	Condition,
	CookieCondition,
	CurrentLocationCondition,
	ElementCondition,
	JavaScriptExpressionCondition,
	NetworkRequestCondition,
	Comparator,
	NetworkRequestInfo,
	AppConfiguration,
	Elements, ElementSubject, CustomElementSubject,
} from '@suitest/types';
import {formatVariables, replaceVariables} from './utils';
import {translateComparator} from './comparators';
import {
	ElementPropertiesCondition,
	PSVideoHadNoErrorCondition,
	PSVideoSubject,
	TestLineResult, TestLineResultType,
} from '@suitest/types/lib';
import {translateTestLineResult} from './testLineResults';

const translateApplicationExitedCondition = (lineResult?: TestLineResult): ConditionNode => {
	const alertNode = lineResult && lineResult.result !== 'success' ?
		<alert level={lineResult.result}>{translateTestLineResult(lineResult)}</alert> as AlertNode :
		undefined;

	return <condition title="Application has exited">{alertNode}</condition> as ConditionNode;
};

const translateCurrentLocationCondition = (
	condition: CurrentLocationCondition,
	appConfig: AppConfiguration,
	lineResult?: TestLineResult,
): ConditionNode => {
	let alertNode: AlertNode | undefined;
	if (lineResult && lineResult.result !== 'success') {
		if (lineResult.errorType === 'queryFailed') {
			if ('expectedValue' in lineResult && 'actualValue' in lineResult) {
				alertNode = <alert level={lineResult.result}>
					<dictionary label="Failing checks:">
						{...getExpectedAndActualValues({
							expectedKey: 'compared value', expectedValue: lineResult.expectedValue,
							actualKey: 'current location', actualValue: lineResult.actualValue,
						})}
					</dictionary>
				</alert> as AlertNode;
			} else if (isMatchJsFail(condition, lineResult)) {
				alertNode = matchJSAlertNode(condition.val, lineResult.result);
			}
		}
		if (!alertNode) {
			alertNode = <alert level={lineResult.result}>{translateTestLineResult(lineResult)}</alert> as AlertNode;
		}
	}

	return <condition title="Current location">
		<table>
			<row>
				<cell>Current location</cell>
				<cell>{translateComparator(condition.type)}</cell>
				<cell>{formatVariables(condition.val, appConfig.configVariables)}</cell>
			</row>
		</table>
		{alertNode}
	</condition> as ConditionNode;
};

const translateCookieCondition = (
	condition: CookieCondition, appConfig: AppConfiguration, lineResult?: TestLineResult
): ConditionNode => {
	let alertNode: AlertNode | undefined;
	if (lineResult && lineResult.result !== 'success') {
		if (lineResult.errorType === 'queryFailed') {
			if ('expectedValue' in lineResult && 'actualValue' in lineResult) {
				alertNode = <alert level={lineResult.result}>
					<dictionary label="Failing checks:">
						{...getExpectedAndActualValues({
							expectedKey: 'compared value', expectedValue: processPropValues(lineResult.expectedValue),
							actualKey: 'cookie value', actualValue: processPropValues(lineResult.actualValue),
						})}
					</dictionary>
				</alert> as AlertNode;
			} else if (isMatchJsFail(condition, lineResult)) {
				alertNode = matchJSAlertNode(condition.val, lineResult.result);
			}
		}
		if (!alertNode) {
			alertNode = <alert level={lineResult.result}>{translateTestLineResult(lineResult)}</alert> as AlertNode;
		}
	}

	return <condition title="Cookie">
		<table>
			<row>
				<cell>{formatVariables(condition.subject.val, appConfig.configVariables)} cookie</cell>
				<cell>{translateComparator(condition.type)}</cell>
				{condition.type === 'exists' || condition.type === '!exists' ?
					undefined :
					<cell>{formatVariables(condition.val, appConfig.configVariables)}</cell>
				}
			</row>
		</table>
		{alertNode}
	</condition> as ConditionNode;
};

export const translateElementProperty = (property: string): string => {
	switch (property) {
		// Special cases, when converting from cameCase is not enough
		case 'videoUrl':
			return 'video URL';
		case 'url':
			return 'URL';
		case 'color':
			return 'text color';
		case 'zIndex':
			return 'z-index';
		case 'automationId':
			return 'automation ID';
		case 'scaleX':
			return 'scale X';
		case 'scaleY':
			return 'scale Y';
		case 'translationX':
			return 'translation X';
		case 'translationY':
			return 'translation Y';
		case 'pivotX':
			return 'pivot X';
		case 'pivotY':
			return 'pivot Y';
		case 'tagInt':
			return 'tag';
		case 'fontURI':
			return 'font URI';
		case 'proposalURL':
			return 'proposal URL';
		default:
			// Split camel case to words
			return property.replace(/([A-Z+])/g, (_, match) => ' ' + match.toLowerCase());
	}
};

/* istanbul ignore next */
const assertUnknownElementCondition = (condition: never): never => {
	throw new Error(`Unknown element condition type: ${JSON.stringify(condition)}`);
};

const translateElementName = (subject: ElementSubject | PSVideoSubject, elements?: Elements): Node | Node[] => {
	if (subject.type === 'video' || (subject as CustomElementSubject).val?.video) {
		return <bold>video</bold>;
	}

	if (subject.type === 'psVideo') {
		return <bold>PlayStation 4 video</bold>;
	}

	if ('elementId' in subject) {
		// Element defined by it's ID
		if (elements && elements[subject.elementId]) {
			return <bold>{elements[subject.elementId].name}</bold>;
		}

		if (subject.name) {
			// Deprecated TODO remove after BE feeds updated
			return <bold>{subject.name}</bold>;
		}

		if (subject.nameHint) {
			// In case element was removed and we no longer have it on record
			return <bold>{subject.nameHint}</bold>;
		}

		return <fragment>
			Unknown element
			(<code>{subject.elementId.length > 12 ? subject.elementId.slice(0, 4) + '...' + subject.elementId.slice(-4) : subject.elementId}</code>)
		</fragment>;
	}

	if ('apiId' in subject) {
		// Element defined by it's API ID
		return <bold>{subject.apiId}</bold>;
	}

	// Otherwise it's a custom element defined by it's selector
	const {ifMultipleFoundReturn, ...selector} = subject.val;
	const selectorKeys = Object.keys(selector);

	if (selectorKeys.length === 1) {
		// A common case when there is a single selector, e.g. css or xpath
		// Casting to any because TS throws an unwarranted error otherwise
		return <code>{(selector as any)[selectorKeys[0]]}</code>;
	}

	return <code>{JSON.stringify({...selector, index: ifMultipleFoundReturn ?? 1})}</code>;
};

const translateElementCondition = (
	condition: ElementCondition,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): ConditionNode => {
	let alertNode: AlertNode | undefined;
	const elementName = translateElementName(condition.subject, elements);

	if (lineResult && lineResult.result !== 'success') {
		if (lineResult.errorType === 'invalidRepositoryReference') {
			alertNode = <alert level={lineResult.result}>
				Element {elementName} was not found in repository.
			</alert> as AlertNode;

			if (lineResult.message) {
				switch (lineResult.message.code) {
					case 'notExistingElement':
						break;
					case 'notExistingPlatform':
						alertNode = <alert level={lineResult.result}>
							Element {elementName} is not defined for selected platform
						</alert> as AlertNode;
						break;
					case 'unknownProperty':
						alertNode = <alert level={lineResult.result}>
							Element does not support property {translateElementProperty(lineResult.message.property)}
						</alert> as AlertNode;
						break;
					default:
						const _message: never = lineResult.message;
						console.warn('invalidRepositoryReference unknown message: ', JSON.stringify(_message));
				}
			}
		} else if (
			lineResult.errorType === 'queryFailed'
			&& condition.type === 'matches'
			&& isMatchJsFail(condition, lineResult)
		) {
			alertNode = matchJSAlertNode(condition.val, lineResult.result);
		} else if ('expression' in lineResult && Array.isArray(lineResult.expression) && condition.type === 'has') {
			alertNode = <alert level={lineResult.result}>
				<dictionary label="Failing checks:">
					{lineResult.expression.reduce((acc, propResult, index) => {
						if (propResult.result === 'success') {
							return acc;
						}
						const prop = condition.expression[index];

						if (
							propResult.errorType === 'queryFailed'
							&& 'expectedValue' in propResult
							&& 'actualValue' in propResult
						) {
							// display actual/expected queryFailed
							acc.push(...getExpectedAndActualValues({
								expectedKey: prop.property, expectedValue: processPropValues(propResult.expectedValue),
								actualKey: prop.property, actualValue: String(propResult.actualValue),
							}));
						} else if ('message' in propResult && propResult.message.code === 'missingProperty') {
							// display error when property not exists for running platform
							acc.push(...getExpectedAndActualValues({
								expectedKey: prop.property, expectedValue: processPropValues(prop.val),
								actualKey: prop.property, actualValue: 'property missing',
							}));
						} else if ('message' in propResult && propResult.message.code === 'wrongExpression') {
							// display error when property has invalid value or comparator
							acc.push(...getExpectedAndActualValues({
								expectedKey: prop.property, expectedValue: processPropValues(prop.val),
								actualKey: prop.property, actualValue: 'wrong format',
							}));
						}

						return acc;
					}, [] as RowNode[])}
				</dictionary>
			</alert> as AlertNode;
		}

		if (!alertNode) {
			alertNode = <alert level={lineResult.result}>{translateTestLineResult(lineResult)}</alert> as AlertNode;
		}
	}

	switch (condition.type) {
		case 'exists': // TODO nyc for some reason reports an uncovered branch here
			return <condition title={<fragment>{elementName} exists</fragment>}>
				{alertNode}
			</condition> as ConditionNode;
		case '!exists':
			return <condition title={<fragment>{elementName} does not exist</fragment>}>
				{alertNode}
			</condition> as ConditionNode;
		case 'matches':
			const codeReplacedVars = replaceVariables(condition.val, appConfig.configVariables);

			return <condition title={<fragment>{elementName} matches JavaScript</fragment>}>
				<code-block label="JavaScript matcher">{codeReplacedVars}</code-block>
				{codeReplacedVars !== condition.val
					? <code-block label="With variables">{condition.val}</code-block>
					: undefined
				}
				{alertNode}
			</condition> as ConditionNode;
		case 'visible':
			return <condition title={<fragment>{elementName} is visible</fragment>}>
				{alertNode}
			</condition> as ConditionNode;
		case 'has':
			return <condition title={<fragment>{elementName} properties</fragment>}>
				<table>
					{condition.expression.map(exp => (
						<row>
							<cell>{translateElementProperty(exp.property)}</cell>
							<cell>{translateComparator(exp.type)}</cell>
							<cell>{formatVariables(exp.val + (exp.type === '+-' ? ' ± ' + exp.deviation : ''), appConfig.configVariables)}</cell>
						</row>
					))}
				</table>
				{alertNode}
			</condition> as ConditionNode;
		default:
			/* istanbul ignore next */
			return assertUnknownElementCondition(condition);
	}
};

/**
 * @description return key-value pairs for expected/actual results
 */
const getExpectedAndActualValues = ({
	expectedKey, actualKey, actualValue, expectedValue,
}: {
	expectedKey: string, expectedValue: string, actualKey: string, actualValue: string,
}): RowNode[] => [
	<row>
		<cell>~ {expectedKey}</cell>
		<cell>{expectedValue} (expected)</cell>
	</row> as RowNode,
	<row>
		<cell>× {actualKey}</cell>
		<cell>{actualValue} (actual)</cell>
	</row> as RowNode,
];

const processPropValues = (val: string | number): string => val === '' ? '[EMPTY STRING]' : String(val);

const translatePSVideoCondition = (
	condition: PSVideoHadNoErrorCondition,
	lineResult?: TestLineResult
): ConditionNode => {
	const title = <fragment>PlayStation 4 video had no error {
		condition.searchStrategy === 'all' ? 'for any source' : 'for current source'
	}</fragment>;

	// TODO: investigate possible errors related to psVideo
	const alertNode = lineResult && lineResult.result !== 'success' ?
		<alert level={lineResult.result}>{translateTestLineResult(lineResult)}</alert> as AlertNode :
		undefined;

	return <condition title={title}>
		{alertNode}
	</condition> as ConditionNode;
};

const translateJavaScriptExpressionCondition = (
	condition: JavaScriptExpressionCondition,
	appConfig: AppConfiguration,
	lineResult?: TestLineResult,
): ConditionNode => {
	const notSpecifiedMessage = '[NOT SPECIFIED]';
	const code = condition.subject.val !== undefined ?
		replaceVariables(condition.subject.val, appConfig.configVariables) :
		notSpecifiedMessage;
	let alertMessage: AlertNode | undefined;
	if (lineResult && lineResult.result !== 'success') {
		if (lineResult.errorType === 'queryFailed' && 'expectedValue' in lineResult && 'actualValue' in lineResult) {
			alertMessage = <alert level={lineResult.result}>
				<dictionary label="Failing checks:">
					{...getExpectedAndActualValues({
						expectedKey: 'compared value', expectedValue: processPropValues(lineResult.expectedValue),
						actualKey: 'returned value', actualValue: processPropValues(lineResult.actualValue),
					})}
				</dictionary>
			</alert> as AlertNode;
		} else {
			alertMessage = <alert level={lineResult.result}>{translateTestLineResult(lineResult)}</alert> as AlertNode;
		}
	}

	return <condition title="JavaScript expression">
		{condition.subject.val !== undefined ?
			<fragment>
				<code-block label="JavaScript expression">{code}</code-block>
				{code !== condition.subject.val
					? <code-block label="With variables">{condition.subject.val}</code-block>
					: undefined
				}
			</fragment> :
			<paragraph>{notSpecifiedMessage}</paragraph>
		}
		<table>
			<row>
				<cell>Expression result</cell>
				<cell>{translateComparator(condition.type)}</cell>
				<cell>{
					condition.val ? formatVariables(condition.val, appConfig.configVariables) : notSpecifiedMessage
				}</cell>
			</row>
		</table>
		{alertMessage}
	</condition> as ConditionNode;
};

const translateNetworkInfo = (isRequest: boolean, appConfig: AppConfiguration) => ({
	name,
	compare,
	val,
}: { name: string, compare: Comparator, val: string | number }): Node | Node[] =>
	<row>
		<cell>
			<text>{isRequest ? 'Request' : 'Response'} </text>
			{name.startsWith('@')
				? <text>{name.slice(1)}</text>
				: <fragment>header {formatVariables(name, appConfig.configVariables)}</fragment>
			}
		</cell>
		<cell>{translateComparator(compare)}</cell>
		<cell>{formatVariables(String(val), appConfig.configVariables)}</cell>
	</row>;

/**
 * Put @status and @method on top, then show headers, then - @body.
 * This order is more familiar to user and closer to HTTP raw request/response.
 *
 * Ordering might be off for headers if variables are used for header names, but that is minor
 */
export const sortNetworkInfo = (a: NetworkRequestInfo, b: NetworkRequestInfo): number => {
	// Method and status always on top
	if (['@method', '@status'].includes(a.name)) {
		return -1;
	}

	if (['@method', '@status'].includes(b.name)) {
		return 1;
	}

	// Body always last
	if (a.name === '@body') {
		return 1;
	}

	if (b.name === '@body') {
		return -1;
	}

	return a.name > b.name ? 1 : -1;
};

const translateNetworkRequestCondition = (
	condition: NetworkRequestCondition,
	appConfig: AppConfiguration,
	lineResult?: TestLineResult,
): ConditionNode => {
	const requestInfo = condition
		.subject
		.requestInfo?.sort(sortNetworkInfo)
		.map(translateNetworkInfo(true, appConfig)) ?? [];
	const responseInfo = condition
		.subject
		.responseInfo?.sort(sortNetworkInfo)
		.map(translateNetworkInfo(false, appConfig)) ?? [];
	const tableRows = requestInfo.concat(responseInfo);

	let alertNode: AlertNode | undefined;
	if (lineResult && lineResult.result !== 'success') {
		if ('errors' in lineResult) {
			const processValues = (val: string | number): string =>
				replaceVariables(processPropValues(val), appConfig.configVariables);

			alertNode = <alert level={lineResult.result}>
				<dictionary label="Failing checks:">
					{lineResult.errors.reduce((rows, err) => {
						if (err.type === 'noUriFound') {
							rows.push(...getExpectedAndActualValues({
								expectedKey: 'url',
								expectedValue: processValues(condition.subject.val),
								actualKey: 'url',
								actualValue: 'request was not made',
							}));

							return rows;
						}

						const props = {
							request: condition.subject.requestInfo ?? [],
							response: condition.subject.responseInfo ?? [],
						};
						const name = err.type === 'header' ? err.name : '@' + err.type;
						const propField = props[err.message].find(field => field.name === name);

						if (propField) {
							const expected = propField.val;
							const actual = 'actualValue' in err && err.reason === 'notMatched' ?
								err.actualValue :
								err.reason === 'notFound' ? 'not found' : 'unknown';
							const key = `${err.message} ${err.type}` + ('name' in err ? ` "${err.name}"` : '');

							rows.push(...getExpectedAndActualValues({
								expectedKey: key,
								expectedValue: processValues(expected),
								actualKey: key,
								actualValue: processValues(actual),
							}));

							return rows;
						}

						return rows;
					}, [] as RowNode[])}
				</dictionary>
			</alert> as AlertNode;
		}
		if (!alertNode) {
			alertNode = <alert level={lineResult.result}>{translateTestLineResult(lineResult)}</alert> as AlertNode;
		}
	}

	return <condition title={<text>Network request {condition.type === 'made' ? 'was made' : 'was not made'}</text>}>
		<dictionary>
			<row>
				<cell>{condition.subject.compare === '=' ? 'Exact URL' : 'URL matching'}</cell>
				<cell>{formatVariables(condition.subject.val, appConfig.configVariables)}</cell>
			</row>
			<row>
				<cell>Previously matched</cell>
				<cell>
					<bold>{condition.searchStrategy === 'all' ? 'Yes' : 'No'}</bold>
				</cell>
			</row>
		</dictionary>
		{tableRows.length
			? <table label="Network request properties">
				{tableRows}
			</table>
			: undefined
		}
		{alertNode}
	</condition> as ConditionNode;
};

/* istanbul ignore next */
const assertUnknownConditionSubject = (subject: never): never => {
	throw new Error(`Unknown condition subject: ${JSON.stringify(subject)}`);
};

const matchJSAlertNode = (jsCode: string, result: Exclude<TestLineResultType, 'success'>): AlertNode =>
	<alert level={result}>
		Expected to match JS function:
		<code-block>{jsCode}</code-block>
	</alert> as AlertNode;

const isMatchJsFail = (condition: Condition, lineResult: TestLineResult): boolean =>
	condition.type === 'matches' && !Reflect.has(lineResult, 'message');
/**
 * Translate condition part of the test line into human readable strings
 * "elements" is optional property. BE is going to update results feed to include elements map,
 * but for now it can be omitted
 */
export const translateCondition = (
	condition: Condition,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): ConditionNode => {
	switch (condition.subject.type) {
		case 'element': // TODO nyc for some reason reports an uncovered branch here
			return translateElementCondition(condition as ElementCondition, appConfig, elements, lineResult);
		case 'video':
			return translateElementCondition(condition as ElementCondition, appConfig, elements, lineResult);
		case 'psVideo':
			if (condition.type === 'hadNoError') {
				return translatePSVideoCondition(condition, lineResult);
			}

			return translateElementCondition(condition as ElementPropertiesCondition, appConfig, elements, lineResult);
		case 'javascript':
			return translateJavaScriptExpressionCondition(
				condition as JavaScriptExpressionCondition, appConfig, lineResult
			);
		case 'location':
			return translateCurrentLocationCondition(condition as CurrentLocationCondition, appConfig, lineResult);
		case 'cookie':
			return translateCookieCondition(condition as CookieCondition, appConfig, lineResult);
		case 'network':
			return translateNetworkRequestCondition(condition as NetworkRequestCondition, appConfig, lineResult);
		case 'application':
			return translateApplicationExitedCondition(lineResult);
		default:
			/* istanbul ignore next */
			return assertUnknownConditionSubject(condition.subject);
	}
};
