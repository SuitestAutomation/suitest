/// <reference path="../../smst/types/intrinsicElements.d.ts" />
/// <reference path="../../smst/types/unistTestLine.d.ts" />
import {jsx} from '@suitest/smst/commonjs/jsxFactory';
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
import {formatVariables, mapStatus, translateCodeProp} from './utils';
import {translateComparator} from './comparator';
import {
	ElementPropertiesCondition,
	PSVideoHadNoErrorCondition,
	PSVideoSubject,
	TestLineResult, // TestLineResultType,
} from '@suitest/types/lib';
// import {translateTestLineResult} from './testLineResults';

const translateApplicationExitedCondition = (lineResult?: TestLineResult): ConditionNode =>
	<condition
		title={<text>Application has exited</text>}
		status={mapStatus(lineResult?.result)}
	/> as ConditionNode;

const translateCurrentLocationCondition = (
	condition: CurrentLocationCondition,
	appConfig: AppConfiguration,
	lineResult?: TestLineResult
): ConditionNode => {
	const isCodeBlock = condition.type === 'matches';

	return <condition title={<text>Current location</text>}>
		<props>
			{isCodeBlock
				? translateCodeProp(
					<text>current location</text>,
					condition.val,
					appConfig,
					translateComparator(condition.type),
					mapStatus(lineResult?.result)
				)
				: <prop
					name={<text>current location</text>}
					expectedValue={formatVariables(condition.val, appConfig.configVariables)}
					comparator={translateComparator(condition.type)}
					status={mapStatus(lineResult?.result)}
					actualValue={lineResult?.actualValue}
				/>
			}
		</props>
	</condition> as ConditionNode;
};

const translateCookieCondition = (
	condition: CookieCondition, appConfig: AppConfiguration, lineResult?: TestLineResult
): ConditionNode => {
	const title = <fragment>cookie <subject>{condition.subject.val}</subject></fragment>;

	if (condition.type === 'exists') {
		return <condition title={<fragment>{title} exists</fragment>}/> as ConditionNode;
	}

	if (condition.type === '!exists') {
		return <condition title={<fragment>{title} does not exist</fragment>}/> as ConditionNode;
	}

	if (condition.type === 'matches') {
		return <condition title={title}>
			{translateCodeProp(
				<subject>{condition.subject.val}</subject>,
				condition.val,
				appConfig,
				condition.type,
				mapStatus(lineResult?.result)
			)}
		</condition> as ConditionNode;
	}

	return <condition title={title}>
		<props>
			<prop
				name={<subject>{condition.subject.val}</subject>}
				comparator={translateComparator(condition.type)}
				expectedValue={formatVariables(condition.val, appConfig.configVariables)}
				actualValue={lineResult?.actualValue}
				status={mapStatus(lineResult?.result)}
			/>
		</props>
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
		return <subject>video</subject>;
	}

	if (subject.type === 'psVideo') {
		return <subject>PlayStation 4 video</subject>;
	}

	if ('elementId' in subject) {
		// Element defined by it's ID
		if (elements && elements[subject.elementId]) {
			return <subject>{elements[subject.elementId].name}</subject>;
		}

		if (subject.name) {
			// Deprecated
			return <subject>{subject.name}</subject>;
		}

		if (subject.nameHint) {
			// In case element was removed and we no longer have it on record
			return <subject>{subject.nameHint}</subject>;
		}

		return <fragment>
			Unknown element
			(<subject>{subject.elementId.length > 12 ? subject.elementId.slice(0, 4) + '...' + subject.elementId.slice(-4) : subject.elementId}</subject>)
		</fragment>;
	}

	if ('apiId' in subject) {
		// Element defined by it's API ID
		return <subject>{subject.apiId}</subject>;
	}

	// Otherwise it's a custom element defined by it's selector
	const {ifMultipleFoundReturn, ...selector} = subject.val;
	const selectorKeys = Object.keys(selector);

	if (selectorKeys.length === 1) {
		// A common case when there is a single selector, e.g. css or xpath
		// Casting to any because TS throws an unwarranted error otherwise
		return <subject>{(selector as any)[selectorKeys[0]]}</subject>;
	}

	return <subject>{JSON.stringify({...selector, index: ifMultipleFoundReturn ?? 1})}</subject>;
};

