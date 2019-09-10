export type LineDefinition = TestLineDefinitionType;
// COPIED from TestResultLineType
export type LineResult = {
	lineId: string,
	result: 'success' | 'warning' | 'fail' | 'fatal' | 'exit',
	timeFinished?: number,
	timeStarted?: number,
	timeHrDiff?: number[],

	errorType?: string,
	message?: {
		code?: string,
		info?: {
			reason?: string,
			buttonIds?: string[],
			error?: string,
			exception?: string,
		}
	},
	actualValue?: string,
	expression?: Array<{
		result: string,
		actualValue?: string,
		errorType?: string,
		message?: {
			code?: string,
		}
	}>,
	errors?: NetworkError[],
	snippetLineId?: string,
	snippetLineNumber?: number | null,

	results?: LineResult[], // regular snippet lines results
	loopResults?: LineResult[], // snippet until loops and lines results
};
export type AppConfiguration = {
	configVariables: string[],
};
export type Options = {
	config: AppConfiguration,
};

// A string with subset of Markdown formatting
export type FormattedString = string;
export type Comparator = PropertyStringComparatorsType
	| PropertyNumericComparatorsType
	| PropertyColorComparatorsType
	| PropertySpecificComparatorsType
	| PropertyEqualComparatorType; // ... all our comparators, translated
// A single property of the element or network request
export type LineResultDetail = {
	prop: FormattedString, // Humanized property name. I.e. borderColor => border color
	actual: number | FormattedString | null, // Formatted string could be used for URLs or image previews
	expected: number | FormattedString | null,
	expectedDefault: boolean, // For Test Editor tests defines if expected value is taken from element repo or was overridden
	comparator: Comparator, // e.g. '=' or 'does not contain'
};

export type Translation = {
	title: FormattedString,
	description?: FormattedString,
};
// A structure with line result translation
export type LineResultTranslated = {
	title: FormattedString,
	description?: FormattedString,
	details: LineResultDetail[],
};

export type NetworkError = {
	actualValue: string
	name: string
	message: 'response' | 'request'
	reason: 'notMatched'
	type: 'header' | 'noUriFound' | 'status'
};

// frontend types

type TestLineDefinitionType = TestLineButtonType
	| TestLineOpenAppType
	| TestLineOpenUrlType
	| TestLineSleepType
	| TestLineClearAppDataType
	| TestLineExecCmdType
	| TestLineExecBRSCmdType
	| TestLineRunSnippetType
	| TestLineCommentType
	| TestLinePollUrlType
	| TestLineAssertType
	| TestLineWaitType
	| TestLineBrowserCommandType
	| TestLineSendTextType
	| TestLineSetTextType
	| TestLineClickType
	| TestLineMoveToType;

type TestLineType = {
	lineId: string,
	excluded: boolean, // exclude from test execution flow
	fatal: boolean, // mark that line is important
	screenshot: boolean, // screenshot will be made during line execution
};

type TestLineTypes =
	'assert'|'button'|'runSnippet'|
	'wait'|'pollUrl'|'sleep'|'clearAppData'|
	'execCmd'|'execBRSCmd'|'openApp'|'openUrl'|'comment' |
	'browserCommand' | 'sendText' | 'setText' | 'click' | 'moveTo';

type BrowserCommandTypes =
	'goBack' | 'goForward' |
	'refresh' | 'setWindowSize' |
	'dismissAlertMessage' | 'acceptAlertMessage' |
	'acceptPromptMessage';

// Press button
type TestLineButtonType = TestLineType & {
	type: 'button',
	ids?: string[],
	count?: number,
	delay?: number,
	condition?: AssertConditionType,
	negateCondition?: boolean,
};

// Open app
type TestLineOpenAppType = TestLineType & {
	type: 'openApp',
	relativeUrl?: string,
};

// Open url
type TestLineOpenUrlType = TestLineType & {
	type: 'openUrl',
	url?: string,
};

// Sleep
type TestLineSleepType = TestLineType & {
	type: 'sleep',
	timeout: number | string | null, // can be null or variable SUIT-6477
};

// Clear app data
type TestLineClearAppDataType = TestLineType & {
	type: 'clearAppData',
};

// Exec command
type TestLineExecCmdType = TestLineType & {
	type: 'execCmd',
	val?: string,
};

