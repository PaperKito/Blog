import type { SiteConfig } from "@/types/siteConfig";
import { resolvePageToggles } from "../utils/page-toggle-utils";
import { resolveSiteLang } from "../utils/site-config-utils";

const SITE_LANG = resolveSiteLang("zh_CN");

const pages = resolvePageToggles({

	friends: true,

	guestbook: true,

	dynamic: false,

	projects: true,

	gallery: true,

	booknav: true,

	bilibili: false,

	bangumi: false,

	vndb: false,

	mal: false,

	sponsor: true,
});

export const siteConfig: SiteConfig = {

	title: "PaperKito",

	subtitle: "个人博客",

	site_url: "https://paperkitoblog-dpbyupmog00q.edgeone.dev",

	description:
		"PaperKito 的个人博客，记录技术折腾、开发与日常思考。",

	keywords: [
		"PaperKito",
		"个人博客",
		"技术博客",
		"Astro",
		"ACGN",
		"静态博客",
	],

	themeColor: {

	hue: 165,

		defaultMode: "system",
	},

	pageWidth: 100,

	card: {

		border: false,

		followTheme: false,
	},

	favicon: [
		{

			src: "/favicon/paperkito-32.png",

		},
	],

	navbar: {

		logo: {
			type: "image",
			value: "assets/images/logo/logo-light.png",
			valueDark: "assets/images/logo/logo-dark.png",
			alt: "🍀",
		},

		title: "PaperKito",

		widthFull: false,

		menuAlign: "center",

		followTheme: false,

		navbarMode: "dynamic",
	},

	siteStartDate: "2025-01-01",

	timezone: "Asia/Shanghai",

	categoryBar: false,

	categoryStyle: "rectangle",

	tagStyle: "pill",

	foldArticle: true,

	postListLayout: {

		defaultMode: "list",

		mobileDefaultMode: "grid",

		coverPosition: "right",

		descriptionLines: 2,

		showStatsIcons: true,

		tagsPosition: "bottom",

		tagsBottomStyle: "chip",

		meta: {

			showPublished: true,

			showCategory: true,

			showTags: true,

			tagCount: 3,

			showWords: false,

			showReadingTime: false,
		},

		stats: {

			showPublished: true,

			showWords: true,

			showReadingTime: true,
		},

		grid: {

			masonry: false,

			columnWidth: 320,

			coverFullWidth: false,
		},
	},

	pagination: {

		postsPerPage: 10,
	},

	post: {

		rehypeCallouts: {
			theme: "github",

			enablePythonMarkdownAdmonitions: false,
		},

		showLastModified: true,

		outdatedThreshold: 30,

		share: true,

		postNavigation: true,

		relatedPosts: true,

		randomPosts: true,

		generateOgImages: true,

		immersiveReading: {

			enable: true,

			defaultOn: false,

			tocEnabled: true,

			tocPosition: "left",
		},
	},

	bilibili: {

		uid: "38932988",
	},

	bangumi: {

		userId: "1143164",

		mode: "dynamic",

		apiUrl: "https://api.bangumi.pro",

		subjectBaseUrl: "https://api.bangumi.pro/subject/",

		categoryOrder: ["anime", "book", "music", "game"],

		nsfw: "hide",
	},

	vndb: {

		userId: "u358128",

		mode: "static",

		downloadCovers: false,

		apiUrl: "https://api.vndb.org/kana",

		vnBaseUrl: "https://vndb.org/",

		apiToken: "",

		nsfw: "hide",
	},

	mal: {

		username: "",

		clientId: "",

		apiUrl: "https://api.myanimelist.net/v2",

		animeBaseUrl: "https://myanimelist.net/anime/",

		mangaBaseUrl: "https://myanimelist.net/manga/",

		nsfw: "hide",
	},

	imageOptimization: {

		formats: "webp",

		quality: 85,

		noReferrerDomains: [
			"*.hdslb.com",
			"*.bilibili.com",
			"*.myanimelist.net",
			"*.vndb.org",
		],
	},

	feed: {

		contentMode: "full",
	},

	lang: SITE_LANG,

	pages,
};
