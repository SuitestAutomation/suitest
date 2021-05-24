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
				variables.find(variable => variable.key === varName)?.value ?? wholeMatch
		) :
		text;

/**
 * Replace variables and format the output to display both replaced and not replaced strings
 */
export const formatVariables = (text: string, variables?: AppConfiguration['configVariables']): JSX.Element => {
	const resultText = replaceVariables(text, variables);

	if (resultText !== text) {
		// There was some replacing done
		return <fragment><input>{resultText}</input> (<code>{text}</code>)</fragment>;
	}

	return <input>{text}</input>;
};

/**
 * Replace variable and output timeout value as unist node
 */
export const formatTimeout = (timeout: number | string, variables?: AppConfiguration['configVariables']): JSX.Element => {
	// Replace variables (if any) in timeout
	const t = typeof timeout === 'string' ? replaceVariables(timeout, variables) : String(timeout);
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
	// Get final value in ms as a number
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
	'landscapeRight': 'Landscape (right/reversed)',
	'landscapeLeft': 'Landscape (left)',
	'portraitUpsideDown': 'Portrait (upside down/reversed)',
};

export const translateCodeProp = (
	name: Node,
	code: string,
	appConfig?: AppConfiguration,
	comparator?: string,
	status?: SingleEntryStatus
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
	execCmd: '/testing/test-operations/execute-command-operation/',
	openApp: '/testing/test-operations/open-app-operation/',
	openUrl: '/testing/test-operations/open-url-operation/',
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
	comment: null,
};
const subjTypeDocsMap: {[key in Subject['type'] | 'elementProps' | 'execute']: string} = {
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
