import {jsx} from '@suitest/smst';
import {AppConfiguration, InvalidRepositoryReferenceError, TestLineResult, Subject, TestLine, QueryLine} from '@suitest/types';

/**
 * Replace variables in text
 * @param text - text to replace variables in
 * @param variables - array of configuration variables
 */
export const replaceVariables = (text: string, variables?: AppConfiguration['configVariables']): string =>
	variables ?
		text.replace(
			/<%([a-zA-Z0-9_]{1,20})%>/g,
			(wholeMatch, varName) =>
				variables.find(variable => variable.key === varName)?.value ?? wholeMatch,
		) :
		text;

const EMPTY_STRING = '[EMPTY STRING]';

/**
 * Replace variables for human-readable output while making empty values explicit.
 * Keep replaceVariables unchanged so callers can still use the actual resolved value.
 */
const replaceVariablesForDisplay = (text: string, variables?: AppConfiguration['configVariables']): string =>
	replaceVariables(
		text,
		variables?.map(({key, value}) => ({
			key,
			value: value === '' ? EMPTY_STRING : value,
		})),
	);

/**
 * Replace variables and format the output to display both replaced and not replaced strings
 */
export const formatVariables = (text: string, variables?: AppConfiguration['configVariables']): JSX.Element => {
	const resultText = replaceVariables(text, variables);

	if (resultText !== text) {
		// There was some replacing done
		return <fragment><input>{resultText === '' ? EMPTY_STRING : resultText}</input> (<code>{text}</code>)</fragment>;
	}

	return <input>{text}</input>;
};

/**
 * Format a resolved configuration variable with its unit while keeping the original expression visible.
 * Return undefined when no replacement occurred.
 */
export const formatVariableWithUnit = (
	expression: string,
	unit: string,
	variables?: AppConfiguration['configVariables'],
): JSX.Element | undefined => {
	const resolvedValue = replaceVariables(expression, variables);

	if (resolvedValue === expression) {
		return undefined;
	}

	return <fragment>
		<input>{resolvedValue === '' ? EMPTY_STRING : `${resolvedValue}${unit}`}</input> (<code>{expression}</code>)
	</fragment>;
};

/**
 * Replace variable and output timeout value as unist node
 */
export const formatTimeout = (timeout: number | string, variables?: AppConfiguration['configVariables']): JSX.Element => {
	// Replace variables (if any) in timeout
	const t = typeof timeout === 'string' ? replaceVariables(timeout, variables) : String(timeout);
	const displayedTimeout = typeof timeout === 'string' ? replaceVariablesForDisplay(timeout, variables) : t;

	// Handle a fully empty resolved value before numeric conversion because Number('') evaluates to 0.
	if (t === '' && displayedTimeout !== t) {
		return <fragment><input>{displayedTimeout}</input> (<code>{String(timeout)}</code>)</fragment>;
	}

	// Get final value in ms as a number
	const ms = +t;

	if (isNaN(ms)) {
		// Wrong variable or other invalid value
		// Just display it as is
		return <input>{String(timeout)}</input>;
	}

	// Value to display to user, as string, in seconds
	const s = String(ms / 1000) + 's';

	if (String(timeout) !== t) {
		// Variable is used
		return <fragment><input>{s}</input> (<code>{String(timeout)}</code>)</fragment>;
	}

	// Not a variable
	return <input>{s}</input>;
};

export const formatCount = (count: number | string, variables?: AppConfiguration['configVariables']): JSX.Element => {
	const countAsString = String(count);
	const countAsStringWithReplacedVars = typeof count === 'string' ? replaceVariables(count, variables) : countAsString;
	const displayedCount = typeof count === 'string'
		? replaceVariablesForDisplay(count, variables)
		: countAsStringWithReplacedVars;

	// Handle a fully empty resolved value before numeric conversion because +'' evaluates to 0.
	if (countAsStringWithReplacedVars === '' && displayedCount !== countAsStringWithReplacedVars) {
		return <fragment><input>{displayedCount}</input> (<code>{countAsString}</code>)</fragment>;
	}

	// Get final count as a number
	const countAsNumberWithReplacedVars = +countAsStringWithReplacedVars;

	if (isNaN(countAsNumberWithReplacedVars)) {
		// Wrong variable or other invalid value
		// Just display it as is
		return <input>{countAsString}</input>;
	}

	if (countAsString !== countAsStringWithReplacedVars) {
		// Variable is used
		return <fragment><input>{countAsStringWithReplacedVars}</input>x (<code>{countAsString}</code>)</fragment>;
	}

	// Not a variable
	return <fragment><input>{countAsString}</input>x</fragment>;
};

export const deviceOrientationsMap = {
	'portrait': 'Portrait',
	'portraitReversed': 'Portrait (upside down/reversed)',
	'landscapeReversed': 'Landscape (right/reversed)',
	'landscape': 'Landscape (left)',
};

