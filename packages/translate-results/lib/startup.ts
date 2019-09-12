import {Translation} from './types';
import t from './texts';

/**
 * Translate the reason for test not being executed
 */
export function translateStartupError(code: StartupError): Translation | undefined {
	switch (code) {
		case STARTUP_ERROR.blasterError:
			return {
				title: t['startupError.blasterError'](),
				description: t['startupError.blasterError.desc'](),
			};
		case STARTUP_ERROR.bootstrappedPlatformError:
			return {
				title: t['startupError.bootstrappedPlatformError'](),
				description: t['startupError.bootstrappedPlatformError.desc'](),
			};
		case STARTUP_ERROR.testQueued:
			return {
				title: t['startupError.testQueued'](),
				description: t['startupError.testQueued.desc'](),
			};
		case STARTUP_ERROR.noAvailableAutomatedMinutes:
			return {
				title: t['startupError.noAvailableAutomatedMinutes'](),
				description: t['startupError.noAvailableAutomatedMinutes.desc'](),
			};
		case STARTUP_ERROR.noActivePlan:
			return {
				title: t['startupError.noActivePlan'](),
				description: t['startupError.noActivePlan.desc'](),
			};
		case STARTUP_ERROR.candyBoxOffline:
			return {
				title: t['startupError.candyBoxOffline'](),
				description: t['startupError.candyBoxOffline.desc'](),
			};
		case STARTUP_ERROR.suitestDriveOffline:
			return {
				title: t['startupError.suitestDriveOffline'](),
				description: t['startupError.suitestDriveOffline.desc'](),
			};
		case STARTUP_ERROR.runningBootSequence:
			return {
				title: t['startupError.runningBootSequence'](),
				description: t['startupError.runningBootSequence.desc'](),
			};
		case STARTUP_ERROR.deviceInUse:
			return {
				title: t['startupError.deviceInUse'](),
				description: t['startupError.deviceInUse.desc'](),
			};
		case STARTUP_ERROR.deviceDisabled:
			return {
				title: t['startupError.deviceDisabled'](),
				description: t['startupError.deviceDisabled.desc'](),
			};
		case STARTUP_ERROR.deviceDeleted:
			return {
				title: t['startupError.deviceDeleted'](),
				description: t['startupError.deviceDeleted.desc'](),
			};
		case STARTUP_ERROR.internalError:
			return {
				title: t['startupError.internalError'](),
				description: t['startupError.internalError.desc'](),
			};
		case STARTUP_ERROR.notDefinedPlatform:
			return {
				title: t['startupError.notDefinedPlatform'](),
				description: t['startupError.notDefinedPlatform.desc'](),
			};
		case STARTUP_ERROR.lgWebosPlatformError:
			return {
				title: t['startupError.lgWebosPlatformError'](),
				description: t['startupError.lgWebosPlatformError.desc'](),
			};
		case STARTUP_ERROR.xboxPlatformError:
			return {
				title: t['startupError.xboxPlatformError'](),
				description: t['startupError.xboxPlatformError.desc'](),
			};
		case STARTUP_ERROR.androidPlatformError:
			return {
				title: t['startupError.androidPlatformError'](),
				description: t['startupError.androidPlatformError.desc'](),
			};
		case STARTUP_ERROR.applePlatformError:
			return {
				title: t['startupError.applePlatformError'](),
				description: t['startupError.applePlatformError.desc'](),
			};
		case STARTUP_ERROR.rokuPlatformError:
			return {
				title: t['startupError.rokuPlatformError'](),
				description: t['startupError.rokuPlatformError.desc'](),
			};
		case STARTUP_ERROR.planLimitExceeded:
			return {
				title: t['startupError.planLimitExceeded'](),
				description: t['startupError.planLimitExceeded.desc'](),
			};
		default:
			const _code: never = code;
			console.warn(_code, 'startup error code not exist');
			break;

	}

	return undefined;
}

export const STARTUP_ERROR = Object.freeze({
	blasterError: 'blasterError',
	bootstrappedPlatformError: 'bootstrappedPlatformError',
	testQueued: 'testQueued',
	noAvailableAutomatedMinutes: 'noAvailableAutomatedMinutes',
	noActivePlan: 'noActivePlan',
	candyBoxOffline: 'candyBoxOffline',
	suitestDriveOffline: 'suitestDriveOffline',
	runningBootSequence: 'runningBootSequence',
	deviceInUse: 'deviceInUse',
	deviceDisabled: 'deviceDisabled',
	deviceDeleted: 'deviceDeleted',
	internalError: 'internalError',
	notDefinedPlatform: 'notDefinedPlatform',
	lgWebosPlatformError: 'lgWebosPlatformError',
	xboxPlatformError: 'xboxPlatformError',
	androidPlatformError: 'androidPlatformError',
	applePlatformError: 'applePlatformError',
	rokuPlatformError: 'rokuPlatformError',
	planLimitExceeded: 'planLimitExceeded',
} as const);

export type StartupError = typeof STARTUP_ERROR[keyof typeof STARTUP_ERROR];
