export type Then = 'success' | 'exit' | 'fail' | 'warning';
export type Comparator = '='; // TODO

const thenMap = {
	success: 'continue',
	warning: 'throw warning',
	exit: 'stop test',
	fail: 'fail',
};

export const lineDefinition = {
	// lineType[_subject[_type]]
	openApp: (appName: string, location: string = 'homepage') => `Open app **${appName}** at **${location}**`,
	openUrl: (url: string) => `Open [URL](${url})`,
	assert_application_exited: (then?: string) => `Assert application has exited then ${thenMap[then]}`,
	assert_location: (comparator: Comparator, value: string, then: Then) => `Assert current location ${comparator} [${value}](${value}) then ${thenMap[then]}`,
	// TODO
};

export const errorTitle = {
	// Generic titles to fallback in case more specific error was not specified
	// keys are based on "result" field of the test line result
	exit: () => 'Test execution was aborted',
	success: () => 'Test line passed',
	fail: () => 'Test line failed',
	fatal: () => 'Test line fatally failed',

	// errorType
	queryTimeout: () => 'Application did not respond for 60 seconds',
	queryFailed: () => 'Assertion failed', // Generic query failed

};

export const errorDescription = {};
