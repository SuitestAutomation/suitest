import {LineId} from './testLine';
import {ElementId} from './element';

export type TestLineResultType = 'success' | 'fail' | 'fatal' | 'warning' | 'exit' | 'excluded';

export type BaseResult = {
	lineId: LineId,
	timeStarted: number,
	timeFinished: number,
	timeHrDiff: [number, number],
	timeScreenshotHr: [number, number],
	result: TestLineResultType,
	results?: TestLineResult[], // Results for child snippet lines
	actualValue?: string | number, // TODO it probably appears only in query failed errors
	expression?: Array<{ // Error description for lines like "element matches props"
		result: 'success',
	} | {
		result: 'failure',
		actualValue?: string | number,
	} | {
		result: 'failure',
		actualValue?: string | number,
		errorType: 'invalidInput',
		message: {
			code: 'wrongExpression' | 'missingProperty',
		},
	}>,
	errors?: Array<{
		reason: 'notMatched',
		message: 'response' | 'request',
		type: 'noUriFound' | 'header' | 'status',
		name?: string,
		actualValue?: string,
	}>,
	loopResults?: TestLineResult[], // snippet until loops and lines results
};

/**
 * Describes a result with simple error type,
 * that does not require extra structure to describe what's wrong
 */
export type SimpleError = BaseResult & {
	errorType: 'failedStart' // Failed Open App or Open URL line
		| 'appRunning' // Assert application is running
		| 'appNotRunning' // Assert application is running then fail
		| 'missingApp' // Application is not installed
		| 'initPlatformFailed' // Failed to bootstrap the platform
		| 'packageNotFound' // Package is not in app config - i.e. happens before test execution
		| 'missingPackage' // Package somehow disappear during test execution
		| 'internalError' // Error on server
		| 'serverError' // Error on server
		| 'ILInternalError' // Error on IL
		| 'invalidCredentials' // to connect ot device in dev mode
		| 'ActionNotAvailable'
		| 'conditionNotSatisfied'
		| 'wrongApp'
		| 'driverException'
		| 'noHasLines'
		| 'appCrashed'
		| 'timeLimitExceeded'
		| 'notResponding' // Device not responding
		| 'suitestifyError'
		| 'suitestifyRequired'
		| 'bootstrapPageNotDetected'
		| 'wrongAppDetected'
		| 'notExpectedResponse'
		| 'noConnection'
		| 'lateManualLaunch'
		| 'launchExpired'
		| 'notActiveDeveloperMode'
		| 'invalidUrl'
		| 'invalidOpenAppOverrideReference'
		| 'Success'
		| 'NoSuchElement'
		| 'NoSuchFrame'
		| 'UnknownCommand'
		| 'StaleElementReference'
		| 'ElementNotVisible'
		| 'InvalidElementState'
		| 'ElementIsNotSelectable'
		| 'XPathLookupError'
		| 'Timeout'
		| 'NoSuchWindow'
		| 'InvalidCookieDomain'
		| 'UnableToSetCookie'
		| 'UnexpectedAlertOpen'
		| 'NoAlertOpenError'
		| 'ScriptTimeout'
		| 'InvalidElementCoordinates'
		| 'IMENotAvailable'
		| 'IMEEngineActivationFailed'
		| 'InvalidSelector'
		| 'ElementNotInteractable'
		| 'unknownWebDriverKey'
		| 'unfocusableElement'
		| 'unclickableElement'
		| 'deviceConnectionError'
		| 'testIsNotStarted'
		| 'signInRequired'
		| 'connectionNotAuthorized'
		| 'higherOSVersionRequired'
		| 'appleError65'
		| 'appleError70'
		| 'appleAppSignError'
		| 'missingPSSDK'
		| 'targetManagerBusy'
		| 'missingDotNet'
		| 'bootstrapAppNotDetected'
		| 'activationExpired'
		| 'missingCpp'
		| 'outOfMemory',
};

