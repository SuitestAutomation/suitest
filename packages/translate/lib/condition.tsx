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
	QueryFailedNetworkError,
	TestLineResult,
} from '@suitest/types/lib';

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
			<props>
				{translateCodeProp(
					<subject>{condition.subject.val}</subject>,
					condition.val,
					appConfig,
					condition.type,
					mapStatus(lineResult?.result)
				)}
			</props>
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
				<props>
					{translateCodeProp(
						elementName as Node,
						condition.val,
						appConfig,
						translateComparator(condition.type),
						mapStatus(lineResult?.result)
					)}
				</props>
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

						let actualValue = expResult && ('actualValue' in expResult) ? expResult.actualValue : undefined;
						if (expResult && 'message' in expResult && expResult.message.code === 'missingProperty') {
							actualValue = 'property missing';
						} else if (expResult && 'message' in expResult && expResult.message.code === 'wrongExpression') {
							actualValue = 'wrong format';
						}

						return <prop
							name={<text>{translateElementProperty(exp.property)}</text>}
							comparator={translateComparator(exp.type)}
							expectedValue={formatVariables(exp.val + (exp.type === '+-' ? ' ± ' + exp.deviation : ''), appConfig.configVariables)}
							actualValue={actualValue}
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

const translatePSVideoCondition = (
	condition: PSVideoHadNoErrorCondition,
	lineResult?: TestLineResult
): ConditionNode => {
	const title = <fragment>PlayStation 4 video had no error {
		condition.searchStrategy === 'all' ? 'for any source' : 'for current source'
	}</fragment>;

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

const translateNetworkInfo = (
	isRequest: boolean, appConfig: AppConfiguration, errors: QueryFailedNetworkError['errors'] = []
) => (
	{ name, compare, val }: { name: string, compare: Comparator, val: string | number },
): Node => {
	const error = errors.find(err => {
		if (err.type === 'noUriFound') { return false; }
		if (err.message !== (isRequest ? 'request' : 'response')) { return false; }
		const propName = 'name' in err ? err.name : '@' + err.type;

		return propName === name;
	});

	const headerNode = <prop
		name={<fragment>{isRequest ? 'request ' : 'response '}{name.startsWith('@')
			? <text>{name.slice(1)}</text>
			: <fragment>header {formatVariables(name, appConfig.configVariables)}</fragment>
		}</fragment>}
		comparator={translateComparator(compare)}
		expectedValue={formatVariables(String(val), appConfig.configVariables)}
	/> as InlinePropertyNode;

	// specify header status
	if (errors.length > 1 && errors[0].type !== 'noUriFound') {
		headerNode.status = error ? 'fail' : 'success';
	}
	if (!error || error.type === 'noUriFound') {
		return headerNode;
	}
	if (error.reason === 'notMatched') {
		headerNode.actualValue = error.actualValue === ''
			? '[EMPTY STRING]' // TODO(fixme): remove it when it will be handled on text renderer side.
			: error.actualValue;
	} else if (error.reason === 'notFound') {
		headerNode.actualValue = 'not found';
	} else {
		headerNode.actualValue = 'unknown';
	}

	return headerNode;
};

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
	const errors = lineResult?.errorType === 'queryFailed' && 'errors' in lineResult ? lineResult.errors : [];
	const requestInfo = condition
		.subject
		.requestInfo?.sort(sortNetworkInfo)
		.map(translateNetworkInfo(true, appConfig, errors)) ?? [];
	const responseInfo = condition
		.subject
		.responseInfo?.sort(sortNetworkInfo)
		.map(translateNetworkInfo(false, appConfig, errors)) ?? [];
	const tableRows = requestInfo.concat(responseInfo);

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