const translateElementCondition = (
	condition: ElementCondition,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): ConditionNode => {
	// let alertNode: AlertNode | undefined;
	const elementName = translateElementName(condition.subject, elements);

	// if (lineResult && lineResult.result !== 'success') {
	// 	if (lineResult.errorType === 'invalidRepositoryReference') {
	// 		alertNode = <alert level={lineResult.result}>
	// 			Element {elementName} was not found in repository.
	// 		</alert> as AlertNode;
	//
	// 		if (lineResult.message) {
	// 			switch (lineResult.message.code) {
	// 				case 'notExistingElement':
	// 					break;
	// 				case 'notExistingPlatform':
	// 					alertNode = <alert level={lineResult.result}>
	// 						Element {elementName} is not defined for selected platform
	// 					</alert> as AlertNode;
	// 					break;
	// 				case 'unknownProperty':
	// 					alertNode = <alert level={lineResult.result}>
	// 						Element does not support property {translateElementProperty(lineResult.message.property)}
	// 					</alert> as AlertNode;
	// 					break;
	// 				default:
	// 					const _message: never = lineResult.message;
	// 					console.warn('invalidRepositoryReference unknown message: ', JSON.stringify(_message));
	// 			}
	// 		}
	// 	} else if (
	// 		lineResult.errorType === 'queryFailed'
	// 		&& condition.type === 'matches'
	// 		&& isMatchJsFail(condition, lineResult)
	// 	) {
	// 		alertNode = matchJSAlertNode(condition.val, lineResult.result);
	// 	} else if ('expression' in lineResult && Array.isArray(lineResult.expression) && condition.type === 'has') {
	// 		alertNode = <alert level={lineResult.result}>
	// 			<dictionary label="Failing checks:">
	// 				{lineResult.expression.reduce((acc, propResult, index) => {
	// 					if (propResult.result === 'success') {
	// 						return acc;
	// 					}
	// 					const prop = condition.expression[index];
	//
	// 					if (
	// 						propResult.errorType === 'queryFailed'
	// 						&& 'expectedValue' in propResult
	// 						&& 'actualValue' in propResult
	// 					) {
	// 						// display actual/expected queryFailed
	// 						acc.push(...getExpectedAndActualValues({
	// 							expectedKey: prop.property, expectedValue: processPropValues(propResult.expectedValue),
	// 							actualKey: prop.property, actualValue: String(propResult.actualValue),
	// 						}));
	// 					} else if ('message' in propResult && propResult.message.code === 'missingProperty') {
	// 						// display error when property not exists for running platform
	// 						acc.push(...getExpectedAndActualValues({
	// 							expectedKey: prop.property, expectedValue: processPropValues(prop.val),
	// 							actualKey: prop.property, actualValue: 'property missing',
	// 						}));
	// 					} else if ('message' in propResult && propResult.message.code === 'wrongExpression') {
	// 						// display error when property has invalid value or comparator
	// 						acc.push(...getExpectedAndActualValues({
	// 							expectedKey: prop.property, expectedValue: processPropValues(prop.val),
	// 							actualKey: prop.property, actualValue: 'wrong format',
	// 						}));
	// 					}
	//
	// 					return acc;
	// 				}, [] as RowNode[])}
	// 			</dictionary>
	// 		</alert> as AlertNode;
	// 	}
	//
	// 	if (!alertNode) {
	// 		alertNode = <alert level={lineResult.result}>{translateTestLineResult(lineResult)}</alert> as AlertNode;
	// 	}
	// }

	switch (condition.type) {
		case 'exists':
			return <condition
				title={<fragment>{elementName} exists</fragment>}
				status={mapStatus(lineResult?.result)}
			/> as ConditionNode;
		case '!exists':
			return <condition
				title={<fragment>{elementName} does not exist</fragment>}
				status={mapStatus(lineResult?.result)}
			/> as ConditionNode;
		case 'visible':
			return <condition
				title={<fragment>{elementName} is visible</fragment>}
				status={mapStatus(lineResult?.result)}
			/> as ConditionNode;
		case 'matches':
			return <condition
				title={<fragment>{elementName} matches JavaScript</fragment>}
				status={mapStatus(lineResult?.result)}
			>
				{translateCodeProp(
					elementName as Node,
					condition.val,
					appConfig,
					translateComparator(condition.type),
					mapStatus(lineResult?.result)
				)}
			</condition> as ConditionNode;
		case 'has':
			return <condition
				title={elementName}
				status={mapStatus(lineResult?.result)}
			>
				<props>
					{condition.expression.map((exp, i) => {
						const expResult = lineResult && ('expression' in lineResult)
							? lineResult.expression[i]
							: undefined;

						return <prop
							name={<text>{translateElementProperty(exp.property)}</text>}
							comparator={translateComparator(exp.type)}
							expectedValue={formatVariables(exp.val + (exp.type === '+-' ? ' ± ' + exp.deviation : ''), appConfig.configVariables)}
							actualValue={expResult && ('actualValue' in expResult) ? expResult.actualValue : undefined}
							status={expResult?.result}
						/>;
					})}
				</props>
			</condition> as ConditionNode;
		default:
			/* istanbul ignore next */
			return assertUnknownElementCondition(condition);
	}
};

