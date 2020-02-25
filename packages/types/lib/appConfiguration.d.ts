// TODO - not complete for all platforms
export type AppConfiguration = {
	url?: string,
	platform: string, // TODO enum
	suitestify: boolean,
	domainList: string[],
	learnDomains: boolean,
	domainCandidates: string[],
	notDomains: string[],
	freezeRules: Array<{
		methods: string[],
		url: string,
		type: string, // TODO enum
		toUrl?: string,
		active: boolean,
	}>,
	codeOverrides: {[key: string]: string},
	configVariables: Array<{
		key: string,
		value: string,
	}>,
	overrideOpenApps?: string,
	launchActivity?: string,
};
