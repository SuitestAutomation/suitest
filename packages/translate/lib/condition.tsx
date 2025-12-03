import {jsx} from '@suitest/smst';
import {ConditionNode, InlinePropertyNode} from '@suitest/smst/types/unistTestLine';
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
	Elements,
	ElementSubject,
	CustomElementSubject,
	ElementPropertiesCondition,
	PSVideoHadNoErrorCondition,
	PSVideoSubject,
	QueryFailedNetworkError,
	TestLineResult,
	OcrCondition,
	ImageCondition,
	ImageSubject,
} from '@suitest/types';
import {formatVariables, mapStatus, shouldElMatchDetailsBeHidden, translateCodeProp} from './utils';
import {translateComparator} from './comparator';

const translateApplicationExitedCondition = (inverse: boolean, lineResult?: TestLineResult): ConditionNode =>
	<condition
		title={<text>Application has exited</text>}
		status={mapStatus(lineResult?.result, inverse)}
	/> as ConditionNode;

const translateCurrentLocationCondition = (
	condition: CurrentLocationCondition,
	inverse: boolean,
	appConfig?: AppConfiguration,
	lineResult?: TestLineResult,
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
					mapStatus(lineResult?.result, inverse)
				)
				: <prop
					name={<text>current location</text>}
					expectedValue={formatVariables(condition.val, appConfig?.configVariables)}
					comparator={translateComparator(condition.type)}
					status={mapStatus(lineResult?.result, inverse)}
					actualValue={lineResult?.actualValue}
				/>
			}
		</props>
	</condition> as ConditionNode;
};

const translateCookieCondition = (
	condition: CookieCondition,
	inverse: boolean,
	appConfig?: AppConfiguration,
	lineResult?: TestLineResult,
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
					mapStatus(lineResult?.result, inverse)
				)}
			</props>
		</condition> as ConditionNode;
	}

	if (condition.type === 'withProperties') {
		const title = <fragment>cookie <subject>{condition.subject.val}</subject> with expected properties</fragment>;
		const errors = lineResult && 'properties' in lineResult ? lineResult.properties : undefined;

		return <condition title={title}>
			<props>
				{condition.properties.map((prop, index) => {
					const propResult = errors?.[index];
					const actualValue = propResult && propResult.result === 'fail' ? propResult.actualValue : undefined;
					const expectedValue = typeof prop.val === 'boolean'
						? prop.val
						: formatVariables(prop.val, appConfig?.configVariables);

					return <prop
						name={prop.property}
						comparator={translateComparator(prop.type)}
						expectedValue={expectedValue}
						actualValue={actualValue}
						status={mapStatus(propResult?.result, inverse)}
					/>;
				})}
			</props>
		</condition> as ConditionNode;
	}

	return <condition title={title}>
		<props>
			<prop
				name={<subject>{condition.subject.val}</subject>}
				comparator={translateComparator(condition.type)}
				expectedValue={formatVariables(condition.val, appConfig?.configVariables)}
				actualValue={lineResult?.actualValue}
				status={mapStatus(lineResult?.result, inverse)}
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

