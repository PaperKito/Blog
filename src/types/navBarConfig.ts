export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
	icon?: string;
	children?: NavBarLink[];
	pageKey?: string;
};

export enum NavBarSearchMethod {
	PageFind = 0,
}

export type NavBarSearchConfig = {
	method: NavBarSearchMethod;
};

export type NavBarConfig = {
	links: NavBarLink[];
};
