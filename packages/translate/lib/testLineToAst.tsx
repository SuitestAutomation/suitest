/// <reference path="../types/intrinsicElements.d.ts" />
/// <reference path="../types/unistTestLine.d.ts" />
import {jsx} from './jsxFactory';
import {
	AppConfiguration,
	AssertTestLine, AssertThen, BrowserCommandTestLine, ClickTestLine, CommentTestLine,
	Elements,
	ExecuteCommandTestLine, MoveToTestLine,
	OpenAppTestLine,
	OpenUrlTestLine,
	PollUrlTestLine, PressButtonTestLine, RunTestTestLine, SendTextTestLine, SetTextTestLine,
	SleepTestLine, Snippets, Target,
	TestLine, WaitUntilTestLine,
} from '@suitest/types';
import {translateCondition} from './conditions';
import {formatVariables, replaceVariables, formatTimeout, formatCount} from './utils';
import {TestLineResult} from '@suitest/types/lib';
import {translateTestLineResult} from './testLineResults';

const renderConditionCountDelay = (
	count: number | string,
	delay: number | string,
	vars: AppConfiguration['configVariables']
): Node => <dictionary label="Condition settings">
	<row>
		<cell>Repeat</cell>
		<cell>{formatCount(count, vars)}</cell>
	</row>
	<row>
		<cell>Every</cell>
		<cell>{formatTimeout(delay, vars)}</cell>
	</row>
</dictionary>;


const getConditionInfo = (
	testLine: TestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): [Node | undefined, Node | undefined] => {
	// Deconstruct with type casting to PressButtonTestLine, as it's the most complete line type
	// and has all types of conditions and loops
	const {condition, count, negateCondition, delay} = (testLine as PressButtonTestLine);

	// Do something ... exactly ... every ...
	if (!condition && count && (typeof count === 'string' || count > 1)) {
		return [
			<fragment> exactly {formatCount(count ?? 1, appConfig.configVariables)}</fragment>,
			<fragment>
				{renderConditionCountDelay(count ?? 1, delay ?? 0, appConfig.configVariables)}
				{getAlertNode(lineResult)}
			</fragment>,
		];
	}

	// Do something ... only if ...
	if (condition && negateCondition) {
		return [
			<text> only if condition is met</text>,
			translateCondition(condition, appConfig, elements, lineResult),
		];
	}

	// Do something ... until ...
	if (condition && !negateCondition) {
		return [
			<text> until condition is met</text>,
			<fragment>
				{renderConditionCountDelay(count ?? 1, delay ?? 0, appConfig.configVariables)}
				{translateCondition(condition, appConfig, elements, lineResult)}
			</fragment>,
		];
	}

	// Do something ...
	return [undefined, undefined];
};

/* istanbul ignore next */
const assertAssertThen = (then: never): never => {
	throw new Error(`Unknown "then" in assert: ${then}`);
};

const translateAssertThen = (then: AssertThen): string => {
	switch (then) {
		/* istanbul ignore next - disabling because we choose not to render "continue" in results */
		case 'success': return 'continue';
		case 'exit': return 'stop test';
		case 'fail': return 'fail';
		case 'warning': return 'warn';
		default:
			/* istanbul ignore next */
			return assertAssertThen(then);
	}
};

const getAlertNode = (lineResult?: TestLineResult): AlertNode | undefined =>
	lineResult && lineResult.result !== 'success' ?
		<alert level={lineResult.result}>{translateTestLineResult(lineResult)}</alert> as AlertNode :
		undefined;

const translateAssertTestLine = (
	testLine: AssertTestLine | WaitUntilTestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const condition = translateCondition(testLine.condition, appConfig, elements, lineResult);

	return <test-line title={<fragment>Assert: {condition.title}</fragment>}>
		{testLine.then !== 'success' || testLine.timeout
			? <dictionary>
				{testLine.then === 'success'
					? undefined
					: <row>
						<cell>When passed</cell>
						<cell>{translateAssertThen(testLine.then)}</cell>
					</row>
				}
				{testLine.timeout
					? <row>
						<cell>Timeout</cell>
						<cell>{formatTimeout(testLine.timeout, appConfig.configVariables)}</cell>
					</row>
					: undefined
				}
			</dictionary>
			: undefined
		}
		{condition.children}
	</test-line> as TestLineNode;
};

const translateClearAppDataTestLine = (lineResult?: TestLineResult): TestLineNode =>
	<test-line title="Clear application data">{getAlertNode(lineResult)}</test-line> as TestLineNode;

const translateExecuteCommandTestLine = (
	testLine: ExecuteCommandTestLine,
	appConfig: AppConfiguration,
	lineResult?: TestLineResult,
): TestLineNode => {
	const code = replaceVariables(testLine.val, appConfig.configVariables);

	return <test-line title="Execute JavaScript expression">
		<code-block label="JavaScript expression">{code}</code-block>
		{code !== testLine.val
			? <code-block label="With variables">{testLine.val}</code-block>
			: undefined
		}
		{getAlertNode(lineResult)}
	</test-line> as TestLineNode;
};