const translateElementName = (subject: ElementSubject | PSVideoSubject, elements?: Elements): JSX.Element => {
	const isSubjectBelongTo = (type: 'video' | 'psVideo'): boolean =>
		'val' in subject && !Array.isArray(subject.val) && !!subject.val[type];

	if (subject.type === 'video' || isSubjectBelongTo('video')) {
		return <subject>video</subject>;
	}

	if (subject.type === 'psVideo' || isSubjectBelongTo('psVideo')) {
		return <subject>PlayStation 4 video</subject>;
	}

	if ('elementId' in subject) {
		// Element defined by it's ID
		if (elements && elements[subject.elementId]) {
			return <subject>{elements[subject.elementId].name}</subject>;
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

	return <subject>{stringifyCustomElementSubjectVal(subject.val)}</subject>;
};

// TODO: unify with stringifySelector from testLine.tsx?
const stringifyCustomElementSubjectVal = (val: CustomElementSubject['val']): string => {
	if (Array.isArray(val)) {
		return val.map(stringifyCustomElementSubjectVal).join(' -> ');
	}
	if (val.active) {
		return 'active element';
	}

	if (val.handle) {
		return `element by handle "${val.handle}"`;
	}

	if (typeof val.linkText === 'string') {
		return `link with "${val.linkText}" text`;
	}

	if (typeof val.partialLinkText === 'string') {
		return `link containing "${val.partialLinkText}" text`;
	}

	// Otherwise it's a custom element defined by it's selector
	const {ifMultipleFoundReturn, ...selector} = val;
	const selectorEntries = Object.entries(selector);

	if (selectorEntries.length === 1) {
		// A common case when there is a single selector, e.g. css or xpath
		// Casting to any because TS throws an unwarranted error otherwise
		return selectorEntries[0][1];
	}

	return JSON.stringify({...selector, index: ifMultipleFoundReturn ?? 1});
};

const translateElementCondition = (
	condition: ElementCondition,
	inverse: boolean,
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): ConditionNode => {
	// let alertNode: AlertNode | undefined;
	const elementName = translateElementName(condition.subject, elements);

	switch (condition.type) {
		case 'exists':
			return <condition
				title={<fragment>{elementName} exists</fragment>}
				status={mapStatus(lineResult?.result, inverse)}
			/> as ConditionNode;
		case '!exists':
			return <condition
				title={<fragment>{elementName} does not exist</fragment>}
				status={mapStatus(lineResult?.result, inverse)}
			/> as ConditionNode;
		case 'visible':
			return <condition
				title={<fragment>{elementName} is visible</fragment>}
				status={mapStatus(lineResult?.result, inverse)}
			/> as ConditionNode;
		case '!visible':
			return <condition
				title={<fragment>{elementName} is not visible</fragment>}
				status={mapStatus(lineResult?.result, inverse)}
			/> as ConditionNode;
		case 'matches':
			return <condition
				title={<fragment>{elementName} matches JavaScript</fragment>}
				status={mapStatus(lineResult?.result, inverse)}
			>
				<props>
					{translateCodeProp(
						elementName as Node,
						condition.val,
						appConfig,
						translateComparator(condition.type),
						mapStatus(lineResult?.result, inverse)
					)}
				</props>
			</condition> as ConditionNode;
		case 'has':
			return <condition
				title={elementName}
				status={mapStatus(lineResult?.result, inverse)}
			>
				{shouldElMatchDetailsBeHidden(lineResult) ? null : <props>
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
						const expectedValue = exp.inherited
							? (expResult && 'expectedValue' in expResult)
								? expResult.expectedValue
								: '[element repository value]'
							: exp.val;

						return <prop
							name={<text>{translateElementProperty(exp.property)}</text>}
							comparator={translateComparator(exp.type)}
							expectedValue={formatVariables(expectedValue + (exp.type === '+-' ? ' ± ' + exp.deviation : ''), appConfig?.configVariables)}
							actualValue={actualValue}
							status={expResult?.result}
						/>;
					})}
				</props>}
			</condition> as ConditionNode;
		default:
			/* istanbul ignore next */
			return assertUnknownElementCondition(condition);
	}
};

const translatePSVideoCondition = (
	condition: PSVideoHadNoErrorCondition,
	inverse: boolean,
	lineResult?: TestLineResult
): ConditionNode => {
	const title = <fragment>PlayStation 4 video had no error {
		condition.searchStrategy === 'all' ? 'for any source' : 'for current source'
	}</fragment>;

	return <condition title={title} status={mapStatus(lineResult?.result, inverse)} /> as ConditionNode;
};

const translateJavaScriptExpressionCondition = (
	condition: JavaScriptExpressionCondition,
	inverse: boolean,
	appConfig?: AppConfiguration,
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
				name={<text>expected result</text>}
				expectedValue={condition.val
					? formatVariables(condition.val, appConfig?.configVariables)
					: <text>{notSpecifiedMessage}</text>}
				actualValue={lineResult?.actualValue}
				comparator={translateComparator(condition.type)}
				status={mapStatus(lineResult?.result, inverse)}
			/>
		</props>
	</condition> as ConditionNode;
};

