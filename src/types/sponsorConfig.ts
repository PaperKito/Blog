export type SponsorMethod = {
	name: string;
	icon?: string;
	qrCode?: string;
	link?: string;
	description?: string;
	enabled: boolean;
};

export type SponsorConfig = {
	title?: string;
	showComment?: boolean;
	showButtonInPost?: boolean;
	methods: SponsorMethod[];
};
