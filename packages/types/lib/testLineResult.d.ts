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
};
