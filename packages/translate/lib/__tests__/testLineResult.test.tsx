import {TestLineResult} from '@suitest/types/lib';
import {translateTestLineResult} from '../testLineResult';

describe('Test line results translation', () => {
	const baseResult = {
		lineId: 'line-id-1',
		timeStarted: 0,
		timeFinished: 1000,
		timeHrDiff: [0, 1000],
		timeScreenshotHr: [0, 0],
	};

	const simpleErrors = [
		'failedStart',
		'appRunning',
		'appNotRunning',
		'missingApp',
		'initPlatformFailed',
		'packageNotFound',
		'missingPackage',
		'internalError',
		'serverError',
		'ILInternalError',
		'invalidCredentials',
		'ActionNotAvailable',
		'conditionNotSatisfied',
		'wrongApp',
		'driverException',
		'noHasLines',
		'appCrashed',
		'timeLimitExceeded',
		'notResponding',
		'suitestifyError',
		'suitestifyRequired',
		'bootstrapPageNotDetected',
		'wrongAppDetected',
		'notExpectedResponse',
		'noConnection',
		'lateManualLaunch',
		'launchExpired',
		'notActiveDeveloperMode',
		'invalidUrl',
		'invalidOpenAppOverrideReference',
		'Success',
		'NoSuchElement',
		'NoSuchFrame',
		'UnknownCommand',
		'StaleElementReference',
		'ElementNotVisible',
		'InvalidElementState',
		'ElementIsNotSelectable',
		'XPathLookupError',
		'Timeout',
		'NoSuchWindow',
		'InvalidCookieDomain',
		'UnableToSetCookie',
		'UnexpectedAlertOpen',
		'NoAlertOpenError',
		'ScriptTimeout',
		'InvalidElementCoordinates',
		'IMENotAvailable',
		'IMEEngineActivationFailed',
		'InvalidSelector',
		'ElementNotInteractable',
		'unknownWebDriverKey',
		'unfocusableElement',
		'unclickableElement',
		'deviceConnectionError',
		'testIsNotStarted',
		'signInRequired',
		'connectionNotAuthorized',
		'higherOSVersionRequired',
		'appleError65',
		'appleError70',
		'appleAppSignError',
		'missingPSSDK',
		'targetManagerBusy',
		'missingDotNet',
		'bootstrapAppNotDetected',
		'activationExpired',
		'missingCpp',
		'outOfMemory',
	];

	// it('should translate success results', () => {
	// 	expect(translateTestLineResult({...baseResult, result: 'success'} as TestLineResult)).toMatchSnapshot();
	// });

	for (const errorType of simpleErrors) {
		it(`should translate "${errorType}" error`, () => {
			expect(translateTestLineResult({
				...baseResult,
				result: 'fail',
				errorType,
			} as TestLineResult)).toMatchSnapshot();
		});
	}
});
