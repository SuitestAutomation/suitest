import {
	StartupError,
	LineResultTranslated,
	LineDefinition,
	Options,
	FormattedString,
	LineResult,
	LineResultDetail,
	NetworkError,
	AssertConditionNetworkType,
	AssertConditionElementType,
	AssertConditionVideoType
} from './types';

export const helloWorld = () => 'Hello World';

// TODO: replace by real
const t = (text: string) => text;

/**
 * Translate the reason for test not being executed
 */
export function translateStartupError(code: StartupError): LineResultTranslated {
	switch (code) {
		case StartupError.blasterError:
			return {
				title: t('startupError.blasterError'),
				description: t('startupError.blasterError.desc'),
			};
		case StartupError.bootstrappedPlatformError:
			return {
				title: t('startupError.bootstrappedPlatformError'),
				description: t('startupError.bootstrappedPlatformError.desc'),
			};
		case StartupError.testQueued:
			return {
				title: t('startupError.testQueued'),
				description: t('startupError.testQueued.desc'),
			};
		case StartupError.noAvailableAutomatedMinutes:
			return {
				title: t('startupError.noAvailableAutomatedMinutes'),
				description: t('startupError.noAvailableAutomatedMinutes.desc'),
			};
		case StartupError.noActivePlan:
			return {
				title: t('startupError.noActivePlan'),
				description: t('startupError.noActivePlan.desc'),
			};
		case StartupError.candyBoxOffline:
			return {
				title: t('startupError.candyBoxOffline'),
				description: t('startupError.candyBoxOffline.desc'),
			};
		case StartupError.suitestDriveOffline:
			return {
				title: t('startupError.suitestDriveOffline'),
				description: t('startupError.suitestDriveOffline.desc'),
			};
		case StartupError.runningBootSequence:
			return {
				title: t('startupError.runningBootSequence'),
				description: t('startupError.runningBootSequence.desc'),
			};
		case StartupError.deviceInUse:
			return {
				title: t('startupError.deviceInUse'),
				description: t('startupError.deviceInUse.desc'),
			};
		case StartupError.deviceDisabled:
			return {
				title: t('startupError.deviceDisabled'),
				description: t('startupError.deviceDisabled.desc'),
			};
		case StartupError.deviceDeleted:
			return {
				title: t('startupError.deviceDeleted'),
				description: t('startupError.deviceDeleted.desc'),
			};
		case StartupError.internalError:
			return {
				title: t('startupError.internalError'),
				description: t('startupError.internalError.desc'),
			};
		case StartupError.notDefinedPlatform:
			return {
				title: t('startupError.notDefinedPlatform'),
				description: t('startupError.notDefinedPlatform.desc'),
			};
		case StartupError.lgWebosPlatformError:
			return {
				title: t('startupError.lgWebosPlatformError'),
				description: t('startupError.lgWebosPlatformError.desc'),
			};
		case StartupError.xboxPlatformError:
			return {
				title: t('startupError.xboxPlatformError'),
				description: t('startupError.xboxPlatformError.desc'),
			};
		case StartupError.androidPlatformError:
			return {
				title: t('startupError.androidPlatformError'),
				description: t('startupError.androidPlatformError.desc'),
			};
	}
}

/**
 * Translate line definition from JSON to formatted string
 *
 * @example translateLine({type: 'openApp'}, {config}) === 'Open app **App name** at homepage'
 */
// TODO
// @ts-ignore
export function translateLine(lienDefinition: LineDefinition, options: Options): FormattedString {
	// pass
}

/**
 * Translate JSON for the line result into another JSON, that's easily renderable with HTML / console
 *
 * @example
 * translateLineResult({type:'wait',condition:{subject:{type:'element',...},type:'has',expression:[...]}}, ...) === {
 * 	title: 'Element Big Bunny focused failed to meet specified conditions',
 * 	details: [{
 * 		prop: 'border color',
 * 		actual: 'rgb(255, 255, 255)',
 * 		expected: 'rgb(123, 123, 123)',
 * 		expectedDefault: true,
 * 		comparator: '=',
 * 	}],
 * }
 */
export function translateLineResult(
	lineDefinition: LineDefinition,
	lineResult: LineResult,
	options: Options
): LineResultTranslated {
	const description = getDescription(lineResult.errorType);
	const details = getDetails(lineDefinition, lineResult, options);
}

