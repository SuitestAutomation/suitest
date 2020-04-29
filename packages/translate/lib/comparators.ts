import {Comparator} from '@suitest/types';

/**
 * Translate only values that might be unclear to user, like "^",
 * leave obvious comparators as they are
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const translateComparator = (comparator: Comparator) => {
	switch (comparator) {
		case '~':
			return 'contains';
		case '!~':
			return '! contains';
		case '^':
			return 'starts with';
		case '!^':
			return '! starts with';
		case '$':
			return 'ends with';
		case '!$':
			return '! ends with';
		case '+-':
			// deviation should be shown next to expected value
			return '=';
		case 'matches':
			return 'matches JS';
		default:
			return comparator;
	}
};
