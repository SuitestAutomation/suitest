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

export type TranslatedTestLine = {
	title: string,
	details: string[][],
};

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
	elements?: Elements
): [Node | undefined, Node | undefined] => {
	// Deconstruct with type casting to PressButtonTestLine, as it's the most complete line type
	// and has all types of conditions and loops
	const {condition, count, negateCondition, delay} = (testLine as PressButtonTestLine);

	// Do something ... exactly ... every ...
	if (!condition && count && (typeof count === 'string' || count > 1)) {
		return [
			<fragment> exactly {formatCount(count ?? 1, appConfig.configVariables)}</fragment>,
			renderConditionCountDelay(count ?? 1, delay ?? 0, appConfig.configVariables),
		];
	}

	// Do something ... only if ...
	if (condition && negateCondition) {
		return [
			<text> only if condition is met</text>,
			translateCondition(condition, appConfig, elements),
		];
	}

	// Do something ... until ...
	if (condition && !negateCondition) {
		return [
			<text> until condition is met</text>,
			<fragment>
				{renderConditionCountDelay(count ?? 1, delay ?? 0, appConfig.configVariables)}
				{translateCondition(condition, appConfig, elements)}
			</fragment>,
		];
	}

	// Do something ...
	return [undefined, undefined];
};

const assertAssertThen = (then: never): never => {
	throw new Error(`Unknown "then" in assert: ${then}`);
};

const translateAssertThen = (then: AssertThen): string => {
	switch (then) {
		case 'success': return 'continue';
		case 'exit': return 'stop test';
		case 'fail': return 'fail';
		case 'warning': return 'warn';
		default:
			return assertAssertThen(then);
	}
};