export const translateCodeProp = (
	name: Node,
	code: string,
	appConfig?: AppConfiguration,
	comparator?: string,
	status?: SingleEntryStatus,
): JSX.Element[] => {
	const codeWithVars = replaceVariables(code, appConfig?.configVariables);

	const out = [
		<prop
			name={name}
			expectedValue={<code-block>{codeWithVars}</code-block>}
			comparator={comparator}
			status={status}
		/>,
	];

	if (code !== codeWithVars) {
		out.push(<prop
			name={<text>(with variables)</text>}
			expectedValue={<code-block>{code}</code-block>}
			status={status}
		/>);
	}

	return out;
};

export const shouldElMatchDetailsBeHidden = (result?: TestLineResult): boolean =>
	['invalidRepositoryReference', 'queryFailed'].includes(result?.errorType ?? '')
	&& ['notExistingPlatform', 'notExistingElement', 'missingSubject']
			.includes((result as InvalidRepositoryReferenceError)?.message?.code ?? '');

export const mapStatus = (status?: TestLineResultStatus, inverse?: boolean): SingleEntryStatus | undefined => {
	switch (status) {
		case 'success':
			return inverse ? 'fail' : 'success';
		case 'warning':
			return 'success';
		case 'fail':
		case 'fatal':
			return inverse ? 'success' : 'fail';
		case 'exit':
			return inverse ? 'success' : undefined;
		case 'excluded':
		default:
			return undefined;
	}
};

const lineTypeDocsMap: {[key in Exclude<TestLine['type'], 'assert' | 'wait'>]: string | null} = {
	clearAppData: '/testing/test-operations/clear-app-data-operation/',
	takeScreenshot: '/suitest-api/commands/#takescreenshot',
	lastScreenshot: '/suitest-api/commands/#getLastVTScreenshot',
	execCmd: '/testing/test-operations/execute-command-operation/',
	openApp: '/testing/test-operations/open-app-operation/',
	openUrl: '/testing/test-operations/open-url-operation/',
	openDeepLink: '/testing/test-operations/open-deep-link-operation/',
	sleep: '/testing/test-operations/sleep-operation/',
	pollUrl: '/testing/test-operations/poll-url-operation/',
	button: '/testing/test-operations/press-button-operation/',
	runSnippet: '/testing/test-operations/run-test-operation/',
	sendText: '/testing/test-operations/send-text-operation/',
	setText: '/testing/test-operations/set-text-operation/',
	browserCommand: '/testing/test-operations/browser-command-operation/',
	click: '/testing/test-operations/click-on-operation/',
	moveTo: '/testing/test-operations/move-to-operation/',
	deviceSettings: '/testing/test-operations/set-screen-orientation-operation/',
	tap: '/testing/test-operations/tap-operation/',
	scroll: '/testing/test-operations/scroll-operation/',
	swipe: '/testing/test-operations/swipe-flick-operation/',
	closeApp: '/testing/test-operations/close-app-operation/',
	suspendApp: '/testing/test-operations/suspend-app-operation/',
	comment: null,
};
const subjTypeDocsMap: {
	[key in Subject['type'] | 'elementProps' | 'execute' | 'elementCssProps' | 'elementHandle' | 'elementAttributes']: string
} = {
	application: '/testing/test-subjects/application-subject/',
	cookie: '/testing/test-subjects/cookie-subject/',
	element: '/testing/test-subjects/view-element-subject/',
	elementProps: '/testing/test-subjects/view-element-subject/',
	javascript: '/testing/test-subjects/javascript-expression-subject/',
	execute: '/testing/test-subjects/javascript-expression-subject/',
	location: '/testing/test-subjects/current-location-subject/',
	network: '/testing/test-subjects/network-request-subject/',
	psVideo: '/testing/test-subjects/video-subject/#playstation-4-webmaf-video',
	video: '/testing/test-subjects/video-subject/',
	// FIXME: specify proper url to the docs section
	elementCssProps: '/',
	// FIXME: specify proper url to the docs section
	elementHandle: '/',
	// FIXME: specify proper url to the docs section
	elementAttributes: '/',
	// FIXME: specify proper url to the docs section
	ocr: '/',
	// FIXME: specify proper url to the docs section
	image: '/',
};

export const getDocsLink = (line: TestLine | QueryLine): string | undefined => {
	let link: string | null;

	if ('query' === line.type) {
		link = subjTypeDocsMap[line.subject.type];
	} else if ('wait' === line.type || 'assert' === line.type) {
		link = subjTypeDocsMap[line.condition.subject.type];
	} else {
		link = lineTypeDocsMap[line.type];
	}

	return link ? `https://suite.st/docs${link}` : undefined;
};
