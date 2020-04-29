export type StringComparator = '=' | '!=' | '~' | '!~' | '^' | '!^' | '$' | '!$';

export type NumberComparator = '=' | '!=' | '+-' | '>' | '>=' | '<' | '<=';

export type ColorComparator = '=' | '!=' | '+-';

export type JavaScriptComparator = 'matches';

type ExistComparator = 'exists' | '!exists';

export type Comparator =
	StringComparator
	| NumberComparator
	| ColorComparator
	| JavaScriptComparator
	| ExistComparator;
