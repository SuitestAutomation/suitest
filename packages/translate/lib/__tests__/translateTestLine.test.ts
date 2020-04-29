import {testLineToFormattedText, testLineToHtml, testLineToPlainText} from '../translateTestLine';
import {appConfig, testLines} from './testLines';

describe('translateTestLine module', () => {
	const line = testLines['Clear app data']();

	describe('testLineToPlainText function', () => {
		it('should connect AST builder function with plain text renderer', () => {
			expect(testLineToPlainText({lineDefinition: line, appConfig})).toEqual('Clear application data\n');
		});
	});

	describe('testLineToFormattedText function', () => {
		it('should connect AST builder function with formatted text renderer', () => {
			expect(testLineToFormattedText({lineDefinition: line, appConfig})).toEqual('Clear application data\n');
		});
	});

	describe('testLineToHtml function', () => {
		it('should connect AST builder function with HTML renderer', () => {
			expect(testLineToHtml({lineDefinition: line, appConfig})).toMatchSnapshot();
		});
	});
});