const translateOpenApp = (
	testLine: OpenAppTestLine, appConfig: AppConfiguration, lineResult?: TestLineResult
): TestLineNode => {
	if (!testLine.relativeUrl) {
		// Open app with default path
		return <test-line title="Open application">{getAlertNode(lineResult)}</test-line> as TestLineNode;
	}

	const relativeUrl = formatVariables(testLine.relativeUrl, appConfig.configVariables);

	return <test-line title="Open application at relative URL">
		<dictionary>
			<row>
				<cell>Relative path</cell>
				<cell>{relativeUrl}</cell>
			</row>
		</dictionary>
		{getAlertNode(lineResult)}
	</test-line> as TestLineNode;
};

const translateOpenUrl = (
	testLine: OpenUrlTestLine, appConfig: AppConfiguration, lineResult?: TestLineResult
): TestLineNode => {
	const url = formatVariables(testLine.url, appConfig.configVariables);

	return <test-line title="Open URL">
		<dictionary>
			<row>
				<cell>Exact URL</cell>
				<cell>{url}</cell>
			</row>
		</dictionary>
		{getAlertNode(lineResult)}
	</test-line> as TestLineNode;
};

const translateSleepTestLine = (
	testLine: SleepTestLine, appConfig: AppConfiguration, lineResult?: TestLineResult,
): TestLineNode => {
	const title = <fragment>Sleep {formatTimeout(testLine.timeout, appConfig.configVariables)}</fragment>;

	return <test-line title={title}>{getAlertNode(lineResult)}</test-line> as TestLineNode;
};

const translatePollUrlTestLine = (
	testLine: PollUrlTestLine, appConfig: AppConfiguration, lineResult?: TestLineResult,
): TestLineNode => {
	const response = formatVariables(testLine.response, appConfig.configVariables);
	const url = formatVariables(testLine.url, appConfig.configVariables);

	return <test-line title="Poll URL every 0.5s">
		<dictionary>
			<row>
				<cell>Poll URL</cell>
				<cell>{url}</cell>
			</row>
			<row>
				<cell>Until receive</cell>
				<cell>{response}</cell>
			</row>
		</dictionary>
		{getAlertNode(lineResult)}
	</test-line> as TestLineNode;
};

const translatePressButtonTestLine = (
	testLine: PressButtonTestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const ids = testLine.ids
		.map((id, i) => <fragment>
			<bold>{id}</bold>{i !== testLine.ids.length - 1 ? ', ' : ''}
		</fragment>);
	const [titleFragment, condition] = getConditionInfo(testLine, appConfig, elements, lineResult);

	return <test-line title={<fragment>Press button {ids}{titleFragment}</fragment>}>
		{condition}
	</test-line> as TestLineNode;
};

const translateTestName = (testId: string, snippets?: Snippets): Node | Node[] => {
	if (snippets && snippets[testId]) {
		return <bold>{snippets[testId].name}</bold>;
	}

	return <fragment>(<code>{testId.slice(0, 4) + '...' + testId.slice(-4)}</code>)</fragment>;
};

// TODO BE will add snippets to the feed, otherwise we have to do extra requests to get snippet names
const translateRunTestTestLine = (
	testLine: RunTestTestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	snippets?: Snippets,
	lineResult?: TestLineResult,
): TestLineNode => {
	const testName = translateTestName(testLine.val, snippets);
	const [titleFragment, condition] = getConditionInfo(testLine, appConfig, elements, lineResult);

	return <test-line title={<fragment>Run test {testName}{titleFragment}</fragment>}>
		{condition}
	</test-line> as TestLineNode;
};

/* istanbul ignore next */
const assertUnknownTarget = (target: never): never => {
	throw new Error('Unknown target: ' + JSON.stringify(target));
};

const translateTarget = (target: Target): Node | Node[] => {
	switch (target.type) {
		case 'element': // TODO nyc for some reason reports an uncovered branch here
			return <bold>element</bold>;
		case 'window':
			// TODO should we translate 'window' depending on running platform?
			return <bold>{'coordinates' in target ? 'position' : 'window'}</bold>;
		default:
			/* istanbul ignore next */
			return assertUnknownTarget(target);
	}
};

// TODO what if text is too long?
const translateSendTextTestLine = (
	testLine: SendTextTestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const text = formatVariables(testLine.val, appConfig.configVariables);
	const [titleFragment, condition] = getConditionInfo(testLine, appConfig, elements, lineResult);
	const title = <fragment>Send text {text} to {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title}>{condition}</test-line> as TestLineNode;
};

