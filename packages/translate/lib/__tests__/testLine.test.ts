import {toText} from '@suitest/smst-to-text';
import {TestLine} from '@suitest/types';
import {translateTestLine} from '../testLine';
import {appConfig, conditions, elements, snippets, testLinesExamples} from './testLinesExamples';

const defaultTestLineProperties: Pick<
	TestLine,
	'lineId' | 'excluded' | 'fatal' | 'screenshot'
> = {
	lineId: 'line-id',
	excluded: false,
	fatal: false,
	screenshot: false,
};

describe('Test Lines translation', () => {
	for (const [name, line] of Object.entries(testLinesExamples)) {
		it(`Should translate test line "${name}"`, () => {
			expect(translateTestLine({testLine: line(), appConfig, elements, snippets})).toMatchSnapshot();
		});

		it(`Should translate test line "${name}" without appConfig`, () => {
			expect(translateTestLine({ testLine: line(), elements, snippets })).toMatchSnapshot();
		});
	}

	it('Should display empty configuration variables', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'sleep',
			timeout: '<%emptyVar%>',
		};
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [{key: 'emptyVar', value: ''}],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toEqual('Sleep [EMPTY STRING] (<%emptyVar%>)');
	});

	it('Should preserve resolved element property values when empty and non-empty variables are mixed', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'assert',
			condition: conditions['element properties']([{
				property: 'text',
				type: '=',
				val: '<%emptyVar%><%var1%>',
			}]),
		};
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [
					{key: 'emptyVar', value: ''},
					{key: 'var1', value: '2'},
				],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('text = 2 (<%emptyVar%><%var1%>)');
	});

	it('Should preserve resolved element property value when an empty variable is followed by text', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'assert',
			condition: conditions['element properties']([{
				property: 'text',
				type: '=',
				val: '<%emptyVar%>WatchMe Demo',
			}]),
		};
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [{key: 'emptyVar', value: ''}],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('text = WatchMe Demo (<%emptyVar%>WatchMe Demo)');
	});

	it('Should display an empty configuration variable in long press duration', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'button',
			ids: ['UP'],
			longPressMs: '<%emptyVar%>',
		};
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [{key: 'emptyVar', value: ''}],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('Press long UP for [EMPTY STRING] (<%emptyVar%>)');
	});

	it('Should resolve a configuration variable in long press duration', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'button',
			ids: ['UP'],
			longPressMs: '<%duration%>',
		};
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [{key: 'duration', value: '2'}],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('Press long UP for 2ms (<%duration%>)');
	});

	it('Should preserve existing behavior for zero long press duration', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'button',
			ids: ['UP'],
			longPressMs: 0,
		};
		const result = translateTestLine({testLine, appConfig});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toEqual('Press UP');
	});

	it('Should preserve an unknown variable in long press duration', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'button',
			ids: ['UP'],
			longPressMs: '<%unknown%>',
		};
		const result = translateTestLine({testLine, appConfig});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('Press long UP for <%unknown%>ms');
	});

	it('Should display empty and resolved configuration variables in window size', () => {
		const testLine = testLinesExamples['Browser command: Set window size'](
			'<%emptyVar%>',
			'<%emptyVar%><%height%>',
		);
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [
					{key: 'emptyVar', value: ''},
					{key: 'height', value: '2'},
				],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('size = [EMPTY STRING] (<%emptyVar%>)x2 (<%emptyVar%><%height%>)');
	});

	it('Should resolve configuration variables in window size', () => {
		const testLine = testLinesExamples['Browser command: Set window size'](
			'<%width%>',
			'<%height%>',
		);
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [
					{key: 'width', value: '1280'},
					{key: 'height', value: '720'},
				],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('size = 1280 (<%width%>)x720 (<%height%>)');
	});

	it('Should display an empty configuration variable in interval', () => {
		const testLine = testLinesExamples['Press ... every ... exactly ...'](
			['UP'],
			1,
			'<%emptyVar%>',
		);
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [{key: 'emptyVar', value: ''}],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('Press UP every [EMPTY STRING] (<%emptyVar%>)');
	});

	it('Should resolve a configuration variable in interval', () => {
		const testLine = testLinesExamples['Press ... every ... exactly ...'](
			['UP'],
			1,
			'<%interval%>',
		);
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [{key: 'interval', value: '2'}],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('Press UP every 0.002s (<%interval%>)');
	});

	it('Should display an empty configuration variable in scroll distance', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'scroll',
			target: {type: 'element', elementId: 'element-id-1'},
			scroll: [{direction: 'down', distance: '<%emptyVar%>'}],
		};
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [{key: 'emptyVar', value: ''}],
			},
			elements,
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('down by [EMPTY STRING] (<%emptyVar%>)');
	});

	it('Should resolve a configuration variable in scroll distance', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'scroll',
			target: {type: 'element', elementId: 'element-id-1'},
			scroll: [{direction: 'down', distance: '<%distance%>'}],
		};
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [{key: 'distance', value: '5'}],
			},
			elements,
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('down by 5px (<%distance%>)');
	});

	it('Should preserve a resolved scroll distance when empty and non-empty variables are mixed', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'scroll',
			target: {type: 'element', elementId: 'element-id-1'},
			scroll: [{direction: 'down', distance: '<%emptyVar%><%distance%>'}],
		};
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [
					{key: 'emptyVar', value: ''},
					{key: 'distance', value: '5'},
				],
			},
			elements,
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('down by 5px (<%emptyVar%><%distance%>)');
	});

	it('Should display an empty swipe distance and resolve a mixed swipe duration', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'swipe',
			target: {type: 'element', elementId: 'element-id-1'},
			swipe: [{
				direction: 'down',
				distance: '<%emptyVar%>',
				duration: '<%emptyVar%><%duration%>',
			}],
		};
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [
					{key: 'emptyVar', value: ''},
					{key: 'duration', value: '5'},
				],
			},
			elements,
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('down by [EMPTY STRING] (<%emptyVar%>) in 5ms (<%emptyVar%><%duration%>)');
	});

	it('Should resolve a swipe distance and display an empty swipe duration', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'swipe',
			target: {type: 'element', elementId: 'element-id-1'},
			swipe: [{
				direction: 'down',
				distance: '<%distance%>',
				duration: '<%emptyVar%>',
			}],
		};
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [
					{key: 'distance', value: '5'},
					{key: 'emptyVar', value: ''},
				],
			},
			elements,
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain('down by 5px (<%distance%>) in [EMPTY STRING] (<%emptyVar%>)');
	});

	it('Should preserve resolved swipe distance and duration when variables are mixed', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'swipe',
			target: {type: 'element', elementId: 'element-id-1'},
			swipe: [{
				direction: 'down',
				distance: '<%emptyVar%><%distance%>',
				duration: '<%emptyVar%><%duration%>',
			}],
		};
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [
					{key: 'emptyVar', value: ''},
					{key: 'distance', value: '5'},
					{key: 'duration', value: '5000'},
				],
			},
			elements,
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toContain(
				'down by 5px (<%emptyVar%><%distance%>) in 5000ms (<%emptyVar%><%duration%>)',
			);
	});

	it('Should display an empty x coordinate and resolve a mixed y coordinate', () => {
		const testLine = testLinesExamples['Click on position ... once'](
			'<%emptyVar%>',
			'<%emptyVar%><%coordinate%>',
		);
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [
					{key: 'emptyVar', value: ''},
					{key: 'coordinate', value: '5'},
				],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toEqual(
				'Click on position (x:[EMPTY STRING] (<%emptyVar%>), y:5 (<%emptyVar%><%coordinate%>))',
			);
	});

	it('Should resolve the x coordinate and display an empty y coordinate', () => {
		const testLine = testLinesExamples['Click on position ... once'](
			'<%coordinate%>',
			'<%emptyVar%>',
		);
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [
					{key: 'coordinate', value: '5'},
					{key: 'emptyVar', value: ''},
				],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toEqual(
				'Click on position (x:5 (<%coordinate%>), y:[EMPTY STRING] (<%emptyVar%>))',
			);
	});

	it('Should preserve resolved position coordinates when variables are mixed', () => {
		const coordinateExpression = '<%emptyVar%><%coordinate%>';
		const testLine = testLinesExamples['Click on position ... once'](
			coordinateExpression,
			coordinateExpression,
		);
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [
					{key: 'emptyVar', value: ''},
					{key: 'coordinate', value: '5'},
				],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toEqual(
				`Click on position (x:5 (${coordinateExpression}), y:5 (${coordinateExpression}))`,
			);
	});

	it('Should resolve configuration variables in screen position coordinates', () => {
		const testLine: TestLine = {
			...defaultTestLineProperties,
			type: 'tap',
			target: {
				type: 'screen',
				coordinates: {
					x: '<%emptyVar%>',
					y: '<%emptyVar%><%coordinate%>',
				},
			},
			taps: [{type: 'single'}],
		};
		const result = translateTestLine({
			testLine,
			appConfig: {
				...appConfig,
				configVariables: [
					{key: 'emptyVar', value: ''},
					{key: 'coordinate', value: '5'},
				],
			},
		});

		expect(toText(result, {format: false, verbosity: 'normal'}))
			.toEqual(
				'Single tap on position (x:[EMPTY STRING] (<%emptyVar%>), y:5 (<%emptyVar%><%coordinate%>))',
			);
	});
});
