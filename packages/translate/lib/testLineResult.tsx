/* eslint-disable max-len */
import {jsx} from '@suitest/smst';
import {TestLineResultNode, TextNode} from '@suitest/smst/types/unistTestLine';
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
	OutdatedInstrumentationLibraryError,
	InvalidRepositoryReferenceError,
	TestLineErrorResult,
	QueryFailedInvalidUrl,
	TestLine,
	AppConfiguration,
	Elements,
	Snippets,
	SimpleError,
	QueryLine,
	QueryLineError,
	NotAllowedPrivilegesError,
} from '@suitest/types';
import {translateTestLine} from './testLine';
import {translateElementProperty} from './condition';
import { getDocsLink } from './utils';

const baseScreenshotPath = 'https://the.suite.st';

const conditionWasMetMessage = <text>Condition was met</text>;
const conditionWasNotMetMessage = <text>Condition was not met</text>;

const simpleErrorMap: {[key in SimpleError['errorType']]: Node} = {
	failedStart: <text>Failed to open application</text>,
	appRunning: <text>App is still running</text>,
	appNotRunning: <text>App is not running</text>,
	missingApp: <text>Application is not installed on the device</text>,
	initPlatformFailed: <text>Failed to bootstrap platform on this device</text>,
	packageNotFound: <text>Selected configuration does not contain an app package. Upload a package on your app`s configuration page before continuing</text>,
	missingPackage: <text>Application package was not found on the target device</text>,
	internalError: <text>Internal error occurred</text>,
	serverError: <text>Internal error occurred</text>,
	ILInternalError: <text>Internal error occurred</text>,
	invalidCredentials: <text>Credentials for this device were changed</text>,
	ActionNotAvailable: <text>This test command is not supported by the current app configuration</text>,
	conditionNotSatisfied: <text>Maximum amount of key presses reached. Condition was not satisfied</text>,
	wrongApp: <text>Wrong app ID detected</text>,
	driverException: <text>Unexpected exception occurred on connected device. Please, contact support@suite.st if you see this often</text>,
	noHasLines: <text>No assertion properties defined</text>,
	appCrashed: <text>App seems to have crashed</text>,
	timeLimitExceeded: <text>Test execution limit exceeded (based on your subscription)</text>,
	notResponding: <text>Device stopped responding</text>,
	suitestifyError: <text>Suitestify failed to start. Check your Suitestify settings</text>,
	suitestifyRequired: <text>This assertion only works with Suitestify. You can configure your app to use Suitestify in the app settings. Please note that Suitestify is not available for all platforms</text>,
	bootstrapPageNotDetected: <text>App seems to have exited correctly but something went wrong when loading the Suitest channel autostart application</text>,
	wrongAppDetected: <text>App seems to have exited correctly, however another app has been opened</text>,
	notExpectedResponse: <text>Unexpected response received while polling URL</text>,
	noConnection: <text>Could not connect to server while polling URL</text>,
	lateManualLaunch: <text>In this configuration the "open app" commands inside the test are not supported. You may however start the test with "open app" command</text>,
	launchExpired: <text>Identical scheduling aborted</text>,
	deviceIsBusy: <text>Identical scheduling aborted</text>,
	notActiveDeveloperMode: <text>Failed to launch application. Is "developer mode" turned on? https://suite.st/docs/devices/lg-webos/#enable-developer-mode-on-the-device</text>,
	invalidUrl: <text>Application could not be launched. Please verify you have provided URL for this configuration</text>,
	invalidOpenAppOverrideReference: <text>Could not start execution, please check open app override setting. https://suite.st/docs/application/more-configuration-options/#open-app-override-test</text>,
	Success: <text>Command executed successfully</text>,
	NoSuchElement: <text>Element was not found</text>,
	NoSuchFrame: <text>Cannot switch to frame</text>,
	UnknownCommand: <text>The requested resource could not be found, or a request was received using an HTTP method that is not supported by the mapped resource</text>,
	StaleElementReference: <text>Element is no longer inside DOM</text>,
	ElementNotVisible: <text>Element is not currently visible</text>,
	InvalidElementState: <text>Cannot perform operation with element because this element is in an invalid state (e.g. attempting to click a disabled element)</text>,
	ElementIsNotSelectable: <text>Element is not selectable</text>,
	UnknownError: <text>An unknown server-side error occurred while processing the command</text>,
	XPathLookupError: <text>An error occurred while searching for an element by XPath</text>,
	Timeout: <text>This command takes too long to execute</text>,
	NoSuchWindow: <text>A request to switch to a different window could not be satisfied because the window could not be found</text>,
	InvalidCookieDomain: <text>Cannot set a cookie on a domain different from the current page</text>,
	UnableToSetCookie: <text>Cannot set the specified cookie value</text>,
	UnexpectedAlertOpen: <text>A modal dialog was open, blocking this operation</text>,
	NoAlertOpenError: <text>There was no modal dialog on page</text>,
	ScriptTimeout: <text>A script takes too long to execute</text>,
	InvalidElementCoordinates: <text>The coordinates provided to an interactions operation are invalid</text>,
	IMENotAvailable: <text>IME was not available</text>,
	IMEEngineActivationFailed: <text>An IME engine could not be started</text>,
	InvalidSelector: <text>Element selector is malformed</text>,
	ElementNotInteractable: <text>Element is not currently interactable and may not be manipulated</text>,
	JavaScriptError: <text>An error occurred while executing user supplied JavaScript</text>,
	unknownWebDriverKey: <text>This key is not supported on the target device</text>,
	unfocusableElement: <text>Element can't receive focus to enter text</text>,
	unclickableElement: <text>Element click is obstructed by different element</text>,
	deviceConnectionError: <text>Failed to initialize device control</text>,
	controllerNotConnected: <text>Please check that all corresponding control units are working.</text>,
	appOnBackgroundError: <text>Cannot process line, application is not active</text>,
	testIsNotStarted: <text>Cannot continue with the current test anymore because of previous errors or bad initialization</text>,
	signInRequired: <text>Account needs to be signed in on target device</text>,
	connectionNotAuthorized: <text>Connection not authorized. Debug mode is not allowed on the device, please make sure it is enabled</text>,
	higherOSVersionRequired: <text>The app package requires higher OS version</text>,
	appleError65: <text>Failed to launch app: Apple ID account error. https://suite.st/docs/devices/apple-tv/#apple-id-account-error</text>,
	appleError70: <text>Failed to launch app: Xcode error. https://suite.st/docs/devices/apple-tv/#xcode-error</text>,
	appleAppSignError: <text>Failed to launch app: App code sign error. https://suite.st/docs/devices/apple-tv/#app-code-sign-error</text>,
	missingPSSDK: <text>Please make sure that you have the PlayStation SDK installed</text>,
	packageInstallationFailed: <text>Application installation on the device failed</text>,
	targetManagerBusy: <text>Device is busy, please try again later. Open Neighborhood (PS4) or Target Manager (PS5) app for more details</text>,
	missingDotNet: <text>Please make sure you have the .NET Framework installed. https://suite.st/docs/troubleshooting/playstation/#net-framework-not-installed</text>,
	bootstrapAppNotDetected: <text>The Suitest bootstrap application was not detected</text>,
	activationExpired: <text>Could not open the app because the DevKit/TestKit expired</text>,
	missingCpp: <text>Make sure you have Microsoft Visual C++ Redistributable installed. https://suite.st/docs/devices/playstation</text>,
	outOfMemory: <text>Failed to open the app. Device is out of memory, please restart the device</text>,
	networkError: <text>Network request matching given conditions was not made. https://suite.st/docs/faq/surprises/#network-request-condition-never-matches</text>,
	instrumentationFailed: <text>Suitest was unable to automatically insert the instrumentation library</text>,
	packageCorrupted: <text>Failed to open the app. Please make sure that your app is working correctly</text>,
	unknownElementProperty: <text>Unknown element property</text>,
	configuratorError: <text>Make sure that Apple Configurator 2 and Automation Tools are installed. https://suite.st/docs/devices/apple-tv/#installing-apple-configurator-2</text>,
	appleNetworkLogsError: <text>SuitestDrive can't launch NetworkLog service on Mac</text>,
	appStoreBuild: <text>Can’t install App Store distribution build</text>,
	outdatedLibraryWarning: <text>We have detected that your instrumentation library is outdated, the package can still be opened. Consider updating</text>,
	cyclicReference: <text>Cyclic reference detected</text>,
	ioError: <fragment>Problem with storing data. Please check that there is enough disk space and that permissions are not limited. Contact <link href="mailto:support@suite.st">support</link> if problem persists</fragment>,
	netError: <fragment>Downloading of the driver failed, please check your internet connection and try again later. Contact <link href="mailto:support@suite.st">support</link> if problem persists</fragment>,
	sdComponentFailed: <fragment>Downloading of the driver failed, please try again later. Contact <link href="mailto:support@suite.st">support</link> if problem persists</fragment>,
	MoveTargetOutOfBounds: <text>Move target is outside of the visible area of the screen</text>,
	ElementClickIntercepted: <text>Click on the element was intercepted by another element</text>,
	unsupportedOSVersion: <fragment>Unsupported OS version, please see our <link href="https://suite.st/docs/devices/playstation/#sdk-650-or-system-software-701-or-lower">docs</link></fragment>,
	targetManagerUnsupportedVersion: <fragment>Unsupported Target Manager Server, please see our <link href="https://suite.st/docs/devices/playstation/#sdk-650-or-system-software-701-or-lower">docs</link></fragment>,
	systemOutdated: <text>System software version mismatch. New version of system software is required</text>,
	noSpaceLeftOnDevice: <text>App installation failed. No space left on the device.</text>,
	invalidDeveloperIP: <fragment>Host PC IP does not match control unit IP, please see our <link href="https://suite.st/docs/devices/samsung-tizen/#set-up-developer-ip-on-the-target-device">docs</link>.</fragment>,
	instrumentationFailedPrivilege: <text>Auto-instrumentation works for app packages with public or partner privileges only. Please use manual instrumentation instead</text>,
	releaseMode: <text>Device is in the Release Mode, please switch it to the Assist Mode (Debug Settings / Boot Parameters / Release Check Mode)</text>,
	unsupportedPatchPackage: <text>Patch package is not supported. You need to use a fully standalone application package</text>,
	deviceLabException: <text>Suitest device lab - you do not have permission for this action under the current circumstances</text>,
	longPressNotSupported: <text>This device does not support long-press feature</text>,
	notSupportedApplicationType: <text>Application type inside the selected configuration is not supported on the device you are connected to</text>,
	deepLinkFormatError: <text>Defined deep link is not valid</text>,
	invalidCertificate: <text>Invalid SSL certificate. See troubleshooting section for this platform</text>,
	authorCertificateMismatch: <text>The app with the same app ID is already installed. Please uninstall the app manually or use a different app ID.</text>,
	appCertificateExpired: <text>Certificate in signature expired. Please create a new package</text>,
	misconfiguredDevice: <fragment>In order to install an app with partner privileges, you must <link href="https://suite.st/docs/devices/samsung-tizen/#certificates-and-privileges">configure your device</link></fragment>,
	invalidSignatureTamper: <text>Invalid signature. Please create a new package</text>,
	invalidSignaturePartner: <text>Mismatched privilege level. Use at least partner signatured certificate and create a new package</text>,
	invalidSignaturePlatform: <text>Mismatched privilege level. Use at least platform signatured certificate and create a new package</text>,
	installAppFailure: <text>Failed to install the app. Make sure that the Smart Hub is working correctly. Restart of the device could help</text>,
	openAppFailure: <text>Failed to open the app, please try again. Restart of the device could help</text>,
	urlOverrideNotSupported: <fragment>Only AppId used - the device does not support URL override. Please look into <link href="https://suite.st/docs/application/setting-up-vidaa-apps#specify-the-application">our user documentation</link> for more details.</fragment>,
	devToolsNotSupported: <fragment>The device has DevTools protocol disabled. Please look into <link href="https://suite.st/docs/devices/vidaa#enable-devtools-protocol">our user documentation</link> for more details.</fragment>,
	deviceNotPaired: <text>You need to pair the device first.</text>,
	appNotFound: <text>The application not found. Please make sure that you have entered a valid AppId.</text>,
	rokuUpdateNeeded: <fragment>The device needs to be updated manually. See <link href="https://suite.st/docs/troubleshooting/roku/#system-update-needed">our user documentation</link></fragment>,
	vizioAppNotFound: <text>Failed to open the application. Please make sure that the application configuration is set correctly.</text>,
	osUpdateNeeded: <text>The device needs to be updated manually.</text>,
	catalogueAppMissing: <text>App launch blocked, typically caused by missing entitlements or app not appearing in SoftCat. Try toggling "Force all apps launchable" from the "Settings" menu.</text>,
	pairingLost: <text>Pairing with the device was lost. Please delete the device and add it again.</text>,
	keyServerOffline: <text>Something went wrong. Please open the Developer Mode app on the device, activate the Key Server, and reopen the app from Suitest.</text>,
};

const translateQueryFailedResults = (result: QueryFailedWithCode): Node => {
	switch (result.message.code) {
		case 'invalidApp':
			return <text>Wrong app ID detected</text>;
		case 'applicationError':
			return <text>Application thrown unexpected error while executing command</text>;
		case 'missingSubject':
			return <text>Subject does not exist</text>;
		case 'existingSubject':
			return <text>Subject exists</text>;
		case 'orderErr':
			return <text>Suitest instrumentation library should be placed as the first script in your HTML file. Loading the instrumentation library dynamically or after other scripts have loaded may cause many unusual errors</text>;
		case 'updateAlert':
			return <text>Suitest instrumentation library is outdated. Please download and install the newest version</text>;
		case 'wrongExpression':
			// TODO: How to reproduce this error?
			return <text>Wrong expression</text>;
		case 'notFunction':
			return <text>Specified code is not a function</text>;
		case 'psImplicitVideo':
			return <text>The "video" subject on the PlayStation platform is inconsistent, we recommend using the "native video" or "element" subject instead</text>;
		case 'exprException':
			return <text>Exception was thrown: "{result.message.info.exception}"</text>;
		case 'invalidUrl':
			const res = result as QueryFailedInvalidUrl;

			return <text>App loaded {res.actualValue} instead of the expected {res.expectedValue}. Consider updating the app URL in settings</text>;
		case 'devToolsRequired':
			return <text>{result.message.info.exception}</text>;
		default:
			const _message: never = result.message;
			console.warn('queryFailed message was not handled', JSON.stringify(_message));

	}

	return conditionWasNotMetMessage;
};

const translateInvalidInputError = (result: InvalidInputError): Node => {
	const defaultMessage = <text>Test command received invalid input</text> as TextNode;
	const message = 'message' in result ? result.message : undefined;

	if (!message) {
		return defaultMessage;
	}

	switch (message.code) {
		case 'lineTypeNotSupported':
			return <text>This test command is not supported by the current app configuration</text> as TextNode;
		case 'elementNotSupported':
			return <text>This test command is unsupported by this element</text> as TextNode;
		case 'wrongExpression':
			return defaultMessage;
		case 'wrongDirection':
			return <fragment>Invalid direction. See <link href="https://suite.st/docs/suitest-api/test-operations/#scroll">our docs</link> for more information</fragment>;
		default:
			const _code: never = message.code;
			console.warn('invalidInput code was not handled', JSON.stringify(_code));
	}

	return defaultMessage;
};

const translateSyntaxError = (result: SyntaxError): TextNode => {
	const defaultMessage = <text>Test command received invalid input</text> as TextNode;

	if (!result.message?.code) {
		return defaultMessage;
	}

	switch (result.message.code) {
		case 'wrongBody':
			return <text>Body field value is exceeding 4KB limit</text> as TextNode;
		case 'WrongDelay':
			return <text>Test command received invalid input. Delay value is invalid</text> as TextNode;
		case 'wrongUrl':
			return <text>This does not look like a valid URL</text> as TextNode;
		default:
			const _code: never = result.message.code;
			console.warn('syntaxError message was not handled', JSON.stringify(_code));
	}

	return defaultMessage;
};

const translateQueryTimeoutError = (result: QueryTimeoutError): TextNode => {
	const defaultMessage = <text>Application did not respond for 60 seconds</text> as TextNode;

	if (!result.message) {
		return defaultMessage;
	}

	switch (result.message.code) {
		case 'missingIlResponse':
			const timeout = result.message.info.timeout / 1000;

			return <text>The wait time exceeded {String(timeout)} {timeout === 1 ? 'second' : 'seconds'}</text> as TextNode;
		default:
			const _code: never = result.message.code;
			console.warn('queryTimeout message was not handled', JSON.stringify(_code));
	}

	return defaultMessage;
};

const translateDeviceError = (result: DeviceError): TextNode => {
	const message = result.message;

	if (message.code === 'unsupportedSelector' && message.info.reason === 'xpathNotSupported') {
		return <text>Element cannot be found, because this device does not support XPath lookups</text> as TextNode;
	}
	if (message.code === 'deviceFailure' && message.info.reason === 'cssSelectorInvalid') {
		return <text>CSS selector is invalid</text> as TextNode;
	}
	if (message.code === 'deviceFailure' && message.info.reason === 'xpathNotValid') {
		return <text>XPath selector is invalid</text> as TextNode;
	}
	if (message.code === 'notSupportedDriver') {
		return <text>The device failed to make a screenshot</text> as TextNode;
	}
	if (['videoAdapterInvalidOutput', 'videoAdapterNotFunction', 'videoAdapterThrownError'].includes(message.code)) {
		return <text>Video adapter error: {message.info.reason}</text> as TextNode;
	}

	return simpleErrorMap.internalError as TextNode;
};

const translateUnsupportedButtonError = (result: UnsupportedButtonError): TextNode => {
	const buttonIds = result.message?.info.buttonIds;

	if (buttonIds) {
		return <text>Specified buttons are not supported on this device: [{buttonIds.join(', ')}]</text> as TextNode;
	}

	return <text>Specified buttons are not supported on this device</text> as TextNode;
};

const translateAbortedError = (result: AbortedError): TextNode => {
	if (result.message?.info.reason === 'manualActionRequired') {
		return <text>Manual actions are not supported</text> as TextNode;
	}

	return <text>Test execution was aborted</text> as TextNode;
};

const translateInvalidVariableError = (result: InvalidVariableError): TextNode => {
	const vars = result.args?.variables ?? [];

	if (vars.length === 0) {
		return <text>Variable is not defined in the app configuration</text> as TextNode;
	}

	const textVars = vars.join(', ');

	return <text>{
		vars.length === 1 ? `Variable ${textVars} is` : `Variables ${textVars} are`
	} not defined in the app configuration</text> as TextNode;
};

const translateInvalidValueError = (result: InvalidValueError): TextNode =>
	result.args?.propertyName ?
		<text>Invalid value provided for {result.args.propertyName}</text> as TextNode :
		<text>Invalid value provided</text> as TextNode;

const translateInvalidResultError = (result: InvalidResultError): TextNode => {
	const defaultMessage = <text>Unexpected response received</text> as TextNode;

	if (!result.message?.code) {
		return defaultMessage;
	}

	switch (result.message.code) {
		case 'resultTooLong':
			return <text>Response exceeded the size limit of 4KB</text> as TextNode;
		default:
			const _code: never = result.message.code;
			console.warn('invalidResult code was not handled', JSON.stringify(_code));
	}

	return defaultMessage;
};

// TODO: investigate possible additional errorType's, and "message" is completely valid result.
const translateOpenAppOverrideFailedError = (): Node =>
	<text>Open app override failed</text>;


const translateInvalidReferenceError = (result: InvalidReferenceError): TextNode => {
	const start = 'Could not start execution because';

	return 'snippetLineNumber' in result ?
		<text>{start} "Run Test" command refers to non-existing test or referred test has it's own references to non-existing tests</text> as TextNode :
		<text>{start} test definition contains "Run Test" lines that refer to non-existing test</text> as TextNode;
};

const translateADBError = (result: ADBError): TextNode => {
	if (result.message && ('code' in result.message) && result.message.code === 'certificateError') {
		return <text>{result.message.code}</text> as TextNode;
	}
	if (result.message && ('code' in result.message) && result.message.code === 'installationRestricted') {
		return <fragment>Application installation is forbidden. See <link href="https://suite.st/docs/troubleshooting/android/#application-installation-is-forbidden-on-xiaomi">our docs</link> for more information</fragment> as TextNode;
	}
	if (result.message && ('info' in result.message)) {
		return <text>{result.message.info.reason}</text> as TextNode;
	}

	return <text>ADB communication with the device has failed. Make sure your device is set up correctly and it can be connected to using ADB</text> as TextNode;
};

const translateInvalidPackageError = (result: InvalidPackageError): TextNode => {
	const defaultMessage = <text>Package cannot be launched on simulator device</text> as TextNode;

	if (!result.message?.code) {
		return defaultMessage;
	}
	switch (result.message.code) {
		case 'appleTvDevicePackageOnSim':
			return <text>An Apple TV app package cannot be launched on simulator device</text> as TextNode;
		case 'appleTvSimPackageOnDevice':
			return <text>An Apple TV app simulator package cannot be launched on real device</text> as TextNode;
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
				We have detected that your instrumentation library is outdated and the package cannot be opened. Update required
			</text> as TextNode;
		case 'minor':
			return  <text>
				We have detected that your instrumentation library is outdated, the package can still be opened. Consider updating
			</text> as TextNode;
	}

	return defaultMessage;
};

const translateInvalidRepositoryReference = (result: InvalidRepositoryReferenceError): TextNode => {
	let textMsg = 'Element was not found in the repository';

	if (result.message) {
		switch (result.message.code) {
			case 'notExistingElement':
				break;
			case 'notExistingPlatform':
				textMsg = 'Element is not defined for the selected platform';
				break;
			case 'unknownProperty':
				textMsg = `Element does not support property ${translateElementProperty(result.message.property)}`;
				break;
			case 'notExistingImage':
				textMsg = 'Image was not found in repository';
				break;
			default:
				const _message: never = result.message;
				console.warn('invalidRepositoryReference unknown message: ', JSON.stringify(_message));
		}
	}

	return <text>{textMsg}</text> as TextNode;
};

const translateNotAllowedPrivileges = (result: NotAllowedPrivilegesError): Node =>
	<fragment>
		Application requires privileges not allowed on Suitest lab devices ({result.message.notAllowedPrivileges.join(', ')}).
		Read more in our <link href="https://suite.st/docs/devices/device-lab">docs</link>.
	</fragment>;

/**
 * Type guard to help TypeScript better understand the code
 * @param result
 */
const isSimpleErrorResult = (result: TestLineErrorResult): result is SimpleError =>
	 result.errorType in simpleErrorMap;

/**
 * This function should never be called in production, as long as all known errors
 * have translation.
 * @param result
 */
const unknownErrorMessage = (result: never): Node => {
	console.warn(`Error message not implemented for: ${JSON.stringify(result)}. Make sure you are using the latest version of the @suitest/translate library.`);

	return <text>Unknown error occurred</text>;
};

// TODO: better test coverage
export const translateResultErrorMessage = (result: TestLineErrorResult): Node => {
	if (isSimpleErrorResult(result)) {
		return simpleErrorMap[result.errorType];
	}

	switch (result.errorType) {
		case 'queryFailed':
			if ('message' in result) {
				return translateQueryFailedResults(result);
			}

			return conditionWasNotMetMessage;
		case 'invalidInput':
			return translateInvalidInputError(result);
		case 'syntaxError':
			return translateSyntaxError(result);
		case 'queryTimeout':
			return translateQueryTimeoutError(result);
		case 'deviceError':
			return translateDeviceError(result);
		case 'unsupportedButton':
		case 'illegalButton':
			return translateUnsupportedButtonError(result);
		case 'aborted':
			return translateAbortedError(result);
		case 'invalidVariable':
			return translateInvalidVariableError(result);
		case 'invalidValue':
			return translateInvalidValueError(result);
		case 'invalidResult':
			return translateInvalidResultError(result);
		case 'openAppOverrideFailed':
			return translateOpenAppOverrideFailedError();
		case 'invalidReference':
			return translateInvalidReferenceError(result);
		case 'adbError':
			return translateADBError(result);
		case 'invalidPackage':
			return translateInvalidPackageError(result);
		case 'outdatedLibrary':
		case 'outdatedLibraryConnected':
			return translateOutdatedLibraryError(result);
		case 'invalidRepositoryReference':
			return translateInvalidRepositoryReference(result);
		case 'notAllowedPrivileges':
			return translateNotAllowedPrivileges(result);
		default:
			return unknownErrorMessage(result);
	}
};

const getScreenshotUrl = (screenshotPath?: string): string | undefined => screenshotPath
	? baseScreenshotPath + screenshotPath
	: undefined;

const getInvertedResultMessage = (
	testLine: TestLine | QueryLine,
	lineResult?: TestLineResult
): Node | undefined => {
	if (
		!lineResult // Does not make sense to translate inverted result if there is no result to compare to
		|| (testLine.type !== 'assert' && testLine.type !== 'wait') // Only assert lines can be inverted by definition
		|| !('then' in testLine) // Make the code future-proof, we might drop inverse conditions
		|| testLine.then === 'success' // Not an inverse result
		|| (lineResult.errorType && lineResult.errorType !== 'queryFailed' && lineResult.errorType !== 'appRunning') // failure not related to condition, thus can't be inverted
	) {
		return undefined;
	}

	return lineResult.result === testLine.then ? conditionWasMetMessage : conditionWasNotMetMessage;
};

const getQueryLineError = (line: QueryLine, lineResult: QueryLineError): Node => {
	let text = '';
	if (lineResult.error === 'notExistingElement') {
		text = 'Element was not found in the repository';
	} else if (lineResult.elementExists === false) {
		text = 'Element was not found';
	} else if (lineResult.cookieExists) {
		text = 'Cookie was not found';
	} else if (lineResult.executeThrowException) {
		text = `Execution thrown exception "${lineResult.executeExceptionMessage}}"`;
	} else if (lineResult.errorMessage) {
		text = lineResult.errorMessage;
	} else {
		text = 'Error occurred while ';
		switch (line.subject.type) {
			case 'execute':
				text += 'executing script on device';
				break;
			case 'cookie':
				text += 'retrieving cookie';
				break;
			case 'elementProps':
				text += 'retrieving element';
				break;
			case 'location':
				text += 'retrieving current location';
				break;
		}
	}

	return <text>{text}</text>;
};

const getLineResultMessage = (testLine: TestLine | QueryLine, lineResult?: TestLineResult | QueryLineError): Node | undefined => {
	if ((lineResult as QueryLineError)?.contentType === 'query') {
		return getQueryLineError(testLine as QueryLine, lineResult as QueryLineError);
	}
	const invertedResult = getInvertedResultMessage(testLine, lineResult as TestLineResult);
	if (invertedResult) {
		return invertedResult;
	}

	// Handle case when result is success
	if (!lineResult || lineResult.result === 'success') {
		return undefined;
	}

	if (lineResult.result === 'excluded') {
		return <text>Line was not executed</text>;
	}

	if (lineResult.result === 'aborted') {
		return <text>Execution was aborted.</text>;
	}

	if (testLine.type === 'runSnippet' && !(lineResult as TestLineResult).errorType) {
		// Snippet failed because one of it's children failed
		return undefined;
	}

	return translateResultErrorMessage(lineResult as TestLineErrorResult);
};

export const translateTestLineResult = (options: {
	testLine: TestLine | QueryLine,
	appConfig?: AppConfiguration,
	lineResult?: TestLineResult | QueryLineError,
	elements?: Elements,
	snippets?: Snippets,
}): TestLineResultNode => {
	const {lineResult, testLine} = options;
	const docs = getDocsLink(testLine);

	if (lineResult && 'contentType' in lineResult && lineResult.contentType === 'query') {
		return <test-line-result
			status={'fail'}
			message={getLineResultMessage(options.testLine, lineResult)}
			docs={docs}
		>{translateTestLine(options)}</test-line-result> as TestLineResultNode;
	}

	return <test-line-result
		status={(lineResult as TestLineResult)?.result ?? 'success'}
		message={getLineResultMessage(options.testLine, lineResult)}
		screenshot={getScreenshotUrl((lineResult as TestLineResult)?.screenshot)}
		docs={docs}
	>{translateTestLine(options)}</test-line-result> as TestLineResultNode;
};