const translateNetworkInfo = (
	isRequest: boolean, appConfig?: AppConfiguration, errors: QueryFailedNetworkError['errors'] = []
) => (
	{ name, compare, val }: { name: string, compare: Comparator, val: string | number },
): InlinePropertyNode => {
	const error = errors.find(err => {
		if (err.type === 'noUriFound') { return false; }
		if (err.message !== (isRequest ? 'request' : 'response')) { return false; }
		const propName = 'name' in err ? err.name : '@' + err.type;

		return propName === name;
	});

	const headerNode = <prop
		name={<fragment>{isRequest ? 'request ' : 'response '}{name.startsWith('@')
			? <text>{name.slice(1)}</text>
			: <fragment>header {formatVariables(name, appConfig?.configVariables)}</fragment>
		}</fragment>}
		comparator={translateComparator(compare)}
		expectedValue={formatVariables(String(val), appConfig?.configVariables)}
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
	inverse: boolean,
	appConfig?: AppConfiguration,
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
				expectedValue={formatVariables(condition.subject.val, appConfig?.configVariables)}
				status={lineResult && ('errors' in lineResult) && lineResult.errors.find(err => err.type === 'noUriFound') ? (!inverse ? 'fail' : 'success') : undefined}
			/>
			{tableRows}
		</props>
	</condition> as ConditionNode;
};

/**
 * @description translate OCR comparators assertions
 */
const translateOcrCondition = (
	condition: OcrCondition,
	inverse: boolean,
	appConfig?: AppConfiguration,
	lineResult?: TestLineResult,
): ConditionNode => {
	const ocrCompResults = lineResult && 'comparators' in lineResult
		? lineResult.comparators
		: [];

	return (
		<condition title={<text>OCR</text>}>
			<props>
				{condition.comparators.map((ocrComp, index) => {
					const ocrCompResult = ocrCompResults?.[index];
					const actualValue = ocrCompResult && ocrCompResult.result === 'fail' ? ocrCompResult.actualValue : undefined;
					const expectedValue = formatVariables(ocrComp.val ?? '', appConfig?.configVariables);

					let ocrCompTitle = 'text on screen';
					if (ocrComp.region?.length) {
						const [x, y, width, height] = ocrComp.region;
						ocrCompTitle = `text in region (x:${x}, y:${y}, w:${width}, h:${height})`;
					}

					return <prop
						name={ocrCompTitle}
						comparator={translateComparator(ocrComp.type)}
						expectedValue={expectedValue}
						actualValue={actualValue}
						status={mapStatus(ocrCompResult?.result, inverse)}
					/>;
				})}
			</props>
		</condition>
	) as ConditionNode;
};

const translateImageCondition = (
	condition: ImageCondition,
	inverse: boolean,
	lineResult?: TestLineResult,
): ConditionNode => {
	const stringifyImageSubject = (subject: ImageSubject): string => {
		if ('url' in subject) {
			return subject.url;
		}
		if ('filepath' in subject) {
			return subject.filepath;
		}
		if ('apiId' in subject) {
			return subject.apiId;
		}

		return '';
	};

	let title = `Image (${stringifyImageSubject(condition.subject)})`;
	if (!condition.region) {
		title += ' on screen';
	} else {
		const [x, y, width, height] = condition.region;
		title += ` in region ${x} ${y} ${width} ${height}`;
	}

	return (
		<condition
			title={<text>{title}</text>}
			status={mapStatus(lineResult?.result, inverse)}
		></condition>
	) as ConditionNode;
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
	inverse: boolean,
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): ConditionNode => {
	switch (condition.subject.type) {
		case 'element':
		case 'video':
			return translateElementCondition(condition as ElementCondition, inverse, appConfig, elements, lineResult);
		case 'psVideo':
			if (condition.type === 'hadNoError') {
				return translatePSVideoCondition(condition, inverse, lineResult);
			}

			return translateElementCondition(
				condition as ElementPropertiesCondition, inverse, appConfig, elements, lineResult);
		case 'javascript':
			return translateJavaScriptExpressionCondition(
				condition as JavaScriptExpressionCondition, inverse, appConfig, lineResult
			);
		case 'location':
			return translateCurrentLocationCondition(
				condition as CurrentLocationCondition, inverse, appConfig, lineResult);
		case 'cookie':
			return translateCookieCondition(condition as CookieCondition, inverse, appConfig, lineResult);
		case 'network':
			return translateNetworkRequestCondition(
				condition as NetworkRequestCondition, inverse, appConfig, lineResult);
		case 'application':
			return translateApplicationExitedCondition(inverse, lineResult);
		case 'ocr':
			return translateOcrCondition(condition as OcrCondition, inverse, appConfig, lineResult);
		case 'image':
			return translateImageCondition(condition as ImageCondition, inverse, lineResult);
		default:
			/* istanbul ignore next */
			return assertUnknownConditionSubject(condition.subject);
	}
};
