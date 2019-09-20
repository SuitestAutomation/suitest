import t from './texts';
import {Translation} from './types';
import {PROGRESS_STATUS, ProgressStatus, NotStartedReason} from './constants';
import {translateNotStartedReason} from './notStartedReason';

/**
 * @description Get humanized progress status explanation result
 */
export function translateProgress(message: ProgressMessage): Translation | undefined {
	if ('code' in message && message.code !== undefined) {
		return translateNotStartedReason(message.code);
	}

	switch (message.status) {
		case PROGRESS_STATUS.OPENING_APP: return {title: t['progress.status.openingApp']()};
		case PROGRESS_STATUS.CLOSING_APP: return {title: t['progress.status.closingApp']()};
		case PROGRESS_STATUS.BOOTING_DEVICE: return {title: t['progress.status.bootingDevice']()};
		case PROGRESS_STATUS.WAIT_FOR_MANUAL_ACTION: return {title: t['progress.status.needManual']()};
		case PROGRESS_STATUS.DEVICE_IDENTIFICATION: return {title: t['progress.status.recoveringID']()};
		case PROGRESS_STATUS.WAITING_FOR_BOOTSTRAP: return {title: t['progress.status.waitingForConnectionFromBootstrap']()};
		case PROGRESS_STATUS.WAITING_FOR_IL: return {title: t['progress.status.waitingForConnectionFromIL']()};
		case PROGRESS_STATUS.APP_UNINSTALL: return {title: t['progress.status.unistallingApp']()};
		case PROGRESS_STATUS.APP_UPLOAD_INSTALL: return {title: t['progress.status.uploadingAndInstallingApp']()};
		case PROGRESS_STATUS.NOTHING: return {title: ''};
		// actionFailed should come with code, so it will be proceeded by translateStartupError above
		case 'actionFailed': break;
		default:
			const _status: never = message.status;
			console.warn(_status, 'progress status not handled');
	}

	return undefined;
}

type ProgressMessage = {
	status?: typeof PROGRESS_STATUS.ACTION_FAILED,
	code: NotStartedReason,
} | {
	status: ProgressStatus,
	code?: undefined,
};
