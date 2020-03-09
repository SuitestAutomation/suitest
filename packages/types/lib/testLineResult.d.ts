export type TestLineResultType = 'success' | 'fail' | 'fatal' | 'warning' | 'exit' | 'excluded';
export type ErrorType = 'queryFailed' | 'appRunning' | 'appNotRunning' | 'queryTimeout';

export type TestLineResult = {
	lineId: string,
	timeStarted: number,
	timeFinished: number,
	timeHrDiff: [number, number],
	timeScreenshotHr: [number, number],
	result: TestLineResultType,
	actualValue?: string | number, // Optional actualValue in case it's different from the expected one
	results?: TestLineResult[], // For "Run test" line - results of the child lines
	errorType?: ErrorType, // Type of the error occurred on the device
	message?: { // Detailed message explaining what went wrong
		code?: string,
		info?: {
			reason?: string,
			buttonIds?: string[],
			error?: string,
			exception?: string,
		},
	},
	expression?: Array<{ // Error description for lines like "element matches props"
		result: string,
		actualValue?: string,
		errorType?: string,
		message?: {
			code?: string,
		},
	}>,
	errors?: Array<{
		actualValue: string,
		name: string,
		message: 'response' | 'request',
		reason: 'notMatched',
		type: 'header' | 'noUriFound' | 'status',
	}>,
	snippetLineId?: string,
	snippetLineNumber?: number | null,
	loopResults?: TestLineResult[], // snippet until loops and lines results
};
