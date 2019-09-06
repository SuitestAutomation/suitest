# Suitest test execution results translation

This document contains all results that Suitest may return for the test execution and translations for those errors.

Error translations support small subset of Markdown text formatting:

* Bold text `**bold**`
* Code block `` `code` ``
* Hyperlinks `[text](url){attribute: 'value'}`
* Images `![caption](src){attribute: 'value'}`

## Failure to start the execution

This errors are received in case it was not possible to start the test execution. Error typ is defined by `notStartedReason`.

```typescript
// TODO put example of JSON received from server
```

### androidPlatformError

Error title: `Cannot continue: Android driver has failed`

Error description: `Android driver has misbehaved. Please verify that the device is online and it's current IP address is correctly specified in Suitest. If nothing helps try rebooting the device and restarting SuitestDrive`

### applePlatformError

Error title: `Cannot continue: Apple TV driver has failed`

Error description: `TODO`

### blasterError

Error title: `Cannot continue: IR blaster missing or incorrectly attached`

Error description: `Infrared blaster assigned to the device is missing or malfunctioning. Check the wiring, replace the blaster or assign another working CandyBox port to this device`

### bootstrappedPlatformError

Error title: `Cannot continue: Suitest bootstrap app is not running`

Error description: `Suitest tried to start the bootstrap application on this device but failed several times and will try no more. Please connect to the device and start the bootstrap app manually, then disconnect and the scheduled test will continue. If you have configured the Suitest channel, tune the TV to this channel and verify that Suitest badge is displayed on TV in the top right corner. If you have not configured the Suitest channel, please contact support`

### candyBoxOffline

Error title: `Cannot continue: CandyBox controlling this device is offline`

Error description: `Check that the cable plugged into the CandyBox delivers Internet connection or reboot the CandyBox and allow about 5 minutes for it to initialize`

### deviceDeleted

Error title: `Cannot continue: Device is deleted`

Error description: `The device on which the execution was scheduled has been deleted. Please cancel the test and schedule it on another available device`

### deviceDisabled

Error title: `This device is disabled`

Error description: `For the execution to continue please enable the device`

### deviceInUse

Error title: `A user is currently connected to this device`

Error description: `Execution will continue after the user disconnects`

### internalError

Error title: `Cannot continue: Internal error occurred`

Error description: `We are very sorry, but some fishy error occurred when Suitest was trying to execute your test. Our developers have been notified and are already working hard to resolve the problem`

### lgWebosPlatformError

Error title: `Cannot continue: LG WebOS driver has failed`

Error description: `LG WebOS driver has misbehaved. Please verify that the device is online and it's current IP address is correctly specified in Suitest. Then doublecheck if the Development mode is enabled on the device. If nothing helps try rebooting the device and/or the CandyBox`

### noActivePlan

Error title: `Cannot continue: Your subscription has expired`

Error description: `Your subscription has expired, to continue using Suitest please [renew your subscription](https://the.suite.st/preferences/billing)`

### noAvailableAutomatedMinutes

Error title: `Cannot continue: you\'ve used up all of your testing minutes`

Error description: `You testing a lot! How about [getting a bigger subscription](https://the.suite.st/preferences/billing)? Or, if you would like to purchase more testing minutes for the current billing cycle, please contact sales@suite.st. Your testing minutes will renew`

### notDefinedPlatform

Error title: `Cannot continue: Device does not support this platform`

Error description: `You have scheduled the test execution with a configuration that depends on a platform, which this device does not currently support. You should either configure the platform on the device or cancel the test run`

### planLimitExceeded

Error title: `TODO`

Error description: `TODO`

### rokuPlatformError

Error title: `Cannot continue: Roku driver has failed`

Error description: `TODO`

### runningBootSequence

Error title: `Trying to open Suitest bootstrap application`

Error description: `Test will start after the Suitest bootstrap application will open. Suitest will attempt to open the app in a number of ways. After each attempt it will wait for 60 seconds for the app to respond. If it will not, Suitest will try the next available method. Current methods are: 1) Sending EXIT key to the device, 2) Executing user defined boot sequence, 3) turning the TV on and off 4) Turning the TV on again. If starting the test takes a long time, you should configure a better boot sequence`

### suitestDriveOffline

Error title: `Cannot continue: SuitestDrive controlling this device is offline`

Error description: `SuitestDrive controlling this device is not currently running or is offline. Please verify that the host computer has Internet connection and that SuitestDrive is running`

### testQueued

Error title: `Test is added to queue`

Error description: `Execution will start as soon as other tests queued on this device will finish execution`

### xboxPlatformError

Error title: `Cannot continue: Xbox driver has failed`

Error description: `Xbox driver has misbehaved. Please verify that the device is online and it's current IP address and developer credentials are correctly specified in Suitest. If nothing helps try rebooting the device and restarting SuitestDrive`
