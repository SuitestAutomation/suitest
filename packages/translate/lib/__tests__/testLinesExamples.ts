import {
	Comparator,
	Condition, CssPropertiesQueryLine,
	Elements,
	NetworkRequestBodyInfo,
	NetworkRequestHeaderInfo,
	NetworkRequestMethodInfo,
	NetworkRequestStatusInfo,
	QueryLine,
	Snippets,
	StringComparator,
	TestLine,
	ElementHandleQueryLine,
	ElementAttributesQueryLine,
	CookieProperty,
	OcrCondition,
	OcrComparator,
	ImageCondition,
} from '@suitest/types';
import {PSVideoHadNoErrorCondition, JavaScriptComparator, ExistComparator, ElementProperty} from '@suitest/types/lib';

export const elements: Elements = {
	'element-id-1': {
		name: 'Element 1',
	},
};

export const snippets: Snippets = {
	'snippet-id-1': {
		name: 'Snippet 1',
	},
};

export const appConfig = {
	platform: 'hbbtv',
	suitestify: true,
	domainList: [],
	domainCandidates: [],
	notDomains: [],
	freezeRules: [],
	learnDomains: true,
	codeOverrides: {},
	configVariables: [
		{
			key: 'var1',
			value: '123',
		},
		{
			key: 'var2',
			value: 'val2',
		},
		{
			key: 'var3',
			value: '3v5',
		},
	],
};

const baseTestLine = {
	lineId: 'line-id-123',
	excluded: false,
	fatal: false,
	screenshot: false,
};

