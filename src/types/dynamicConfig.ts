export type DynamicConfig = {
	title?: string;
	description?: string;

	profileUrl?: string;
	showComment?: boolean;
	itemsPerPage?: number;

	apiUrl?: string;

	memos?: DynamicMemocsConfig;
};

export type DynamicMemocsConfig = {

	enable: boolean;

	apiUrl: string;

	parent?: string;
};
