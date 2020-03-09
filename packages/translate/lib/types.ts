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
		},
	},
	actualValue?: string,
	expression?: Array<{
		result: string,
		actualValue?: string,
		errorType?: string,
		message?: {
			code?: string,
		},
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
	actualValue: string,
	name: string,
	message: 'response' | 'request',
	reason: 'notMatched',
	type: 'header' | 'noUriFound' | 'status',
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

export type TestLineTypes =
	'assert' | 'button' | 'runSnippet' |
	'wait' | 'pollUrl' | 'sleep' | 'clearAppData' |
	'execCmd' | 'execBRSCmd' | 'openApp' | 'openUrl' | 'comment' |
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
		},
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
	},
};

type SetTextTargetType = {
	type: 'element',
	name?: string,
	elementId?: string,
};

export type AssertConditionType = AssertConditionElementType
	| AssertConditionVideoType
	| AssertConditionLocationType
	| AssertConditionCookieType
	| AssertConditionJavaScriptType
	| AssertConditionBrightScriptType
	| AssertConditionNetworkType
	| AssertConditionApplicationType
	| AssertConditionVideoType
	| AssertConditionPlayStationVideoType;

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
		responseInfo: Array<InfoBodyType | InfoStatusType | InfoHeaderType>,
	},
	type: 'made',
	searchStrategy: 'all' | 'notMatched',
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
		type: 'application',
	},
	type: 'exited',
};

export type AssertConditionElementType = {
	subject: {
		type: 'element',
		name?: string,
		flag?: number,
		elementId: string,
	},
	expression: Array<
		NumericProperties
		| StringProperties
		| BooleanProperties
		| ColorProperties
		| ImageHashProperty
		| BorderStyleProperty
		| VisibilityProperty
		| ContentModeProperty
		| StateProperty
		| TextAlignmentProperty
		| ImageLoadStateProperty
		>,
	type: 'has' | 'exists' | '!exists' | 'matches' | 'matchesBRS',
	val?: string,
};

export type AssertConditionVideoType = {
	subject: {
		type: 'video',
		name?: string,
		flag?: number,
	},
	expression: Array<
		NumericProperties
		| StringProperties
		| BooleanProperties
		| ColorProperties
		| ImageHashProperty
		| VideoStateProperty
		| BorderStyleProperty
		| VisibilityProperty
		| ContentModeProperty
		| StateProperty
		| TextAlignmentProperty
		>,
	type: 'has' | 'exists' | '!exists' | 'matches' | 'matchesBRS',
	val?: string,
};

type AssertConditionPlayStationVideoType = PlayStationHasCondition | PlayStationHadErrorCondition;
type PlayStationHasCondition = {
	subject: {
		type: 'psVideo',
	},
	expression: Array<VideoStateProperty | VideoPosProperty | VideoLengthProperty | VideoUrlProperty>,
	type: 'has',
};
type PlayStationHadErrorCondition = {
	subject: {
		type: 'psVideo',
	},
	type: 'hadNoError',
	searchStrategy: 'all' | 'currentUrl',
};

type PropertyStringComparatorsType = '=' | '!=' | '~' | '!~' | '^' | '!^' | '$' | '!$';
type PropertyNumericComparatorsType = '=' | '+-' | '!=' | '>' | '>=' | '<' | '<=';
type PropertyColorComparatorsType = '=' | '!=' | '+-';
type PropertySpecificComparatorsType = '=' | '!=';
type PropertyEqualComparatorType = '=';

export type AllElementProperties = NumericProperties['property']
	| StringProperties['property']
	| BooleanProperties['property']
	| ColorProperties['property']
	| ImageHashProperty['property']
	| VideoStateProperty['property']
	| BorderStyleProperty['property']
	| VisibilityProperty['property']
	| ContentModeProperty['property']
	| StateProperty['property']
	| TextAlignmentProperty['property']
	| ImageLoadStateProperty['property'];

type BasePropertyType<TProp, TType, TVal = string> = {
	property: TProp,
	type: TType,
	val?: TVal,
	uid: string,
	inherited?: boolean,
};

