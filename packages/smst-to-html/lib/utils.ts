export const escapeHtml = (text: string): string => text.replace(/[&<"']/g, m => {
	switch (m) {
		case '&':
			return '&amp;';
		case '<':
			return '&lt;';
		case '"':
			return '&quot;';
		default: // single quote
			return '&#039;';
	}
});
