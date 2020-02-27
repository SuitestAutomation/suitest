import {translateCondition} from '../conditions';
import {
	AppConfiguration,
	Comparator, Elements,
	NetworkRequestBodyInfo, NetworkRequestHeaderInfo, NetworkRequestMethodInfo,
	NetworkRequestStatusInfo,
} from '@suitest/types';

describe('conditions translation', () => {
	const config: AppConfiguration = {
		platform: 'hbbtv',
		suitestify: true,
		domainList: [],
		domainCandidates: [],
		notDomains: [],
		freezeRules: [],
		learnDomains: true,
		codeOverrides: {},
		configVariables: [
			{
				key: 'var1',
				value: 'val1',
			},
			{
				key: 'var2',
				value: 'val2',
			},
			{
				key: 'var3',
				value: '3',
			},
		],
	};
	const elements: Elements = {
		'element-id-1': {
			name: 'Element 1',
		},
	};
	const lines = {
		'application has exited': {
			subject: {
				type: 'application',
			},
			type: 'exited',
		},
		'current location': {
			subject: {
				type: 'location',
			},
			type: '~',
			val: 'expected <%var1%>',
		},
		'cookie': {
			subject: {
				type: 'cookie',
				val: 'my-cookie<%var1%>',
			},
			type: '!=',
			val: 'expected<%var2%>',
		},
		'element exists': {
			subject: {
				type: 'video',
			},
			type: 'exists',
		},
		'element does not exist': {
			subject: {
				type: 'element',
				elementId: 'element-id-1',
			},
			type: '!exists',
		},
		'element is visible': {
			subject: {
				type: 'element',
				apiId: 'My element',
			},
			type: 'visible',
		},
		'element matches JS': {
			subject: {
				type: 'element',
				val: {
					css: '.some.class',
					xpath: '//div',
					ifMultipleFoundReturn: 1,
				},
			},
			type: 'matches',
			val: 'thisIsJS("<%var1%>");',
		},
		'element properties': {
			subject: {
				type: 'element',
				elementId: 'unknown-id',
			},
			type: 'has',
			expression: [
				{
					property: 'videoPosition',
					type: '>=',
					val: 123,
				},
				{
					property: 'height',
					type: '+-',
					val: 123,
					deviation: '<%var3%>',
				},
				{
					property: 'text',
					type: '~',
					val: 'expected text',
				},
			] as Array<{property: string, type: Comparator, val: string | number, deviation?: number}>,
		},
		'network request to URL was made including matched': {
			subject: {
				type: 'network',
				compare: '=',
				val: 'http://suite.st/<%var1%>',
			},
			type: 'made',
			searchStrategy: 'all',
		},
		'network request matching URL was not made excluding previously matched': {
			subject: {
				type: 'network',
				compare: '~',
				val: '/partial/url/<%var1%>',
				requestInfo: [
					{
						name: '@method',
						compare: '=',
						val: 'GET',
					},
					{
						name: '@body',
						compare: '=',
						val: 'request <%var2%> body',
					},
					{
						name: 'Accept-Type',
						compare: '~',
						val: 'text/javascript',
					},
				] as Array<NetworkRequestBodyInfo | NetworkRequestMethodInfo | NetworkRequestHeaderInfo>,
				responseInfo: [
					{
						name: '@status',
						compare: '>',
						val: 123,
					},
					{
						name: '@body',
						compare: '=',
						val: 'response <%non_existing_var%> <%kind-of|var but not%> body',
					},
					{
						name: 'Content-<%var1%>',
						compare: '$',
						val: '<%var2%>/javascript',
					},
				] as Array<NetworkRequestBodyInfo | NetworkRequestStatusInfo | NetworkRequestHeaderInfo>,
			},
			type: '!made',
			searchStrategy: 'notMatched',
		},
	} as const;

	for (const [name, definition] of Object.entries(lines)) {
		it(`should translate "${name}" line`, () => {
			expect(translateCondition(definition, config, elements)).toMatchSnapshot();
		});
	}
});