export const conditions = {
	'application has exited': (): Condition => ({
		subject: {
			type: 'application',
		},
		type: 'exited',
	}),
	'current location': (type: StringComparator | JavaScriptComparator = '~', val = 'expected value'): Condition => ({
		subject: {
			type: 'location',
		},
		type,
		val,
	}),
	'cookie': (
		cookieName = 'my-cookie',
		type: StringComparator | JavaScriptComparator | ExistComparator = '!=',
		val = 'expect value'
	): Condition => ({
		subject: {
			type: 'cookie',
			val: cookieName,
		},
		type,
		val,
	}),
	'cookie with properties': (properties: CookieProperty[] = []): Condition => ({
		subject: {
			type: 'cookie',
			val: 'my-cookie',
		},
		type: 'withProperties',
		properties,
	}),
	'video exists': (): Condition => ({
		subject: {
			type: 'video',
		},
		type: 'exists',
	}),
	'ps video had not error': (searchStrategy: PSVideoHadNoErrorCondition['searchStrategy'] = 'currentUrl'): Condition => ({
		subject: {
			type: 'psVideo',
		},
		type: 'hadNoError',
		searchStrategy,
	}),
	'element ... exist': (elementId = 'element-id-1'): Condition => ({
		subject: {
			type: 'element',
			elementId,
		},
		type: 'exists',
	}),
	'element ... does not exist': (elementId = 'element-id-1'): Condition => ({
		subject: {
			type: 'element',
			elementId,
		},
		type: '!exists',
	}),
	'element ... is visible': (apiId = 'My element'): Condition => ({
		subject: {
			type: 'element',
			apiId,
		},
		type: 'visible',
	}),
	'element ... is not visible': (apiId = 'My element'): Condition => ({
		subject: {
			type: 'element',
			apiId,
		},
		type: '!visible',
	}),
	'element matches JS': (val = 'someJS();'): Condition => ({
		subject: {
			type: 'element',
			val: {
				css: '.some.class',
				xpath: '//div',
				ifMultipleFoundReturn: 1,
			},
		},
		type: 'matches',
		val,
	}),
	'element matches JS with vars': (): Condition => ({
		subject: {
			type: 'element',
			val: {
				css: '.some.class',
				xpath: '//div',
				// ifMultipleFoundReturn: 1, // Commented out intentionally to cover all branches
			},
		},
		type: 'matches',
		val: 'someJS("<%var1%>");',
	}),
	'element properties': (expression?: ElementProperty[]): Condition => ({
		subject: {
			type: 'element',
			elementId: 'unknown-id',
		},
		type: 'has',
		expression: expression ?? [
			{
				property: 'videoPosition',
				type: '>=',
				val: 123,
			},
			{
				property: 'height',
				type: '+-',
				val: 123,
				deviation: '<%var3%>',
			},
			{
				property: 'text',
				type: '~',
				val: 'expected text',
			},
		] as Array<{property: string, type: Comparator, val: string | number, deviation?: number}>,
	}),
	'element with single selector exists': (): Condition => ({
		subject: {
			type: 'element',
			val: {
				css: '#fooBar',
				ifMultipleFoundReturn: 3,
			},
		},
		type: 'exists',
	}),
	'element specified with selector array exists': (): Condition => ({
		subject: {
			type: 'element',
			val: [{ css: '#fooBar' }, { css: 'div' }, { css: 'span' }],
		},
		type: 'exists',
	}),
	'element with name hint exists': (): Condition => ({
		subject: {
			type: 'element',
			elementId: 'unknown-id',
			nameHint: 'Foo Bar',
		},
		type: 'exists',
	}),
	'element with legacy name exists': (): Condition => ({
		subject: {
			type: 'element',
			elementId: 'unknown-id',
			nameHint: 'Foo Bar',
		},
		type: 'exists',
	}),
	'link with "home page" text exists': (): Condition => ({
		subject: {
			type: 'element',
			val: {
				linkText: 'home page',
			},
		},
		type: 'exists',
	}),
	'link containing "home" text exists': (): Condition => ({
		subject: {
			type: 'element',
			val: {
				partialLinkText: 'home',
			},
		},
		type: 'exists',
	}),
	'PS4 video had no error': (searchStrategy: PSVideoHadNoErrorCondition['searchStrategy'] = 'all'): Condition => ({
		subject: {type: 'psVideo'},
		type: 'hadNoError',
		searchStrategy,
	}),
	'PS4 video for current had no error': (): Condition => ({
		subject: {type: 'psVideo'},
		type: 'hadNoError',
		searchStrategy: 'currentUrl',
	}),
	'PS4 video has props': (): Condition => ({
		subject: {type: 'psVideo'},
		type: 'has',
		searchStrategy: 'all',
		expression: [
			{property: 'width', type: '=', val: 123},
		],
	}),
	'JavaScript expression ... equals ...': (
		jsCode = 'someJS()', val = 'returned value', type: StringComparator = '='
	): Condition => ({
		subject: {
			type: 'javascript',
			val: jsCode,
		},
		type,
		val,
	}),
	'JavaScript expression with variables ... equals ...': (): Condition => ({
		subject: {
			type: 'javascript',
			val: 'someJS("<%var1%>")',
		},
		type: '=',
		val: 'returned value',
	}),
	'network request to URL was made including matched': (): Condition => ({
		subject: {
			type: 'network',
			compare: '=',
			val: 'http://suite.st/<%var1%>',
		},
		type: 'made',
		searchStrategy: 'all',
	}),
	'network request matching URL was not made excluding previously matched': (): Condition => ({
		subject: {
			type: 'network',
			compare: '~',
			val: '/partial/url/<%var1%>',
			requestInfo: [
				{
					name: '@method',
					compare: '=',
					val: 'GET',
				},
				{
					name: '@body',
					compare: '=',
					val: 'request <%var2%> body',
				},
				{
					name: 'Accept-Type',
					compare: '~',
					val: 'text/javascript',
				},
			] as Array<NetworkRequestBodyInfo | NetworkRequestMethodInfo | NetworkRequestHeaderInfo>,
			responseInfo: [
				{
					name: '@status',
					compare: '>',
					val: 123,
				},
				{
					name: '@body',
					compare: '=',
					val: 'response <%non_existing_var%> <%kind-of|var but not%> body',
				},
				{
					name: 'Content-<%var1%>',
					compare: '$',
					val: '<%var2%>/javascript',
				},
			] as Array<NetworkRequestBodyInfo | NetworkRequestStatusInfo | NetworkRequestHeaderInfo>,
		},
		type: '!made',
		searchStrategy: 'notMatched',
	}),
	'assert OCR comparators': (comparators: OcrComparator[] = []): OcrCondition => ({
		subject: {
			type: 'ocr',
		},
		type: 'ocrComparators',
		comparators,
	}),
	'assert image by url on screen': (url = 'https://suite.st/'): ImageCondition => ({
		subject: {
			type: 'image',
			url,
		},
		type: 'visible',
	}),
	'assert image by filepath on screen': (filepath = '/suitest-project/image.jpg'): ImageCondition => ({
		subject: {
			type: 'image',
			filepath,
		},
		type: 'visible',
	}),
	'assert image by id on screen': (imageId = 'image-id'): ImageCondition => ({
		subject: {
			type: 'image',
			imageId,
		},
		type: 'visible',
	}),
	'assert image by id in region': (imageId = 'image-id', region: ImageCondition['region'] = [10, 10, 10, 10]): ImageCondition => ({
		subject: {
			type: 'image',
			imageId,
		},
		type: 'visible',
		region,
	}),
} as const;