// /**
//  * @description return key-value pairs for expected/actual results
//  */
// const getExpectedAndActualValues = ({
// 	expectedKey, actualKey, actualValue, expectedValue,
// }: {
// 	expectedKey: string, expectedValue: string, actualKey: string, actualValue: string,
// }): RowNode[] => [
// 	<row>
// 		<cell>~ {expectedKey}</cell>
// 		<cell>{expectedValue} (expected)</cell>
// 	</row> as RowNode,
// 	<row>
// 		<cell>× {actualKey}</cell>
// 		<cell>{actualValue} (actual)</cell>
// 	</row> as RowNode,
// ];

// const processPropValues = (val: string | number): string => val === '' ? '[EMPTY STRING]' : String(val);

const translatePSVideoCondition = (
	condition: PSVideoHadNoErrorCondition,
	lineResult?: TestLineResult
): ConditionNode => {
	const title = <fragment>PlayStation 4 video had no error {
		condition.searchStrategy === 'all' ? 'for any source' : 'for current source'
	}</fragment>;

	// TODO: investigate possible errors related to psVideo
	// const alertNode = lineResult && lineResult.result !== 'success' ?
	// 	<alert level={lineResult.result}>{translateTestLineResult(lineResult)}</alert> as AlertNode :
	// 	undefined;

	return <condition title={title} status={mapStatus(lineResult?.result)} /> as ConditionNode;
};

const translateJavaScriptExpressionCondition = (
	condition: JavaScriptExpressionCondition,
	appConfig: AppConfiguration,
	lineResult?: TestLineResult,
): ConditionNode => {
	const notSpecifiedMessage = '[NOT SPECIFIED]';

	return <condition title={<text>JavaScript expression</text>}>
		<props>
			{translateCodeProp(
				<text>expression</text>,
				condition.subject.val ?? notSpecifiedMessage,
				appConfig,
				'',
				lineResult?.errorType === 'JavaScriptError' ? 'fail' : mapStatus(lineResult?.result)
			)}
			<prop
				name={<text>expression result</text>}
				expectedValue={condition.val
					? formatVariables(condition.val, appConfig.configVariables)
					: <text>{notSpecifiedMessage}</text>}
				actualValue={lineResult?.actualValue}
				comparator={translateComparator(condition.type)}
				status={mapStatus(lineResult?.result)}
			/>
		</props>
	</condition> as ConditionNode;
};