type ZIndexProperty = BasePropertyType<'zIndex', PropertyNumericComparatorsType, number>;
type OpacityProperty = BasePropertyType<'opacity', PropertyNumericComparatorsType, number>;
type BorderWidthProperty = BasePropertyType<'borderWidth', PropertyNumericComparatorsType, number>;
type TopProperty = BasePropertyType<'top', PropertyNumericComparatorsType, number>;
type LeftProperty = BasePropertyType<'left', PropertyNumericComparatorsType, number>;
type WidthProperty = BasePropertyType<'width', PropertyNumericComparatorsType, number>;
type HeightProperty = BasePropertyType<'height', PropertyNumericComparatorsType, number>;
type VideoPosProperty = BasePropertyType<'videoPos', PropertyNumericComparatorsType, number>;
type VideoLengthProperty = BasePropertyType<'videoLength', PropertyNumericComparatorsType, number>;
type ItemFocusedProperty = BasePropertyType<'itemFocused', PropertyNumericComparatorsType, number>;
type MarginProperty = BasePropertyType<'margin', PropertyNumericComparatorsType, number>;
type PaddingProperty = BasePropertyType<'padding', PropertyNumericComparatorsType, number>;
type FontSizeProperty = BasePropertyType<'fontSize', PropertyNumericComparatorsType, number>;
type FontWeightProperty = BasePropertyType<'fontWeight', PropertyNumericComparatorsType, number>;
type FocusMarginProperty = BasePropertyType<'focusMargin', PropertyNumericComparatorsType, number>;
type FocusPrimaryWidthProperty = BasePropertyType<'focusPrimaryWidth', PropertyNumericComparatorsType, number>;
type FocusSecondaryWidthProperty = BasePropertyType<'focusSecondaryWidth', PropertyNumericComparatorsType, number>;
type TextSizeProperty = BasePropertyType<'textSize', PropertyNumericComparatorsType, number>;
type ScaleXProperty = BasePropertyType<'scaleX', PropertyNumericComparatorsType, number>;
type ScaleYProperty = BasePropertyType<'scaleY', PropertyNumericComparatorsType, number>;
type TranslationXProperty = BasePropertyType<'translationX', PropertyNumericComparatorsType, number>;
type TranslationYProperty = BasePropertyType<'translationY', PropertyNumericComparatorsType, number>;
type PivotXProperty = BasePropertyType<'pivotX', PropertyNumericComparatorsType, number>;
type PivotYProperty = BasePropertyType<'pivotY', PropertyNumericComparatorsType, number>;
type TagIntProperty = BasePropertyType<'tagInt', PropertyNumericComparatorsType, number>;
type NumberOfSegmentsProperty = BasePropertyType<'numberOfSegments', PropertyNumericComparatorsType, number>;
type LeftAbsoluteProperty = BasePropertyType<'leftAbsolute', PropertyNumericComparatorsType, number>;
type TopAbsoluteProperty = BasePropertyType<'topAbsolute', PropertyNumericComparatorsType, number>;

type NumericProperties  = ZIndexProperty | OpacityProperty | BorderWidthProperty | TopProperty | LeftProperty
	| WidthProperty | HeightProperty | VideoPosProperty | VideoLengthProperty | ItemFocusedProperty |  MarginProperty
	| PaddingProperty |  FontSizeProperty | FontWeightProperty | FocusMarginProperty | FocusPrimaryWidthProperty
	| FocusSecondaryWidthProperty | TextSizeProperty | ScaleXProperty| ScaleYProperty | TranslationXProperty
	| TranslationYProperty | PivotXProperty | PivotYProperty | TagIntProperty | NumberOfSegmentsProperty
	| LeftAbsoluteProperty | TopAbsoluteProperty;

