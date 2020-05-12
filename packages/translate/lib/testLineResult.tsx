/* eslint-disable max-len */
/// <reference path="../../smst/types/intrinsicElements.d.ts" />
/// <reference path="../../smst/types/unistTestLine.d.ts" />
import {jsx} from '@suitest/smst/commonjs/jsxFactory';
import {
	TestLineResult,
	QueryFailedWithCode,
	InvalidInputError,
	SyntaxError,
	QueryTimeoutError,
	DeviceError,
	UnsupportedButtonError,
	AbortedError,
	InvalidVariableError,
	InvalidValueError,
	InvalidResultError,
	InvalidReferenceError,
	ADBError,
	InvalidPackageError,
	OutdatedInstrumentationLibraryError, TestLine, AppConfiguration, Elements, Snippets,
} from '@suitest/types';
import {testLine} from './testLine';

const simpleErrorMap: {[key: string]: string} = {
	failedStart: 'Failed to open application',
	appRunning: 'App is still running',
	appNotRunning: 'App is not running',
	missingApp: 'Application is not installed on the device',
	initPlatformFailed: 'Failed to start Suitest bootstrap application on this device',
	packageNotFound: 'Selected configuration does not contain an app package. Upload a package on your app`s configuration page before continuing',
	missingPackage: 'Application package was not found on the target device',
	internalError: 'Internal error occurred',
	serverError: 'Internal error occurred',
	ILInternalError: 'Internal error occurred',
	invalidCredentials: 'Credentials for this device were changed',
	ActionNotAvailable: 'This test command is not supported by the current app configuration',
	conditionNotSatisfied: 'Maximum amount of key presses reached. Condition was not satisfied',
	wrongApp: 'Wrong app ID detected',
	driverException: 'Unexpected exception occurred on connected device. Please, contact support@suite.st if you see this often',
	noHasLines: 'No assertion properties defined',
	appCrashed: 'App seems to have crashed',
	timeLimitExceeded: 'Test execution limit exceeded (based on your subscription)',
	notResponding: 'Device stopped responding',
	suitestifyError: 'Suitestify failed to start. Check your Suitestify settings',
	suitestifyRequired: 'This assertion only works with Suitestify. You can configure your app to use Suitestify in the app settings. Please note that Suitestify is not available for all platforms',
	bootstrapPageNotDetected: 'App seems to have exited correctly but something went wrong when loading the Suitest channel autostart application',
	wrongAppDetected: 'App seems to have exited correctly, however another app has been opened',
	notExpectedResponse: 'Unexpected response received while polling URL',
	noConnection: 'Could not connect to server while polling URL',
	lateManualLaunch: 'In this configuration the "open app" commands inside the test are not supported. You may however start the test with "open app" command',
	launchExpired: 'Identical scheduling aborted',
	deviceIsBusy: 'Identical scheduling aborted',
	notActiveDeveloperMode: 'Failed to launch application. Is "developer mode" turned on? https://suite.st/docs/devices/lg-webos/#enable-developer-mode-on-the-device',
	// TODO should we display actualValue and expectedValue from response?
	invalidUrl: 'Application could not be launched. Please verify you have provided URL for this configuration',
	invalidOpenAppOverrideReference: 'Could not start execution, please check open app override setting. https://suite.st/docs/application/more-configuration-options/#open-app-override-test',
	Success: 'Command executed successfully',
	NoSuchElement: 'Element was not found', // TODO params
	NoSuchFrame: 'Cannot switch to frame', // TODO params
	UnknownCommand: 'The requested resource could not be found, or a request was received using an HTTP method that is not supported by the mapped resource',  // TODO params
	StaleElementReference: 'Element is no longer inside DOM', // TODO params
	ElementNotVisible: 'Element is not currently visible', // TODO params
	InvalidElementState: 'Cannot perform operation with element because this element is in an invalid state (e.g. attempting to click a disabled element)', // TODO params
	ElementIsNotSelectable: 'Element is not selectable', // TODO params
	UnknownError: 'An unknown server-side error occurred while processing the command',
	XPathLookupError: 'An error occurred while searching for an element by XPath',
	Timeout: 'This command takes too long to execute',
	NoSuchWindow: 'A request to switch to a different window could not be satisfied because the window could not be found',
	InvalidCookieDomain: 'Cannot set a cookie on a domain different from the current page',
	UnableToSetCookie: 'Cannot set the specified cookie value',
	UnexpectedAlertOpen: 'A modal dialog was open, blocking this operation',
	NoAlertOpenError: 'There was no modal dialog on page',
	ScriptTimeout: 'A script takes too long to execute',
	InvalidElementCoordinates: 'The coordinates provided to an interactions operation are invalid',
	IMENotAvailable: 'IME was not available',
	IMEEngineActivationFailed: 'An IME engine could not be started',
	InvalidSelector: 'Element selector is malformed',
	ElementNotInteractable: 'Element is not currently interactable and may not be manipulated',
	JavaScriptError: 'An error occurred while executing user supplied JavaScript',
	unknownWebDriverKey: 'This key is not supported on the target device',
	unfocusableElement: 'Element can\'t receive focus to enter text',
	unclickableElement: 'Element click is obstructed by different element',
	deviceConnectionError: 'Failed to initialize device control',
	testIsNotStarted: 'Cannot continue with the current test anymore because of previous errors or bad initialization',
	signInRequired: 'Account needs to be signed in on target device',
	connectionNotAuthorized: 'Connection not authorized. Debug mode is not allowed on the device, please make sure it is enabled',
	higherOSVersionRequired: 'The app package requires higher OS version',
	appleError65: 'Failed to launch app: Apple ID account error. https://suite.st/docs/devices/apple-tv/#apple-id-account-error',
	appleError70: 'Failed to launch app: Xcode error. https://suite.st/docs/devices/apple-tv/#xcode-error',
	appleAppSignError: 'Failed to launch app: App code sign error. https://suite.st/docs/devices/apple-tv/#app-code-sign-error',
	missingPSSDK: 'Please make sure that you have the PlayStation SDK installed. https://suite.st/docs/troubleshooting/playstation/#playstation-sdk-not-installed',
	targetManagerBusy: 'Please try again in a few minutes',
	missingDotNet: 'Please make sure you have the .NET Framework installed. https://suite.st/docs/troubleshooting/playstation/#net-framework-not-installed',
	bootstrapAppNotDetected: 'The Suitest bootstrap application was not detected',
	activationExpired: 'Could not open the app because the DevKit/TestKit expired',
	missingCpp: 'Make sure you have Microsoft Visual C++ Redistributable installed. https://suite.st/docs/devices/playstation',
	outOfMemory: 'Failed to open the app. Device is out of memory, please restart the device',
};