// Exec BrightScript command
type TestLineExecBRSCmdType = TestLineType & {
	type: 'execBRSCmd',
	val?: string,
};

// Run test
declare type TestLineRunSnippetType = TestLineType & {
	type: 'runSnippet',
	val?: string,
	count: number,
	condition?: AssertConditionType,
	negateCondition?: boolean,
};

// Comment
type TestLineCommentType = TestLineType & {
	type: 'comment',
	val?: string,
};

// Poll Url
type TestLinePollUrlType = TestLineType & {
	type: 'pollUrl',
	url?: string,
	response?: string,
};

type AssertResultType = 'success' | 'warning' | 'fail' | 'exit';

// Assert
export type TestLineAssertType = TestLineType & {
	type: 'assert',
	condition: AssertConditionType,
	then: AssertResultType,
};

// Wait until
export type TestLineWaitType = TestLineType & {
	type: 'wait',
	timeout: number,
	condition: AssertConditionType,
	then: AssertResultType,
};

// Send text
declare type TestLineSendTextType = TestLineType & {
	type: 'sendText',
	target: BrowserCommandElementTargetType,
	val: string,
	condition?: AssertConditionType,
	negateCondition?: true,
	count: number,
	delay: number,
};

// Set text
declare type TestLineSetTextType = TestLineType & {
	type: 'setText',
	target: SetTextTargetType,
	val: string,
	condition?: AssertConditionType,
	negateCondition?: true,
};

// Click
declare type TestLineClickType = TestLineType & {
	type: 'click',
	target: BrowserCommandElementTargetType | BrowserCommandWindowTargetType,
	condition?: AssertConditionType,
	negateCondition?: true,
	count: number,
	delay: number,
};

// MoveTo
declare type TestLineMoveToType = TestLineType & {
	type: 'moveTo',
	target: BrowserCommandElementTargetType | BrowserCommandWindowTargetType,
	condition?: AssertConditionType,
	negateCondition?: true,
};

// Browser command
declare type TestLineBrowserCommandType = TestLineType & {
	type: 'browserCommand',
	browserCommand: {
		type: BrowserCommandTypes | '',
		params: {
			width?: number | null,
			height?: number | null,
			text?: string | null,
		}
	},
	condition?: AssertConditionType,
	negateCondition?: true,
};

// Helper subtypes

type BrowserCommandElementTargetType = {
	type: 'element' | 'window',
	name?: string,
	elementId?: string,
};

type BrowserCommandWindowTargetType = {
	type: 'window',
	coordinates: {
		x?: number,
		y?: number,
	}
};

type SetTextTargetType = {
	type: 'element',
	name?: string,
	elementId?: string,
};

type AssertConditionType = AssertConditionElementType
	| AssertConditionVideoType
	| AssertConditionLocationType
	| AssertConditionCookieType
	| AssertConditionJavaScriptType
	| AssertConditionBrightScriptType
	| AssertConditionNetworkType
	| AssertConditionApplicationType
	| AssertConditionVideoType
	;

type StringComparatorsType = '=' | '!=' | '~' | '!~' | '^' | '$';
type MatchComparatorsType = 'matches';
type ExistComparatorType = 'exists' | '!exists';

type AssertConditionLocationType = {
	subject: {
		type: 'location',
	},
	type: StringComparatorsType,
	val?: string,
};

type AssertConditionCookieType = {
	subject: {
		type: 'cookie',
		val?: string,
	},
	type: StringComparatorsType | MatchComparatorsType | ExistComparatorType,
	val?: string,
};

type AssertConditionJavaScriptType = {
	subject: {
		type: 'javascript',
		val?: string,
	},
	type: StringComparatorsType,
	val?: string,
};

type AssertConditionBrightScriptType = {
	subject: {
		type: 'brightscript',
		val?: string,
	},
	type: StringComparatorsType,
	val?: string,
};

export type AssertConditionNetworkType = {
	subject: {
		type: 'network',
		val?: string,
		compare: '=' | '~',
		requestInfo: Array<InfoBodyType | InfoMethodType | InfoHeaderType>,
		responseInfo: Array<InfoBodyType | InfoStatusType | InfoHeaderType>
	},
	type: 'made',
	searchStrategy: 'all' | 'notMatched'
};

type InfoBodyType = {
	name: '@body',
	val?: string,
	compare: '=',
	uid: string,
};

