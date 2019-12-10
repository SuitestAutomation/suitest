# Test bootstrap

Messages related to bootstrap phase of the test execution.

## Test bootstrap status

This statuses are received as part of the test result in case it was not possible to start the test execution by the time status is requested.
Reason is defined by `reason` field of `notRunningReason` message:

```typescript
type NotStartedReason = {
    type: 'notRunningReason',
    reason: NotRunningReason,
};
```

Where `NotRunningReason` enum values are listed below.

Example:

```typescript
import {translateNotStartedReason} from '@suitest/translate';

const {title, description} = translateNotStartedReason('blasterError');
```

### androidPlatformError

Title: `Cannot continue: Android driver has failed`

Description: `Android driver has misbehaved. Please verify that the device is online and it's current IP address is correctly specified in Suitest. If nothing helps try rebooting the device and restarting SuitestDrive`

### applePlatformError

Title: `Cannot continue: Apple TV driver has failed`

Description: `Apple driver has misbehaved. Please verify that the device is paired with Mac that is running SuitestDrive. Make sure that application build is installable on that device. If nothing helps try rebooting the device and restarting SuitestDrive`

### blasterError

Title: `Cannot continue: IR blaster missing or incorrectly attached`

Description: `Infrared blaster assigned to the device is missing or malfunctioning. Check the wiring, replace the blaster or assign another working CandyBox port to this device`

### bootstrappedPlatformError

Title: `Cannot continue: Suitest bootstrap app is not running`

Description: `Suitest tried to start the bootstrap application on this device but failed several times and will try no more. Please connect to the device and start the bootstrap app manually, then disconnect and the scheduled test will continue. If you have configured the Suitest channel, tune the TV to this channel and verify that Suitest badge is displayed on TV in the top right corner. If you have not configured the Suitest channel, please contact support`

### candyBoxOffline

Title: `Cannot continue: CandyBox controlling this device is offline`

Description: `Check that the cable plugged into the CandyBox delivers Internet connection or reboot the CandyBox and allow about 5 minutes for it to initialize`

### deviceDeleted

Title: `Cannot continue: Device is deleted`

Description: `The device on which the execution was scheduled has been deleted. Please cancel the test and schedule it on another available device`

### deviceDisabled

Title: `This device is disabled`

Description: `For the execution to continue please enable the device`

### deviceInUse

Title: `A user is currently connected to this device`

Description: `Execution will continue after the user disconnects`

### internalError

Title: `Cannot continue: Internal error occurred`

Description: `We are very sorry, but some fishy error occurred when Suitest was trying to execute your test. Our developers have been notified and are already working hard to resolve the problem`

### lgWebosPlatformError

Title: `Cannot continue: LG WebOS driver has failed`

Description: `LG WebOS driver has misbehaved. Please verify that the device is online and it's current IP address is correctly specified in Suitest. Then doublecheck if the Development mode is enabled on the device. If nothing helps try rebooting the device`

### noActivePlan

Title: `Cannot continue: Your subscription has expired`

Description: `Your subscription has expired, to continue using Suitest please [renew your subscription](https://the.suite.st/preferences/billing)`

### noAvailableAutomatedMinutes

Title: `Cannot continue: you\'ve used up all of your testing minutes`

Description: `You testing a lot! How about [getting a bigger subscription](https://the.suite.st/preferences/billing)? Or, if you would like to purchase more testing minutes for the current billing cycle, please contact [sales@suite.st](mailto:sales@suite.st). Your testing minutes will renew`

### notDefinedPlatform

Title: `Cannot continue: Device does not support this platform`

Description: `You have scheduled the test execution with a configuration that depends on a platform, which this device does not currently support. You should either configure the platform on the device or cancel the test run`

### planLimitExceeded

Title: `Application or user limit has been exceeded`

Description: `Looks like you have reached the limit of applications or users, check your [billing section](https://the.suite.st/preferences/billing) to increase your plan. Please contact [sales@suite.st](sales@suite.st) if you require help with your plan.`

### playstationPlatformError

Title: `Cannot continue: PlayStation 4 driver has failed`

Description: `PlayStation 4 driver has misbehaved. Please verify that the device is online and it's current IP address is correctly specified in Suitest. If nothing helps try rebooting the device and restarting SuitestDrive. If the local IP of the device changes, make sure to set up a static IP for the device.`

### rokuPlatformError

Title: `Cannot continue: Roku driver has failed`

Description: `Roku driver has misbehaved. Please verify that the device is online and it's current IP address and developer credentials are correctly specified in Suitest. Then double check if the Development mode is enabled on the device and your channel/application is valid. If the local IP of the device changes, make sure to set up a static IP for the device`

### runningBootSequence

Title: `Trying to open Suitest bootstrap application`

Description: `Test will start after the Suitest bootstrap application will open. Suitest will attempt to open the app in a number of ways. After each attempt it will wait for 60 seconds for the app to respond. If it will not, Suitest will try the next available method. Current methods are: 1) Sending EXIT key to the device, 2) Executing user defined boot sequence, 3) turning the TV on and off 4) Turning the TV on again. If starting the test takes a long time, you should configure a better boot sequence`

### suitestDriveOffline

Title: `Cannot continue: SuitestDrive controlling this device is offline`

Description: `SuitestDrive controlling this device is not currently running or is offline. Please verify that the host computer has Internet connection and that SuitestDrive is running`

### testQueued

Title: `Test is added to queue`

Description: `Execution will start as soon as other tests queued on this device will finish execution`

### xboxPlatformError

Title: `Cannot continue: Xbox driver has failed`

Description: `Xbox driver has misbehaved. Please verify that the device is online and it's current IP address and developer credentials are correctly specified in Suitest. If nothing helps try rebooting the device and restarting SuitestDrive`

## Test bootstrap progress

During test bootstrap phase in interactive mode, Suitest server would notify about the progress.
This way user may be made aware of the steps that are being made to start the execution.

```typescript
type ProgressMessage = {
  type: 'progress',
  code: NotStartedReason,
  status: ProgressStatus,
}
```

Messages with `status` define current step in the bootstrap process.

Messages with `code` define current step in the bootstrap process in case further execution is blocked.
Code exactly correspond to `reason` of `notRunningReason` message, see above for translations.

Example:

```typescript
import {translateProgress} from '@suitest/translate';

const {title, description} = translateProgress({status: 'openingApp', code: 'blasterError'});
```

### openingApp

Title: `Trying to open app...`

### closingApp

Title: `Trying to close app...`

### bootingDevice

Title: `Running the boot sequence defined for the device...`

### needManual

Title: `Paused. For this platform, install and open the application manually.`

### recoveringID

Title: `Trying to recover Suitest device ID...`

### waitingForConnectionFromBootstrap

Title: `Waiting for connection from the Suitest app on device...`

### waitingForConnectionFromIL

Title: `Waiting for connection from the instrumentation library...`

### unistallingApp

Title: `Uninstalling app...`

### uploadingAndInstallingApp

Title: `Uploading and installing app...`
