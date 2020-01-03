import {Translation} from './types';
import {NOT_STARTED_REASON, NotStartedReason} from './constants';
import t from './texts';

/**
 * @description Translate the reason for test not being executed
 * @throws {Error} Throws an Error if unknown code is provided
 */
export function translateNotStartedReason(code: NotStartedReason): Translation {
	switch (code) {
		case NOT_STARTED_REASON.BLASTER_ERROR:
			return {
				title: t['startupError.blasterError'](),
				description: t['startupError.blasterError.desc'](),
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_BOOTSTRAP:
			return {
				title: t['startupError.bootstrappedPlatformError'](),
				description: t['startupError.bootstrappedPlatformError.desc'](),
			};
		case NOT_STARTED_REASON.TEST_QUEUED:
			return {
				title: t['startupError.testQueued'](),
				description: t['startupError.testQueued.desc'](),
			};
		case NOT_STARTED_REASON.NO_AUTOMATED_MINUTES:
			return {
				title: t['startupError.noAvailableAutomatedMinutes'](),
				description: t['startupError.noAvailableAutomatedMinutes.desc'](),
			};
		case NOT_STARTED_REASON.NO_ACTIVE_PLAN:
			return {
				title: t['startupError.noActivePlan'](),
				description: t['startupError.noActivePlan.desc'](),
			};
		case NOT_STARTED_REASON.CANDYBOX_OFFLINE:
			return {
				title: t['startupError.candyBoxOffline'](),
				description: t['startupError.candyBoxOffline.desc'](),
			};
		case NOT_STARTED_REASON.SUITEST_DRIVE_OFFLINE:
			return {
				title: t['startupError.suitestDriveOffline'](),
				description: t['startupError.suitestDriveOffline.desc'](),
			};
		case NOT_STARTED_REASON.BOOTING:
			return {
				title: t['startupError.runningBootSequence'](),
				description: t['startupError.runningBootSequence.desc'](),
			};
		case NOT_STARTED_REASON.DEVICE_IN_USE:
			return {
				title: t['startupError.deviceInUse'](),
				description: t['startupError.deviceInUse.desc'](),
			};
		case NOT_STARTED_REASON.DEVICE_DISABLED:
			return {
				title: t['startupError.deviceDisabled'](),
				description: t['startupError.deviceDisabled.desc'](),
			};
		case NOT_STARTED_REASON.DEVICE_DELETED:
			return {
				title: t['startupError.deviceDeleted'](),
				description: t['startupError.deviceDeleted.desc'](),
			};
		case NOT_STARTED_REASON.INTERNAL_ERROR:
			return {
				title: t['startupError.internalError'](),
				description: t['startupError.internalError.desc'](),
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_UNDEFINED:
			return {
				title: t['startupError.notDefinedPlatform'](),
				description: t['startupError.notDefinedPlatform.desc'](),
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_LG_WEBOS:
			return {
				title: t['startupError.lgWebosPlatformError'](),
				description: t['startupError.lgWebosPlatformError.desc'](),
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_XBOX:
			return {
				title: t['startupError.xboxPlatformError'](),
				description: t['startupError.xboxPlatformError.desc'](),
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_ANDROID:
			return {
				title: t['startupError.androidPlatformError'](),
				description: t['startupError.androidPlatformError.desc'](),
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_APPLE_TV:
			return {
				title: t['startupError.applePlatformError'](),
				description: t['startupError.applePlatformError.desc'](),
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_ROKU:
			return {
				title: t['startupError.rokuPlatformError'](),
				description: t['startupError.rokuPlatformError.desc'](),
			};
		case NOT_STARTED_REASON.EXCEEDED_PLAN_LIMITS:
			return {
				title: t['startupError.planLimitExceeded'](),
				description: t['startupError.planLimitExceeded.desc'](),
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_PLAYSTATION:
			return {
				title: t['startupError.playstationPlatformError'](),
				description: t['startupError.playstationPlatformError.desc'](),
			};
		case NOT_STARTED_REASON.PACKAGE_CORRUPTED:
			return {
				title: t['startupError.packageCorrupted'](),
				description: '',
			};
		default:
			const _code: never = code;
			throw new Error(t['startupError.unknownReason'](_code));
	}
}
