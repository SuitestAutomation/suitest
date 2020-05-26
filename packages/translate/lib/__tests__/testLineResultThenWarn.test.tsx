import {
	TestLineSuccessResult,
	TestLineResult,
	PSVideoHadNoErrorCondition,
	TestLine,
} from '@suitest/types/lib';
import {translateTestLineResult} from '../testLineResult';
import {appConfig, conditions, elements, testLinesExamples} from './testLinesExamples';
import {toText} from '@suitest/smst-to-text';

describe('Translate assert lines with then warn', () => {
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
	const assertLine = testLinesExamples['Assert ... then warn'];
	const testLineToFormattedText = (...args: Parameters<typeof translateTestLineResult>): string =>
		toText(translateTestLineResult(...args), false);
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

	describe('translate "assert current location" success', () => {
		const assertLocation = assertLine(conditions['current location']('~', 'http://some.url'));

		it('without result', () => {
			expect(testLineToFormattedText({
				testLine: assertLocation,
				appConfig,
			})).toMatchSnapshot();
		});

		it('with success result', () => {
			expect(testLineToFormattedText({
				testLine: assertLocation,
				appConfig,
				lineResult: successLineResult,
			})).toMatchSnapshot();
		});

		it('errorType: "queryFailed", location value not matched', () => {
			expect(testLineToFormattedText({
				testLine: assertLocation,
				appConfig,
				lineResult: extendBaseError({
					errorType: 'queryFailed',
					actualValue: 'http://file.suite.st/sampleapp_staging/index-hbbtv.html',
					expectedValue: 'http://some.url',
				}),
			})).toMatchSnapshot();
		});

		it('errorType: "queryFailed" matchjs failed', () => {
			expect(testLineToFormattedText({
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
			expect(testLineToFormattedText({
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
			})).toMatchSnapshot();
		});

		it('errorType: "queryFailed" with message.code', () => {
			expect(testLineToFormattedText({
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

		it('with success result', () => {
			// display plain assert cookie line
			expect(testLineToFormattedText({
				testLine: assertCookie,
				lineResult: successLineResult,
				appConfig,
			})).toMatchSnapshot();
		});

		it('without result', () => {
			// display plain assert cookie line
			expect(testLineToFormattedText({
				testLine: assertCookie,
				appConfig,
			})).toMatchSnapshot();
		});

		it('missingSubject error', () => {
			// display cookie line with missing subject error (when cookie does not exists)
			expect(testLineToFormattedText({
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
			expect(testLineToFormattedText({
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
			expect(testLineToFormattedText({
				testLine: assertCookie,
				appConfig,
				lineResult: extendBaseError({
					errorType: 'queryFailed',
					actualValue: 'some cookie value',
					expectedValue: 'suitest',
				}),
			})).toMatchSnapshot();
		});

		it('queryFailed match js failed', () => {
			// match js query fail
			expect(testLineToFormattedText({
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
			expect(testLineToFormattedText({
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
	});
	// ---- end of "translate "assert cookie"" ----

	describe('translate "assert element"', () => {
		describe('without error', () => {
			it('"element ... exist"', () => {
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element ... exist']()),
					appConfig,
					elements,
				})).toMatchSnapshot();
			});

			it('"element ... exist" with success', () => {
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element ... exist']()),
					appConfig,
					elements,
					lineResult: successLineResult,
				})).toMatchSnapshot();
			});

			it('"element ... does not exist"', () => {
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element ... does not exist']()),
					appConfig,
					elements,
				})).toMatchSnapshot();
			});

			it('"element ... does not exist" with success', () => {
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element ... does not exist']()),
					appConfig,
					elements,
					lineResult: successLineResult,
				})).toMatchSnapshot();
			});

			it('"element matches JS"', () => {
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element matches JS']()),
					appConfig,
					elements,
				})).toMatchSnapshot();
			});

			it('"element matches JS" with success', () => {
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element matches JS']()),
					appConfig,
					elements,
					lineResult: successLineResult,
				})).toMatchSnapshot();
			});

			it('"element matches JS with vars"', () => {
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element matches JS with vars']()),
					appConfig,
					elements,
				})).toMatchSnapshot();
			});

			it('"element matches JS with vars" with success', () => {
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element matches JS with vars']()),
					appConfig,
					elements,
					lineResult: successLineResult,
				})).toMatchSnapshot();
			});

			it('"element ... is visible"', () => {
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element ... is visible']()),
					appConfig,
					elements,
				})).toMatchSnapshot();
			});

			it('"element ... is visible" with success', () => {
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element ... is visible']()),
					appConfig,
					elements,
					lineResult: successLineResult,
				})).toMatchSnapshot();
			});

			it('"element properties"', () => {
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element properties']()),
					appConfig,
					elements,
				})).toMatchSnapshot();
			});
		});

		// translate for invalidRepositoryReference family errors
		describe('invalidRepositoryReference results', () => {
			it('general error', () => {
				// display invalidRepositoryReference general error
				expect(testLineToFormattedText({
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
				expect(testLineToFormattedText({
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
				// display notExistingPlatform error
				expect(testLineToFormattedText({
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

		describe('queryFailed results', () => {
			it('missingSubject', () => {
				expect(testLineToFormattedText({
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

			it('existingSubject', () => {
				expect(testLineToFormattedText({
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
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element ... is visible']()),
					appConfig,
					elements,
					lineResult: extendBaseError({
						errorType: 'queryFailed',
					}),
				})).toMatchSnapshot();
			});

			it('match js fail', () => {
				expect(testLineToFormattedText({
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
				expect(testLineToFormattedText({
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
				expect(testLineToFormattedText({
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
				expect(testLineToFormattedText({
					testLine: assertLine(conditions['element properties']([
						{ property: 'backgroundColor', type: '=', val: 'rgba(0, 0, 0, 0)' },
						{ property: 'borderColor', type: '=', val: 'rgb(255, 255, 255)' },
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
			expect(testLineToFormattedText({
				testLine: psVideoHadNoError(),
				appConfig,
			})).toMatchSnapshot();
			expect(testLineToFormattedText({
				testLine: psVideoHadNoError('all'),
				appConfig,
			})).toMatchSnapshot();
		});

		it('render with fail result', () => {
			expect(testLineToFormattedText({
				testLine: psVideoHadNoError('all'),
				appConfig,
				lineResult: extendBaseError({
					errorType: 'missingPSSDK',
				}),
			})).toMatchSnapshot();
		});

		it('render with success result', () => {
			expect(testLineToFormattedText({
				testLine: psVideoHadNoError('all'),
				appConfig,
				lineResult: successLineResult,
			})).toMatchSnapshot();
		});
	});
	// ---- end of "translate "assert ps video"" ----

	describe('translate "assert javascript expression"', () => {
		it('render without result', () => {
			expect(testLineToFormattedText({
				testLine: assertLine(conditions['JavaScript expression ... equals ...']()),
				appConfig,
			})).toMatchSnapshot();
			expect(testLineToFormattedText({
				testLine: assertLine(conditions['JavaScript expression with variables ... equals ...']()),
				appConfig,
			})).toMatchSnapshot();
		});
		it('render with success result', () => {
			expect(testLineToFormattedText({
				testLine: assertLine(conditions['JavaScript expression ... equals ...']()),
				appConfig,
				lineResult: successLineResult,
			})).toMatchSnapshot();
			expect(testLineToFormattedText({
				testLine: assertLine(conditions['JavaScript expression with variables ... equals ...']()),
				appConfig,
				lineResult: successLineResult,
			})).toMatchSnapshot();
		});

		it('render error when javascript expression missed', () => {
			// value for compare not specified
			expect(testLineToFormattedText({
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
			expect(testLineToFormattedText({
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
			expect(testLineToFormattedText({
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
				expect(testLineToFormattedText({
					testLine: jsExpression('1 + 1', '3'),
					appConfig,
					lineResult: extendBaseError({
						errorType: 'queryFailed',
						expectedValue: '3',
						actualValue: '2',
					}),
				})).toMatchSnapshot();

				expect(testLineToFormattedText({
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
				expect(testLineToFormattedText({
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
			expect(testLineToFormattedText({
				testLine: assertLine(conditions['application has exited']()),
				appConfig,
			})).toMatchSnapshot();
		});

		it('render with fail result', () => {
			expect(testLineToFormattedText({
				testLine: assertLine(conditions['application has exited']()),
				appConfig,
				lineResult: extendBaseError({
					errorType: 'appRunning',
				}),
			})).toMatchSnapshot();
		});

		it('render with success result', () => {
			expect(testLineToFormattedText({
				testLine: assertLine(conditions['application has exited']()),
				appConfig,
				lineResult: successLineResult,
			})).toMatchSnapshot();
		});
	});
	// ---- end of "translate "assert application has exited""

	describe('translate "assert network"', () => {
		it('render without result', () => {
			expect(testLineToFormattedText({
				testLine: assertLine(conditions['network request to URL was made including matched']()),
				appConfig,
			})).toMatchSnapshot();
			expect(testLineToFormattedText({
				testLine: assertLine(conditions['network request matching URL was not made excluding previously matched']()),
				appConfig,
			})).toMatchSnapshot();
		});
		it('render with success result', () => {
			expect(testLineToFormattedText({
				testLine: assertLine(conditions['network request to URL was made including matched']()),
				appConfig,
				lineResult: successLineResult,
			})).toMatchSnapshot();
			expect(testLineToFormattedText({
				testLine: assertLine(conditions['network request matching URL was not made excluding previously matched']()),
				appConfig,
				lineResult: successLineResult,
			})).toMatchSnapshot();
		});

		describe('render fail results', () => {
			it('url not matched', () => {
				const lineResult = extendBaseError({
					errorType: 'queryFailed',
					errors: [ { type: 'noUriFound' } ],
					failingRequestCount: 0,
				});

				expect(testLineToFormattedText({
					testLine: assertLine(conditions['network request to URL was made including matched']()),
					appConfig,
					lineResult,
				})).toMatchSnapshot();

				expect(testLineToFormattedText({
					testLine: assertLine(
						conditions['network request matching URL was not made excluding previously matched']()
					),
					appConfig,
					lineResult,
				})).toMatchSnapshot();
			});

			it('request/response headers not matched', () => {
				expect(testLineToFormattedText({
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
				expect(testLineToFormattedText({
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
});
