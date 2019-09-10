import {translateProgress} from '../progress';

describe('Interactive progress explanation.', () => {
	describe('Test actionFailed status with codes.', () => {
		it('Should return empty result if code not provided', () => {
			expect(translateProgress({status: 'actionFailed'}))
				.toStrictEqual({title: ''});
		});

		it('Should return empty result if code is unknown', () => {
			expect(translateProgress({status: 'actionFailed', code: 'unknownCode' as any}))
				.toStrictEqual({title: ''});
		});

		it('Should return translation if code is valid', () => {
			expect(translateProgress({code: 'noActivePlan'}))
				.toStrictEqual({
					title: 'Cannot continue: Your subscription has expired',
					description: 'Your subscription has expired, to continue using Suitest please [renew your subscription](https://the.suite.st/preferences/billing)',
				});
		});
	});

	describe('Test results with', () => {
		it('status "nothing" should be empty string.', () => {
			expect(translateProgress({status: 'nothing'}))
				.toStrictEqual({title: ''});
		});

		it('unknown status should be empty string.', () => {
			expect(translateProgress({status: 'unknownStatus' as any}))
				.toStrictEqual({title: ''});
		});

		it('valid status should return translation.', () => {
			expect(translateProgress({status: 'bootingDevice'}))
				.toStrictEqual({title: 'Running the boot sequence defined for the device...'});
		});
	});
});
