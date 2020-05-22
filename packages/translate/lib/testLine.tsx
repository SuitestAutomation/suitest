import {jsx} from '@suitest/smst';
import {TestLineNode} from '@suitest/smst/types/unistTestLine';
import {
	AppConfiguration,
	AssertTestLine,
	AssertThen,
	BrowserCommandTestLine,
	ClickTestLine,
	CommentTestLine,
	Elements,
	ExecuteCommandTestLine,
	MoveToTestLine,
	OpenAppTestLine,
	OpenUrlTestLine,
	PollUrlTestLine,
	PressButtonTestLine,
	RunTestTestLine,
	SendTextTestLine,
	SetTextTestLine,
	SleepTestLine,
	Snippets,
	Target,
	TestLine,
	WaitUntilTestLine,
	TestLineResult,
} from '@suitest/types';
import {translateComparator} from './comparator';
import {translateCondition} from './condition';
import {
	formatTimeout,
	formatVariables,
	mapStatus,
	translateCodeProp,
	formatCount,
} from './utils';

const getConditionInfo = (
	testLine: TestLine,
	appConfig: AppConfiguration,
): Node | undefined => {
	// Deconstruct with type casting to PressButtonTestLine, as it's the most complete line type
	// and has all types of conditions and loops
	const {condition, count, negateCondition, delay} = (testLine as PressButtonTestLine);

	// Do something ... exactly ... every ...
	if (!condition && count && (typeof count === 'string' || count > 1)) {
		return <fragment> exactly {
			formatCount(count, appConfig.configVariables)
		} every {formatTimeout(delay ?? 0, appConfig.configVariables)}</fragment> as Node;
	}

	// Do something ... only if ...
	if (condition && negateCondition) {
		return <text> only if condition is met</text>;
	}

	// Do something ... until ...
	if (condition && !negateCondition) {
		return <fragment> until condition is met max {
			formatCount(count ?? 1, appConfig.configVariables)
		} every {formatTimeout(delay ?? 0, appConfig.configVariables)}</fragment>;
	}

	// Do something ...
	return undefined;
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

const translateAssertTestLine = (
	testLine: AssertTestLine | WaitUntilTestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const condition = translateCondition(testLine.condition, appConfig, elements, lineResult);

	return <test-line
		title={<fragment>Assert: {condition.title}{testLine.timeout ? <fragment> timeout {formatTimeout(testLine.timeout, appConfig.configVariables)}</fragment> : undefined} {testLine.then !== 'success' ? <fragment> then {translateAssertThen(testLine.then)}</fragment> : undefined}</fragment>}
		status={lineResult?.result}
	>
		{condition.children}
	</test-line> as TestLineNode;
};

const translateClearAppDataTestLine = (lineResult?: TestLineResult): TestLineNode =>
	<test-line
		title={<text>Clear application data</text>}
		status={lineResult?.result}
	/> as TestLineNode;

const translateExecuteCommandTestLine = (
	testLine: ExecuteCommandTestLine,
	appConfig: AppConfiguration,
	lineResult?: TestLineResult,
): TestLineNode =>
	<test-line
		title={<text>Execute JavaScript expression</text>}
		status={lineResult?.result}
	>
		<props>
			{translateCodeProp(
				<text>JavaScript expression</text>,
				testLine.val,
				appConfig,
				'',
				mapStatus(lineResult?.result)
			)}
		</props>
	</test-line> as TestLineNode;

const translateOpenApp = (
	testLine: OpenAppTestLine, appConfig: AppConfiguration, lineResult?: TestLineResult
): TestLineNode => {
	if (!testLine.relativeUrl) {
		// Open app with default path
		return <test-line
			title={<text>Open application</text>}
			status={lineResult?.result}
		/> as TestLineNode;
	}

	const relativeUrl = formatVariables(testLine.relativeUrl, appConfig.configVariables);

	return <test-line
		title={<text>Open application at relative URL</text>}
		status={lineResult?.result}
	>
		<props>
			<prop
				name={<text>relative path</text>}
				comparator={translateComparator('=')}
				expectedValue={relativeUrl}
			/>
		</props>
	</test-line> as TestLineNode;
};

const translateOpenUrl = (
	testLine: OpenUrlTestLine, appConfig: AppConfiguration, lineResult?: TestLineResult
): TestLineNode => {
	const url = formatVariables(testLine.url, appConfig.configVariables);

	return <test-line title={<text>Open URL</text>} status={lineResult?.result}>
		<props>
			<prop
				name={<text>URL</text>}
				comparator={translateComparator('=')}
				expectedValue={url}
			/>
		</props>
	</test-line> as TestLineNode;
};

const translateSleepTestLine = (
	testLine: SleepTestLine, appConfig: AppConfiguration, lineResult?: TestLineResult,
): TestLineNode => {
	const title = <fragment>Sleep {formatTimeout(testLine.timeout, appConfig.configVariables)}</fragment>;

	return <test-line title={title} status={lineResult?.result} /> as TestLineNode;
};

const translatePollUrlTestLine = (
	testLine: PollUrlTestLine, appConfig: AppConfiguration, lineResult?: TestLineResult,
): TestLineNode => {
	const response = formatVariables(testLine.response, appConfig.configVariables);
	const url = formatVariables(testLine.url, appConfig.configVariables);

	return <test-line title={<text>Poll URL every 0.5s</text>} status={lineResult?.result}>
		<props>
			<prop
				name={<text>poll URL</text>}
				comparator={translateComparator('=')}
				expectedValue={url}
				status={mapStatus(lineResult?.result)}
			/>
			<prop
				name={<text>until receive</text>}
				comparator={translateComparator('=')}
				expectedValue={response}
				status={mapStatus(lineResult?.result)}
			/>
		</props>
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
			<input>{id}</input>{i !== testLine.ids.length - 1 ? ', ' : ''}
		</fragment>);
	const titleFragment = getConditionInfo(testLine, appConfig);

	return <test-line
		title={<fragment>Press button {ids}{titleFragment}</fragment>}
		status={lineResult?.result}
	>
		{testLine.condition ? translateCondition(testLine.condition, appConfig, elements, lineResult) : undefined}
	</test-line> as TestLineNode;
};