const translateAssertTestLine = (
	testLine: AssertTestLine | WaitUntilTestLine,
	appConfig: AppConfiguration,
	elements?: Elements
): TestLineNode => {
	const condition = translateCondition(testLine.condition, appConfig, elements);

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

const translateClearAppDataTestLine = (): TestLineNode =>
	<test-line title="Clear application data" /> as TestLineNode;

const translateExecuteCommandTestLine = (
	testLine: ExecuteCommandTestLine,
	appConfig: AppConfiguration
): TestLineNode => {
	const code = replaceVariables(testLine.val, appConfig.configVariables);

	return <test-line title="Execute JavaScript expression">
		<code-block label="JavaScript expression">{code}</code-block>
		{code !== testLine.val
			? <code-block label="With variables">{testLine.val}</code-block>
			: undefined
		}
	</test-line> as TestLineNode;
};

const translateOpenApp = (testLine: OpenAppTestLine, appConfig: AppConfiguration): TestLineNode => {
	if (!testLine.relativeUrl) {
		// Open app with default path
		return <test-line title="Open application" /> as TestLineNode;
	}

	const relativeUrl = formatVariables(testLine.relativeUrl, appConfig.configVariables);

	return <test-line title="Open application at relative URL">
		<dictionary>
			<row>
				<cell>Relative path</cell>
				<cell>{relativeUrl}</cell>
			</row>
		</dictionary>
	</test-line> as TestLineNode;
};

const translateOpenUrl = (testLine: OpenUrlTestLine, appConfig: AppConfiguration): TestLineNode => {
	const url = formatVariables(testLine.url, appConfig.configVariables);

	return <test-line title="Open URL">
		<dictionary>
			<row>
				<cell>Exact URL</cell>
				<cell>{url}</cell>
			</row>
		</dictionary>
	</test-line> as TestLineNode;
};

const translateSleepTestLine = (testLine: SleepTestLine, appConfig: AppConfiguration): TestLineNode => {
	const title = <fragment>Sleep {formatTimeout(testLine.timeout, appConfig.configVariables)}</fragment>;

	return <test-line title={title} /> as TestLineNode;
};

const translatePollUrlTestLine = (testLine: PollUrlTestLine, appConfig: AppConfiguration): TestLineNode => {
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
	</test-line> as TestLineNode;
};

const translatePressButtonTestLine = (
	testLine: PressButtonTestLine,
	appConfig: AppConfiguration,
	elements?: Elements
): TestLineNode => {
	const ids = testLine.ids
		.map((id, i) => <fragment>
			<bold>{id}</bold>{i !== testLine.ids.length - 1 ? ', ' : ''}
		</fragment>);
	const [titleFragment, condition] = getConditionInfo(testLine, appConfig, elements);

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
	snippets?: Snippets
): TestLineNode => {
	const testName = translateTestName(testLine.val, snippets);
	const [titleFragment, condition] = getConditionInfo(testLine, appConfig, elements);

	return <test-line title={<fragment>Run test {testName}{titleFragment}</fragment>}>
		{condition}
	</test-line> as TestLineNode;
};

const assertUnknownTarget = (target: never): never => {
	throw new Error('Unknown target: ' + JSON.stringify(target));
};

const translateTarget = (target: Target): Node | Node[] => {
	switch (target.type) {
		case 'element':
			return <bold>element</bold>;
		case 'window':
			return <bold>{'coordinates' in target ? 'position' : 'window'}</bold>;
		default:
			return assertUnknownTarget(target);
	}
};

// TODO what if text is too long?
const translateSendTextTestLine = (
	testLine: SendTextTestLine,
	appConfig: AppConfiguration,
	elements?: Elements
): TestLineNode => {
	const text = formatVariables(testLine.val, appConfig.configVariables);
	const [titleFragment, condition] = getConditionInfo(testLine, appConfig, elements);
	const title = <fragment>Send text {text} to {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title}>{condition}</test-line> as TestLineNode;
};

const translateSetTextTestLine = (
	testLine: SetTextTestLine,
	appConfig: AppConfiguration,
	elements?: Elements
): TestLineNode => {
	const text = formatVariables(testLine.val, appConfig.configVariables);
	const [titleFragment, condition] = getConditionInfo(testLine, appConfig, elements);
	const title = <fragment>Set text {text} to {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title}>{condition}</test-line> as TestLineNode;
};

const assertUnknownBrowserCommand = (browserCommand: never): never => {
	throw new Error(`Unknown browser command: ${JSON.stringify(browserCommand)}`);
};

const translateBrowserCommandTestLine = (
	testLine: BrowserCommandTestLine,
	appConfig: AppConfiguration,
	elements?: Elements
): TestLineNode => {
	const condition = testLine.condition ? translateCondition(testLine.condition, appConfig, elements) : undefined;

	switch (testLine.browserCommand.type) {
		case 'goBack':
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
			return assertUnknownBrowserCommand(testLine.browserCommand);
	}
};

const translateClickTestLine = (
	testLine: ClickTestLine,
	appConfig: AppConfiguration,
	elements?: Elements
): TestLineNode => {
	const [titleFragment, condition] = getConditionInfo(testLine, appConfig, elements);
	const title = <fragment>Click on {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title}>{condition}</test-line> as TestLineNode;
};

const translateMoveToTestLine = (
	testLine: MoveToTestLine,
	appConfig: AppConfiguration,
	elements?: Elements
): TestLineNode => {
	const [titleFragment, condition] = getConditionInfo(testLine, appConfig, elements);
	const title = <fragment>Move pointer to {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title}>{condition}</test-line> as TestLineNode;
};

const translateCommentTestLine = (testLine: CommentTestLine): TestLineNode =>
	<test-line title={testLine.val} /> as TestLineNode;

const assertUnknownLineType = (testLine: never): never => {
	throw new Error(`Unknown line type: ${JSON.stringify(testLine)}`);
};

export const testLineToAst = (
	testLine: TestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	snippets?: Snippets
): TestLineNode => {
	switch (testLine.type) {
		case 'assert':
		case 'wait':
			return translateAssertTestLine(testLine, appConfig, elements);
		case 'clearAppData':
			return translateClearAppDataTestLine();
		case 'execCmd':
			return translateExecuteCommandTestLine(testLine, appConfig);
		case 'openApp':
			return translateOpenApp(testLine, appConfig);
		case 'openUrl':
			return translateOpenUrl(testLine, appConfig);
		case 'sleep':
			return translateSleepTestLine(testLine, appConfig);
		case 'pollUrl':
			return translatePollUrlTestLine(testLine, appConfig);
		case 'button':
			return translatePressButtonTestLine(testLine, appConfig, elements);
		case 'runSnippet':
			return translateRunTestTestLine(testLine, appConfig, elements, snippets);
		case 'sendText':
			return translateSendTextTestLine(testLine, appConfig, elements);
		case 'setText':
			return translateSetTextTestLine(testLine, appConfig, elements);
		case 'browserCommand':
			return translateBrowserCommandTestLine(testLine, appConfig, elements);
		case 'click':
			return translateClickTestLine(testLine, appConfig, elements);
		case 'moveTo':
			return translateMoveToTestLine(testLine, appConfig, elements);
		case 'comment':
			return translateCommentTestLine(testLine);
		default:
			return assertUnknownLineType(testLine);
	}
};
