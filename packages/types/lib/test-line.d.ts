import {Condition} from './condition';

export type BaseTestLine = {
	lineId: string,
	excluded: boolean,
	fatal: boolean,
	screenshot: boolean,
};

export type AssertThen = 'success' | 'fail' | 'warning' | 'exit';

export type AssertTestLine = BaseTestLine & {
	type: 'assert',
	condition: Condition,
	timeout?: number | string, // String in case it's a variable
	then: AssertThen,
};

export type  WaitUntilTestLine = BaseTestLine & {
	type: 'wait',
	condition: Condition,
	timeout: number | string, // String in case it's a variable
	then: AssertThen,
};

export type ClearAppDataTestLine = BaseTestLine & {
	type: 'clearAppData',
};

export type ExecuteCommandTestLine = BaseTestLine & {
	type: 'execCmd',
	val: string,
};

export type OpenAppTestLine = BaseTestLine & {
	type: 'openApp',
	relativeUrl?: string,
};

export type OpenUrlTestLine = BaseTestLine & {
	type: 'openUrl',
	url: string,
};

export type PollUrlTestLine = BaseTestLine & {
	type: 'pollUrl',
	url: string,
	response: string,
};

export type SleepTestLine = BaseTestLine & {
	type: 'sleep',
	timeout: number | string, // String in case it's a variable
};

export type PressButtonTestLine = BaseTestLine & {
	type: 'button',
	ids: string[],
	count?: number | string,
	delay?: number | string,
	condition?: Condition,
	negateCondition?: boolean,
};

export type RunTestTestLine = BaseTestLine & {
	type: 'runSnippet',
	val: string,
	count?: number | string,
	delay?: number | string,
	condition?: Condition,
	negateCondition?: boolean,
};

export type BrowserCommandGoBack = {type: 'goBack'};
export type BrowserCommandGoForward = {type: 'goForward'};
export type BrowserCommandRefresh = {type: 'refresh'};
export type BrowserCommandSetWindowSize = {
	type: 'setWindowSize',
	params: {
		width: number | string,
		height: number | string,
	},
};
export type BrowserCommandDismissModal = {type: 'dismissAlertMessage'};
export type BrowserCommandAcceptModal = {type: 'acceptAlertMessage'};
export type BrowserCommandAcceptPrompt = {type: 'acceptPromptMessage', params: {text: string}};

export type BrowserCommand = BrowserCommandGoBack
	| BrowserCommandGoForward
	| BrowserCommandRefresh
	| BrowserCommandSetWindowSize
	| BrowserCommandDismissModal
	| BrowserCommandAcceptModal
	| BrowserCommandAcceptPrompt;

export type BrowserCommandTestLine = BaseTestLine & {
	type: 'browserCommand',
	browserCommand: BrowserCommand,
	condition?: Condition,
	negateCondition?: boolean,
};

export type ElementTarget = {
	type: 'element',
	elementId: string,
};

export type WindowTarget = {
	type: 'window',
};

export type PositionTarget = {
	type: 'window',
	coordinates: {
		x: number | string,
		y: number | string,
	},
};

export type Target = ElementTarget
	| WindowTarget
	| PositionTarget;

export type ClickTestLine = BaseTestLine & {
	type: 'click',
	target: ElementTarget | PositionTarget,
	delay?: number | string,
	count?: number | string,
	clicks: [{type: 'single', button: 'left'}],
	condition?: Condition,
	negateCondition?: boolean,
};

export type MoveToTestLine = BaseTestLine & {
	type: 'moveTo',
	target: ElementTarget | PositionTarget,
	condition?: Condition,
	negateCondition?: true,
};

export type SendTextTestLine = BaseTestLine & {
	type: 'sendText',
	target: ElementTarget | WindowTarget,
	val: string,
	delay?: number | string,
	count?: number | string,
	condition?: Condition,
	negateCondition?: boolean,
};

export type SetTextTestLine = BaseTestLine & {
	type: 'setText',
	target: ElementTarget,
	val: string,
	condition?: Condition,
	negateCondition?: true,
};

export type CommentTestLine = BaseTestLine & {
	type: 'comment',
	val: string,
};

export type TestLine = AssertTestLine
	| WaitUntilTestLine
	| ClearAppDataTestLine
	| ExecuteCommandTestLine
	| OpenAppTestLine
	| OpenUrlTestLine
	| PollUrlTestLine
	| SleepTestLine
	| PressButtonTestLine
	| RunTestTestLine
	| BrowserCommandTestLine
	| ClickTestLine
	| MoveToTestLine
	| SendTextTestLine
	| SetTextTestLine
	| CommentTestLine;
