import {LineId} from './testLine';
import {ElementId} from './element';
import {ElementProperty} from './condition';

export type TestLineResultType = 'success' | 'fail' | 'fatal' | 'warning' | 'exit' | 'excluded' | 'aborted';

export type BaseResult = {
	lineId: LineId,
	timeStarted: number,
	timeFinished: number,
	timeHrDiff: [number, number],
	timeScreenshotHr: [number, number],
	screenshot?: string,
	result: TestLineResultType,
	results?: TestLineResult[], // Results for child snippet lines
	actualValue?: string | number, // TODO it probably appears only in query failed errors
	loopResults?: TestLineResult[], // snippet until loops and lines results
};

export type ResultExpression = ResultExpressionItem[];
// TODO investigate that here described all possible cases.
export type ResultExpressionItem = { // Error description for lines like "element matches props"
	result: 'success',
} | {
	result: 'fail',
	errorType: 'invalidInput',
	message: {
		code: 'missingProperty',
	},
} | {
	result: 'fail',
	errorType: 'invalidInput',
	message: {
		code: 'wrongExpression',
		info: ElementProperty,
	},
} | {
	result: 'fail',
	errorType: 'queryFailed',
	message: {
		code: 'missingProperty',
	},
}  | {
	errorType: 'queryFailed',
	actualValue: string | number,
	expectedValue: string | number,
	result: 'fail',
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
		| 'deviceIsBusy'
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
		| 'UnknownError'
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
		| 'JavaScriptError'
		| 'unknownWebDriverKey'
		| 'unfocusableElement'
		| 'unclickableElement'
		| 'deviceConnectionError'
		| 'controllerNotConnected'
		| 'appOnBackgroundError'
		| 'testIsNotStarted'
		| 'signInRequired'
		| 'connectionNotAuthorized'
		| 'higherOSVersionRequired'
		| 'appleError65'
		| 'appleError70'
		| 'appleAppSignError'
		| 'missingPSSDK'
		| 'packageInstallationFailed'
		| 'targetManagerBusy'
		| 'missingDotNet'
		| 'bootstrapAppNotDetected'
		| 'activationExpired'
		| 'missingCpp'
		| 'outOfMemory'
		| 'networkError'
		| 'instrumentationFailed'
		| 'packageCorrupted'
		| 'unknownElementProperty'
		| 'configuratorError'
		| 'appleNetworkLogsError'
		| 'appStoreBuild'
		| 'outdatedLibraryWarning'
		| 'cyclicReference'
		| 'ioError'
		| 'netError'
		| 'sdComponentFailed'
		| 'MoveTargetOutOfBounds'
		| 'ElementClickIntercepted'
		| 'unsupportedOSVersion'
		| 'targetManagerUnsupportedVersion'
		| 'systemOutdated'
		| 'noSpaceLeftOnDevice'
		| 'invalidDeveloperIP'
		| 'instrumentationFailedPrivilege'
		| 'releaseMode'
		| 'unsupportedPatchPackage'
		| 'deviceLabException'
		| 'longPressNotSupported'
		| 'notSupportedApplicationType'
		| 'deepLinkFormatError'
		| 'invalidCertificate'
		| 'authorCertificateMismatch'
		| 'appCertificateExpired'
		| 'misconfiguredDevice'
		| 'invalidSignatureTamper'
		| 'invalidSignaturePartner'
		| 'invalidSignaturePlatform'
		| 'installAppFailure'
		| 'openAppFailure'
		| 'urlOverrideNotSupported'
		| 'devToolsNotSupported'
		| 'deviceNotPaired'
		| 'appNotFound'
		| 'rokuUpdateNeeded'
		| 'vizioAppNotFound'
		| 'osUpdateNeeded'
		| 'catalogueAppMissing',
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

export type InvalidInputError = BaseResult & ({
	errorType: 'invalidInput',
	message?: {
		code: 'lineTypeNotSupported' // Line is not supported by platform
			| 'elementNotSupported' // Command is unsupported by element
			| 'wrongExpression' // Faced when javascript expression subject value is undefined
			| 'wrongDirection', // When line specified with unknown direction
	},
} | {
	errorType: 'invalidInput',
	expression: ResultExpression,
});

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
		code: 'deviceFailure',
		info: {
			reason: 'xpathNotValid',
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

export type QueryFailedNetworkError = {
	errorType: 'queryFailed',
	// TODO for what this needed?
	failingRequestCount: number,
	// TODO clarify
	errors: Array<
		{type: 'noUriFound'}
		| NetworkNotMatchedError
		| NetworkNotFoundError
	>,
};

export type QueryFailedCookieProperties = BaseResult & {
	errorType: 'queryFailed',
	properties: Array<
		| { result: 'success' }
		| {
			result: 'fail',
			errorType: 'queryFailed',
			actualValue: string | number | boolean,
			expectedValue: string | number | boolean,
		}
	>,
};

export type QueryFailedOcrComparators = BaseResult & {
	errorType: 'queryFailed',
	comparators: Array<
		| { result: 'success' }
		| {
			result: 'fail',
			errorType: 'queryFailed',
			actualValue: string,
			expectedValue: string,
		}>,
};

export type NetworkNotMatchedError = {
	actualValue: string | number, // TODO: probably number can be only for status header
	reason: 'notMatched',
} & NetworkErrorItemBase;
export type NetworkNotFoundError = { reason: 'notFound' } & NetworkErrorItemBase;
export type NetworkErrorItemBase = {
	message: 'response',
	type: 'status' | 'body',
} | {
	message: 'request',
	type: 'method' | 'body',
} | {
	message: 'response' | 'request',
	type: 'header',
	name: string,
};

export type QueryFailedWithCode =
	| QueryFailedInvalidUrl
	| QueryFailedDevToolsRequired
	| {
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
	}
	| {
		errorType: 'queryFailed',
		message: {
			code: 'exprException',
			info: {
				exception: string,
			},
		},
	};

export type QueryFailedInvalidUrl = {
	errorType: 'queryFailed',
	message: {
		code: 'invalidUrl',
	},
	actualValue: string,
	expectedValue: string,
};

export type QueryFailedDevToolsRequired = BaseResult & {
	errorType: 'queryFailed',
	message: {
		code: 'devToolsRequired',
		info: {
			exception: string,
		},
	},
};

export type QueryFailedError = BaseResult & (
	| QueryFailedWithCode
	| {
		errorType: 'queryFailed',
		actualValue: string,
		expectedValue: string,
	}
	| {
		errorType: 'queryFailed',
		expression: ResultExpression,
	}
	| QueryFailedNetworkError
	| QueryFailedCookieProperties
	| QueryFailedOcrComparators
);

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

export type InvalidResultError = BaseResult & {
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
	definitionId: string,
};

export type InvalidPackageError = BaseResult & {
	errorType: 'invalidPackage',
	message?: {
		code: 'appleTvSimPackageOnDevice' | 'appleTvDevicePackageOnSim',
	},
};

// TODO: clarify response
export type InvalidReferenceError = BaseResult & {
	errorType: 'invalidReference',
	snippetLineNumber?: unknown,
};

export type ADBError = BaseResult & {
	errorType: 'adbError',
	message?: {
		info: {
			reason: string,
		},
	} | {
		code: 'certificateError',
	} | {
		code: 'installationRestricted',
	},
};

export type NotAllowedPrivilegesError = BaseResult & {
	errorType: 'notAllowedPrivileges',
	message: {
		notAllowedPrivileges: string[],
	},
};

export type QueryLineError = {
	contentType: 'query',
	result?: 'error',
	errorType?: 'deviceError',
	errorMessage?: 'cssSelectorInvalid',
	elementExists?: boolean,
	cookieExists?: boolean,
	executeThrowException?: boolean,
	executeExceptionMessage?: string,
	error?: 'notExistingElement',

};

export type TestLineSuccessResult = BaseResult & {
	result: 'success',
	errorType?: undefined,
};

export type TestLineAbortedResult = BaseResult & {
	result: 'aborted',
	message?: {
		info?: unknown,
	},
	errorType?: undefined,
};


export type TestLineExcludedResult = BaseResult & {
	result: 'excluded',
	errorType?: undefined,
};

export type TestLineErrorResult = Exclude<
	TestLineResult,
	TestLineSuccessResult | TestLineExcludedResult | TestLineAbortedResult
>;

export type TestLineResult = TestLineSuccessResult
	| TestLineExcludedResult
	| TestLineAbortedResult
	| SimpleError
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
	| InvalidResultError
	| InvalidRepositoryReferenceError
	| InvalidReferenceError
	| OpenAppOverrideFailedError
	| InvalidPackageError
	| ADBError
	| NotAllowedPrivilegesError;
