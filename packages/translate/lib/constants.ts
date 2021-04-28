export const NOT_STARTED_REASON = Object.freeze({
	BLASTER_ERROR: 'blasterError',
	BOOTING: 'runningBootSequence',
	CANDYBOX_OFFLINE: 'candyBoxOffline',
	DEVICE_DELETED: 'deviceDeleted',
	DEVICE_DISABLED: 'deviceDisabled',
	DEVICE_IN_USE: 'deviceInUse',
	EXCEEDED_PLAN_LIMITS: 'planLimitExceeded',
	INTERNAL_ERROR: 'internalError',
	NO_ACTIVE_PLAN: 'noActivePlan',
	NO_AUTOMATED_MINUTES: 'noAvailableAutomatedMinutes',
	PLATFORM_ERROR_ANDROID: 'androidPlatformError',
	PLATFORM_ERROR_BOOTSTRAP: 'bootstrappedPlatformError',
	PLATFORM_ERROR_LG_WEBOS: 'lgWebosPlatformError',
	PLATFORM_ERROR_UNDEFINED: 'notDefinedPlatform',
	PLATFORM_ERROR_PLAYSTATION: 'playstationPlatformError',
	PLATFORM_ERROR_ROKU: 'rokuPlatformError',
	PLATFORM_ERROR_XBOX: 'xboxPlatformError',
	PLATFORM_ERROR_APPLE_TV: 'applePlatformError',
	PLATFORM_ERROR_TIZEN: 'tizenPlatformError',
	SUITEST_DRIVE_OFFLINE: 'suitestDriveOffline',
	SUITEST_DRIVE_SERVICE_OFFLINE: 'suitestDriveServiceOffline',
	TEST_QUEUED: 'testQueued',
	PACKAGE_CORRUPTED: 'packageCorrupted',
	CONFIGURATOR_ERROR: 'configuratorError',
	APPLE_NETWORK_LOGS_ERROR: 'appleNetworkLogsError',
	DEVICE_OFFLINE: 'deviceOffline',
	SUITEST_DRIVE_UPDATE: 'suitestDriveUpdate',
} as const);

export type NotStartedReason = typeof NOT_STARTED_REASON[keyof typeof NOT_STARTED_REASON];

export const PROGRESS_STATUS = Object.freeze({
	ACTION_FAILED: 'actionFailed', // says that previous operation failed
	APP_UNINSTALL: 'unistallingApp',
	APP_UPLOAD_INSTALL: 'uploadingAndInstallingApp',
	BOOTING_DEVICE: 'bootingDevice',
	CLOSING_APP: 'closingApp',
	DEVICE_IDENTIFICATION: 'recoveringID',
	NOTHING: 'nothing', // says that previous operation is finished (failed or succeed)
	OPENING_APP: 'openingApp',
	WAITING_FOR_BOOTSTRAP: 'waitingForConnectionFromBootstrap',
	WAITING_FOR_IL: 'waitingForConnectionFromIL',
	WAIT_FOR_MANUAL_ACTION: 'needManual',
} as const);

export type ProgressStatus = typeof PROGRESS_STATUS[keyof typeof PROGRESS_STATUS];