type TextProperty = BasePropertyType<'text', PropertyStringComparatorsType, string>;
type ImageProperty = BasePropertyType<'image', PropertyStringComparatorsType, string>;
type IdProperty = BasePropertyType<'id', PropertyStringComparatorsType, string>;
type ClassProperty = BasePropertyType<'class', PropertyStringComparatorsType, string>;
type HrefProperty = BasePropertyType<'href', PropertyStringComparatorsType, string>;
type VideoUrlProperty = BasePropertyType<'videoUrl', PropertyStringComparatorsType, string>;
type FontFamilyProperty = BasePropertyType<'fontFamily', PropertyStringComparatorsType, string>;
type NameProperty = BasePropertyType<'name', PropertyStringComparatorsType, string>;
type AutomationNameProperty = BasePropertyType<'automationName', PropertyStringComparatorsType, string>;
type AutomationIdProperty = BasePropertyType<'automationId', PropertyStringComparatorsType, string>;
type AlphaProperty = BasePropertyType<'alpha', PropertyStringComparatorsType, string>;
type TagProperty = BasePropertyType<'tag', PropertyStringComparatorsType, string>;
type ContentDescriptionProperty = BasePropertyType<'contentDescription', PropertyStringComparatorsType, string>;
type HintProperty = BasePropertyType<'hint', PropertyStringComparatorsType, string>;
type PackageNameProperty = BasePropertyType<'packageName', PropertyStringComparatorsType, string>;
type AccessibilityIdentifierProperty = BasePropertyType<'accessibilityIdentifier', PropertyStringComparatorsType, string>;
type FontNameProperty = BasePropertyType<'fontName', PropertyStringComparatorsType, string>;
type FontURIProperty = BasePropertyType<'fontURI', PropertyStringComparatorsType, string>;
type PlaceholderProperty = BasePropertyType<'placeholder', PropertyStringComparatorsType, string>;
type ProposalURLProperty = BasePropertyType<'proposalURL', PropertyStringComparatorsType, string>;
type UrlProperty = BasePropertyType<'url', PropertyStringComparatorsType, string>;
type ValueProperty = BasePropertyType<'value', PropertyStringComparatorsType, string>;

type StringProperties =
	TextProperty | ImageProperty | IdProperty | ClassProperty | HrefProperty | VideoUrlProperty | FontFamilyProperty |
	NameProperty | AutomationNameProperty | AutomationIdProperty | AlphaProperty | TagProperty |
	ContentDescriptionProperty | HintProperty | PackageNameProperty | AccessibilityIdentifierProperty |
	FontNameProperty | FontURIProperty | PlaceholderProperty | ProposalURLProperty | UrlProperty | ValueProperty;

type IsCompletelyDisplayedProperty = BasePropertyType<'isCompletelyDisplayed', PropertyEqualComparatorType, boolean>;
type IsEnabledProperty = BasePropertyType<'isEnabled', PropertyEqualComparatorType, boolean>;
type HasFocusProperty = BasePropertyType<'hasFocus', PropertyEqualComparatorType, boolean>;
type IsClickableProperty = BasePropertyType<'isClickable', PropertyEqualComparatorType, boolean>;
type IsCheckedProperty = BasePropertyType<'isChecked', PropertyEqualComparatorType, boolean>;
type IsSelectedProperty = BasePropertyType<'isSelected', PropertyEqualComparatorType, boolean>;
type IsFocusableProperty = BasePropertyType<'isFocusable', PropertyEqualComparatorType, boolean>;
type IsTouchableProperty = BasePropertyType<'isTouchable', PropertyEqualComparatorType, boolean>;
type HasMetaDataProperty = BasePropertyType<'hasMetaData', PropertyEqualComparatorType, boolean>;
type HasNavMarkersProperty = BasePropertyType<'hasNavMarkers', PropertyEqualComparatorType, boolean>;
type IsOpaqueProperty = BasePropertyType<'isOpaque', PropertyEqualComparatorType, boolean>;
type IsFocusedProperty = BasePropertyType<'isFocused', PropertyEqualComparatorType, boolean>;

