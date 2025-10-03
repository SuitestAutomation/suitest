import {
	SimpleError,
	TestLineSuccessResult,
	TestLineResult,
	TestLineErrorResult,
	PSVideoHadNoErrorCondition,
	TestLine,
	QueryLineError,
	ElementQueryLine,
	CookieQueryLine,
	JsExpressionQueryLine,
	QueryLine,
	BaseResult,
	CookieProperty,
	OcrComparator,
} from '@suitest/types/lib';
import {translateResultErrorMessage, translateTestLineResult} from '../testLineResult';
import {appConfig, conditions, elements, testLinesExamples} from './testLinesExamples';
import {toText} from '@suitest/smst-to-text';

describe('Test line results translation', () => {
	const baseResult: Omit<BaseResult, 'result'> = {
		lineId: 'line-id-1',
		timeStarted: 0,
		timeFinished: 1000,
		timeHrDiff: [0, 1000],
		timeScreenshotHr: [0, 0],
	};

	const simpleErrors: Array<SimpleError['errorType']> = [
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
		'controllerNotConnected',
		'appOnBackgroundError',
		'testIsNotStarted',
		'signInRequired',
		'connectionNotAuthorized',
		'higherOSVersionRequired',
		'appleError65',
		'appleError70',
		'appleAppSignError',
		'missingPSSDK',
		'packageInstallationFailed',
		'targetManagerBusy',
		'missingDotNet',
		'bootstrapAppNotDetected',
		'activationExpired',
		'missingCpp',
		'outOfMemory',
		'networkError',
		'instrumentationFailed',
		'packageCorrupted',
		'unknownElementProperty',
		'configuratorError',
		'appleNetworkLogsError',
		'appStoreBuild',
		'outdatedLibraryWarning',
		'cyclicReference',
		'ioError',
		'netError',
		'sdComponentFailed',
		'MoveTargetOutOfBounds',
		'ElementClickIntercepted',
		'unsupportedOSVersion',
		'targetManagerUnsupportedVersion',
		'systemOutdated',
		'noSpaceLeftOnDevice',
		'invalidDeveloperIP',
		'instrumentationFailedPrivilege',
		'releaseMode',
		'unsupportedPatchPackage',
		'deviceLabException',
		'longPressNotSupported',
		'notSupportedApplicationType',
		'deepLinkFormatError',
		'invalidCertificate',
		'authorCertificateMismatch',
		'appCertificateExpired',
		'misconfiguredDevice',
		'invalidSignatureTamper',
		'invalidSignaturePartner',
		'invalidSignaturePlatform',
		'installAppFailure',
		'openAppFailure',
		'urlOverrideNotSupported',
		'devToolsNotSupported',
		'devToolsNotSupportedVidaa',
		'devToolsNotSupportedXbox',
		'deviceNotPaired',
		'appNotFound',
		'rokuUpdateNeeded',
		'vizioAppNotFound',
		'osUpdateNeeded',
		'catalogueAppMissing',
		'pairingLost',
		'keyServerOffline',
		'notSupportedPlatform',
		'screenshotWasNotTaken',
		'invalidRokuCredentials',
		'notExistingRegion',
		'contextNotFound',
	];

	describe('simple errors translations', () => {
		for (const errorType of simpleErrors) {
			it(`should translate "${errorType}" error`, () => {
				expect(translateResultErrorMessage({
					...baseResult,
					result: 'fail',
					errorType,
				} as TestLineErrorResult)).toMatchSnapshot();
			});
		}
	});

	it('translate notAllowedPrivileges error', () => {
		expect(translateResultErrorMessage({
			...baseResult,
			result: 'fatal',
			errorType: 'notAllowedPrivileges',
			message: {
				notAllowedPrivileges: ['https://some.com', 'https://some2.com'],
			},
		})).toMatchSnapshot();
	});

	describe('Translate query lines', () => {
		const testLineToFormattedText = (...args: Parameters<typeof translateTestLineResult>): string =>
			toText(translateTestLineResult(...args), {verbosity: 'normal', format: false});
		const extendQueryLineSubject = (subject: QueryLine['subject']): QueryLine => ({
			type: 'query',
			subject,
		} as QueryLine);
		expect(testLineToFormattedText({
			testLine: extendQueryLineSubject({type: 'elementProps', selector: {css: 'div'}}) as ElementQueryLine,
			lineResult: {
				contentType: 'query',
				elementExists: false,
			} as QueryLineError,
		})).toMatchSnapshot();
		expect(testLineToFormattedText({
			testLine: extendQueryLineSubject({type: 'elementProps', selector: {css: 'div'}}) as ElementQueryLine,
			lineResult: {
				contentType: 'query',
				errorType: 'deviceError',
				errorMessage: 'cssSelectorInvalid',
			} as QueryLineError,
		})).toMatchSnapshot();
		expect(testLineToFormattedText({
			testLine: extendQueryLineSubject({type: 'cookie', cookieName: 'cook'}) as CookieQueryLine,
			lineResult: {
				contentType: 'query',
				cookieExists: false,
			} as QueryLineError,
		})).toMatchSnapshot();
		expect(testLineToFormattedText({
			testLine: extendQueryLineSubject({type: 'execute', execute: 'a + 1'}) as JsExpressionQueryLine,
			lineResult: {
				contentType: 'query',
				executeThrowException: true,
				executeExceptionMessage: '"a" is not defined',
			} as QueryLineError,
		})).toMatchSnapshot();
	});
	const extendBaseError = (err: any): TestLineResult => ({
		result: 'fail',
		lineId: 'a625a00e-50b8-4a4c-a24f-b7e206e72199',
		timeStarted: 1587127670927,
		timeFinished: 1587127670981,
		timeHrDiff: [
			0,
			53647599,
		],
		timeScreenshotHr: [
			0,
			0,
		],
		...err,
	});

	describe('Translate assert lines', () => {
		const assertLine = testLinesExamples['Assert ... then continue'];
		const testLineToPlainText = (...args: Parameters<typeof translateTestLineResult>): string =>
			toText(translateTestLineResult(...args), {verbosity: 'normal', format: false});
		const testLineToVerbosePlainText = (...args: Parameters<typeof translateTestLineResult>): string =>
			toText(translateTestLineResult(...args), {format: false, verbosity: 'verbose'});
		const testLineToQuietPlainText = (...args: Parameters<typeof translateTestLineResult>): string =>
			toText(translateTestLineResult(...args), {format: false, verbosity: 'quiet'});
		const successLineResult: TestLineSuccessResult = {
			result: 'success',
			lineId: 'a625a00e-50b8-4a4c-a24f-b7e206e72199',
			timeStarted: 1587127670927,
			timeFinished: 1587127670981,
			timeHrDiff: [
				0,
				53647599,
			],
			timeScreenshotHr: [
				0,
				0,
			],
		};

		describe('translate "openAppOverrideFailed"', () => {
			const openAppCommand = testLinesExamples['Open app at homepage']();

			it('render with lineId', () => {
				expect(testLineToPlainText({
					testLine: openAppCommand,
					appConfig,
					lineResult: extendBaseError({
						errorType: 'openAppOverrideFailed',
						message: {
							errorType: 'queryFailed',
							lineId: 'line-id-1',
						},
					}),
				})).toMatchSnapshot();
			});

			it('render with addition errorType', () => {
				expect(testLineToPlainText({
					testLine: openAppCommand,
					appConfig,
					lineResult: extendBaseError({
						errorType: 'openAppOverrideFailed',
						message: {
							errorType: 'queryFailed',
						},
					}),
				})).toMatchSnapshot();
				expect(testLineToPlainText({
					testLine: openAppCommand,
					appConfig,
					lineResult: extendBaseError({
						errorType: 'openAppOverrideFailed',
						message: {
							errorType: 'invalidInput',
							message: {
								code: 'lineTypeNotSupported',
							},
						},
					}),
				})).toMatchSnapshot();

				expect(testLineToVerbosePlainText({
					testLine: openAppCommand,
					appConfig,
					lineResult: extendBaseError({
						errorType: 'openAppOverrideFailed',
						message: {
							errorType: 'invalidInput',
							message: {
								code: 'lineTypeNotSupported',
							},
						},
					}),
				})).toMatchSnapshot();

				expect(testLineToQuietPlainText({
					testLine: openAppCommand,
					appConfig,
					lineResult: extendBaseError({
						errorType: 'openAppOverrideFailed',
						message: {
							errorType: 'invalidInput',
							message: {
								code: 'lineTypeNotSupported',
							},
						},
					}),
				})).toMatchSnapshot();
			});

			it('render without appConfig', () => {
				expect(testLineToPlainText({
					testLine: openAppCommand,
					lineResult: extendBaseError({
						errorType: 'openAppOverrideFailed',
						message: {
							errorType: 'queryFailed',
							lineId: 'line-id-1',
						},
					}),
				})).toMatchSnapshot();
			});
		});

		describe('translate "assert current location"', () => {
			const assertLocation = assertLine(conditions['current location']('~', 'http://some.url'));

			it('without result', () => {
				expect(testLineToPlainText({
					testLine: assertLocation,
					appConfig,
				})).toMatchSnapshot();
			});

			it('without appConfig', () => {
				expect(testLineToPlainText({ testLine: assertLocation })).toMatchSnapshot();
			});

			it('with success result', () => {
				expect(testLineToPlainText({
					testLine: assertLocation,
					appConfig,
					lineResult: successLineResult,
				})).toMatchSnapshot();

				expect(testLineToVerbosePlainText({
					testLine: assertLocation,
					appConfig,
					lineResult: successLineResult,
				})).toMatchSnapshot();

				expect(testLineToQuietPlainText({
					testLine: assertLocation,
					appConfig,
					lineResult: successLineResult,
				})).toMatchSnapshot();
			});

			it('errorType: "queryFailed", location value not matched', () => {
				const line = {
					testLine: assertLocation,
					appConfig,
					lineResult: extendBaseError({
						errorType: 'queryFailed',
						actualValue: 'http://file.suite.st/sampleapp_staging/index-hbbtv.html',
						expectedValue: 'http://some.url',
					}),
				};
				expect(testLineToPlainText(line)).toMatchSnapshot();
				expect(testLineToVerbosePlainText(line)).toMatchSnapshot();
				expect(testLineToQuietPlainText(line)).toMatchSnapshot();
			});

			it('errorType: "queryFailed" matchjs failed', () => {
				expect(testLineToPlainText({
					testLine: assertLine(conditions['current location']('matches',
						`function somePredicate(location) {
return false;
}`
					)),
					appConfig,
					lineResult: extendBaseError({
						errorType: 'queryFailed',
						actualValue: false,
					}),
				})).toMatchSnapshot();
				// display javascript exception
				const line = {
					testLine: assertLine(conditions['current location']('matches', 'something')),
					appConfig,
					lineResult: extendBaseError({
						errorType: 'queryFailed',
						message: {
							code: 'exprException',
							info: {
								exception: 'something is not defined',
							},
						},
					}),
				};
				expect(testLineToPlainText(line)).toMatchSnapshot();
				expect(testLineToVerbosePlainText(line)).toMatchSnapshot();
				expect(testLineToQuietPlainText(line)).toMatchSnapshot();
			});

			it('errorType: "queryFailed" with message.code', () => {
				expect(testLineToPlainText({
					testLine: assertLocation,
					appConfig,
					lineResult: extendBaseError({
						errorType: 'queryFailed',
						message: {
							code: 'invalidApp',
						},
					}),
				})).toMatchSnapshot();
			});
		});
		// ---- end of "translate "assert current location"" ----

		describe('translate "assert cookie"', () => {
			const assertCookie = assertLine(conditions.cookie('suitest-cookie', '=', 'suitest'));

			it('without result', () => {
				// display plain assert cookie line
				expect(testLineToPlainText({
					testLine: assertCookie,
					appConfig,
				})).toMatchSnapshot();
			});

			it('without appConfig', () => {
				expect(testLineToPlainText({ testLine: assertCookie })).toMatchSnapshot();
			});

			it('missingSubject error', () => {
				// display cookie line with missing subject error (when cookie does not exists)
				expect(testLineToPlainText({
					testLine: assertCookie,
					appConfig,
					lineResult: extendBaseError({
						errorType: 'queryFailed',
						message: {
							code: 'missingSubject',
						},
					}),
				})).toMatchSnapshot();
			});

			it('existingSubject error', () => {
				// message for: check that cookie not exist
				expect(testLineToPlainText({
					testLine: assertLine(conditions.cookie('cookie-name', '!exists')),
					appConfig,
					lineResult: extendBaseError({
						errorType: 'queryFailed',
						message: {
							code: 'existingSubject',
						},
					}),
				})).toMatchSnapshot();
			});

			it('queryFailed (cookie value not matched) error', () => {
				// cookie value not matched error
				const line = {
					testLine: assertCookie,
					appConfig,
					lineResult: extendBaseError({
						errorType: 'queryFailed',
						actualValue: 'some cookie value',
						expectedValue: 'suitest',
					}),
				};
				expect(testLineToPlainText(line)).toMatchSnapshot();
				expect(testLineToQuietPlainText(line)).toMatchSnapshot();
				expect(testLineToVerbosePlainText(line)).toMatchSnapshot();
			});

			it('queryFailed match js failed', () => {
				// match js query fail
				expect(testLineToPlainText({
					testLine: assertLine(conditions.cookie('suitest-cookie', 'matches',
						`function somePredicate(val) {
return false;
}`
					)),
					appConfig,
					lineResult: extendBaseError({
						errorType: 'queryFailed',
						actualValue: false,
					}),
				})).toMatchSnapshot();
			});

			it('exprException error', () => {
				// translate JS runtime error
				expect(testLineToPlainText({
					testLine: assertLine(conditions.cookie('cookieName', 'matches', 'cookieValue')),
					appConfig,
					lineResult: extendBaseError({
						errorType: 'queryFailed',
						message: {
							code: 'exprException',
							info: {
								exception: 'cookieValue is not defined',
							},
						},
					}),
				})).toMatchSnapshot();
			});

			it('withProperties error', () => {
				const cookieProperties: CookieProperty[] = [
					{
						property: 'value',
						val: 'I am cookie',
						type: '=',
					},
					{
						property: 'path',
						val: '/value',
						type: '=',
					},
					{
						property: 'domain',
						val: 'domain',
						type: '=',
					},
					{
						property: 'httpOnly',
						val: true,
						type: '=',
					},
					{
						property: 'secure',
						val: true,
						type: '=',
					},
				];

				expect(testLineToPlainText({
					testLine: assertLine(conditions['cookie with properties'](cookieProperties)),
					appConfig,
					lineResult: extendBaseError({
						errorType: 'queryFailed',
						properties: [
							{
								result: 'success',
							},
							{
								result: 'fail',
								errorType: 'queryFailed',
								actualValue: '/drive2',
								expectedValue: '/value',
							},
							{
								result: 'fail',
								errorType: 'queryFailed',
								actualValue: 'watchme-dev.suite.st',
								expectedValue: 'domain',
							},
							{
								result: 'fail',
								errorType: 'queryFailed',
								actualValue: false,
								expectedValue: true,
							},
							{
								result: 'fail',
								errorType: 'queryFailed',
								actualValue: false,
								expectedValue: true,
							},
						],
					}),
				})).toMatchSnapshot();

				expect(testLineToPlainText({
					testLine: assertLine(conditions['cookie with properties'](cookieProperties)),
					appConfig,
					lineResult: successLineResult,
				})).toMatchSnapshot();
			});
		});
		// ---- end of "translate "assert cookie"" ----

		describe('translate "assert element"', () => {
			describe('without error', () => {
				it('"element ... exist"', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element ... exist']()),
						appConfig,
						elements,
					})).toMatchSnapshot();
				});

				it('"element ... does not exist"', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element ... does not exist']()),
						appConfig,
						elements,
					})).toMatchSnapshot();
					expect(testLineToVerbosePlainText({
						testLine: assertLine(conditions['element ... does not exist']()),
						appConfig,
						elements,
					})).toMatchSnapshot();
					expect(testLineToQuietPlainText({
						testLine: assertLine(conditions['element ... does not exist']()),
						appConfig,
						elements,
					})).toMatchSnapshot();
				});

				it('"element matches JS"', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element matches JS']()),
						appConfig,
						elements,
					})).toMatchSnapshot();
				});

				it('"element matches JS with vars"', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element matches JS with vars']()),
						appConfig,
						elements,
					})).toMatchSnapshot();
				});

				it('"element ... is visible"', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element ... is visible']()),
						appConfig,
						elements,
					})).toMatchSnapshot();
				});

				it('"element ... is not visible"', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element ... is not visible']()),
						appConfig,
						elements,
					})).toMatchSnapshot();
				});

				it('"element properties"', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element properties']()),
						appConfig,
						elements,
					})).toMatchSnapshot();
				});
			});

			it('without appConfig', () => {
				expect(testLineToPlainText({
					testLine: assertLine(conditions['element ... exist']()),
					elements,
				})).toMatchSnapshot();
			});

			// translate for invalidRepositoryReference family errors
			describe('invalidRepositoryReference results', () => {
				it('general error', () => {
					// display invalidRepositoryReference general error
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element ... exist']('some-id')),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'invalidRepositoryReference',
						}),
					})).toMatchSnapshot();
				});

				it('notExistingElement message code', () => {
					// display notExistingElement error
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element properties']([
							{ property: 'backgroundColor', type: '=', val: 'rgba(0, 0, 0, 0)' },
						])),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'invalidRepositoryReference',
							message: {
								code: 'notExistingElement',
								elementId: 'some-id',
							},
						}),
					})).toMatchSnapshot();
				});

				it('notExistingPlatform message code', () => {
					// display notExistingPlatform error
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element properties']([
							{ property: 'backgroundColor', type: '=', val: 'rgba(0, 0, 0, 0)' },
						])),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'invalidRepositoryReference',
							message: {
								code: 'notExistingPlatform',
								elementId: 'element-id-1',
							},
						}),
					})).toMatchSnapshot();
				});

				it('notExistingImage message code', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['assert image by id on screen']()),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'invalidRepositoryReference',
							message: {
								code: 'notExistingImage',
								elementId: 'element-id-1',
							},
						}),
					})).toMatchSnapshot();
				});
			});

			describe('queryFailed results', () => {
				it('missingSubject', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element ... exist']()),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'queryFailed',
							message: {
								code: 'missingSubject',
							},
						}),
					})).toMatchSnapshot();
				});

				it('missingSubject with details', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element properties']([
							{ property: 'backgroundColor', type: '=', val: 'rgba(0, 0, 0, 0)' },
						])),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'queryFailed',
							message: {
								code: 'missingSubject',
							},
						}),
					})).toMatchSnapshot();
				});

				it('existingSubject', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element ... does not exist']()),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'queryFailed',
							message: {
								code: 'existingSubject',
							},
						}),
					})).toMatchSnapshot();
				});

				it('element visible fail', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element ... is visible']()),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'queryFailed',
						}),
					})).toMatchSnapshot();
				});

				it('element not visible fail', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element ... is not visible']()),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'queryFailed',
						}),
					})).toMatchSnapshot();
				});

				it('match js fail', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element matches JS']()),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'queryFailed',
							actualValue: false,
						}),
					})).toMatchSnapshot();
				});

				it('handle error because of js error for match js', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element matches JS'](
							`function(((testSubject) {
console.log(testSubject);
return true;
}`
						)),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'queryFailed',
							message: {
								code: 'exprException',
								info: {
									exception: 'Unexpected token \'(\'',
								},
							},
						}),
					})).toMatchSnapshot();
				});

				it('expression error', () => {
					// for queryFailed
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element properties']([
							{ property: 'backgroundColor', type: '=', val: 'rgba(0, 0, 0, 0)' },
							{ property: 'borderColor', type: '=', val: 'rgb(255, 255, 255)' },
							{ property: 'borderStyle', type: '=', val: 'none' },
							{ property: 'borderWidth', type: '=', val: '0px' },
							{
								property: 'class',
								type: '=',
								val: 'componentcontainer container widget',
							},
							{ property: 'height', type: '=', val: 720 },
							{ property: 'href', type: '=', val: '' },
							{ property: 'id', type: '=', val: 'maincontainer' },
							{ property: 'image', type: '=', val: '' },
							{ property: 'left', type: '=', val: 0 },
							{ property: 'opacity', type: '=', val: '1' },
							{ property: 'color', type: '=', val: 'rgba(255, 255, 255, 1)' },
							{ property: 'text', type: '=', val: 'Some short text' }, // TODO: return value to empty string
							{ property: 'top', type: '=', val: 0 },
							{ property: 'width', type: '=', val: 1280 },
							{ property: 'zIndex', type: '<', val: 0 },
							{ property: 'visibility', type: '=', val: 'invisible' },
						])),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'queryFailed',
							expression: [
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{
									result: 'fail',
									errorType: 'queryFailed',
									actualValue: 'active componentcontainer container widget',
									expectedValue: 'componentcontainer container widget',
								},
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{
									result: 'fail',
									errorType: 'queryFailed',
									actualValue: 'WatchMe New Pictures Videos Music More All Files Candies Cherries strawberry-cake Big Buck Bunny (trailer).mp4 boiled-sweets.jpg cakes_tarts_desserts_sweets_berries_strawberries_blackberries_blueberries_currants_75280_1400x1050.jpg DSC_0159.JPG 7 Images 1 folder folder Cherries strawberry-cake boiled-sweets.jpg cakes_tarts_desserts_sweets_berries_strawberries_blackberries_blueberries_currants_75280_1400x1050.jpg DSC_0159.JPG 0 Music 6 Videos SINTEL.mp4 Big Buck Bunny (trailer).mp4',
									expectedValue: '',
								},
								{ result: 'success' },
								{ result: 'success' },
								{
									result: 'fail',
									errorType: 'queryFailed',
									actualValue: 0,
									expectedValue: 0,
								},
								{
									result: 'fail',
									errorType: 'queryFailed',
									message: { code: 'missingProperty', info: {} },
								},
							],
						}),
					})).toMatchSnapshot();

					// for invalidInput
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element properties']([
							{ property: 'backgroundColor', type: '=', val: 'rgba(0, 0, 0, 0)' },
							{ property: 'borderColor', type: '=', inherited: true },
							{ property: 'borderStyle', type: '=', val: 'none' },
							{ property: 'borderWidth', type: '=', val: '0px' },
							{ property: 'class', type: '=', val: 'componentcontainer container widget' },
							{ property: 'height', type: '=', val: 720 },
							{ property: 'href', type: '=', val: '' },
							{ property: 'id', type: '=', val: 'maincontainer' },
							{ property: 'image', type: '=', val: '' },
							{ property: 'left', type: '=', val: 0 },
							{ property: 'opacity', type: '=', val: '1' },
							{ property: 'color', type: '=', val: 'rgba(255, 255, 255, 1)' },
							{ property: 'text', type: '=', val: '' },
							{ property: 'top', type: '=', val: 0 },
							{ property: 'width', type: '=', val: 1280 },
							{ property: 'zIndex', type: '<', val: 0 },
							{ property: 'visibility', type: '=', val: 'invisible' },
							{ property: 'zIndex', type: '~', val: 0 },
							{ property: 'color', type: '=', val: 'rgba(255, dddd, 255, 1)' },
						])),
						appConfig,
						elements,
						lineResult: extendBaseError({
							errorType: 'invalidInput',
							expression: [
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{
									result: 'fail',
									errorType: 'queryFailed',
									actualValue: 'active componentcontainer container widget',
									expectedValue: 'componentcontainer container widget',
								},
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{ result: 'success' },
								{
									result: 'fail',
									errorType: 'queryFailed',
									actualValue: 'WatchMe New Pictures Videos Music More All Files Candies Cherries strawberry-cake Big Buck Bunny (trailer).mp4 boiled-sweets.jpg cakes_tarts_desserts_sweets_berries_strawberries_blackberries_blueberries_currants_75280_1400x1050.jpg DSC_0159.JPG 7 Images 1 folder folder Cherries strawberry-cake boiled-sweets.jpg cakes_tarts_desserts_sweets_berries_strawberries_blackberries_blueberries_currants_75280_1400x1050.jpg DSC_0159.JPG 0 Music 6 Videos SINTEL.mp4 Big Buck Bunny (trailer).mp4',
									expectedValue: '',
								},
								{ result: 'success' },
								{ result: 'success' },
								{
									result: 'fail',
									errorType: 'queryFailed',
									actualValue: 0,
									expectedValue: 0,
								},
								{
									result: 'fail',
									errorType: 'queryFailed',
									message: {
										code: 'missingProperty',
										info: {},
									},
								},
								{
									result: 'fail',
									errorType: 'invalidInput',
									message: {
										code: 'wrongExpression',
										info: {
											property: 'zIndex',
											type: '~',
											val: 0,
										},
									},
								},
								{
									result: 'fail',
									errorType: 'invalidInput',
									message: {
										code: 'wrongExpression',
										info: {
											property: 'color',
											type: '=',
											val: 'rgba(255, dddd, 255, 1)',
										},
									},
								},
							],
						}),
					})).toMatchSnapshot();
				});
			});
		});
		// ---- end of "translate "assert element"" ----

		describe('translate "assert ps video"', () => {
			const psVideoHadNoError = (searchStrategy?: PSVideoHadNoErrorCondition['searchStrategy']): TestLine =>
				assertLine(conditions['ps video had not error'](searchStrategy));

			it('render without result', () => {
				expect(testLineToPlainText({
					testLine: psVideoHadNoError(),
					appConfig,
				})).toMatchSnapshot();
				expect(testLineToPlainText({
					testLine: psVideoHadNoError('all'),
					appConfig,
				})).toMatchSnapshot();
			});

			it('render without appConfig', () => {
				expect(testLineToPlainText({ testLine: psVideoHadNoError() })).toMatchSnapshot();
			});

			it('render with fail result', () => {
				expect(testLineToPlainText({
					testLine: psVideoHadNoError('all'),
					appConfig,
					lineResult: extendBaseError({
						errorType: 'missingPSSDK',
					}),
				})).toMatchSnapshot();
			});
		});
		// ---- end of "translate "assert ps video"" ----

		describe('translate "assert javascript expression"', () => {
			it('render without result', () => {
				expect(testLineToPlainText({
					testLine: assertLine(conditions['JavaScript expression ... equals ...']()),
					appConfig,
				})).toMatchSnapshot();
				expect(testLineToPlainText({
					testLine: assertLine(conditions['JavaScript expression with variables ... equals ...']()),
					appConfig,
				})).toMatchSnapshot();
			});

			it('render without appConfig', () => {
				expect(testLineToPlainText({
					testLine: assertLine(conditions['JavaScript expression ... equals ...']()),
				})).toMatchSnapshot();
			});

			it('render error when javascript expression missed', () => {
				// value for compare not specified
				expect(testLineToPlainText({
					testLine: assertLine({
						subject: {
							type: 'javascript',
						},
						type: '=',
					}),
					appConfig,
					lineResult: extendBaseError({
						errorType: 'ILInternalError',
						result: 'fatal',
					}),
				})).toMatchSnapshot();
				// value for compare specified
				expect(testLineToPlainText({
					testLine: assertLine({
						subject: {
							type: 'javascript',
						},
						type: '=',
						val: '1',
					}),
					appConfig,
					lineResult: extendBaseError({
						errorType: 'ILInternalError',
						result: 'fatal',
					}),
				})).toMatchSnapshot();
			});

			it('render error when js expression specified but comparing value is empty', () => {
				expect(testLineToPlainText({
					testLine: assertLine({
						subject: {
							type: 'javascript',
							val: '1',
						},
						type: '=',
					}),
					appConfig,
					lineResult: extendBaseError({
						errorType: 'invalidInput',
						message: {
							code: 'wrongExpression',
						},
					}),
				})).toMatchSnapshot();
			});

			describe('errorType: "queryFailed"', () => {
				const jsExpression = (...args: Parameters<typeof conditions['JavaScript expression ... equals ...']>): TestLine =>
					assertLine(conditions['JavaScript expression ... equals ...'](...args));

				it('expression matching failed', () => {
					const line = {
						testLine: jsExpression('1 + 1', '3'),
						appConfig,
						lineResult: extendBaseError({
							errorType: 'queryFailed',
							expectedValue: '3',
							actualValue: '2',
						}),
					};
					expect(testLineToPlainText(line)).toMatchSnapshot();
					expect(testLineToQuietPlainText(line)).toMatchSnapshot();
					expect(testLineToVerbosePlainText(line)).toMatchSnapshot();

					expect(testLineToPlainText({
						// expected that '12' not contains in evaluation result
						testLine: jsExpression('120 + 3', '12', '!~'),
						appConfig,
						lineResult: extendBaseError({
							errorType: 'queryFailed',
							expectedValue: '12',
							actualValue: '123',
						}),
					})).toMatchSnapshot();
				});

				it('handle javascript exception', () => {
					expect(testLineToPlainText({
						testLine: jsExpression('function test() { return 123', '123'),
						appConfig,
						lineResult: extendBaseError({
							errorType: 'queryFailed',
							message: {
								code: 'exprException',
								info: {
									exception: 'Unexpected end of input',
								},
							},
						}),
					})).toMatchSnapshot();
				});
			});
		});
		// ---- end of "translate "assert javascript expression"" ----

		describe('translate "assert application has exited"', () => {
			it('render without result', () => {
				expect(testLineToPlainText({
					testLine: assertLine(conditions['application has exited']()),
					appConfig,
				})).toMatchSnapshot();
			});

			it('render without appConfig', () => {
				expect(testLineToPlainText({
					testLine: assertLine(conditions['application has exited']()),
				})).toMatchSnapshot();
			});

			it('render with fail result', () => {
				expect(testLineToPlainText({
					testLine: assertLine(conditions['application has exited']()),
					appConfig,
					lineResult: extendBaseError({
						errorType: 'appRunning',
					}),
				})).toMatchSnapshot();
			});
		});
		// ---- end of "translate "assert application has exited""

		describe('translate "assert network"', () => {
			it('render without result', () => {
				expect(testLineToPlainText({
					testLine: assertLine(conditions['network request to URL was made including matched']()),
					appConfig,
				})).toMatchSnapshot();
				expect(testLineToPlainText({
					testLine: assertLine(conditions['network request matching URL was not made excluding previously matched']()),
					appConfig,
				})).toMatchSnapshot();
			});

			it('render without appConfig', () => {
				expect(testLineToPlainText({
					testLine: assertLine(conditions['network request to URL was made including matched']()),
				})).toMatchSnapshot();
			});

			describe('render fail results', () => {
				it('url not matched', () => {
					const lineResult = extendBaseError({
						errorType: 'queryFailed',
						errors: [ { type: 'noUriFound' } ],
						failingRequestCount: 0,
					});

					expect(testLineToPlainText({
						testLine: assertLine(conditions['network request to URL was made including matched']()),
						appConfig,
						lineResult,
					})).toMatchSnapshot();

					expect(testLineToPlainText({
						testLine: assertLine(
							conditions['network request matching URL was not made excluding previously matched']()
						),
						appConfig,
						lineResult,
					})).toMatchSnapshot();
				});

				it('request/response headers not matched', () => {
					expect(testLineToPlainText({
						testLine: assertLine({
							subject: {
								type: 'network',
								compare: '=',
								val: 'http://suite.st/<%var1%>',
								requestInfo: [
									{ name: '@body', val: 'asdfs', compare: '=' },
									{ name: '@method', val: 'GET', compare: '!=' },
									{
										name: 'Accept',
										val: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
										compare: '=',
									},
									{ name: 'Accept-Language', val: 'en-US,en;q=0.9', compare: '=' },
									{ name: 'Content-Length', val: '0', compare: '=' },
									{ name: 'Host', val: 'file.suite.st', compare: '=' },
									{ name: 'If-Modified-Since', val: 'Fri, 25 Jan 2019 16:33:31 GMT', compare: '=' },
									{ name: 'If-None-Match', val: 'W/"5c4b3a5b-19e2"', compare: '=' },
									{ name: 'Upgrade-Insecure-Requests', val: '1', compare: '=' },
									{
										name: 'User-Agent',
										val: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36',
										compare: '=',
									},
									{ name: 'Via', val: '1.1 suitestify', compare: '=' },
								],
								responseInfo: [
									{ name: '@body', val: 'asdfasdddddd', compare: '=' },
									{ name: '@status', val: 303, compare: '=' },
									{ name: 'Cache-Control', val: 'max-age=300', compare: '=' },
									{ name: 'Connection', val: 'keep-alive', compare: '=' },
									{ name: 'Date', val: 'Mon, 27 Apr 2020 13:08:59 GMT', compare: '=' },
									{ name: 'Etag', val: '"5c4b3a5b-19e2"', compare: '=' },
									{ name: 'Expires', val: 'Mon, 27 Apr 2020 13:13:59 GMT', compare: '=' },
									{ name: 'Last-Modified', val: 'Fri, 25 Jan 2019 16:33:31 GMT', compare: '=' },
									{ name: 'Server', val: 'nginx', compare: '=' },
								],
							},
							type: 'made',
							searchStrategy: 'all',

						}),
						appConfig,
						lineResult: extendBaseError({
							errorType: 'queryFailed',
							failingRequestCount: 1,
							errors: [
								{
									message: 'request',
									type: 'body',
									reason: 'notMatched',
									actualValue: '',
								},
								{
									message: 'request',
									type: 'method',
									reason: 'notMatched',
									actualValue: 'GET',
								},
								{
									message: 'request',
									type: 'header',
									reason: 'notFound',
									name: 'If-Modified-Since',
								},
								{
									message: 'request',
									type: 'header',
									reason: 'notFound',
									name: 'If-None-Match',
								},
								{
									message: 'response',
									type: 'body',
									reason: 'notMatched',
									actualValue: (
										`<!DOCTYPE html PUBLIC "-//HbbTV//1.1.1//EN" "http://www.hbbtv.org/dtd/HbbTV-1.1.1.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>HbbTv App</title>
	<link rel="stylesheet" href="css/base.css" />
</head>
<body>
	<div id="content"></div>
</body>
</html>`
									),
								},
								{
									message: 'response',
									type: 'status',
									reason: 'notMatched',
									actualValue: 200,
								},
								{
									message: 'response',
									type: 'header',
									reason: 'notMatched',
									name: 'Date',
									actualValue: 'Tue, 28 Apr 2020 09:58:10 GMT',
								},
								{
									message: 'response',
									type: 'header',
									reason: 'notMatched',
									name: 'Expires',
									actualValue: 'Tue, 28 Apr 2020 10:03:10 GMT',
								},
							],
						}),
					})).toMatchSnapshot();
				});

				it('syntax error when status compare type is "CONTAINS"', () => {
					expect(testLineToPlainText({
						testLine: assertLine({
							subject: {
								type: 'network',
								compare: '=',
								val: 'http://suite.st/<%var1%>',
								requestInfo: [],
								responseInfo: [ { name: '@status', val: String(303), compare: '~' as const } ],
							},
							type: 'made',
							searchStrategy: 'all',

						}),
						appConfig,
						lineResult: extendBaseError({
							result: 'fatal',
							errorType: 'syntaxError',
						}),
					})).toMatchSnapshot();
				});
			});
		});
		// ---- end of "translate "assert network"" ----
		describe('translate line with screenshot', () => {
			it('should render line without screenshot', () => {
				expect(testLineToPlainText({
					testLine: {
						type: 'button',
						ids: ['OK'],
						screenshot: false,
						lineId: '123',
						excluded: false,
						fatal: false,
					},
					appConfig,
					lineResult: {
						lineId: '123',
						result: 'success',
						timeStarted: 0,
						timeFinished: 0,
						timeHrDiff: [0, 0],
						timeScreenshotHr: [0, 0],
					},
				})).toMatchSnapshot();

				expect(testLineToPlainText({
					testLine: {
						type: 'button',
						ids: ['OK'],
						screenshot: false,
						lineId: '123',
						excluded: false,
						fatal: false,
					},
					appConfig,
					lineResult: {
						lineId: '123',
						result: 'fail',
						errorType: 'adbError',
						timeStarted: 0,
						timeFinished: 0,
						timeHrDiff: [0, 0],
						timeScreenshotHr: [0, 0],
					},
				})).toMatchSnapshot();
			});

			it('should render line with screenshot', () => {
				expect(testLineToPlainText({
					testLine: {
						type: 'button',
						ids: ['OK'],
						screenshot: true,
						lineId: '123',
						excluded: false,
						fatal: false,
					},
					appConfig,
					lineResult: {
						lineId: '123',
						result: 'success',
						timeStarted: 0,
						timeFinished: 0,
						timeHrDiff: [0, 0],
						timeScreenshotHr: [0, 0],
						screenshot: '/path/to/file.png',
					},
				})).toMatchSnapshot();

				const line = {
					testLine: {
						type: 'button' as const,
						ids: ['OK'],
						screenshot: true,
						lineId: '123',
						excluded: false,
						fatal: false,
					},
					appConfig,
					lineResult: {
						lineId: '123',
						result: 'fail' as const,
						errorType: 'adbError' as const,
						timeStarted: 0,
						timeFinished: 0,
						timeHrDiff: [0, 0] as [number, number],
						timeScreenshotHr: [0, 0] as [number, number],
						screenshot: '/path/to/file.png',
					},
				};
				expect(testLineToPlainText(line)).toMatchSnapshot();
				expect(testLineToVerbosePlainText(line)).toMatchSnapshot();
				expect(testLineToQuietPlainText(line)).toMatchSnapshot();
			});

			it('should render excluded lines', () => {
				expect(testLineToPlainText({
					testLine: {
						type: 'button',
						ids: ['OK'],
						screenshot: false,
						lineId: '123',
						excluded: true,
						fatal: false,
					},
					appConfig,
					lineResult: {
						lineId: '123',
						result: 'excluded',
						timeStarted: 0,
						timeFinished: 0,
						timeHrDiff: [0, 0],
						timeScreenshotHr: [0, 0],
					},
				})).toMatchSnapshot();
			});
		});

		describe('translate line with ocr assertion', () => {
			const ocrComparators: OcrComparator[] = [
				{
					val: 'text1',
					type: '=',
					region: [100, 100, 100, 100],
					readAs: 'single-word',
				},
				{
					val: 'text2',
					type: '^',
					readAs: 'single-block',
				},
				{
					val: 'text3',
					type: '^',
					whitelist: 'allowed-word',
				},
			];

			it('queryFailed result', () => {
				expect(testLineToPlainText({
					testLine: assertLine(conditions['assert OCR comparators'](ocrComparators)),
					lineResult: extendBaseError({
						errorType: 'queryFailed',
						comparators: [
							{
								result: 'success',
							},
							{
								result: 'fail',
								errorType: 'queryFailed',
								actualValue: 'not-match',
								expectedValue: 'text2',
							},
							{
								result: 'fail',
								errorType: 'queryFailed',
								actualValue: 'not-match2',
								expectedValue: 'text3',
							},
						],
					}),
				})).toMatchSnapshot();
			});
		});
		// ---- end of "translate line with ocr assertion" ----
	});

	(['fail', 'warning', 'exit'] as const).forEach((then) => {
		describe('assert then ' + then, () => {
			const extendBaseError = (err: any): TestLineResult => ({
				result: 'fail',
				lineId: 'a625a00e-50b8-4a4c-a24f-b7e206e72199',
				timeStarted: 1587127670927,
				timeFinished: 1587127670981,
				timeHrDiff: [
					0,
					53647599,
				],
				timeScreenshotHr: [
					0,
					0,
				],
				...err,
			});
			const testLinesExampleKey = then === 'warning' ? 'Assert ... then warn' : `Assert ... then ${then}` as 'Assert ... then fail';
			const assertLine = testLinesExamples[testLinesExampleKey];
			const testLineToPlainText = (...args: Parameters<typeof translateTestLineResult>): string =>
				toText(translateTestLineResult(...args), {format: false, verbosity: 'normal'});
			const successLineResult: TestLineSuccessResult = {
				result: 'success',
				lineId: 'a625a00e-50b8-4a4c-a24f-b7e206e72199',
				timeStarted: 1587127670927,
				timeFinished: 1587127670981,
				timeHrDiff: [
					0,
					53647599,
				],
				timeScreenshotHr: [
					0,
					0,
				],
			};

			describe('translate "openAppOverrideFailed" with then ' + then, () => {
				const openAppCommand = testLinesExamples['Open app at homepage']();

				it('render with addition errorType', () => {
					expect(testLineToPlainText({
						testLine: openAppCommand,
						appConfig,
						lineResult: extendBaseError({
							errorType: 'openAppOverrideFailed',
							message: {
								errorType: 'queryFailed',
							},
						}),
					})).toMatchSnapshot();
					expect(testLineToPlainText({
						testLine: openAppCommand,
						appConfig,
						lineResult: extendBaseError({
							errorType: 'openAppOverrideFailed',
							message: {
								errorType: 'invalidInput',
								message: {
									code: 'lineTypeNotSupported',
								},
							},
						}),
					})).toMatchSnapshot();
				});
			});

			describe(`translate then ${then} and "assert current location"`, () => {
				const assertLocation = assertLine(conditions['current location']('~', 'file.suite.st'));

				it('without result', () => {
					expect(testLineToPlainText({
						testLine: assertLocation,
						appConfig,
					})).toMatchSnapshot();
				});

				it('with success result', () => {
					expect(testLineToPlainText({
						testLine: assertLocation,
						appConfig,
						lineResult: successLineResult,
					})).toMatchSnapshot();
				});

				it(`with ${then} result`, () => {
					expect(testLineToPlainText({
						testLine: assertLocation,
						appConfig,
						lineResult: extendBaseError({
							result: then,
						}),
					})).toMatchSnapshot();
				});

				it(`then ${then} with "queryFailed"`, () => {
					expect(testLineToPlainText({
						testLine: assertLocation,
						appConfig,
						lineResult: extendBaseError({
							result: 'success',
							errorType: 'queryFailed',
							actualValue: 'http://the.suite.st/sampleapp_staging/index-hbbtv.html',
							expectedValue: 'file.suite.st',
						}),
					})).toMatchSnapshot();
				});
			});

			describe(`translate then ${then} and "assert cookie"`, () => {
				const assertCookie = assertLine(conditions.cookie('suitest-cookie', '=', 'suitest'));

				it('without result', () => {
					// display plain assert cookie line
					expect(testLineToPlainText({
						testLine: assertCookie,
						appConfig,
					})).toMatchSnapshot();
				});

				it(`with ${then} result`, () => {
					// match js query fail
					expect(testLineToPlainText({
						testLine: assertLine(conditions.cookie('suitest-cookie', '=',
							'suitest-cookie'
						)),
						appConfig,
						lineResult: extendBaseError({
							result: then,
						}),
					})).toMatchSnapshot();
				});

				it('with success result', () => {
					// match js query fail
					expect(testLineToPlainText({
						testLine: assertLine(conditions.cookie('suitest-cookie', '=',
							'cookie'
						)),
						appConfig,
						lineResult: extendBaseError({
							result: 'success',
							errorType: 'queryFailed',
							actualValue: false,
						}),
					})).toMatchSnapshot();
				});
			});

			describe(`translate then ${then} and "assert element"`, () => {
				it('"element ... exist" success', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element ... exist']()),
						appConfig,
						elements,
						lineResult: extendBaseError({
							result: 'success',
							errorType: 'queryFailed',
							actualValue: false,
						}),
					})).toMatchSnapshot();
				});


				it('"element ... exist" ' + then, () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['element ... exist']()),
						appConfig,
						elements,
						lineResult: extendBaseError({
							result: then,
						}),
					})).toMatchSnapshot();
				});

				describe('translate not queryFailed errors', () => {
					it('general error', () => {
						expect(testLineToPlainText({
							testLine: assertLine(conditions['element ... exist']('some-id')),
							appConfig,
							elements,
							lineResult: extendBaseError({
								errorType: 'invalidRepositoryReference',
							}),
						})).toMatchSnapshot();
					});

					it('notExistingElement message code', () => {
						expect(testLineToPlainText({
							testLine: assertLine(conditions['element ... exist']('some-id')),
							appConfig,
							elements,
							lineResult: extendBaseError({
								errorType: 'invalidRepositoryReference',
								message: {
									code: 'notExistingElement',
									elementId: 'some-id',
								},
							}),
						})).toMatchSnapshot();
					});

					it('notExistingPlatform message code', () => {
						expect(testLineToPlainText({
							testLine: assertLine(conditions['element ... exist']('element-id-1')),
							appConfig,
							elements,
							lineResult: extendBaseError({
								errorType: 'invalidRepositoryReference',
								message: {
									code: 'notExistingPlatform',
									elementId: 'element-id-1',
								},
							}),
						})).toMatchSnapshot();
					});
				});
			});

			describe(`translate then ${then} and "assert ps video"`, () => {
				const psVideoHadNoError = (searchStrategy?: PSVideoHadNoErrorCondition['searchStrategy']): TestLine =>
					assertLine(conditions['ps video had not error'](searchStrategy));

				it('render without result', () => {
					expect(testLineToPlainText({
						testLine: psVideoHadNoError(),
						appConfig,
					})).toMatchSnapshot();
					expect(testLineToPlainText({
						testLine: psVideoHadNoError('all'),
						appConfig,
					})).toMatchSnapshot();
				});

				it(`render with ${then} result`, () => {
					expect(testLineToPlainText({
						testLine: psVideoHadNoError('all'),
						appConfig,
						lineResult: extendBaseError({
							result: then,
						}),
					})).toMatchSnapshot();
				});

				it('render with success result', () => {
					expect(testLineToPlainText({
						testLine: psVideoHadNoError('all'),
						appConfig,
						lineResult: extendBaseError({
							result: 'success',
						}),
					})).toMatchSnapshot();
				});
			});

			describe(`translate then ${then} and "assert javascript expression"`, () => {
				const jsExpression = (...args: Parameters<typeof conditions['JavaScript expression ... equals ...']>): TestLine =>
					assertLine(conditions['JavaScript expression ... equals ...'](...args));
				it('render without result', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['JavaScript expression ... equals ...']()),
						appConfig,
					})).toMatchSnapshot();
				});
				it(`render with ${then} result`, () => {
					expect(testLineToPlainText({
						testLine: jsExpression('1 + 1', '3'),
						appConfig,
						lineResult: extendBaseError({
							result: then,
							errorType: 'queryFailed',
							expectedValue: '3',
							actualValue: '2',
						}),
					})).toMatchSnapshot();
				});
				it('render with success result', () => {
					expect(testLineToPlainText({
						testLine: jsExpression('1 + 1', '3'),
						appConfig,
						lineResult: extendBaseError({
							result: 'success',
							errorType: 'queryFailed',
							expectedValue: '3',
							actualValue: '2',
						}),
					})).toMatchSnapshot();
				});
			});

			describe('translate "assert network"', () => {
				it('render without result', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['network request to URL was made including matched']()),
						appConfig,
					})).toMatchSnapshot();
				});

				it(`render ${then} result`, () => {
					const lineResult = extendBaseError({
						result: then,
						errorType: 'queryFailed',
						errors: [ { type: 'noUriFound' } ],
						failingRequestCount: 0,
					});

					expect(testLineToPlainText({
						testLine: assertLine(conditions['network request to URL was made including matched']()),
						appConfig,
						lineResult,
					})).toMatchSnapshot();
				});

				it('render success result', () => {
					const lineResult = extendBaseError({
						result: 'success',
						errorType: 'queryFailed',
						errors: [ { type: 'noUriFound' } ],
						failingRequestCount: 0,
					});

					expect(testLineToPlainText({
						testLine: assertLine(conditions['network request to URL was made including matched']()),
						appConfig,
						lineResult,
					})).toMatchSnapshot();
				});
			});

			describe(`translate then ${then} "assert application has exited"`, () => {
				it('render without result', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['application has exited']()),
						appConfig,
					})).toMatchSnapshot();
				});

				it(`render with ${then} result`, () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['application has exited']()),
						appConfig,
						lineResult: extendBaseError({
							result: then,
							errorType: 'appRunning',
						}),
					})).toMatchSnapshot();
				});

				it('render with success result', () => {
					expect(testLineToPlainText({
						testLine: assertLine(conditions['application has exited']()),
						appConfig,
						lineResult: extendBaseError({
							result: 'success',
							errorType: 'appRunning',
						}),
					})).toMatchSnapshot();
				});
			});
		});
	});

	describe('Translate aborted result', () => {
		const abortedLineJson = translateTestLineResult({
			testLine: testLinesExamples['Sleep ...'](10e4),
			appConfig,
			lineResult: {
				result: 'aborted',
				lineId: '2',
				timeStarted: 1603368650150,
				timeFinished: 1603368655763,
				timeHrDiff: [5, 611864587],
				timeScreenshotHr: [0, 0],
			},
		});

		it('as JSON', () => {
			expect(abortedLineJson).toMatchSnapshot();
		});

		it('as plain text', () => {
			expect(toText(abortedLineJson, { format: false, verbosity: 'normal' })).toMatchSnapshot();
		});

		it('translate line results that contains link', () => {
			expect(toText(translateTestLineResult({
				testLine: testLinesExamples['Scroll from active element'](),
				appConfig,
				lineResult: extendBaseError({
					errorType: 'invalidInput',
					message: {
						code: 'wrongDirection',
					},
				}),
			}))).toMatchSnapshot();

			expect(toText(translateTestLineResult({
				testLine: testLinesExamples['Assert ... then continue'](),
				appConfig,
				lineResult: extendBaseError({
					errorType: 'unsupportedOSVersion',
				}),
			}))).toMatchSnapshot();
		});
	});
});
