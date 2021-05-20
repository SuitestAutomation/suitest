import {Translation} from './types';
import {PROGRESS_STATUS, ProgressStatus, NotStartedReason} from './constants';
import {translateNotStartedReason} from './notStartedReason';
import {jsx} from '@suitest/smst';

/**
 * @description Get humanized progress status explanation result
 * @throws {Error} Throws an Error if unknown status is provided or code is required and missing
 */
export function translateProgress(message: ProgressMessage): Translation {
	if ('code' in message && message.code !== undefined) {
		return translateNotStartedReason(message.code);
	}

	if (message.status === undefined) {
		throw new Error('A status is expected.');
	}

	switch (message.status) {
		case PROGRESS_STATUS.OPENING_APP: return {
			title: <text>Trying to open app…</text>,
		};
		case PROGRESS_STATUS.CLOSING_APP: return {
			title: <text>Trying to close app…</text>,
		};
		case PROGRESS_STATUS.BOOTING_DEVICE: return {
			title: <text>Running the boot sequence defined for the device…</text>,
		};
		case PROGRESS_STATUS.WAIT_FOR_MANUAL_ACTION: return {
			title: <text>Paused. For this platform, install and open the application manually.</text>,
		};
		case PROGRESS_STATUS.DEVICE_IDENTIFICATION: return {
			title: <text>Trying to recover Suitest device ID…</text>,
		};
		case PROGRESS_STATUS.SELECTING_SUITESTIFY_INSTANCE: return {
			title: <text>Selecting nearest suitestify instance…</text>,
		};
		case PROGRESS_STATUS.WAITING_FOR_BOOTSTRAP: return {
			title: <text>Waiting for connection from the Suitest app on device…</text>,
		};
		case PROGRESS_STATUS.WAITING_FOR_IL: return {
			title: <text>Waiting for connection from the instrumentation library…</text>,
		};
		case PROGRESS_STATUS.APP_UNINSTALL: return {
			title: <text>Uninstalling app…</text>,
		};
		case PROGRESS_STATUS.APP_UPLOAD_INSTALL: return {
			title: <text>Uploading and installing app…</text>,
		};
		case PROGRESS_STATUS.NOTHING:
		case PROGRESS_STATUS.ACTION_FAILED: return {
			title: <text>{''}</text>,
		};
		default:
			const _status: never = message.status;
			throw new Error(`Unknown status code received: ${_status}`);
	}
}

type ProgressMessage = {
	code?: NotStartedReason,
	status?: ProgressStatus,
};