type BooleanProperties =
	IsCompletelyDisplayedProperty | IsEnabledProperty | HasFocusProperty | IsClickableProperty | IsCheckedProperty |
	IsSelectedProperty | IsFocusableProperty | IsTouchableProperty | HasMetaDataProperty | HasNavMarkersProperty |
	IsOpaqueProperty | IsFocusedProperty;

type BackgroundColorProperty = BasePropertyType<'backgroundColor', PropertyColorComparatorsType, string>;
type ColorProperty = BasePropertyType<'color', PropertyColorComparatorsType, string>;
type BorderColorProperty = BasePropertyType<'borderColor', PropertyColorComparatorsType, string>;
type FocusPrimaryColorProperty = BasePropertyType<'focusPrimaryColor', PropertyColorComparatorsType, string>;
type FocusSecondaryColorProperty = BasePropertyType<'focusSecondaryColor', PropertyColorComparatorsType, string>;
type BarTintColorProperty = BasePropertyType<'barTintColor', PropertyColorComparatorsType, string>;
type SelectedImageTintColorProperty = BasePropertyType<'selectedImageTintColor', PropertyColorComparatorsType, string>;
type TintColorProperty = BasePropertyType<'tintColor', PropertyColorComparatorsType, string>;

type ColorProperties =
	BackgroundColorProperty | ColorProperty | BorderColorProperty | FocusPrimaryColorProperty |
	FocusSecondaryColorProperty | BarTintColorProperty | SelectedImageTintColorProperty | TintColorProperty;

// imageHash property
type ImageHashProperty = BasePropertyType<'imageHash', PropertySpecificComparatorsType, string>;

// videoState property
type VideoStateProperty = BasePropertyType<
	'videoState',
	PropertySpecificComparatorsType,
	VideoStatesDefaultType | VideoStatesAndroidType | VideoStatesTvOSType
>;
type VideoStatesDefaultType = 'stopped' | 'playing' | 'paused' | 'connecting' | 'buffering' | 'finished' | 'error';
type VideoStatesAndroidType = 'error' | 'idle' | 'preparing' | 'prepared' | 'playing' | 'paused' | 'playback_completed' | 'unknown';
type VideoStatesTvOSType = 'finished' | 'paused' | 'reversing' | 'playing' | 'error' | 'buffering' | 'undefined';

// borderStyle property
type BorderStyleTvOSType = 'none' | 'bezel' | 'rectangle' | 'rounded';
type BorderStyleProperty = BasePropertyType<'borderStyle', PropertyEqualComparatorType, BorderStyleTvOSType>;

// visibility property
type VisibilityProperty = BasePropertyType<
	'visibility',
	PropertyEqualComparatorType,
	VisibilityXboxType | VisibilityAndroidType | VisibilityRokuType
>;
type VisibilityXboxType = 'visible' | 'collapsed';
type VisibilityAndroidType = 'visible' | 'invisible' | 'collapsed';
type VisibilityRokuType = 'visible' | 'invisible';

// contentMode property
type ContentModeProperty = BasePropertyType<'contentMode', PropertyEqualComparatorType, ContentModesType>;
type ContentModesType = 'scaleToFill' | 'scaleAspectFit' | 'scaleAspectFill' | 'redraw' | 'center' | 'top' | 'bottom'
	| 'bottomLeft' | 'bottomRight' | 'left' | 'right' | 'topLeft' | 'topRight';

// element state property
type StateProperty = BasePropertyType<'state', PropertyEqualComparatorType, ElementStatesTvOSType>;
type ElementStatesTvOSType = 'selected' | 'highlighted' | 'disabled' | 'normal' | 'application' | 'focused' | 'reserved';

// textAlignment property
type TextAlignmentProperty = BasePropertyType<'textAlignment', PropertyEqualComparatorType, TextAlignmentTvOSType>;
type TextAlignmentTvOSType = 'center' | 'justified' | 'left' | 'right' | 'natural';

type ImageLoadStateProperty = BasePropertyType<'imageLoadState', PropertyEqualComparatorType, ImageLoadStateHtmlBased>;
type ImageLoadStateHtmlBased = 'loaded' | 'loading' | 'error' | 'unknown' | '';