type InfoStatusType = {
	name: '@status',
	val?: string,
	compare: PropertyNumericComparatorsType,
	uid: string,
};

type InfoMethodType = {
	name: '@method',
	val?: string,
	compare: PropertyStringComparatorsType,
	uid: string,
};

type InfoHeaderType = {
	name?: string,
	val?: string,
	compare: PropertyStringComparatorsType | PropertyNumericComparatorsType ,
	uid: string,
};

type AssertConditionApplicationType = {
	subject: {
		type: 'application'
	},
	type: 'exited'
};

export type AssertConditionElementType = {
	subject: {
		type: 'element',
		name?: string,
		flag?: number,
		elementId: string,
	},
	expression: Array<
		AssertElementNumericPropertyType
		| AssertElementStringPropertyType
		| AssertElementBooleanPropertyType
		| AssertElementColorPropertyType
		| AssertElementSpecificPropertyType
		| AssertBorderStylePropertyType
		| AssertVisibilityPropertyType
		| AssertContentModePropertyType
		| AssertStatePropertyType
		| AssertTextAlignmentPropertyType
		| AssertImageLoadStatePropertyType
		>,
	type: 'has' | 'exists' | '!exists' | 'matches' | 'matchesBRS',
	val?: string
};

export type AssertConditionVideoType = {
	subject: {
		type: 'video',
		name?: string,
		flag?: number
	},
	expression: Array<
		AssertElementNumericPropertyType
		| AssertElementStringPropertyType
		| AssertElementBooleanPropertyType
		| AssertElementColorPropertyType
		| AssertElementSpecificPropertyType
		| AssertVideoStatePropertyType
		| AssertBorderStylePropertyType
		| AssertVisibilityPropertyType
		| AssertContentModePropertyType
		| AssertStatePropertyType
		| AssertTextAlignmentPropertyType
		>,
	type: 'has' | 'exists' | '!exists' | 'matches' | 'matchesBRS',
	val?: string
};

type PropertyStringComparatorsType = '=' | '!=' | '~' | '!~' | '^' | '!^' | '$' | '!$';
type PropertyNumericComparatorsType = '=' | '+-' | '!=' | '>' | '>=' | '<' | '<=';
type PropertyColorComparatorsType = '=' | '!=' | '+-';
type PropertySpecificComparatorsType = '=' | '!=';
type PropertyEqualComparatorType = '=';

// TODO improve properties definitions by creating type aliases for each prop
type AllElementProperties = AssertElementNumericPropertyType['property']
	| AssertElementStringPropertyType['property']
	| AssertElementBooleanPropertyType['property']
	| AssertElementColorPropertyType['property']
	| AssertElementSpecificPropertyType['property']
	| AssertVideoStatePropertyType['property']
	| AssertBorderStylePropertyType['property']
	| AssertVisibilityPropertyType['property']
	| AssertContentModePropertyType['property']
	| AssertStatePropertyType['property']
	| AssertTextAlignmentPropertyType['property']
	| AssertImageLoadStatePropertyType['property'];

type AssertElementNumericPropertyType = {
	property: 'zIndex' | 'opacity' | 'borderWidth' | 'top' | 'left' | 'width' | 'height' | 'videoPos'
		| 'videoLength' | 'itemFocused' | 'margin' | 'padding' | 'fontSize' | 'fontWeight' | 'focusMargin'
		| 'focusPrimaryWidth' | 'focusSecondaryWidth' | 'textSize' | 'scaleX' | 'scaleY' | 'translationX'
		| 'translationY' | 'pivotX' | 'pivotY' | 'tagInt' | 'numberOfSegments' | 'leftAbsolute' | 'topAbsolute',
	type: PropertyNumericComparatorsType,
	name?: string,
	uid: string,
	inherited?: boolean,
	val: string | number,
};

