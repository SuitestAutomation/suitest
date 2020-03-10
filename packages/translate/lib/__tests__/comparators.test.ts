import {translateComparator} from '../comparators';

describe('Comparators translation', () => {
	it('should translate values, that hard to interpret, to a human readable string', () => {
		expect(translateComparator('~')).toEqual('contains');
		expect(translateComparator('!~')).toEqual('! contains');
		expect(translateComparator('^')).toEqual('starts with');
		expect(translateComparator('!^')).toEqual('! starts with');
		expect(translateComparator('$')).toEqual('ends with');
		expect(translateComparator('!$')).toEqual('! ends with');
		expect(translateComparator('+-')).toEqual('=');
		expect(translateComparator('matches')).toEqual('matches JS');
		expect(translateComparator('=')).toEqual('=');
	});
});
