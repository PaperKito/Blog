import type { SidebarLayoutConfig } from "../types/sidebarConfig";

export const sidebarLayoutConfig: SidebarLayoutConfig = {

	enable: true,

	position: "both",

	tabletSidebar: "left",

	hideSidebarOnPostPage: false,

	noSidebarContentWidth: 0.6,

	leftComponents: [
		{

			type: "profile",

			enable: true,

			position: "top",

			showOnPostPage: true,
		},
		{

			type: "announcement",

			enable: true,

			position: "top",

			showOnPostPage: true,
		},
		{

			type: "music",

			enable: false,

			position: "top",

			showOnPostPage: true,
		},
		{

			type: "categories",

			enable: false,

			position: "sticky",

			showOnPostPage: true,

			specificConfig: {

				collapseThreshold: 5,
			},
		},
		{

			type: "tags",

			enable: true,

			position: "sticky",

			showOnPostPage: true,

			specificConfig: {

				collapseThreshold: 10,
			},
		},
	],

	rightComponents: [
		{

			type: "dynamic",

			enable: false,

			position: "top",

			showOnPostPage: true,

			specificConfig: {
				dynamic: {

					limit: 2,
				},
			},
		},
		{

			type: "stats",

			enable: false,

			position: "top",

			showOnPostPage: false,
		},
		{

			type: "siteInfo",

			enable: false,

			position: "top",

			showOnPostPage: false,

			specificConfig: {
				siteInfo: {

					unknownBuildPlatform: "Unknown CI",
				},
			},
		},
		{

			type: "calendar",

			enable: false,

			showTitle: false,

			position: "sticky",

			showOnPostPage: false,

			specificConfig: {
				calendar: {

					showHeatmap: true,
				},
			},
		},
		{

			type: "sidebarToc",

			enable: true,

			position: "sticky",

			showOnPostPage: true,

			hideOnNonPostPage: true,
		},
		{

			type: "advertisement",

			enable: false,

			showTitle: false,

			position: "sticky",

			showOnPostPage: true,

			specificConfig: {
				ad: {
					image: {
						src: "/assets/images/ad/ad1.webp",
						alt: "广告横幅",
						link: "https://haoka.lot-ml.com/plugreg.html?agentid=1423316",
						external: true,
					},

					closable: false,

					displayCount: -1,

					padding: {
						all: "1rem",
					},
				},
			},
		},
		{

			type: "advertisement",

			enable: false,

			position: "sticky",

			showOnPostPage: true,

			specificConfig: {
				ad: {
					title: "支持博主",
					content:
						"如果您觉得本站内容对您有帮助，欢迎支持我们的创作！您的支持是我们持续更新的动力。",
					link: {
						text: "支持一下",
						url: "about/",
						external: false,
					},
					closable: false,
					displayCount: -1,
				},
			},
		},
	],

	mobileBottomComponents: [
		{

			type: "profile",

			enable: true,

			showOnPostPage: true,
		},
		{

			type: "announcement",

			enable: true,

			showOnPostPage: true,
		},
		{

			type: "categories",

			enable: false,

			showOnPostPage: true,

			specificConfig: {

				collapseThreshold: 5,
			},
		},
		{

			type: "tags",

			enable: false,

			showOnPostPage: true,

			specificConfig: {

				collapseThreshold: 10,
			},
		},
		{

			type: "dynamic",

			enable: false,

			showOnPostPage: true,

			specificConfig: {
				dynamic: {

					limit: 2,
				},
			},
		},
		{

			type: "stats",

			enable: false,

			showOnPostPage: true,
		},
		{

			type: "siteInfo",

			enable: false,

			showOnPostPage: true,

			specificConfig: {
				siteInfo: {

					unknownBuildPlatform: "Unknown CI",
				},
			},
		},
	],
};