const translateQueryFailedResults = (result: QueryFailedWithCode): Node => {
	switch (result.message.code) {
		case 'invalidApp':
			return <text>Wrong app ID detected</text>;
		case 'applicationError':
			return <text>Application thrown unexpected error while executing command.</text>;
		case 'missingSubject':
			// TODO: should we display it as general error or implement it for each line when it can happens?
			return <text>Subject does not exist.</text>;
		case 'existingSubject':
			// TODO: should we display it as general error or implement it for each line when it can happens?
			return <text>Subject expected not to exist.</text>;
		case 'orderErr':
			return <text>Suitest instrumentation library should be placed as the first script in your HTML file. Loading the instrumentation library dynamically or after other scripts have loaded may cause many unusual errors.</text>;
		case 'updateAlert':
			return <text>Suitest instrumentation library is outdated. Please download and install the newest version.</text>;
		case 'wrongExpression':
			// TODO: what error message should be?
			// How to reproduce this error?
			return <text>Wrong expression.</text>;
		case 'notFunction':
			return <text>Specified code is not a function.</text>;
		case 'psImplicitVideo':
			return <text>The "video" subject on the PlayStation platform is inconsistent, we recommend using the "native video" or "element" subject instead.</text>;
		case 'exprException':
			return <text>Exception was thrown: "{result.message.info.exception}".</text>;
		default:
			const _message: never = result.message;
			console.warn('queryFailed message was not handled', JSON.stringify(_message));

	}

	return <text>Query failed.</text>;
};

const translateInvalidInputError = (result: InvalidInputError): TextNode => {
	const defaultMessage = <text>Test command received invalid input.</text> as TextNode;
	const message = 'message' in result ? result.message : undefined;

	if (!message) {
		return defaultMessage;
	}

	switch (message.code) {
		case 'lineTypeNotSupported':
			return <text>This test command is not supported by the current app configuration.</text> as TextNode;
		case 'elementNotSupported':
			return <text>This test command is unsupported by this element.</text> as TextNode;
		case 'wrongExpression':
			return defaultMessage;
		default:
			const _code: never = message.code;
			console.warn('invalidInput code was not handled', JSON.stringify(_code));
	}

	return defaultMessage;
};