function getDescription(errorType?: 'deviceIsBusy' | 'launchExpired' | 'deviceConnectionError' | string): string | undefined {
	switch (errorType) {
		case 'deviceIsBusy': return t('errorDescription.identicalScheduling');
		case 'launchExpired': return t('errorDescription.identicalScheduling');
		case 'deviceConnectionError': return t('errorDescription.deviceConnectionError');
	}

	return;
}

function getDetails(
	definition: LineDefinition,
	lineResult: LineResult,
	{config}: Options
): LineResultDetail[] {
	// Reversed then
	if ('then' in definition && definition.then !== 'success' || !invalidErrorHasRows(lineResult)) {
		return [];
	}

	if ('condition' in definition && definition.condition !== undefined
		&& definition.condition.subject
		&& definition.condition.subject.type === 'network'
	) {
		return getNetworkRows(definition.condition.subject, lineResult.errors || []);
	}

	// Nothing to build upon
	if (!('condition' in definition)
		|| definition.condition === undefined
		|| !Reflect.has(definition.condition, 'expression')
		|| !lineResult.expression
	) {
		return [];
	}

	// Exist condition
	if (['exists', '!exists', 'matches', 'matchesBRS'].indexOf(definition.condition.type) !== -1) {
		return [];
	}

	// If element is missing - no need to show rows, error title will be enough
	if (lineResult.errorType === 'queryFailed'
		&& lineResult.message
		&& lineResult.message.code === 'missingSubject'
	) { return []; }

	const isReverseCondition = 'then' in definition && definition.then !== 'success';
	const expression = (definition.condition as AssertConditionElementType | AssertConditionVideoType).expression || [];
	const responseExpression = lineResult.expression || [];

	const max = Math.max(expression.length, responseExpression.length);
	const out: LineResultDetail[] = [];

	for (let i = 0; i < max; i++) {
		const def = expression[i];
		const res = responseExpression[i];
		let actualValue: string | number | undefined = 'unknown';

		// Something wrong with data
		if (!def || !res) {
			continue;
		}

		// Result is success
		if (res.result === 'success') {
			continue;
		}

		if ('actualValue' in res) {
			actualValue = res.actualValue;
		} else if (isReverseCondition) {
			// if [something] then fail
			actualValue = def.val;
		}

		let expectedMsg = def.val;
		const messageCode = getCode(res);

		switch (messageCode) {
			case 'wrongExpression':
				expectedMsg = `Value (${valueNormalize(def.val, def.property)}) is in the wrong format`;
				break;
			case 'missingProperty':
				expectedMsg = 'Property is missing';
				break;
			default:
				break;
		}

		out.push({
			// TODO: check the def.name will be in response
			prop: def.name || '',
			// def.inherited means that value is taken from elements repo,
			// variables defined in repo are not supported yet, and should not be treated as such
			expected: def.inherited ? expectedMsg : applyConfigVars(expectedMsg, config.configVariables),
			actual: applyConfigVars(valueNormalize(actualValue, def.property), config.configVariables),
			comparator: def.type,
			expectedDefault: !!def.inherited,
		});
	}

	return out;
}

/**
 * Quick and dirty rows for network requests. The structure must be same as for "element has" condition
 */
function getNetworkRows(subject: AssertConditionNetworkType['subject'], errors: NetworkError[]): LineResultDetail[] {
	if (errors.length === 1 && errors[0].type === 'noUriFound') {
		return [];
	}

	return errors.map(error => {
		const headers = (error.message === 'request' ? subject.requestInfo : subject.responseInfo) || [];

		const def = headers.find(item => {
			return item.name === (error.type === 'header' ? error.name : '@' + error.type);
		})!;

		return {
			prop: bold(error.name),
			expected: valueNormalize(def.val),
			actual: error.actualValue || '',
			expectedDefault: false,
			comparator: def.compare,
		};
	});
}

function invalidErrorHasRows(res: LineResult) {
	return res.errorType !== 'invalidInput'
		|| (res.message && res.message.code === 'wrongExpression')
		|| (Array.isArray(res.expression)
			&& res.expression.some(res => res.errorType === 'invalidInput'));
}

function getInfo(res: LineResult) {
	return res.message && res.message.info || {};
}

function getCode(res: {message?: {code?: string}}) {
	return res.message && res.message.code;
}

function bold(str: string): string {
	return `**${str}**`;
}