type AssertElementStringPropertyType = {
	property: 'text' | 'image' | 'id' | 'class' | 'href' | 'videoUrl' | 'fontFamily' | 'name'
		| 'automationName' | 'automationId' | 'alpha' | 'tag' | 'contentDescription' | 'hint' | 'packageName'
		| 'accessibilityIdentifier' | 'fontName' | 'fontURI' | 'placeholder' | 'proposalURL' | 'url' | 'value',
	type: PropertyStringComparatorsType,
	name?: string,
	uid: string,
	inherited?: boolean,
	val: string | number,
};
type AssertElementBooleanPropertyType = {
	property: 'isCompletelyDisplayed' | 'isEnabled' | 'hasFocus' | 'isClickable' | 'isChecked' | 'isSelected'
		| 'isFocusable' | 'isTouchable' | 'hasMetaData' | 'hasNavMarkers' | 'isOpaque' | 'isFocused',
	type: PropertyEqualComparatorType,
	name?: string,
	uid: string,
	inherited?: boolean,
	val: string | number,
};

type AssertElementColorPropertyType = {
	property: 'backgroundColor' | 'color' | 'borderColor' | 'focusPrimaryColor' | 'focusSecondaryColor' | 'barTintColor'
		| 'selectedImageTintColor' | 'tintColor',
	type: PropertyColorComparatorsType,
	name?: string,
	uid: string,
	inherited?: boolean,
	val: string | number,
};

type AssertElementSpecificPropertyType = {
	property: 'imageHash',
	type: PropertySpecificComparatorsType,
	name?: string,
	uid: string,
	inherited?: boolean,
	val: string | number,
};

// videoState property
type VideoStatesDefaultType = 'stopped' | 'playing' | 'paused' | 'connecting' | 'buffering' | 'finished' | 'error';
type VideoStatesAndroidType = 'error' | 'idle' | 'preparing' | 'prepared' | 'playing' | 'paused' | 'playback_completed' | 'unknown';
type VideoStatesTvOSType = 'finished' | 'paused' | 'reversing' | 'playing' | 'error' | 'buffering' | 'undefined';
type AssertVideoStatePropertyType = {
	property: 'videoState',
	type: PropertySpecificComparatorsType,
	name?: VideoStatesDefaultType | VideoStatesAndroidType | VideoStatesTvOSType,
	uid: string,
	inherited?: boolean,
	val: string | number,
};

// borderStyle property
type BorderStyleTvOSType = 'none' | 'bezel' | 'rectangle' | 'rounded';
type AssertBorderStylePropertyType = {
	property: 'borderStyle',
	type: PropertyEqualComparatorType,
	name?: BorderStyleTvOSType,
	uid: string,
	inherited?: boolean,
	val: string | number,
};

// visibility property
type VisibilityXboxType = 'visible' | 'collapsed';
type VisibilityAndroidType = 'visible' | 'invisible' | 'collapsed';
type VisibilityRokuType = 'visible' | 'invisible';
type AssertVisibilityPropertyType = {
	property: 'visibility',
	type: PropertyEqualComparatorType,
	name?: VisibilityXboxType | VisibilityAndroidType | VisibilityRokuType,
	uid: string,
	inherited?: boolean,
	val: string | number,
};

// contentMode property
type ContentModesType = 'scaleToFill' | 'scaleAspectFit' | 'scaleAspectFill' | 'redraw' | 'center' | 'top' | 'bottom'
	| 'bottomLeft' | 'bottomRight' | 'left' | 'right' | 'topLeft' | 'topRight';
type AssertContentModePropertyType = {
	property: 'contentMode',
	type: PropertyEqualComparatorType,
	name?: ContentModesType,
	uid: string,
	inherited?: boolean,
	val: string | number,
};

// element state property
type ElementStatesTvOSType = 'selected' | 'highlighted' | 'disabled' | 'normal' | 'application' | 'focused' | 'reserved';
type AssertStatePropertyType = {
	property: 'state',
	type: PropertyEqualComparatorType,
	name?: ElementStatesTvOSType,
	uid: string,
	inherited?: boolean,
	val: string | number,
};

// textAlignment property
type TextAlignmentTvOSType = 'center' | 'justified' | 'left' | 'right' | 'natural';
type AssertTextAlignmentPropertyType = {
	property: 'textAlignment',
	type: PropertyEqualComparatorType,
	name?: TextAlignmentTvOSType,
	uid: string,
	inherited?: boolean,
	val: string | number,
};

type ImageLoadStateHtmlBased = 'loaded' | 'loading' | 'error' | 'unknown' | '';
type AssertImageLoadStatePropertyType = {
	property: 'imageLoadState',
	type: PropertyEqualComparatorType,
	name?: ImageLoadStateHtmlBased,
	uid: string,
	inherited?: boolean,
	val: string | number,
};
