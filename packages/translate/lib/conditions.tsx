import '../types/intrinsicElements';
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
	Elements, ElementSubject,
} from '@suitest/types';
import {formatVariables, replaceVariables} from './utils';
import {translateComparator} from './comparators';
import {ConditionNode, Node} from '../types/unistTestLine';

const translateApplicationExitedCondition = (): ConditionNode =>
	<condition title="Application has exited" /> as ConditionNode;

const translateCurrentLocationCondition = (
	condition: CurrentLocationCondition,
	appConfig: AppConfiguration
): ConditionNode =>
	<condition title="Current location">
		<table>
			<row>
				<cell>URL</cell>
				<cell>{translateComparator(condition.type)}</cell>
				<cell>{formatVariables(condition.val, appConfig.configVariables)}</cell>
			</row>
		</table>
	</condition> as ConditionNode;

const translateCookieCondition = (condition: CookieCondition, appConfig: AppConfiguration): ConditionNode =>
	<condition title="Cookie">
		<table>
			<row>
				<cell>{formatVariables(condition.subject.val, appConfig.configVariables)} cookie`)}</cell>
				<cell>{translateComparator(condition.type)}</cell>
				<cell>{formatVariables(condition.val, appConfig.configVariables)}</cell>
			</row>
		</table>
	</condition> as ConditionNode;

// TODO - cover with unit tests
const translateElementProperty = (property: string): string => {
	switch (property) {
		// Special cases, when converting from cameCase is not enough
		case 'videoUrl': return 'video URL';
		case 'url': return 'URL';
		case 'color': return 'text color';
		case 'zIndex': return 'z-index';
		case 'automationId': return 'automation ID';
		case 'scaleX': return 'scale X';
		case 'scaleY': return 'scale Y';
		case 'translationX': return 'translation X';
		case 'translationY': return 'translation Y';
		case 'pivotX': return 'pivot X';
		case 'pivotY': return 'pivot Y';
		case 'tagInt': return 'tag';
		case 'fontURI': return 'font URI';
		case 'proposalURL': return 'proposal URL';
		default:
			// Split camel case to words
			return property.replace(/([A-Z+])/g, (_, match) => ' ' + match.toLowerCase());
	}
};

const assertUnknownElementCondition = (condition: never): never => {
	throw new Error(`Unknown element condition type: ${JSON.stringify(condition)}`);
};

const translateElementName = (subject: ElementSubject, elements?: Elements): Node => {
	if (subject.type === 'video') {
		return <bold>video</bold>;
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

		return <text-fragment>
			Unknown element (<code>{subject.elementId.slice(0, 4) + '...' + subject.elementId.slice(-4)}</code>)
		</text-fragment>;
	}

	if ('apiId' in subject) {
		// Element defined by it's API ID
		return <text-fragment><bold>{subject.apiId}</bold> element</text-fragment>;
	}

	// Otherwise it's a custom element defined by it's selector
	const {ifMultipleFoundReturn, ...selector} = subject.val;

	return <code>{JSON.stringify({...selector, index: ifMultipleFoundReturn ?? 1})}</code>;
};

const translateElementCondition = (
	condition: ElementCondition,
	appConfig: AppConfiguration,
	elements?: Elements
): ConditionNode => {
	const elementName = translateElementName(condition.subject, elements);

	switch (condition.type) {
		case 'exists':
			return <condition title={<text-fragment>{elementName} exists</text-fragment>} /> as ConditionNode;
		case '!exists':
			return <condition title={<text-fragment>{elementName} does not exist</text-fragment>} /> as ConditionNode;
		case 'matches':
			const codeReplacedVars = replaceVariables(condition.val, appConfig.configVariables);

			return <condition title={<text-fragment>{elementName} matches JavaScript</text-fragment>}>
				<code-block label="JavaScript matcher">{codeReplacedVars}</code-block>
				{codeReplacedVars !== condition.val
					? <code-block label="With variables">{condition.val}</code-block>
					: undefined
				}
			</condition> as ConditionNode;
		case 'visible':
			return <condition title={<text-fragment>{elementName} is visible</text-fragment>} /> as ConditionNode;
		case 'has':
			return <condition title={<text-fragment>{elementName} properties</text-fragment>}>
				<table>
				{condition.expression.map(exp => (
					<row>
						<cell>{translateElementProperty(exp.property)}</cell>
						<cell>{translateComparator(exp.type)}</cell>
						<cell>{formatVariables(exp.val + (exp.type === '+-' ? ' ± ' + exp.deviation : ''), appConfig.configVariables)}</cell>
					</row>
				))}
				</table>
			</condition> as ConditionNode;
		default:
			return assertUnknownElementCondition(condition);
	}
};

const translateJavaScriptExpressionCondition = (
	condition: JavaScriptExpressionCondition,
	appConfig: AppConfiguration
): ConditionNode => {
	const code = replaceVariables(condition.subject.val, appConfig.configVariables);

	return <condition title="JavaScript expression">
		<code-block label="JavaScript expression">{code}</code-block>
		{code !== condition.val
			? <code-block label="With variables">{condition.val}</code-block>
			: undefined
		}
		<table>
			<row>
				<cell>Expression result</cell>
				<cell>{translateComparator(condition.type)}</cell>
				<cell>formatVariables(condition.val, appConfig.configVariables)</cell>
			</row>
		</table>
	</condition> as ConditionNode;
};

const translateNetworkInfo = (isRequest: boolean, appConfig: AppConfiguration) =>
	({name, compare, val}: {name: string, compare: Comparator, val: string | number}): Node =>
		<row>
			<cell>
				<text>{isRequest ? 'Request' : 'Response'} </text>
				{name.startsWith('@')
					? <text>name.slice(1)</text>
					: <text-fragment>header {formatVariables(name, appConfig.configVariables)}</text-fragment>
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
const sortNetworkInfo = (a: NetworkRequestInfo, b: NetworkRequestInfo): number => {
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

	return a.name > b.name ? -1 : 1;
};

const translateNetworkRequestCondition = (
	condition: NetworkRequestCondition,
	appConfig: AppConfiguration
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

	return <condition title={<text>Network request {condition.type === 'made' ? 'was made' : 'was not made'}</text>}>
		<dictionary>
			<row>
				<cell>{condition.subject.compare === '=' ? 'URL' : 'URL matching'}</cell>
				<cell>{formatVariables(condition.subject.val, appConfig.configVariables)}</cell>
			</row>
			<row>
				<cell>Previously matched</cell>
				<cell><bold>{condition.searchStrategy === 'all' ? 'Yes' : 'No'}</bold></cell>
			</row>
		</dictionary>
		{tableRows.length
			? <table label="Network request properties">
				{tableRows}
			</table>
			: undefined
		}
	</condition> as ConditionNode;
};

const assertUnknownConditionSubject = (subject: never): never => {
	throw new Error(`Unknown condition subject: ${JSON.stringify(subject)}`);
};

/**
 * Translate condition part of the test line into human readable strings
 * "elements" is optional property. BE is going to update results feed to include elements map,
 * but for now it can be omitted
 */
export const translateCondition = (
	condition: Condition,
	appConfig: AppConfiguration,
	elements?: Elements
): ConditionNode => {
	switch (condition.subject.type) {
		case 'element':
		case 'video':
			return translateElementCondition(condition as ElementCondition, appConfig, elements);
		case 'javascript':
			return translateJavaScriptExpressionCondition(condition as JavaScriptExpressionCondition, appConfig);
		case 'location':
			return translateCurrentLocationCondition(condition as CurrentLocationCondition, appConfig);
		case 'cookie':
			return translateCookieCondition(condition as CookieCondition, appConfig);
		case 'network':
			return translateNetworkRequestCondition(condition as NetworkRequestCondition, appConfig);
		case 'application':
			return translateApplicationExitedCondition();
		default:
			return assertUnknownConditionSubject(condition.subject);
	}
};