const translateNetworkInfo = (isRequest: boolean, appConfig: AppConfiguration) => ({
	name,
	compare,
	val,
}: { name: string, compare: Comparator, val: string | number }): Node =>
	<prop
		name={<fragment>{isRequest ? 'request ' : 'response '}{name.startsWith('@')
			? <text>{name.slice(1)}</text>
			: <fragment>header {formatVariables(name, appConfig.configVariables)}</fragment>
		}</fragment>}
		comparator={translateComparator(compare)}
		expectedValue={formatVariables(String(val), appConfig.configVariables)}
	/>;

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

	// let alertNode: AlertNode | undefined;
	// if (lineResult && lineResult.result !== 'success') {
	// 	if ('errors' in lineResult) {
	// 		const processValues = (val: string | number): string =>
	// 			replaceVariables(processPropValues(val), appConfig.configVariables);
	//
	// 		alertNode = <alert level={lineResult.result}>
	// 			<dictionary label="Failing checks:">
	// 				{lineResult.errors.reduce((rows, err) => {
	// 					if (err.type === 'noUriFound') {
	// 						rows.push(...getExpectedAndActualValues({
	// 							expectedKey: 'url',
	// 							expectedValue: processValues(condition.subject.val),
	// 							actualKey: 'url',
	// 							actualValue: 'request was not made',
	// 						}));
	//
	// 						return rows;
	// 					}
	//
	// 					const props = {
	// 						request: condition.subject.requestInfo ?? [],
	// 						response: condition.subject.responseInfo ?? [],
	// 					};
	// 					const name = err.type === 'header' ? err.name : '@' + err.type;
	// 					const propField = props[err.message].find(field => field.name === name);
	//
	// 					if (propField) {
	// 						const expected = propField.val;
	// 						const actual = 'actualValue' in err && err.reason === 'notMatched' ?
	// 							err.actualValue :
	// 							err.reason === 'notFound' ? 'not found' : 'unknown';
	// 						const key = `${err.message} ${err.type}` + ('name' in err ? ` "${err.name}"` : '');
	//
	// 						rows.push(...getExpectedAndActualValues({
	// 							expectedKey: key,
	// 							expectedValue: processValues(expected),
	// 							actualKey: key,
	// 							actualValue: processValues(actual),
	// 						}));
	//
	// 						return rows;
	// 					}
	//
	// 					return rows;
	// 				}, [] as RowNode[])}
	// 			</dictionary>
	// 		</alert> as AlertNode;
	// 	}
	// 	if (!alertNode) {
	// 		alertNode = <alert level={lineResult.result}>{translateTestLineResult(lineResult)}</alert> as AlertNode;
	// 	}
	// }

	return <condition title={<text>network request {condition.type === 'made' ? 'was made' : 'was not made'} {condition.searchStrategy === 'all' ? 'in entire network log' : 'excluding previously matched requests'}</text>}>
		<props>
			<prop
				name={<text>URL</text>}
				comparator={translateComparator(condition.subject.compare)}
				expectedValue={formatVariables(condition.subject.val, appConfig.configVariables)}
				status={lineResult && ('errors' in lineResult) && lineResult.errors.find(err => err.type === 'noUriFound') ? 'fail' : undefined}
			/>
			{tableRows}
		</props>
	</condition> as ConditionNode;
};

/* istanbul ignore next */
const assertUnknownConditionSubject = (subject: never): never => {
	throw new Error(`Unknown condition subject: ${JSON.stringify(subject)}`);
};

// const matchJSAlertNode = (jsCode: string, result: Exclude<TestLineResultType, 'success'>): AlertNode =>
// 	<alert level={result}>
// 		Expected to match JS function:
// 		<code-block>{jsCode}</code-block>
// 	</alert> as AlertNode;
//
// const isMatchJsFail = (condition: Condition, lineResult: TestLineResult): boolean =>
// 	condition.type === 'matches' && !Reflect.has(lineResult, 'message');
/**
 * Translate condition part of the test line into SMST
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
		case 'element':
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
