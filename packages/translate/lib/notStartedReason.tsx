/* eslint-disable max-len */
import {Translation} from './types';
import {NOT_STARTED_REASON, NotStartedReason} from './constants';
import { jsx } from '@suitest/smst';

/**
 * @description Translate the reason for test not being executed
 * @throws {Error} Throws an Error if unknown code is provided
 */
export function translateNotStartedReason(code: NotStartedReason): Translation {
	switch (code) {
		case NOT_STARTED_REASON.BLASTER_ERROR:
			return {
				title: <text>Cannot continue: IR blaster missing or incorrectly attached</text>,
				description: <text>Infrared blaster assigned to the device is missing or malfunctioning. Check the wiring, replace the blaster or assign another working CandyBox port to this device</text>,
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_BOOTSTRAP:
			return {
				title: <text>Cannot continue: Suitest bootstrap app is not running</text>,
				description: <text>Suitest tried to start the bootstrap application on this device but failed several times and will try no more. Please connect to the device and start the bootstrap app manually, then disconnect and the scheduled test will continue. If you have configured the Suitest channel, tune the TV to this channel and verify that Suitest badge is displayed on TV in the top right corner. If you have not configured the Suitest channel, please contact support</text>,
			};
		case NOT_STARTED_REASON.TEST_QUEUED:
			return {
				title: <text>Test is added to queue</text>,
				description: <text>Execution will start as soon as other tests queued on this device will finish execution</text>,
			};
		case NOT_STARTED_REASON.NO_AUTOMATED_MINUTES:
			return {
				title: <text>Cannot continue: you've used up all of your testing minutes</text>,
				description: <fragment>You are testing a lot! Please consider <link href="https://the.suite.st/preferences/summary?modal=create-organization">creating an organization</link> and purchasing a plan. Visit our <link href="https://suite.st/pricing.html">Pricing page</link> for more details.</fragment>,
			};
		case NOT_STARTED_REASON.NO_ACTIVE_PLAN:
			return {
				title: <text>Cannot continue: Your subscription has expired</text>,
				description: <fragment>Your subscription has expired, to continue using Suitest please <link href="https://the.suite.st/preferences/billing">renew your subscription</link></fragment>,
			};
		case NOT_STARTED_REASON.CAMERA_BUSY:
			return {
				title: <text>Cannot continue: Suitest Camera app is busy</text>,
				description: <text>Suitest Camera app is busy, please try again in a few minutes</text>,
			};
		case NOT_STARTED_REASON.CANDYBOX_OFFLINE:
			return {
				title: <text>Cannot continue: CandyBox controlling this device is offline</text>,
				description: <text>Check that the cable plugged into the CandyBox delivers Internet connection or reboot the CandyBox and allow about 5 minutes for it to initialize</text>,
			};
		case NOT_STARTED_REASON.SUITEST_DRIVE_OFFLINE:
			return {
				title: <text>Cannot continue: SuitestDrive controlling this device is offline</text>,
				description: <text>SuitestDrive controlling this device is not currently running or is offline. Please verify that the host computer has Internet connection and that SuitestDrive is running</text>,
			};
		case NOT_STARTED_REASON.SUITEST_DRIVE_SERVICE_OFFLINE:
			return {
				title: <text>The SuitestDrive is not running on the CandyBox</text>,
			};
		case NOT_STARTED_REASON.BOOTING:
			return {
				title: <text>Trying to open Suitest bootstrap application</text>,
				description: <text>Test will start after the Suitest bootstrap application will open. Suitest will attempt to open the app in a number of ways. After each attempt it will wait for 60 seconds for the app to respond. If it will not, Suitest will try the next available method. Current methods are: 1) Sending EXIT key to the device, 2) Executing user defined boot sequence, 3) turning the TV on and off 4) Turning the TV on again. If starting the test takes a long time, you should configure a better boot sequence</text>,
			};
		case NOT_STARTED_REASON.DEVICE_IN_USE:
			return {
				title: <text>A user is currently connected to this device</text>,
				description: <text>Execution will continue after the user disconnects</text>,
			};
		case NOT_STARTED_REASON.DEVICE_DISABLED:
			return {
				title: <text>This device is disabled</text>,
				description: <text>For the execution to continue please enable the device</text>,
			};
		case NOT_STARTED_REASON.DEVICE_DELETED:
			return {
				title: <text>Cannot continue: Device is deleted</text>,
				description: <text>The device on which the execution was scheduled has been deleted. Please cancel the test and schedule it on another available device</text>,
			};
		case NOT_STARTED_REASON.INTERNAL_ERROR:
			return {
				title: <text>Cannot continue: Internal error occurred</text>,
				description: <text>We are very sorry, but some fishy error occurred when Suitest was trying to execute your test. Our developers have been notified and are already working hard to resolve the problem</text>,
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_UNDEFINED:
			return {
				title: <text>Cannot continue: Device does not support this platform</text>,
				description: <text>You have scheduled the test execution with a configuration that depends on a platform, which this device does not currently support. You should either configure the platform on the device or cancel the test run</text>,
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_LG_WEBOS:
			return {
				title: <text>Cannot continue: LG WebOS driver has failed</text>,
				description: <text>LG WebOS driver has misbehaved. Please verify that the device is online and it's current IP address is correctly specified in Suitest. Then double check if the Development mode is enabled on the device. If nothing helps try rebooting the device</text>,
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_XBOX:
			return {
				title: <text>Cannot continue: Xbox driver has failed</text>,
				description: <text>Xbox driver has misbehaved. Please verify that the device is online and it's current IP address and developer credentials are correctly specified in Suitest. If nothing helps try rebooting the device and restarting SuitestDrive</text>,
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_ANDROID:
			return {
				title: <text>Cannot continue: Android driver has failed</text>,
				description: <text>Android driver has misbehaved. Please verify that the device is online and it's current IP address is correctly specified in Suitest. If nothing helps try rebooting the device and restarting SuitestDrive</text>,
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_APPLE_TV:
			return {
				title: <text>Cannot continue: Apple TV driver has failed</text>,
				description: <text>Apple driver has misbehaved. Please verify that the device is paired with Mac that is running SuitestDrive. Make sure that application build is installable on that device. If nothing helps try rebooting the device and restarting SuitestDrive</text>,
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_GENERIC:
			return {
				title: <text>Cannot continue: Platform failed</text>,
				description: <text>Please verify that the device is online and it's current IP address is correctly specified in Suitest. If nothing helps try rebooting the device.</text>,
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_ROKU:
			return {
				title: <text>Cannot continue: Roku driver has failed</text>,
				description: <text>Roku driver has misbehaved. Please verify that the device is online and it's current IP address and developer credentials are correctly specified in Suitest. Then double check if the Development mode is enabled on the device and your channel/application is valid. If the local IP of the device changes, make sure to set up a static IP for the device</text>,
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_TIZEN:
			return {
				title: <text>Cannot continue: Tizen driver has failed</text>,
				description: <text>Tizen driver has misbehaved. Please verify that the device is online and it's current IP address is correctly specified in Suitest. Then double check if the developer mode is enabled and if host PC IP matches the control unit IP. If nothing helps try rebooting the device and restarting SuitestDrive</text>,
			};
		case NOT_STARTED_REASON.EXCEEDED_PLAN_LIMITS:
			return {
				title: <text>Application or user limit has been exceeded</text>,
				description: <fragment>Looks like you have reached the limit of applications or users, check your <link href="https://the.suite.st/preferences/billing">billing section</link> to increase your plan. Please contact <link href="sales@suite.st">sales@suite.st</link> if you require help with your plan.</fragment>,
			};
		case NOT_STARTED_REASON.PLATFORM_ERROR_PLAYSTATION:
			return {
				title: <text>Cannot continue: PlayStation 4 driver has failed</text>,
				description: <text>PlayStation 4 driver has misbehaved. Please verify that the device is online and it's current IP address is correctly specified in Suitest. If nothing helps try rebooting the device and restarting SuitestDrive. If the local IP of the device changes, make sure to set up a static IP for the device.</text>,
			};
		case NOT_STARTED_REASON.PACKAGE_CORRUPTED:
			return {
				title: <text>Failed to open the app. Please make sure that your app is working correctly.</text>,
			};
		case NOT_STARTED_REASON.CONFIGURATOR_ERROR:
			return {
				title: <text>Make sure that Apple Configurator 2 and Automation Tools are installed</text>,
				description: <fragment>Please see <link href="https://suite.st/docs/devices/apple-tv/#installing-apple-configurator-2">our docs</link>.</fragment>,
			};
		case NOT_STARTED_REASON.APPLE_NETWORK_LOGS_ERROR:
			return {
				title: <text>SuitestDrive can't launch NetworkLog service on Mac</text>,
			};
		case NOT_STARTED_REASON.DEVICE_OFFLINE:
			return {
				title: <fragment>Device could not be reached, please try again in a few minutes. Contact <link href="mailto:support@suite.st">support</link> if the problem persists.</fragment>,
			};
		case NOT_STARTED_REASON.SUITEST_DRIVE_UPDATE:
			return {
				title: <text>SuitestDrive is being automatically updated.</text>,
			};
		case NOT_STARTED_REASON.DEV_TOOLS_NOT_SUPPORTED:
			return {
				title: <text>The selected instrumentation option (Lite version) of the configuration is not supported on the device.</text>,
			};
		case NOT_STARTED_REASON.XBOX_PLATFORM_ERROR_IN_VALID_CERTIFICATE:
			return {
				title: <text>Invalid SSL certificate. See troubleshooting section for this platform</text>,
			};
		case NOT_STARTED_REASON.XFINITY_PLATFORM_ERROR_EXPIRED_API_KEY:
			return {
				title: <text>Your Comcast Xfinity key has been expired.</text>,
			};
		default:
			const _code: never = code;
			throw new Error(`Unknown not started reason received: ${_code}`);
	}
}
