export type ElementId = string;

// Element, as delivered by result details feed
export type Element = {
	name: string,
};

// Map - id: element
export type Elements = {
	[key: string]: Element,
};
