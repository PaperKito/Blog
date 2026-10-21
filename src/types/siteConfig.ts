import type {
	DARK_MODE,
	LIGHT_MODE,
	SYSTEM_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "../constants/constants";
import type { ImmersiveReadingConfig } from "./immersiveReadingConfig";
import type { NsfwMode } from "./nsfw";

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof SYSTEM_MODE;

export type WALLPAPER_MODE =
	| typeof WALLPAPER_BANNER
	| typeof WALLPAPER_FULLSCREEN
	| typeof WALLPAPER_OVERLAY
	| typeof WALLPAPER_NONE;

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export type NavbarMode = "static" | "fixed" | "dynamic";

export type SiteConfig = {
	title: string;
	subtitle: string;
	site_url: string;
	description?: string;
	keywords?: string[];

	lang: "en" | "zh_CN" | "zh_TW" | "ja" | "ru" | "ko";

	themeColor: {
		hue: number;
		defaultMode?: LIGHT_DARK_MODE;
	};

	pageWidth?: number;

	card: {

		border: boolean;

		followTheme?: boolean;
	};

	siteStartDate?: string;

	timezone?: string;

	favicon: Array<{
		src: string;
		theme?: "light" | "dark";
		sizes?: string;
	}>;

	navbar: {

		logo?: {
			type: "icon" | "image" | "url";
			value: string;
			valueDark?: string;
			alt?: string;
		};
		title?: string;
		widthFull?: boolean;
		menuAlign?: "left" | "center";
		followTheme?: boolean;

		navbarMode?: NavbarMode;

		stickyNavbar?: boolean;
	};

	pages: {
		booknav: boolean;
		friends: boolean;
		sponsor: boolean;
		guestbook: boolean;
		bangumi: boolean;
		vndb: boolean;
		mal: boolean;
		gallery: boolean;
		bilibili: boolean;
		dynamic: boolean;
		projects: boolean;
	};

	categoryBar?: boolean;

	categoryStyle?: "pill" | "rectangle";

	tagStyle?: "pill" | "pill-gray" | "rectangle";

	foldArticle?: boolean;

	postListLayout: {
		defaultMode: "list" | "grid";
		mobileDefaultMode?: "list" | "grid";

		coverPosition?: "left" | "right";
		descriptionLines?: number;
		showStatsIcons?: boolean;

		tagsPosition?: "meta" | "bottom";

		tagsBottomStyle?: "chip" | "text";

		meta?: {
			showPublished?: boolean;
			showCategory?: boolean;
			showTags?: boolean;
			tagCount?: number;
			showWords?: boolean;
			showReadingTime?: boolean;
		};

		stats?: {
			showPublished?: boolean;
			showWords?: boolean;
			showReadingTime?: boolean;
		};
		grid: {

			masonry: boolean;

			columnWidth?: number;

			coverFullWidth?: boolean;
		};
	};

	post: {

		rehypeCallouts: {
			theme: "github" | "obsidian" | "vitepress" | "docusaurus";
			enablePythonMarkdownAdmonitions?: boolean;
		};

		showLastModified: boolean;

		outdatedThreshold?: number;

		share: boolean;

		postNavigation: boolean;

		relatedPosts: boolean;

		randomPosts: boolean;

		generateOgImages: boolean;

		immersiveReading?: ImmersiveReadingConfig;
	};

	bangumi?: {
		userId?: string;
		mode?: "static" | "dynamic";
		apiUrl?: string;
		subjectBaseUrl?: string;
		categoryOrder?: ("anime" | "game" | "book" | "music" | "real")[];

		categories?: {
			book?: boolean;
			anime?: boolean;
			music?: boolean;
			game?: boolean;
			real?: boolean;
		};
		nsfw?: NsfwMode;
	};

	vndb?: {
		userId?: string;
		mode?: "static" | "dynamic";
		downloadCovers?: boolean;
		apiUrl?: string;
		vnBaseUrl?: string;
		apiToken?: string;
		nsfw?: NsfwMode;
	};

	mal?: {
		username?: string;
		clientId?: string;
		apiUrl?: string;
		animeBaseUrl?: string;
		mangaBaseUrl?: string;
		nsfw?: NsfwMode;
	};

	bilibili?: {
		uid?: string;
	};

	pagination: {
		postsPerPage: number;
	};

	imageOptimization?: {

		formats?: "avif" | "webp" | "both";

		quality?: number;

		noReferrerDomains?: string[];
	};

	feed?: {

		contentMode?: "full" | "summary";
	};
};
