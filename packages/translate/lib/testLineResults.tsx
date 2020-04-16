/// <reference path="../types/intrinsicElements.d.ts" />
/// <reference path="../types/unistTestLine.d.ts" />
import {jsx} from './jsxFactory';
import {TestLineResult} from '@suitest/types/lib';

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
	notActiveDeveloperMode: 'Failed to launch application. Is "developer mode" turned on?',
	invalidUrl: 'Application could not be launched. Please verify you have provided URL for this configuration.',
	invalidOpenAppOverrideReference: 'Could not start execution, please check open app override setting. https://suite.st/docs/application/more-configuration-options/#open-app-override-test',
	Success: 'Command executed successfully.',
	NoSuchElement: 'Element was not found.', // TODO params
	NoSuchFrame: 'Cannot switch to frame', // TODO params
	UnknownCommand: 'The requested resource could not be found, or a request was received using an HTTP method that is not supported by the mapped resource.',  // TODO params
	StaleElementReference: 'Element ${0} is no longer inside DOM.', // TODO params
	ElementNotVisible: 'Element ${0} is not currently visible.', // TODO params
	InvalidElementState: 'Cannot perform operation with element ${0} because this element is in an invalid state (e.g. attempting to click a disabled element).', // TODO params
	ElementIsNotSelectable: 'Element ${0} is not selectable.', // TODO params
	XPathLookupError: '',
	Timeout: '',
	NoSuchWindow: '',
	InvalidCookieDomain: '',
	UnableToSetCookie: '',
	UnexpectedAlertOpen: '',
	NoAlertOpenError: '',
	ScriptTimeout: '',
	InvalidElementCoordinates: '',
	IMENotAvailable: '',
	IMEEngineActivationFailed: '',
	InvalidSelector: '',
	ElementNotInteractable: '',
	unknownWebDriverKey: '',
	unfocusableElement: '',
	unclickableElement: '',
	deviceConnectionError: '',
	testIsNotStarted: '',
	signInRequired: '',
	connectionNotAuthorized: '',
	higherOSVersionRequired: '',
	appleError65: '',
	appleError70: '',
	appleAppSignError: '',
	missingPSSDK: '',
	targetManagerBusy: '',
	missingDotNet: '',
	bootstrapAppNotDetected: '',
	activationExpired: '',
	missingCpp: '',
	outOfMemory: '',
};

export const translateTestLineResult = (result: TestLineResult): Node => {
	debugger;

	if (result.errorType in simpleErrorMap) {
		return <alert level="error">{simpleErrorMap[result.errorType]}</alert>;
	}

	return <text>TEST</text>;
};
