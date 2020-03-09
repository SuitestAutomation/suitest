import {jsx} from '../jsxFactory';
import {toText} from '../renderers/text';
import {toHtml} from '../renderers/html';

describe('AST renderers', () => {
	const plainText = <fragment>TEXT</fragment>;
	const boldText = <bold>BOLD</bold>;
	const emphText = <emphasis>EMPH</emphasis>;
	const codeText = <code>CODE</code>;
	const paragraph = <paragraph>TEST <bold>bold</bold></paragraph>;

	const simpleCodeBlockWithLabel = <code-block label="The code">
		someJS();
	</code-block>;
	const longCodeBlock = <code-block>
		someJS(); someJS(); someJS(); someJS(); someJS(); someJS(); someJS(); someJS(); someJS(); someJS();
	</code-block>;

	const simpleTableWithLabel = <table label="Simple label">
		<row>
			<cell>1:1</cell>
			<cell>1:2</cell>
		</row>
		<row>
			<cell>2:1</cell>
			<cell>2:2</cell>
		</row>
	</table>;
	const longTable = <table>
		<row>
			<cell>1:1</cell>
			<cell>1:2 1:2 1:2 1:2 1:2 1:2 1:2 1:2 1:2 1:2 1:2 1:2 1:2 1:2 1:2 1:2 1:2 1:2</cell>
		</row>
	</table>;

	const simpleDictionaryWithLabel = <dictionary label={<bold>BOLD label</bold>}>
		<row>
			<cell>Term</cell>
			<cell>Definition</cell>
		</row>
		<row>
			<cell>Longer Term 2</cell>
			<cell>Definition 2</cell>
		</row>
	</dictionary>;
	const longDictionary = <dictionary>
		<row>
			<cell>Term</cell>
			<cell>Definition Definition Definition Definition Definition Definition Definition Definition</cell>
		</row>
	</dictionary>;

	const condition = <condition title="I am condition">
		<paragraph>I am content</paragraph>
	</condition>;
	const testLine = <test-line title="I am test line">
		<paragraph>I am content</paragraph>
	</test-line>;

	describe('plain text renderer', () => {
		it('should handle textual nodes', () => {
			expect(toText(plainText, false)).toEqual('TEXT');
			expect(toText(boldText, false)).toEqual('BOLD');
			expect(toText(emphText, false)).toEqual('EMPH');
			expect(toText(codeText, false)).toEqual('CODE');
			expect(toText(paragraph, false)).toEqual('TEST bold\n');
		});

		it('should handle code blocks', () => {
			expect(toText(simpleCodeBlockWithLabel, false)).toMatchSnapshot();
			expect(toText(longCodeBlock, false)).toMatchSnapshot();
		});

		it('should handle tables', () => {
			expect(toText(simpleTableWithLabel, false)).toMatchSnapshot();
			expect(toText(longTable, false)).toMatchSnapshot();
		});

		it('should handle dictionaries', () => {
			expect(toText(simpleDictionaryWithLabel, false)).toMatchSnapshot();
			expect(toText(longDictionary, false)).toMatchSnapshot();
		});

		it('should render condition', () => {
			expect(toText(condition, false)).toMatchSnapshot();
		});

		it('should render test line', () => {
			expect(toText(testLine, false)).toMatchSnapshot();
		});
	});

	describe('formatted text renderer', () => {
		it('should handle textual nodes', () => {
			expect(toText(plainText, true)).toEqual('TEXT');
			expect(toText(boldText, true)).toEqual('\u001b[32mBOLD\u001b[0m');
			expect(toText(emphText, true)).toEqual('\u001b[4mEMPH\u001b[0m');
			expect(toText(codeText, true)).toEqual('\u001b[36mCODE\u001b[0m');
			expect(toText(paragraph, true)).toEqual('TEST \u001b[32mbold\u001b[0m\n');
		});

		it('should handle code blocks', () => {
			expect(toText(simpleCodeBlockWithLabel, true)).toMatchSnapshot();
			expect(toText(longCodeBlock, true)).toMatchSnapshot();
		});

		it('should handle tables', () => {
			expect(toText(simpleTableWithLabel, true)).toMatchSnapshot();
			expect(toText(longTable, true)).toMatchSnapshot();
		});

		it('should handle dictionaries', () => {
			expect(toText(simpleDictionaryWithLabel, true)).toMatchSnapshot();
			expect(toText(longDictionary, true)).toMatchSnapshot();
		});

		it('should render condition', () => {
			expect(toText(condition, true)).toMatchSnapshot();
		});

		it('should render test line', () => {
			expect(toText(testLine, true)).toMatchSnapshot();
		});
	});

	describe('html renderer', () => {
		it('should handle textual nodes', () => {
			expect(toHtml(plainText)).toEqual('TEXT');
			expect(toHtml(boldText)).toEqual('<span class="suitest-test-line__text--bold">BOLD</span>');
			expect(toHtml(emphText)).toEqual('<span class="suitest-test-line__text--emphasis">EMPH</span>');
			expect(toHtml(codeText)).toEqual('<code class="suitest-test-line__text--code">CODE</code>');
			expect(toHtml(paragraph)).toMatchSnapshot();
		});

		it('should handle code blocks', () => {
			expect(toHtml(simpleCodeBlockWithLabel)).toMatchSnapshot();
			expect(toHtml(longCodeBlock)).toMatchSnapshot();
		});

		it('should handle tables', () => {
			expect(toHtml(simpleTableWithLabel)).toMatchSnapshot();
			expect(toHtml(longTable)).toMatchSnapshot();
		});

		it('should handle dictionaries', () => {
			expect(toHtml(simpleDictionaryWithLabel)).toMatchSnapshot();
			expect(toHtml(longDictionary)).toMatchSnapshot();
		});

		it('should render condition', () => {
			expect(toHtml(condition)).toMatchSnapshot();
		});

		it('should render test line', () => {
			expect(toHtml(testLine)).toMatchSnapshot();
		});
	});
});