const translateTestName = (testId: string, snippets?: Snippets): JSX.Element => {
	if (snippets && snippets[testId]) {
		return <subject>{snippets[testId].name}</subject>;
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
	const titleFragment = getConditionInfo(testLine, appConfig);

	return <test-line
		title={<fragment>Run test {testName}{titleFragment}</fragment>}
		status={lineResult?.result}
	>
		{testLine.condition ? translateCondition(testLine.condition, appConfig, elements, lineResult) : undefined}
	</test-line> as TestLineNode;
};

/* istanbul ignore next */
const assertUnknownTarget = (target: never): never => {
	throw new Error('Unknown target: ' + JSON.stringify(target));
};

const translateTarget = (target: Target): JSX.Element => {
	switch (target.type) {
		case 'element': // TODO nyc for some reason reports an uncovered branch here
			return <subject>element</subject>;
		case 'window':
			// TODO should we translate 'window' depending on running platform?
			return <subject>{'coordinates' in target ? 'position' : 'window'}</subject>;
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
	const titleFragment = getConditionInfo(testLine, appConfig);
	const title = <fragment>Send text {text} to {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title} status={lineResult?.result}>
		{testLine.condition ? translateCondition(testLine.condition, appConfig, elements, lineResult) : undefined}
	</test-line> as TestLineNode;
};

const translateSetTextTestLine = (
	testLine: SetTextTestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const text = formatVariables(testLine.val, appConfig.configVariables);
	const titleFragment = getConditionInfo(testLine, appConfig);
	const title = <fragment>Set text {text} to {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title} status={lineResult?.result}>
		{testLine.condition ? translateCondition(testLine.condition, appConfig, elements, lineResult) : undefined}
	</test-line> as TestLineNode;
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
	const condition = testLine.condition
		? translateCondition(testLine.condition, appConfig, elements, lineResult)
		: undefined;

	switch (testLine.browserCommand.type) {
		case 'goBack':
			return <test-line title={<text>Go back</text>} status={lineResult?.result}>
				{condition}
			</test-line> as TestLineNode;
		case 'goForward':
			return <test-line title={<text>Go forward</text>} status={lineResult?.result}>
				{condition}
			</test-line> as TestLineNode;
		case 'refresh':
			return <test-line title={<text>Refresh</text>} status={lineResult?.result}>
				{condition}
			</test-line> as TestLineNode;
		case 'setWindowSize':
			return <test-line title={<text>Resize window</text>} status={lineResult?.result}>
				<props>
					<prop
						name={<text>size</text>}
						comparator={translateComparator('=')}
						expectedValue={<text>{ // TODO - variables in width / height
							String(testLine.browserCommand.params.width)}x{String(testLine.browserCommand.params.height)
						}</text>}
					/>
				</props>
				{condition}
			</test-line> as TestLineNode;
		case 'dismissAlertMessage':
			return <test-line title={<text>Dismiss modal dialog</text>} status={lineResult?.result}>
				{condition}
			</test-line> as TestLineNode;
		case 'acceptAlertMessage':
			return <test-line title={<text>Accept modal dialog</text>} status={lineResult?.result}>
				{condition}
			</test-line> as TestLineNode;
		case 'acceptPromptMessage':
			// TODO variables
			return <test-line title={<text>Accept modal dialog with message</text>} status={lineResult?.result}>
				<props>
					<prop
						name={<text>message</text>}
						comparator={translateComparator('=')}
						expectedValue={<text>{testLine.browserCommand.params.text}</text>}
					/>
				</props>
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
	const titleFragment = getConditionInfo(testLine, appConfig);
	const title = <fragment>Click on {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title}>
		{testLine.condition ? translateCondition(testLine.condition, appConfig, elements, lineResult) : undefined}
	</test-line> as TestLineNode;
};

const translateMoveToTestLine = (
	testLine: MoveToTestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const titleFragment = getConditionInfo(testLine, appConfig);
	const title = <fragment>Move pointer to {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title} status={lineResult?.result}>
		{testLine.condition ? translateCondition(testLine.condition, appConfig, elements, lineResult) : undefined}
	</test-line> as TestLineNode;
};

const translateCommentTestLine = (testLine: CommentTestLine): TestLineNode =>
	<test-line title={<text>{testLine.val}</text>} /> as TestLineNode;

/* istanbul ignore next */
const assertUnknownLineType = (testLine: never): never => {
	throw new Error(`Unknown line type: ${JSON.stringify(testLine)}`);
};

export const translateTestLine = ({
	testLine, appConfig, elements, snippets, lineResult,
}: {
	testLine: TestLine,
	appConfig: AppConfiguration,
	elements?: Elements,
	snippets?: Snippets,
	lineResult?: TestLineResult,
}): TestLineNode => {
	switch (testLine.type) {
		case 'assert':
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
		case 'button':
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
