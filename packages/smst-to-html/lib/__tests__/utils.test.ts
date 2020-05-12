import {escapeHtml} from '../utils';

describe('Translation utils', () => {
	describe('escapeHtml util', () => {
		it('should escape special characters', () => {
			expect(escapeHtml('& < " \'')).toEqual('&amp; &lt; &quot; &#039;');
		});

		it('should replace entities even if they repeat', () => {
			expect(escapeHtml('&&&')).toEqual('&amp;&amp;&amp;');
		});
	});
});