export type OutdatedInstrumentationLibraryError = BaseResult & {
	// outdatedLibrary - detected before execution started, i.e. checked directly in package
	// outdatedLibraryConnected - detected after IL is connected to server
	errorType: 'outdatedLibrary' | 'outdatedLibraryConnected',
	message: {
		code: 'minor' | 'major',
	},
};

export type QueryTimeoutError = BaseResult & {
	errorType: 'queryTimeout',
	message?: {
		code: 'missingIlResponse',
		info: {
			timeout: number, // ms
		},
	},
};

export type SyntaxError = BaseResult & {
	errorType: 'syntaxError',
	message?: {
		code: 'WrongDelay' | 'wrongBody' | 'wrongUrl',
	},
};

export type InvalidInputError = BaseResult & {
	errorType: 'invalidInput',
	message?: {
		code: 'lineTypeNotSupported' // Line is not supported by platform
			| 'elementNotSupported', // Command is unsupported by element
	},
};

export type DeviceError = BaseResult & {
	errorType: 'deviceError',
	message: {
		code: 'unsupportedSelector',
		info: {
			reason: 'xpathNotSupported',
		},
	} | {
		code: 'deviceFailure',
		info: {
			reason: 'cssSelectorInvalid',
		},
	} | {
		code: 'videoAdapterInvalidOutput' | 'videoAdapterNotFunction' | 'videoAdapterThrownError',
		info: {
			reason: string, // TODO should be enumerable
		},
	},
};

export type UnsupportedButtonError = BaseResult & {
	errorType: 'unsupportedButton' | 'illegalButton',
	message?: {
		info: {
			buttonIds: string[],
		},
	},
};

export type AbortedError = BaseResult & {
	errorType: 'aborted',
	message?: {
		info: {
			reason: 'manualActionRequired',
		},
	},
};

export type QueryFailedError = BaseResult & {
	errorType: 'queryFailed',
	message: {
		code: 'invalidApp'
			| 'applicationError'
			| 'missingSubject'
			| 'existingSubject'
			| 'orderErr'
			| 'updateAlert'
			| 'wrongExpression'
			| 'notFunction'
			| 'psImplicitVideo',
	},
} | {
	errorType: 'invalidUrl',
	actualValue: string,
	expectedValue: string,
} | {
	errorType: 'exprException',
	message?: {
		info: {
			exception: string,
		},
	},
};

export type InvalidValueError = BaseResult & {
	errorType: 'invalidValue',
	args?: {
		propertyName: string,
	},
};

export type InvalidVariableError = BaseResult & {
	errorType: 'invalidVariable',
	args?: {
		variables: string[],
	},
};

export type InvalidResponseError = BaseResult & {
	errorType: 'invalidResult',
	message?: {
		code: 'resultTooLong',
	},
};

export type InvalidRepositoryReferenceError = BaseResult & {
	errorType: 'invalidRepositoryReference',
	message?: {
		code: 'notExistingPlatform' | 'notExistingElement',
		elementId?: ElementId,
		apiId?: string,
	} | {
		code: 'unknownProperty',
		elementId?: ElementId,
		apiId?: string,
		property: string,
	},
};

export type OpenAppOverrideFailedError = BaseResult & {
	errorType: 'openAppOverrideFailed',
	openAppOverrideFailed: string,
	message: {
		lineId: LineId,
		errorType: string, // TODO - any other error type potentially
		// TODO any other error data potentially
	},
};

export type InvalidPackageError = BaseResult & {
	errorType: 'invalidPackage',
	message?: {
		code: 'appleTvSimPackageOnDevice' | 'appleTvDevicePackageOnSim',
	},
};

export type TestLineResult = SimpleError
	| OutdatedInstrumentationLibraryError
	| QueryTimeoutError
	| SyntaxError
	| InvalidInputError
	| DeviceError
	| UnsupportedButtonError
	| AbortedError
	| QueryFailedError
	| InvalidValueError
	| InvalidVariableError
	| InvalidResponseError
	| InvalidRepositoryReferenceError
	| OpenAppOverrideFailedError
	| InvalidPackageError;
