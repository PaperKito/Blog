export type GalleryAlbum = {
	id: string;
	name: string;
	description?: string;
	date?: string;
	location?: string;
	tags?: string[];
	cover?: string;
	password?: string;
	passwordHint?: string;
};

export type GalleryConfig = {
	albums: GalleryAlbum[];
	columnWidth?: number;
};