const appExitedCondition = conditions['application has exited']();

export const testLinesExamples = {
	// ASSERT
	'Assert ... then continue': (condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'assert',
		condition,
		then: 'success',
	}),
	'Assert ... then continue excluded': (condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'assert',
		condition,
		then: 'success',
		excluded: true,
	}),
	'Assert ... then exit': (condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'assert',
		condition,
		then: 'exit',
	}),
	'Assert ... then warn': (condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'assert',
		condition,
		then: 'warning',
	}),
	'Assert ... then fail': (condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'assert',
		condition,
		then: 'fail',
	}),
	'Assert ... timeout ... then continue': (condition: Condition = appExitedCondition, timeout: number | string = 1000): TestLine => ({
		...baseTestLine,
		type: 'assert',
		condition,
		then: 'success',
		timeout,
	}),
	// WAIT UNTIL
	'Wait until ... max ... then continue': (condition: Condition = appExitedCondition, timeout: number | string = 1000): TestLine => ({
		...baseTestLine,
		type: 'wait',
		condition,
		then: 'success',
		timeout,
	}),
	// CLEAR APP DATA
	'Clear app data': (): TestLine => ({
		...baseTestLine,
		type: 'clearAppData',
	}),
	'Clear app data excluded': (): TestLine => ({
		...baseTestLine,
		type: 'clearAppData',
		excluded: true,
	}),
	// Execute command ...
	'Execute command ...': (val = 'someJS();'): TestLine => ({
		...baseTestLine,
		type: 'execCmd',
		val,
	}),
	'Execute command ... excluded': (val = 'someJS();'): TestLine => ({
		...baseTestLine,
		type: 'execCmd',
		val,
		excluded: true,
	}),
	// OPEN APP
	'Open app at homepage': (): TestLine => ({
		...baseTestLine,
		type: 'openApp',
	}),
	'Open app at homepage excluded': (): TestLine => ({
		...baseTestLine,
		type: 'openApp',
		excluded: true,
	}),
	'Restart application': (): TestLine => ({
		...baseTestLine,
		type: 'openApp',
		launchMode: 'restart',
	}),
	'Resume background application': (): TestLine => ({
		...baseTestLine,
		type: 'openApp',
		launchMode: 'resume',
	}),
	'Open app at relative URL ...': (relativeUrl = '/some/path'): TestLine => ({
		...baseTestLine,
		type: 'openApp',
		relativeUrl,
	}),
	'Open app at deep link ...': (deepLink = 'some deep link'): TestLine => ({
		...baseTestLine,
		type: 'openApp',
		deepLink,
	}),
	// OPEN URL
	'Open URL ...': (url = 'https://suite.st'): TestLine => ({
		...baseTestLine,
		type: 'openUrl',
		url,
	}),
	// OPEN DEEP LINK
	'Open Deep Link ...': (deepLink = 'some-deep-link'): TestLine => ({
		...baseTestLine,
		type: 'openDeepLink',
		deepLink,
	}),
	// SLEEP
	'Sleep ...': (timeout: string | number = 2000): TestLine => ({
		...baseTestLine,
		type: 'sleep',
		timeout,
	}),
	'Sleep ... excluded': (timeout: string | number = 2000): TestLine => ({
		...baseTestLine,
		type: 'sleep',
		timeout,
		excluded: true,
	}),
	// POLL URL
	'Poll URL ... until response is ...': (url = 'https://suite.st', response = 'expected response'): TestLine => ({
		...baseTestLine,
		type: 'pollUrl',
		url,
		response,
	}),
	// Run snippet
	'Run snippet ... once': (val = 'snippet-id-1'): TestLine => ({
		...baseTestLine,
		type: 'runSnippet',
		val,
	}),
	'Run snippet ... only if ...': (val = 'snippet-id-1', condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'runSnippet',
		val,
		condition,
		negateCondition: true,
	}),
	'Run snippet ... until ... max ...': (
		val = 'snippet-id-1',
		condition: Condition = appExitedCondition,
		count: number | string = 2,
	): TestLine => ({
		...baseTestLine,
		type: 'runSnippet',
		val,
		condition,
		negateCondition: false,
		count,
	}),
	'Run snippet ... exactly ...': (
		val = 'unknown-snippet-id-1',
		count: number | string = 2,
	): TestLine => ({
		...baseTestLine,
		type: 'runSnippet',
		val,
		count,
	}),
	// Press button
	'Press ... once': (ids = ['LEFT']): TestLine => ({
		...baseTestLine,
		type: 'button',
		ids,
	}),
	'Press long ... for ... once': (ids = ['LEFT'], longPressMs = 1000): TestLine => ({
		...baseTestLine,
		type: 'button',
		ids,
		longPressMs,
	}),
	'Press ... only if ...': (ids = ['LEFT'], condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'button',
		ids,
		condition,
		negateCondition: true,
	}),
	'Press ... until ... every ... max ...': (
		ids = ['LEFT', 'RIGHT'],
		condition: Condition = appExitedCondition,
		count: number | string = 2,
		delay: number | string = 3000
	): TestLine => ({
		...baseTestLine,
		type: 'button',
		ids,
		condition,
		negateCondition: false,
		count,
		delay,
	}),
	'Press ... every ... exactly ...': (
		ids = ['LEFT'],
		count: number | string = 2,
		delay: number | string = 3000
	): TestLine => ({
		...baseTestLine,
		type: 'button',
		ids,
		count,
		delay,
	}),
	// SEND TEXT
	'Send text ... to window once': (val = 'text to send'): TestLine => ({
		...baseTestLine,
		type: 'sendText',
		val,
		target: {type: 'window'},
	}),
	'Send text ... to element ... once': (val = 'text to send', elementId = 'element-id-1'): TestLine => ({
		...baseTestLine,
		type: 'sendText',
		val,
		target: {type: 'element', elementId},
	}),
	'Send text ... to active element once': (val = 'text to send'): TestLine => ({
		...baseTestLine,
		type: 'sendText',
		val,
		target: {
			type: 'element',
			val: {
				active: true,
			},
		},
	}),
	'Send text ... to window every ... exactly ...': (
		val = 'text to send',
		count: number | string = 2,
		delay: number | string = 1000
	): TestLine => ({
		...baseTestLine,
		type: 'sendText',
		val,
		target: {type: 'window'},
		count,
		delay,
	}),
	'Send text ... to window only if ...': (val = 'text to send', condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'sendText',
		val,
		target: {type: 'window'},
		condition,
		negateCondition: true,
	}),
	'Send text ... to window until ... every ... max ...': (
		val = 'text to send',
		condition: Condition = appExitedCondition,
		count: number | string = 4,
		delay: number | string = 1200
	): TestLine => ({
		...baseTestLine,
		type: 'sendText',
		val,
		target: {type: 'window'},
		condition,
		negateCondition: false,
		count,
		delay,
	}),
	// SET TEXT
	'Set text ... to element ...': (val = 'text to send', elementId = 'element-id-1'): TestLine => ({
		...baseTestLine,
		type: 'setText',
		val,
		target: {type: 'element', elementId},
	}),
	'Set text ... to active element': (val = 'text to send'): TestLine => ({
		...baseTestLine,
		type: 'setText',
		val,
		target: {
			type: 'element',
			val: {
				active: true,
			},
		},
	}),
	'Set text ... to element ... only if ...': (
		val = 'text to send',
		elementId = 'element-id-1',
		condition: Condition = appExitedCondition
	): TestLine => ({
		...baseTestLine,
		type: 'setText',
		val,
		target: {type: 'element', elementId},
		condition,
		negateCondition: true,
	}),
	// BROWSER COMMAND
	'Browser command: Go back': (): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'goBack',
		},
	}),
	'Browser command: Go back excluded': (): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'goBack',
		},
		excluded: true,
	}),
	'Browser command: Go back only if ...': (condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'goBack',
		},
		condition,
		negateCondition: true,
	}),
	'Browser command: Go forward': (): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'goForward',
		},
	}),
	'Browser command: Go forward only if ...': (condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'goForward',
		},
		condition,
		negateCondition: true,
	}),
	'Browser command: Refresh': (): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'refresh',
		},
	}),
	'Browser command: Refresh only if ...': (condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'refresh',
		},
		condition,
		negateCondition: true,
	}),
	'Browser command: Dismiss modal dialog': (): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'dismissAlertMessage',
		},
	}),
	'Browser command: Dismiss modal dialog only if ...': (condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'dismissAlertMessage',
		},
		condition,
		negateCondition: true,
	}),
	'Browser command: Accept modal dialog': (): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'acceptAlertMessage',
		},
	}),
	'Browser command: Accept modal dialog only if ...': (condition: Condition = appExitedCondition): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'acceptAlertMessage',
		},
		condition,
		negateCondition: true,
	}),
	'Browser command: Accept prompt dialog with text ...': (text = 'prompt text'): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'acceptPromptMessage',
			params: {text},
		},
	}),
	'Browser command: Accept prompt dialog with text ... only if ...': (
		text = 'prompt text',
		condition: Condition = appExitedCondition
	): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'acceptPromptMessage',
			params: {text},
		},
		condition,
		negateCondition: true,
	}),
	'Browser command: Set window size': (width: number | string = 123, height: number | string = 234): TestLine => ({
		...baseTestLine,
		type: 'browserCommand',
		browserCommand: {
			type: 'setWindowSize',
			params: {width, height},
		},
	}),
	// CLICK
	'Click on position ... once': (x: number | string = 123, y: number | string = 234): TestLine => ({
		...baseTestLine,
		type: 'click',
		target: {
			type: 'window',
			coordinates: {x, y},
		},
		clicks: [{type: 'single', button: 'left'}],
	}),
	'Click on relative position ... once': (x: number | string = 123, y: number | string = 234): TestLine => ({
		...baseTestLine,
		type: 'click',
		target: {
			type: 'window',
			coordinates: {x, y},
			relative: true,
		},
		clicks: [{type: 'single', button: 'left'}],
	}),
	'Click on element ... once': (elementId = 'element-id-1'): TestLine => ({
		...baseTestLine,
		type: 'click',
		target: {
			type: 'element',
			elementId,
		},
		clicks: [{type: 'single', button: 'left'}],
	}),
	'Click on element ... every ... exactly ...': (
		elementId = 'element-id-1',
		delay: number | string = 1500,
		count: number | string = 4
	): TestLine => ({
		...baseTestLine,
		type: 'click',
		target: {
			type: 'element',
			elementId,
		},
		clicks: [{type: 'single', button: 'left'}],
		delay,
		count,
	}),
	'Click on element ... only if ...': (
		elementId = 'element-id-1',
		condition: Condition = appExitedCondition
	): TestLine => ({
		...baseTestLine,
		type: 'click',
		target: {
			type: 'element',
			elementId,
		},
		clicks: [{type: 'single', button: 'left'}],
		condition,
		negateCondition: true,
	}),
	'Click on element ... until ... every ... max ...': (
		elementId = 'element-id-1',
		condition: Condition = appExitedCondition,
		delay: number | string = 5700,
		count: number | string = 6
	): TestLine => ({
		...baseTestLine,
		type: 'click',
		target: {
			type: 'element',
			elementId,
		},
		clicks: [{type: 'single', button: 'left'}],
		condition,
		negateCondition: false,
		delay,
		count,
	}),
	'Click on active element once': (): TestLine => ({
		...baseTestLine,
		type: 'click',
		target: {
			type: 'element',
			val: {
				active: true,
			},
		},
		clicks: [{type: 'single', button: 'left'}],
	}),
	// Tap lines
	'Single tap on element ... until ... every ... max ...': (
		elementId = 'element-id-1',
		condition: Condition = appExitedCondition,
		delay: number | string = 5700,
		count: number | string = 6
	): TestLine => ({
		...baseTestLine,
		type: 'tap',
		target: {
			type: 'element',
			elementId,
		},
		taps: [{type: 'single'}],
		condition,
		negateCondition: false,
		delay,
		count,
	}),
	'Double tap on element ... until ... every ... max ...': (
		elementId = 'element-id-1',
		condition: Condition = appExitedCondition,
		delay: number | string = 5700,
		count: number | string = 6
	): TestLine => ({
		...baseTestLine,
		type: 'tap',
		target: {
			type: 'element',
			elementId,
		},
		taps: [{type: 'double'}],
		condition,
		negateCondition: false,
		delay,
		count,
	}),
	'Long tap on element ... until ... every ... max ...': (
		elementId = 'element-id-1',
		condition: Condition = appExitedCondition,
		delay: number | string = 5700,
		count: number | string = 6
	): TestLine => ({
		...baseTestLine,
		type: 'tap',
		target: {
			type: 'element',
			elementId,
		},
		taps: [{type: 'long'}],
		condition,
		negateCondition: false,
		delay,
		count,
	}),
	'Long tap on element ... for ... until ... every ... max ...': (
		elementId = 'element-id-1',
		condition: Condition = appExitedCondition,
		delay: number | string = 5700,
		count: number | string = 6,
		duration: number | string = 2000,
	): TestLine => ({
		...baseTestLine,
		type: 'tap',
		target: {
			type: 'element',
			elementId,
		},
		taps: [{type: 'long', duration}],
		condition,
		negateCondition: false,
		delay,
		count,
	}),
	'Single tap on active element': (): TestLine => ({
		...baseTestLine,
		type: 'tap',
		target: {
			type: 'element',
			val: {
				active: true,
			},
		},
		delay: 1000,
		count: 1,
		taps: [
			{
				type: 'single',
			},
		],
	}),
	// Scroll line
	'Scroll from element ... to ... until ... every ... max ...': (
		elementId = 'element-id-1',
		condition: Condition = appExitedCondition,
		delay: number | string = 5700,
		count: number | string = 6
	): TestLine => ({
		...baseTestLine,
		type: 'scroll',
		target: {
			type: 'element',
			elementId,
		},
		scroll: [{direction: 'left', distance: 1}],
		condition,
		negateCondition: false,
		delay,
		count,
	}),
	'Scroll from active element': (): TestLine => ({
		...baseTestLine,
		type: 'scroll',
		target: {
			type: 'element',
			val: {
				active: true,
			},
		},
		delay: 1000,
		count: 1,
		scroll: [
			{
				direction: 'down',
				distance: 1,
			},
		],
	}),

	// Swipe line
	'Swipe from element ... to ... in ... until ... every ... max ...': (
		elementId = 'element-id-1',
		condition: Condition = appExitedCondition,
		delay: number | string = 5700,
		count: number | string = 6
	): TestLine => ({
		...baseTestLine,
		type: 'swipe',
		target: {
			type: 'element',
			elementId,
		},
		swipe: [{direction: 'left', distance: 1, duration: 3}],
		condition,
		negateCondition: false,
		delay,
		count,
	}),
	'Swipe from active element once': (): TestLine => ({
		...baseTestLine,
		type: 'swipe',
		target: {
			type: 'element',
			val: {
				active: true,
			},
		},
		delay: 1000,
		count: 1,
		swipe: [
			{
				direction: 'right',
				duration: 1,
				distance: 3,
			},
		],
	}),
	// MOVE TO
	'Move to position ...': (x: number | string = 123, y: number | string = 234): TestLine => ({
		...baseTestLine,
		type: 'moveTo',
		target: {
			type: 'window',
			coordinates: {x, y},
		},
	}),
	'Move to relative position ...': (x: number | string = 123, y: number | string = 234): TestLine => ({
		...baseTestLine,
		type: 'moveTo',
		target: {
			type: 'window',
			coordinates: {x, y},
			relative: true,
		},
	}),
	'Move to element ...': (elementId = 'element-id-1'): TestLine => ({
		...baseTestLine,
		type: 'moveTo',
		target: {
			type: 'element',
			elementId,
		},
	}),
	'Move to element ... only if ...': (
		elementId = 'element-id-1',
		condition: Condition = appExitedCondition
	): TestLine => ({
		...baseTestLine,
		type: 'moveTo',
		target: {
			type: 'element',
			elementId,
		},
		condition,
		negateCondition: true,
	}),
	'Move to element ... only if ... excluded': (
		elementId = 'element-id-1',
		condition: Condition = appExitedCondition
	): TestLine => ({
		...baseTestLine,
		type: 'moveTo',
		target: {
			type: 'element',
			elementId,
		},
		condition,
		negateCondition: true,
		excluded: true,
	}),
	'Move to active element': (): TestLine => ({
		...baseTestLine,
		type: 'moveTo',
		target: {
			type: 'element',
			val: {
				active: true,
			},
		},
	}),
	// COMMENT
	'Comment': (val = 'This is a comment'): TestLine => ({
		...baseTestLine,
		type: 'comment',
		val,
	}),
	// QUERY LINES
	'GET element props': (): QueryLine => ({
		type: 'query',
		subject: {
			type: 'elementProps',
			selector: {
				css: 'div.className',
			},
		},
	}),
	'GET location': (): QueryLine => ({
		type: 'query',
		subject: {
			type: 'location',
		},
	}),
	'GET cookies': (): QueryLine => ({
		type: 'query',
		subject: {
			type: 'cookie',
			cookieName: 'cook',
		},
	}),
	'GET element css properties': (): CssPropertiesQueryLine => ({
		type: 'query',
		subject: {
			type: 'elementCssProps',
			selector: { apiId: 'element-api-id' },
			elementCssProps: ['width', 'height', 'opacity'],
		},
	}),
	'GET element css properties with array selector': (): CssPropertiesQueryLine => ({
		type: 'query',
		subject: {
			type: 'elementCssProps',
			selector: [{ css: '#app' }, { css: 'div' }, { css: 'span' }],
			elementCssProps: ['width', 'height', 'opacity'],
		},
	}),
	'GET element handle': (): ElementHandleQueryLine => ({
		type: 'query',
		subject: {
			type: 'elementHandle',
			selector: { apiId: 'element-api-id' },
			multiple: false,
		},
	}),
	'GET link handle by "home page" text': (): ElementHandleQueryLine => ({
		type: 'query',
		subject: {
			type: 'elementHandle',
			multiple: false,
			selector: { linkText: 'home page' },
		},
	}),
	'GET link handle containing "home" text': (): ElementHandleQueryLine => ({
		type: 'query',
		subject: {
			type: 'elementHandle',
			multiple: false,
			selector: { partialLinkText: 'home page' },
		},
	}),
	'GET element attributes': (): ElementAttributesQueryLine => ({
		type: 'query',
		subject: {
			type: 'elementAttributes',
			selector: { apiId: 'element-api-id' },
			attributes: ['id', 'type', 'class'],
		},
	}),
	'JS expression': (): QueryLine => ({
		type: 'query',
		subject: {
			type: 'execute',
			execute: '1 + 1',
		},
	}),
	// take screenshot
	'get screenshot': (): TestLine => ({
		...baseTestLine,
		type: 'takeScreenshot',
		dataFormat: 'base64',
	}),
	'save screenshot': (): TestLine => ({
		...baseTestLine,
		type: 'takeScreenshot',
		fileName: 'screen.jpg',
	}),
	'setOrientation': (): TestLine => ({
		...baseTestLine,
		type: 'deviceSettings',
		deviceSettings: {
			type: 'setOrientation',
			params: {orientation: 'portrait'},
		},
	}),
	'close application': (): TestLine => ({
		...baseTestLine,
		type: 'closeApp',
	}),
	'suspend application': (): TestLine => ({
		...baseTestLine,
		type: 'suspendApp',
	}),
};