const translateSyntaxError = (result: SyntaxError): TextNode => {
	const defaultMessage = <text>Test command received invalid input.</text> as TextNode;

	if (!result.message?.code) {
		return defaultMessage;
	}

	switch (result.message.code) {
		case 'wrongBody':
			return <text>Body field value is exceeding 4KB limit.</text> as TextNode;
		case 'WrongDelay':
			return <text>Test command received invalid input. Delay value is invalid.</text> as TextNode;
		case 'wrongUrl':
			return <text>This does not look like a valid URL.</text> as TextNode;
		default:
			const _code: never = result.message.code;
			console.warn('syntaxError message was not handled', JSON.stringify(_code));
	}

	return defaultMessage;
};

const translateQueryTimeoutError = (result: QueryTimeoutError): TextNode => {
	const defaultMessage = <text>Application did not respond for 60 seconds.</text> as TextNode;

	if (!result.message) {
		return defaultMessage;
	}

	switch (result.message.code) {
		case 'missingIlResponse':
			const timeout = result.message.info.timeout / 1000;

			return <text>The wait time exceeded {String(timeout)} {timeout === 1 ? 'second' : 'seconds'}.</text> as TextNode;
		default:
			const _code: never = result.message.code;
			console.warn('queryTimeout message was not handled', JSON.stringify(_code));
	}

	return defaultMessage;
};

const translateDeviceError = (result: DeviceError): TextNode => {
	const message = result.message;

	if (message.code === 'unsupportedSelector' && message.info.reason === 'xpathNotSupported') {
		return <text>Element cannot be found, because this device does not support XPath lookups.</text> as TextNode;
	}
	if (message.code === 'deviceFailure' && message.info.reason === 'cssSelectorInvalid') {
		return <text>CSS selector is invalid.</text> as TextNode;
	}
	if (['videoAdapterInvalidOutput', 'videoAdapterNotFunction', 'videoAdapterThrownError'].includes(message.code)) {
		return <text>Video adapter error: {message.info.reason}</text> as TextNode;
	}

	return <text>{simpleErrorMap.internalError}</text> as TextNode;
};

const translateUnsupportedButtonError = (result: UnsupportedButtonError): TextNode => {
	const buttonIds = result.message?.info.buttonIds;

	if (buttonIds) {
		return <text>Specified buttons are not supported on this device: [{buttonIds.join(', ')}]</text> as TextNode;
	}

	return <text>Specified buttons are not supported on this device.</text> as TextNode;
};

const translateAbortedError = (result: AbortedError): TextNode => {
	if (result.message?.info.reason === 'manualActionRequired') {
		return <text>Manual actions are not supported.</text> as TextNode;
	}

	return <text>Test execution was aborted.</text> as TextNode;
};

const translateInvalidVariableError = (result: InvalidVariableError): TextNode => {
	const vars = result.args?.variables ?? [];

	if (vars.length === 0) {
		return <text>Variable is not defined in the app configuration.</text> as TextNode;
	}

	const textVars = vars.join(', ');

	return <text>{
		vars.length === 1 ? `Variable ${textVars} is` : `Variables ${textVars} are`
	} not defined in the app configuration.</text> as TextNode;
};

const translateInvalidValueError = (result: InvalidValueError): TextNode =>
	result.args?.propertyName ?
		<text>Invalid value provided for {result.args.propertyName}.</text> as TextNode :
		<text>Invalid value provided.</text> as TextNode;

const translateInvalidResultError = (result: InvalidResultError): TextNode => {
	const defaultMessage = <text>Unexpected response received</text> as TextNode;

	if (!result.message?.code) {
		return defaultMessage;
	}

	switch (result.message.code) {
		case 'resultTooLong':
			return <text>Response exceeded the size limit of 4KB.</text> as TextNode;
		default:
			const _code: never = result.message.code;
			console.warn('invalidResult code was not handled', JSON.stringify(_code));
	}

	return defaultMessage;
};

// TODO: should we somehow use additional data from result?
const translateOpenAppOverrideFailedError = (): TextNode =>
	<text>An error occurred while executing the "Open app override test".</text> as TextNode;

const translateInvalidReferenceError = (result: InvalidReferenceError): TextNode => {
	const start = 'Could not start execution because';

	return 'snippetLineNumber' in result ?
		<text>{start} "Run Test" command refers to non-existing test or referred test has it's own references to non-existing tests</text> as TextNode :
		<text>{start} test definition contains "Run Test" lines that refer to non-existing test</text> as TextNode;
};