const translateSetTextTestLine = (
	testLine: SetTextTestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const text = formatVariables(testLine.val, appConfig.configVariables);
	const [titleFragment, condition] = getConditionInfo(testLine, appConfig, elements, lineResult);
	const title = <fragment>Set text {text} to {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title}>{condition}</test-line> as TestLineNode;
};

/* istanbul ignore next */
const assertUnknownBrowserCommand = (browserCommand: never): never => {
	throw new Error(`Unknown browser command: ${JSON.stringify(browserCommand)}`);
};

const translateBrowserCommandTestLine = (
	testLine: BrowserCommandTestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const condition = testLine.condition ?
		translateCondition(testLine.condition, appConfig, elements, lineResult) :
		getAlertNode(lineResult);

	switch (testLine.browserCommand.type) {
		case 'goBack':  // TODO nyc for some reason reports an uncovered branch here
			return <test-line title="Go back">{condition}</test-line> as TestLineNode;
		case 'goForward':
			return <test-line title="Go forward">{condition}</test-line> as TestLineNode;
		case 'refresh':
			return <test-line title="Refresh">{condition}</test-line> as TestLineNode;
		case 'setWindowSize':
			return <test-line title="Resize window">
				<dictionary>
					<row>
						<cell>Size</cell>
						<cell><text>{ // TODO - variables in width / height
							String(testLine.browserCommand.params.width)}x{String(testLine.browserCommand.params.height)
						}</text></cell>
					</row>
				</dictionary>
				{condition}
			</test-line> as TestLineNode;
		case 'dismissAlertMessage':
			return <test-line title="Dismiss modal dialog">{condition}</test-line> as TestLineNode;
		case 'acceptAlertMessage':
			return <test-line title="Accept modal dialog">{condition}</test-line> as TestLineNode;
		case 'acceptPromptMessage':
			// TODO variables
			return <test-line title="Accept modal dialog with message">
				<dictionary>
					<row>
						<cell>Message</cell>
						<cell>{testLine.browserCommand.params.text}</cell>
					</row>
				</dictionary>
				{condition}
			</test-line> as TestLineNode;
		default:
			/* istanbul ignore next */
			return assertUnknownBrowserCommand(testLine.browserCommand);
	}
};

const translateClickTestLine = (
	testLine: ClickTestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const [titleFragment, condition] = getConditionInfo(testLine, appConfig, elements, lineResult);
	const title = <fragment>Click on {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title}>{condition}</test-line> as TestLineNode;
};

const translateMoveToTestLine = (
	testLine: MoveToTestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const [titleFragment, condition] = getConditionInfo(testLine, appConfig, elements, lineResult);
	const title = <fragment>Move pointer to {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title}>{condition}</test-line> as TestLineNode;
};

const translateCommentTestLine = (testLine: CommentTestLine): TestLineNode =>
	<test-line title={testLine.val} /> as TestLineNode;

/* istanbul ignore next */
const assertUnknownLineType = (testLine: never): never => {
	throw new Error(`Unknown line type: ${JSON.stringify(testLine)}`);
};

export const testLineToAst = ({
	testLine, appConfig, elements, snippets, lineResult,
}: {
	testLine: TestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	snippets?: Snippets,
	lineResult?: TestLineResult,
}): TestLineNode => {
	switch (testLine.type) {
		case 'assert':  // TODO nyc for some reason reports an uncovered branch here
		case 'wait':
			return translateAssertTestLine(testLine, appConfig, elements, lineResult);
		case 'clearAppData':
			return translateClearAppDataTestLine(lineResult);
		case 'execCmd':
			return translateExecuteCommandTestLine(testLine, appConfig, lineResult);
		case 'openApp':
			return translateOpenApp(testLine, appConfig, lineResult);
		case 'openUrl':
			return translateOpenUrl(testLine, appConfig, lineResult);
		case 'sleep':
			return translateSleepTestLine(testLine, appConfig, lineResult);
		case 'pollUrl':
			return translatePollUrlTestLine(testLine, appConfig, lineResult);
		case 'press':
			return translatePressButtonTestLine(testLine, appConfig, elements, lineResult);
		case 'runSnippet':
			return translateRunTestTestLine(testLine, appConfig, elements, snippets, lineResult);
		case 'sendText':
			return translateSendTextTestLine(testLine, appConfig, elements, lineResult);
		case 'setText':
			return translateSetTextTestLine(testLine, appConfig, elements, lineResult);
		case 'browserCommand':
			return translateBrowserCommandTestLine(testLine, appConfig, elements, lineResult);
		case 'click':
			return translateClickTestLine(testLine, appConfig, elements, lineResult);
		case 'moveTo':
			return translateMoveToTestLine(testLine, appConfig, elements, lineResult);
		case 'comment':
			return translateCommentTestLine(testLine);
		default:
			/* istanbul ignore next */
			return assertUnknownLineType(testLine);
	}
};
