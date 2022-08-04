import {Condition} from './condition';

export type LineId = string;

export type BaseTestLine = {
	lineId: LineId,
	excluded: boolean,
	fatal: boolean,
	screenshot: boolean,
};

export type AssertThen = 'success' | 'fail' | 'warning' | 'exit';

export type AssertTestLine = BaseTestLine & {
	type: 'assert',
	condition: Condition,
	timeout?: number | string, // String in case it's a variable
	then?: AssertThen,
};

/*
* @deprecated should be used AssertTestLine instead
*/
export type  WaitUntilTestLine = BaseTestLine & {
	type: 'wait',
	condition: Condition,
	timeout: number | string, // String in case it's a variable
	then?: AssertThen,
};

export type ClearAppDataTestLine = BaseTestLine & {
	type: 'clearAppData',
};

export type TakeScreenshotTestLine = BaseTestLine & {
	type: 'takeScreenshot',
	dataFormat?: 'raw' | 'base64',
	fileName?: string,
};

export type ScreenOrientation =
	| 'portrait'
	| 'portraitReversed'
	| 'landscape'
	| 'landscapeReversed';

export type DeviceSettingsTestLine = BaseTestLine & {
	type: 'deviceSettings',
	deviceSettings: {
		type: 'setOrientation',
		params: {
			orientation: ScreenOrientation,
		},
	},
	condition?: Condition,
	negateCondition?: boolean,
};

export type ExecuteCommandTestLine = BaseTestLine & {
	type: 'execCmd',
	val: string,
};

export type OpenAppLaunchModes = 'resume' | 'restart';

export type OpenAppTestLine = BaseTestLine & {
	type: 'openApp',
	relativeUrl?: string,
	launchMode?: OpenAppLaunchModes,
	deepLink?: string,
};

export type CloseAppTestLine = BaseTestLine & {
	type: 'closeApp',
};

export type SuspendAppTestLine = BaseTestLine & {
	type: 'suspendApp',
};

export type OpenUrlTestLine = BaseTestLine & {
	type: 'openUrl',
	url: string,
};

export type OpenDeepLinkTestLine = BaseTestLine & {
	type: 'openDeepLink',
	deepLink: string,
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
	longPressMs?: number,
	count?: number | string,
	delay?: number | string,
	condition?: Condition,
	negateCondition?: boolean,
};

export type RunTestTestLine = BaseTestLine & {
	type: 'runSnippet',
	val: string,
	count?: number | string,
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

export type ScreenTarget = {
	type: 'screen',
};

export type WebPositionTarget = {
	type: 'window',
	coordinates: {
		x: number | string,
		y: number | string,
	},
	relative?: boolean,
};

export type MobilePositionTarget = {
	type: 'screen',
	coordinates: {
		x: number | string,
		y: number | string,
	},
};

export type ActiveElementTarget = {
	type: 'element',
	val: {
		active: true,
	},
};

export type WebTarget =
	| ElementTarget
	| WindowTarget
	| WebPositionTarget
	| ActiveElementTarget;

export type MobileTarget =
	| ElementTarget
	| ScreenTarget
	| ActiveElementTarget
	| MobilePositionTarget;

export type ClickTestLine = BaseTestLine & {
	type: 'click',
	target: ElementTarget | WebPositionTarget | ActiveElementTarget,
	delay?: number | string,
	count?: number | string,
	clicks: [{type: 'single', button: 'left'}],
	condition?: Condition,
	negateCondition?: boolean,
};

export type TapTypes = 'single' | 'double' | 'long';
export type Directions = 'up' | 'down' | 'left' | 'right';

export type TapTestLine = BaseTestLine & {
	type: 'tap',
	target: ElementTarget | MobilePositionTarget | ActiveElementTarget,
	delay?: number | string,
	count?: number | string,
	taps: [{type: TapTypes, duration?: undefined} | {type: 'long', duration?: number | string}],
	condition?: Condition,
	negateCondition?: boolean,
};

export type ScrollTestLine = BaseTestLine & {
	type: 'scroll',
	target: ElementTarget | MobilePositionTarget | ActiveElementTarget,
	delay?: number | string,
	count?: number | string,
	scroll: [{direction: Directions, distance?: number | string | null}],
	condition?: Condition,
	negateCondition?: boolean,
};

export type SwipeTestLine = BaseTestLine & {
	type: 'swipe',
	target: ElementTarget | MobilePositionTarget | ActiveElementTarget,
	delay?: number | string,
	count?: number | string,
	swipe: [{direction: Directions, distance: number | string, duration: number | string}],
	condition?: Condition,
	negateCondition?: boolean,
};

export type MoveToTestLine = BaseTestLine & {
	type: 'moveTo',
	target: ElementTarget | WebPositionTarget | ActiveElementTarget,
	condition?: Condition,
	negateCondition?: true,
};

export type SendTextTestLine = BaseTestLine & {
	type: 'sendText',
	target: ElementTarget | WindowTarget | ActiveElementTarget,
	val: string,
	delay?: number | string,
	count?: number | string,
	condition?: Condition,
	negateCondition?: boolean,
};

export type SetTextTestLine = BaseTestLine & {
	type: 'setText',
	target: ElementTarget | ActiveElementTarget,
	val: string,
	condition?: Condition,
	negateCondition?: true,
};

export type CommentTestLine = BaseTestLine & {
	type: 'comment',
	val: string,
};

export type TestLine =
	| AssertTestLine
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
	| CommentTestLine
	| TakeScreenshotTestLine
	| DeviceSettingsTestLine
	| TapTestLine
	| ScrollTestLine
	| SwipeTestLine
	| CloseAppTestLine
	| SuspendAppTestLine
	| OpenDeepLinkTestLine;
