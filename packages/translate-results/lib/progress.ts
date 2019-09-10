import t from './texts';
import {Translation} from './types';
import {StartupError, translateStartupError} from './startup';

/**
 * @description Get humanized progress status explanation result
 */
export function translateProgress(message: ProgressMessage): Translation {
	if ('code' in message) {
		return translateStartupError(message.code);
	}

	switch (message.status) {
		case 'openingApp': return {title: t['progress.status.openingApp']()};
		case 'closingApp': return {title: t['progress.status.closingApp']()};
		case 'bootingDevice': return {title: t['progress.status.bootingDevice']()};
		case 'needManual': return {title: t['progress.status.needManual']()};
		case 'recoveringID': return {title: t['progress.status.recoveringID']()};
		case 'waitingForConnectionFromBootstrap': return {title: t['progress.status.waitingForConnectionFromBootstrap']()};
		case 'waitingForConnectionFromIL': return {title: t['progress.status.waitingForConnectionFromIL']()};
		case 'unistallingApp': return {title: t['progress.status.unistallingApp']()};
		case 'uploadingAndInstallingApp': return {title: t['progress.status.uploadingAndInstallingApp']()};
		case 'nothing': break;
		// actionFailed should comes with code, so it will proceeded by translateStartupError above
		case 'actionFailed': break;
		default:
			const _status: never = message.status;
			console.warn(_status, 'progression status not handled');
	}

	return {title: ''};
}

export const PROGRESS_STATUS = Object.freeze({
	actionFailed: 'actionFailed',
	openingApp: 'openingApp',
	closingApp: 'closingApp',
	bootingDevice: 'bootingDevice',
	needManual: 'needManual',
	nothing: 'nothing',
	recoveringID: 'recoveringID',
	waitingForConnectionFromBootstrap: 'waitingForConnectionFromBootstrap',
	waitingForConnectionFromIL: 'waitingForConnectionFromIL',
	unistallingApp: 'unistallingApp',
	uploadingAndInstallingApp: 'uploadingAndInstallingApp',
} as const);

export type ProgressStatus = keyof typeof PROGRESS_STATUS;

type ProgressMessage = {
	status?: typeof PROGRESS_STATUS.actionFailed
	code: StartupError,
} | {
	status: ProgressStatus,
};
