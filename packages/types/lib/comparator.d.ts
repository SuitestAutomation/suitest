export type StringComparator = '=' | '!=' | '~' | '!~' | '^' | '!^' | '$' | '!$';

export type NumberComparator = '=' | '!=' | '+-' | '>' | '>=' | '<' | '<=';

export type ColorComparator = '=' | '!=' | '+-';

export type JavaScriptComparator = 'matches';

export type Comparator = StringComparator | NumberComparator | ColorComparator | JavaScriptComparator;
