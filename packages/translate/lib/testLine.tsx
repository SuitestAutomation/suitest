import {jsx} from '@suitest/smst';
import {TestLineNode} from '@suitest/smst/types/unistTestLine';
import {
	AppConfiguration,
	AssertTestLine,
	AssertThen,
	BrowserCommandTestLine,
	ClickTestLine,
	TapTestLine,
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
	WebTarget,
	MobileTarget,
	TestLine,
	WaitUntilTestLine,
	TestLineResult,
	ClearAppDataTestLine,
	TakeScreenshotTestLine,
	QueryLine,
	QueryLineError,
	DeviceSettingsTestLine,
	ScrollTestLine,
	SwipeTestLine,
	CloseAppTestLine,
	SuspendAppTestLine,
	ElementSelector,
	OpenDeepLinkTestLine,
	LastScreenshotTestLine,
} from '@suitest/types';
import {translateComparator} from './comparator';
import {translateCondition} from './condition';
import {
	formatTimeout,
	formatVariables,
	mapStatus,
	translateCodeProp,
	formatCount, deviceOrientationsMap,
} from './utils';

const getConditionInfo = (
	testLine: TestLine,
	appConfig?: AppConfiguration,
): Node | undefined => {
	// Deconstruct with type casting to PressButtonTestLine, as it's the most complete line type
	// and has all types of conditions and loops
	const {condition, count, negateCondition, delay} = (testLine as PressButtonTestLine);

	const getDelayFragment = (delay?: number | string) => delay !== undefined
		? <fragment> every {formatTimeout(delay, appConfig?.configVariables)}</fragment>
		: '';

	// Do something ... exactly ... every ...
	if (!condition && count && (typeof count === 'string' || count > 1)) {
		return <fragment> exactly {formatCount(count, appConfig?.configVariables)}
			{getDelayFragment(delay)}</fragment> as Node;
	}

	// Do something ... only if ...
	if (condition && negateCondition) {
		return <text> only if condition is met</text>;
	}

	// Do something ... until ...
	if (condition && !negateCondition) {
		return <fragment> until condition is met max {formatCount(count ?? 1, appConfig?.configVariables)}
			{getDelayFragment(delay)}</fragment>;
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
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const condition = translateCondition(testLine.condition, !!(testLine.then && testLine?.then !== 'success'), appConfig, elements, lineResult);
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	return <test-line
		title={<fragment>Assert: {condition.title}{testLine.timeout ? <fragment> timeout {formatTimeout(testLine.timeout, appConfig?.configVariables)}</fragment> : undefined}{testLine.then && testLine.then !== 'success' ? <fragment> then {translateAssertThen(testLine.then!)}</fragment> : undefined}</fragment>}
		status={status}
	>
		{condition.children}
	</test-line> as TestLineNode;
};

const translateTakeScreenshotTestLine = (
	testLine: TakeScreenshotTestLine, lineResult?: TestLineResult
): TestLineNode => {
	let text = '';
	if (testLine.dataFormat === 'raw') {
		text = 'Take screenshot (raw)';
	} else if (testLine.dataFormat === 'base64') {
		text = 'Take screenshot (base64)';
	} else if (testLine.fileName) {
		text = `Save screenshot ("${testLine.fileName}")`;
	}

	return <test-line
		title={<text>{text}</text>}
		status={lineResult?.result}
	/> as TestLineNode;
};

const translateLastScreenshotTestLine = (
	testLine: LastScreenshotTestLine,
	lineResult?: TestLineResult,
): TestLineNode => {
	let text = 'Get last screenshot for visual testing';
	if (testLine.dataFormat === 'raw') {
		text += ' (raw)';
	} else if (testLine.dataFormat === 'base64') {
		text += ' (base64)';
	}

	return <test-line
		title={<text>{text}</text>}
		status={lineResult?.result}
	/> as TestLineNode;
};

const translateClearAppDataTestLine = (testLine: ClearAppDataTestLine, lineResult?: TestLineResult): TestLineNode =>
	<test-line
		title={<text>Clear application data</text>}
		status={testLine.excluded ? 'excluded' : lineResult?.result}
	/> as TestLineNode;

// TODO: unify with stringifyCustomElementSubjectVal from condition.tsx?
const stringifySelector = (selector: ElementSelector): string => {
	if (Array.isArray(selector)) {
		return selector.map(s => `|${stringifySelector(s)}|`).join(' -> ');
	}

	if (selector.video || selector.psVideo) {
		return 'video element';
	}
	if (selector.active) {
		return 'active element';
	}
	if (selector.handle) {
		return `element by handle "${selector.handle}"`;
	}
	if (typeof selector.linkText === 'string') {
		return `link with "${selector.linkText}" text`;
	}
	if (typeof selector.partialLinkText === 'string') {
		return `link containing "${selector.partialLinkText}" text`;
	}

	return `"${Object.values(selector).filter(Boolean)[0]}" element`;
};

const translateQueryTestLine = (testLine: QueryLine, lineResult?: TestLineResult | QueryLineError): TestLineNode => {
	let title = '';

	switch (testLine.subject.type) {
		case 'cookie':
			title = `Retrieve value for "${testLine.subject.cookieName}" cookie`;
			break;
		case 'execute':
			title = `Retrieve value of execution "${testLine.subject.execute}"`;
			break;
		case 'location':
			title = 'Retrieve value of current location';
			break;
		case 'elementProps':
			title = 'Retrieve info of ' + stringifySelector(testLine.subject.selector);
			break;
		case 'elementCssProps':
			const { elementCssProps, selector } = testLine.subject;
			title += `Getting [${elementCssProps.join(', ')}] css properties of `
				+ stringifySelector(selector);
			break;
		case 'elementHandle':
			title += `Getting handle${testLine.subject.multiple ? 's' : ''} of `
				+ stringifySelector(testLine.subject.selector);
			break;
		case 'elementAttributes':
			const { attributes } = testLine.subject;
			const stringifiedAttrs = attributes.length ?
				`[${attributes.join(', ')}] attribute${attributes.length > 1 ? 's' : ''}`
				: 'all attributes';
			title += `Getting ${stringifiedAttrs} of ` + stringifySelector(testLine.subject.selector);
			break;
		case 'ocr':
			title += 'Getting OCR result';
			break;
		default:
			const subject: never = testLine.subject;
			console.warn(`Unknown subject "${JSON.stringify(subject)}" of query line.`);
	}
	const result: TestLineResult['result'] | undefined = lineResult?.result === 'error' ? 'fail' : lineResult?.result;

	return <test-line
		title={<text>{title}</text>}
		status={result}
	/> as TestLineNode;
};

const translateExecuteCommandTestLine = (
	testLine: ExecuteCommandTestLine,
	appConfig?: AppConfiguration,
	lineResult?: TestLineResult,
): TestLineNode =>
	<test-line
		title={<text>Execute JavaScript expression</text>}
		status={testLine.excluded ? 'excluded' : lineResult?.result}
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
	testLine: OpenAppTestLine,
	appConfig?: AppConfiguration,
	lineResult?: TestLineResult
): TestLineNode => {
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	if (testLine.launchMode) {
		// Open app with launch mode
		const message = {
			resume: 'Resume background application',
			restart: 'Restart application',
		}[testLine.launchMode] ?? 'Open application';

		return <test-line
			title={<text>{message}</text>}
			status={status}
		/> as TestLineNode;
	}

	if (testLine.deepLink) {
		return (
			<test-line
				title={'Open application at deep link ' + testLine.deepLink}
				status={status}
			/>
		) as TestLineNode;
	}

	if (!testLine.relativeUrl) {
		// Open app with default path
		return <test-line
			title={<text>Open application</text>}
			status={status}
		/> as TestLineNode;
	}

	const relativeUrl = formatVariables(testLine.relativeUrl, appConfig?.configVariables);

	return <test-line
		title={<text>Open application at relative URL</text>}
		status={status}
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

const translateCloseAppTestLine = (
	testLine: CloseAppTestLine,
	lineResult?: TestLineResult,
): TestLineNode => {
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	return <test-line
		title={<text>Close application</text>}
		status={status}
	/> as TestLineNode;
};

const translateSuspendAppTestLine = (
	testLine: SuspendAppTestLine,
	lineResult?: TestLineResult,
): TestLineNode => {
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	return <test-line
		title={<text>Suspend application</text>}
		status={status}
	/> as TestLineNode;
};

const translateOpenUrl = (
	testLine: OpenUrlTestLine, appConfig?: AppConfiguration, lineResult?: TestLineResult
): TestLineNode => {
	const url = formatVariables(testLine.url, appConfig?.configVariables);
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	return <test-line title={<text>Open URL</text>} status={status}>
		<props>
			<prop
				name={<text>URL</text>}
				comparator={translateComparator('=')}
				expectedValue={url}
			/>
		</props>
	</test-line> as TestLineNode;
};


const translateOpenDeepLink = (
	testLine: OpenDeepLinkTestLine,
	appConfig?: AppConfiguration,
	lineResult?: TestLineResult,
): TestLineNode => {
	const deepLink = formatVariables(testLine.deepLink, appConfig?.configVariables);
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	return (
		<test-line
			title={<text>Open Deep Link</text>}
			status={status}
		>
			<props>
				<prop
					name={<text>Deep Link</text>}
					comparator={translateComparator('=')}
					expectedValue={deepLink}
				/>
			</props>
		</test-line> as TestLineNode
	);
};

const translateSleepTestLine = (
	testLine: SleepTestLine, appConfig?: AppConfiguration, lineResult?: TestLineResult,
): TestLineNode => {
	const status = testLine.excluded ? 'excluded' : lineResult?.result;
	const title = <fragment>Sleep {formatTimeout(testLine.timeout, appConfig?.configVariables)}</fragment>;

	return <test-line title={title} status={status}/> as TestLineNode;
};

const translatePollUrlTestLine = (
	testLine: PollUrlTestLine, appConfig?: AppConfiguration, lineResult?: TestLineResult,
): TestLineNode => {
	const response = formatVariables(testLine.response, appConfig?.configVariables);
	const url = formatVariables(testLine.url, appConfig?.configVariables);
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	return <test-line title={<text>Poll URL every 0.5s</text>} status={status}>
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
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const ids = testLine.ids
		.map((id, i) => <fragment>
			<input>{id}</input>{i !== testLine.ids.length - 1 ? ', ' : ''}
		</fragment>);
	const titleFragment = getConditionInfo(testLine, appConfig);
	const status = testLine.excluded ? 'excluded' : lineResult?.result;
	const title = testLine.longPressMs
		? <fragment>Press long {ids} for {testLine.longPressMs}ms {titleFragment}</fragment>
		: <fragment>Press {ids}{titleFragment}</fragment>;

	return <test-line
		title={title}
		status={status}
	>
		{testLine.condition
			? translateCondition(testLine.condition, false, appConfig, elements, lineResult)
			: undefined}
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
	appConfig?: AppConfiguration,
	elements?: Elements,
	snippets?: Snippets,
	lineResult?: TestLineResult,
): TestLineNode => {
	const testName = translateTestName(testLine.val, snippets);
	const titleFragment = getConditionInfo(testLine, appConfig);
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	return <test-line
		title={<fragment>Run test {testName}{titleFragment}</fragment>}
		status={status}
	>
		{testLine.condition
			? translateCondition(testLine.condition, false, appConfig, elements, lineResult)
			: undefined}
	</test-line> as TestLineNode;
};

/* istanbul ignore next */
const assertUnknownTarget = (target: never): never => {
	throw new Error('Unknown target: ' + JSON.stringify(target));
};

const translateTarget = (target: WebTarget | MobileTarget): JSX.Element => {
	switch (target.type) {
		case 'element': // TODO nyc for some reason reports an uncovered branch here
			return 'val' in target && target.val.active
				? <subject>active element</subject>
				: <subject>element</subject>;
		case 'window':
			// TODO should we translate 'window' depending on running platform?
			return <subject>{
				'coordinates' in target
					? (target.relative ? 'relative position' : 'position')
					: 'window'
			}</subject>;
		case 'screen':
			return <subject>{'coordinates' in target ? 'position' : 'screen'}</subject>;
		default:
			/* istanbul ignore next */
			return assertUnknownTarget(target);
	}
};

// TODO what if text is too long?
const translateSendTextTestLine = (
	testLine: SendTextTestLine,
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const text = formatVariables(testLine.val, appConfig?.configVariables);
	const status = testLine.excluded ? 'excluded' : lineResult?.result;
	const titleFragment = getConditionInfo(testLine, appConfig);
	const title = <fragment>Send text {text} to {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title} status={status}>
		{testLine.condition
			? translateCondition(testLine.condition, false, appConfig, elements, lineResult)
			: undefined}
	</test-line> as TestLineNode;
};

const translateSetTextTestLine = (
	testLine: SetTextTestLine,
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const text = formatVariables(testLine.val, appConfig?.configVariables);
	const titleFragment = getConditionInfo(testLine, appConfig);
	const status = testLine.excluded ? 'excluded' : lineResult?.result;
	const title = <fragment>Set text {text} to {translateTarget(testLine.target)}{titleFragment}</fragment>;

	return <test-line title={title} status={status}>
		{testLine.condition
			? translateCondition(testLine.condition, false, appConfig, elements, lineResult)
			: undefined}
	</test-line> as TestLineNode;
};

/* istanbul ignore next */
const assertUnknownBrowserCommand = (browserCommand: never): never => {
	throw new Error(`Unknown browser command: ${JSON.stringify(browserCommand)}`);
};

/* istanbul ignore next */
const assertUnknownDeviceSetting = (deviceSettingsType: never): never => {
	throw new Error(`Unknown device setting: ${JSON.stringify(deviceSettingsType)}`);
};

const translateBrowserCommandTestLine = (
	testLine: BrowserCommandTestLine,
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const status = testLine.excluded ? 'excluded' : lineResult?.result;
	const condition = testLine.condition
		? translateCondition(testLine.condition, false, appConfig, elements, lineResult)
		: undefined;

	switch (testLine.browserCommand.type) {
		case 'goBack':
			return <test-line title={<text>Go back</text>} status={status}>
				{condition}
			</test-line> as TestLineNode;
		case 'goForward':
			return <test-line title={<text>Go forward</text>} status={status}>
				{condition}
			</test-line> as TestLineNode;
		case 'refresh':
			return <test-line title={<text>Refresh</text>} status={status}>
				{condition}
			</test-line> as TestLineNode;
		case 'setWindowSize':
			return <test-line title={<text>Resize window</text>} status={status}>
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
			return <test-line title={<text>Dismiss modal dialog</text>} status={status}>
				{condition}
			</test-line> as TestLineNode;
		case 'acceptAlertMessage':
			return <test-line title={<text>Accept modal dialog</text>} status={status}>
				{condition}
			</test-line> as TestLineNode;
		case 'acceptPromptMessage':
			// TODO variables
			return <test-line title={<text>Accept modal dialog with message</text>} status={status}>
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

const translateDeviceSettingsTestLine = (
	testLine: DeviceSettingsTestLine,
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const status = testLine.excluded ? 'excluded' : lineResult?.result;
	const condition = testLine.condition
		? translateCondition(testLine.condition, false, appConfig, elements, lineResult)
		: undefined;

	switch (testLine.deviceSettings.type) {
		case 'setOrientation':
			const orientation = deviceOrientationsMap[testLine.deviceSettings.params.orientation];

			return <test-line title={
				<fragment>Set screen orientation to <input>{orientation}</input></fragment>
			} status={status}>
				{condition}
			</test-line> as TestLineNode;
		default:
			/* istanbul ignore next */
			return assertUnknownDeviceSetting(testLine.deviceSettings.type);
	}
};

const translateClickTestLine = (
	testLine: ClickTestLine,
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const titleFragment = getConditionInfo(testLine, appConfig);
	const title = <fragment>Click on {translateTarget(testLine.target)}{titleFragment}</fragment>;
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	return <test-line title={title} status={status}>
		{testLine.condition
			? translateCondition(testLine.condition, false, appConfig, elements, lineResult)
			: undefined}
	</test-line> as TestLineNode;
};

const translateTapTestLine = (
	testLine: TapTestLine,
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const titleFragment = getConditionInfo(testLine, appConfig);
	const [{ type: tapType, duration }] = testLine.taps;
	const tapTypeCapitalized = tapType.charAt(0).toUpperCase() + tapType.slice(1);
	const title = (
		<fragment>
			{tapTypeCapitalized} tap on {translateTarget(testLine.target)}
			{duration !== undefined ?
				<fragment> for {formatTimeout(duration, appConfig?.configVariables)}</fragment>
				: undefined
			}
			{titleFragment}
		</fragment>
	);
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	return <test-line title={title} status={status}>
		{testLine.condition
			? translateCondition(testLine.condition, false, appConfig, elements, lineResult)
			: undefined}
	</test-line> as TestLineNode;
};

const translateScrollTestLine = (
	testLine: ScrollTestLine,
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const titleFragment = getConditionInfo(testLine, appConfig);
	const direction = testLine.scroll[0].direction;
	const distance = testLine.scroll[0].distance;
	const title = (
		<fragment>
			Scroll from {translateTarget(testLine.target)}
			{titleFragment} {direction}{['string', 'number'].includes(typeof distance) ? ` by ${distance}px` : ''}
		</fragment>
	);
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	return <test-line title={title} status={status}>
		{testLine.condition
			? translateCondition(testLine.condition, false, appConfig, elements, lineResult)
			: undefined}
	</test-line> as TestLineNode;
};

const translateSwipeTestLine = (
	testLine: SwipeTestLine,
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const titleFragment = getConditionInfo(testLine, appConfig);
	const direction = testLine.swipe[0].direction;
	const distance = testLine.swipe[0].distance;
	const duration = testLine.swipe[0].duration;
	const title = <fragment>Swipe/Flick from {translateTarget(testLine.target)}
		{titleFragment} {direction} by {distance}px in {duration}ms</fragment>;
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	return <test-line title={title} status={status}>
		{testLine.condition
			? translateCondition(testLine.condition, false, appConfig, elements, lineResult)
			: undefined}
	</test-line> as TestLineNode;
};

const translateMoveToTestLine = (
	testLine: MoveToTestLine,
	appConfig?: AppConfiguration,
	elements?: Elements,
	lineResult?: TestLineResult,
): TestLineNode => {
	const titleFragment = getConditionInfo(testLine, appConfig);
	const title = <fragment>Move pointer to {translateTarget(testLine.target)}{titleFragment}</fragment>;
	const status = testLine.excluded ? 'excluded' : lineResult?.result;

	return <test-line title={title} status={status}>
		{testLine.condition
			? translateCondition(testLine.condition, false, appConfig, elements, lineResult)
			: undefined}
	</test-line> as TestLineNode;
};

const translateCommentTestLine = (testLine: CommentTestLine): TestLineNode =>
	<test-line title={
		<text>{
			testLine.val
				.split('\n')
				.map(l => l.trim() ? `# ${l}` : false)
				.filter(Boolean)
				.join('\n')
		}</text>
	} /> as TestLineNode;

/* istanbul ignore next */
const assertUnknownLineType = (testLine: never): never => {
	throw new Error(`Unknown line type: ${JSON.stringify(testLine)}`);
};

export const translateTestLine = ({
	testLine, appConfig, elements, snippets, lineResult,
}: {
	testLine: TestLine | QueryLine,
	appConfig?: AppConfiguration,
	elements?: Elements,
	snippets?: Snippets,
	lineResult?: TestLineResult | QueryLineError,
}): TestLineNode => {
	switch (testLine.type) {
		case 'query':
			return translateQueryTestLine(testLine, lineResult);
		case 'assert':
		case 'wait':
			return translateAssertTestLine(testLine, appConfig, elements, lineResult as TestLineResult);
		case 'takeScreenshot':
			return translateTakeScreenshotTestLine(testLine, lineResult as TestLineResult);
		case 'lastScreenshot':
			return translateLastScreenshotTestLine(testLine, lineResult as TestLineResult);
		case 'clearAppData':
			return translateClearAppDataTestLine(testLine, lineResult as TestLineResult);
		case 'execCmd':
			return translateExecuteCommandTestLine(testLine, appConfig, lineResult as TestLineResult);
		case 'openApp':
			return translateOpenApp(testLine, appConfig, lineResult as TestLineResult);
		case 'openUrl':
			return translateOpenUrl(testLine, appConfig, lineResult as TestLineResult);
		case 'openDeepLink':
			return translateOpenDeepLink(testLine, appConfig, lineResult as TestLineResult);
		case 'sleep':
			return translateSleepTestLine(testLine, appConfig, lineResult as TestLineResult);
		case 'pollUrl':
			return translatePollUrlTestLine(testLine, appConfig, lineResult as TestLineResult);
		case 'button':
			return translatePressButtonTestLine(testLine, appConfig, elements, lineResult as TestLineResult);
		case 'runSnippet':
			return translateRunTestTestLine(testLine, appConfig, elements, snippets, lineResult as TestLineResult);
		case 'sendText':
			return translateSendTextTestLine(testLine, appConfig, elements, lineResult as TestLineResult);
		case 'setText':
			return translateSetTextTestLine(testLine, appConfig, elements, lineResult as TestLineResult);
		case 'browserCommand':
			return translateBrowserCommandTestLine(testLine, appConfig, elements, lineResult as TestLineResult);
		case 'deviceSettings':
			return translateDeviceSettingsTestLine(testLine, appConfig, elements, lineResult as TestLineResult);
		case 'click':
			return translateClickTestLine(testLine, appConfig, elements, lineResult as TestLineResult);
		case 'tap':
			return translateTapTestLine(testLine, appConfig, elements, lineResult as TestLineResult);
		case 'scroll':
			return translateScrollTestLine(testLine, appConfig, elements, lineResult as TestLineResult);
		case 'swipe':
			return translateSwipeTestLine(testLine, appConfig, elements, lineResult as TestLineResult);
		case 'moveTo':
			return translateMoveToTestLine(testLine, appConfig, elements, lineResult as TestLineResult);
		case 'closeApp':
			return translateCloseAppTestLine(testLine, lineResult as TestLineResult);
		case 'suspendApp':
			return translateSuspendAppTestLine(testLine, lineResult as TestLineResult);
		case 'comment':
			return translateCommentTestLine(testLine);
		default:
			/* istanbul ignore next */
			return assertUnknownLineType(testLine);
	}
};