const translateADBError = (result: ADBError): TextNode => <text>{
		result.message?.info.reason ??
		'ADB communication with the device has failed. Make sure your device is set up correctly and it can be connected to using ADB.'
	}</text> as TextNode;

const translateInvalidPackageError = (result: InvalidPackageError): TextNode => {
	const defaultMessage = <text>Package cannot be launched on simulator device.</text> as TextNode;

	if (!result.message?.code) {
		return defaultMessage;
	}
	switch (result.message.code) {
		case 'appleTvDevicePackageOnSim':
			return <text>An Apple TV app package cannot be launched on simulator device.</text> as TextNode;
		case 'appleTvSimPackageOnDevice':
			return <text>An Apple TV app simulator package cannot be launched on real device.</text> as TextNode;
		default:
			const _code: never = result.message.code;
			console.warn('invalidPackage code was not handled', JSON.stringify(_code));

			return defaultMessage;
	}
};

const translateOutdatedLibraryError = (result: OutdatedInstrumentationLibraryError): TextNode => {
	const defaultMessage = <text>We have detected that your instrumentation library is outdated</text> as TextNode;

	switch (result.message.code) {
		case 'major':
			return <text>
				We have detected that your instrumentation library is outdated and the package cannot be opened. Update required.
			</text> as TextNode;
		case 'minor':
			return  <text>
				We have detected that your instrumentation library is outdated, the package can still be opened. Consider updating.
			</text> as TextNode;
	}

	return defaultMessage;
};

// TODO: investigate how to get jsExpressionError, testSnippetError, outdatedLibraryWarning described in suitest-js-api
// TODO: investigate handlers from FE:
//  	cyclicReference, snippetError, snippetUndone, instrumentationFailed, packageCorrupted, unknownElementProperty
//  	configuratorError, appStoreBuild
// TODO: better test coverage
export const translateResultMessage = (result: TestLineResult): Node => {
	if (result.errorType in simpleErrorMap) {
		return <text>{simpleErrorMap[result.errorType]}</text>;
	}
	if (result.errorType === 'queryFailed' && 'message' in result) {
		return translateQueryFailedResults(result);
	}
	if (result.errorType === 'queryFailed') {
		return <text>Query failed.</text>;
	}
	if (result.errorType === 'invalidInput') {
		return translateInvalidInputError(result);
	}
	if (result.errorType === 'syntaxError') {
		return translateSyntaxError(result);
	}
	if (result.errorType === 'queryTimeout') {
		return translateQueryTimeoutError(result);
	}
	if (result.errorType === 'deviceError') {
		return translateDeviceError(result);
	}
	if (result.errorType === 'unsupportedButton' || result.errorType === 'illegalButton') {
		return translateUnsupportedButtonError(result);
	}
	if (result.errorType === 'aborted') {
		return translateAbortedError(result);
	}
	if (result.errorType === 'invalidVariable') {
		return translateInvalidVariableError(result);
	}
	if (result.errorType === 'invalidValue') {
		return translateInvalidValueError(result);
	}
	if (result.errorType === 'invalidResult') {
		return translateInvalidResultError(result);
	}
	if (result.errorType === 'openAppOverrideFailed') {
		return translateOpenAppOverrideFailedError();
	}
	if (result.errorType === 'invalidReference') {
		return translateInvalidReferenceError(result);
	}
	if (result.errorType === 'adbError') {
		return translateADBError(result);
	}
	if (result.errorType === 'invalidPackage') {
		return translateInvalidPackageError(result);
	}
	if (result.errorType === 'outdatedLibrary' || result.errorType === 'outdatedLibraryConnected') {
		return translateOutdatedLibraryError(result);
	}

	console.warn('Error message not implemented for', JSON.stringify(result));

	return <text>Unknown error occurred.</text>;
};

export const translateTestLineResult = (options: {
	testLine: TestLine,
	appConfig: AppConfiguration,
	lineResult: TestLineResult,
	elements?: Elements,
	snippets?: Snippets,
}): TestLineResultNode => {
	const testLineTranslation = testLine(options);
	const {lineResult} = options;

	return <test-line-result
		status={lineResult.result}
		message={translateResultMessage(lineResult)}
	>{testLineTranslation}</test-line-result> as TestLineResultNode;
};
