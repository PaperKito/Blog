import type { BackgroundWallpaperConfig } from "@/types/backgroundWallpaper";

export const backgroundWallpaper: BackgroundWallpaperConfig = {

	mode: "banner",

	playerEnable: false,

	src: {

		desktop: "assets/images/DesktopWallpaper/banner.webp",

		mobile: "assets/images/MobileWallpaper/banner.webp",

		playerUrl: "https://bed.twoleaf.cn/file/1785658612716_firefly.mp4",
	},

	common: {

		dimOpacity: 0.2,

		playerMode: "random",

		homeText: {

			enable: true,

			title: "PaperKito",

			titleSize: "4.5rem",

			subtitle: [
				"Notes on code, tinkering, and everyday life",
				"Collecting the small things I love",
				"Stay curious, stay building",
				"Slow is fast",
			],

			subtitleSize: "1.5rem",
			typewriter: {

				enable: true,

				speed: 100,

				deleteSpeed: 50,

				pauseTime: 2000,
			},

			linksEnable: true,

			links: [
				{
					name: "GitHub",
					icon: "fa7-brands:github",
					url: "https://github.com/PaperKito",
					showName: true,
				},
				{
					name: "Sponsor",
					icon: "material-symbols:favorite",
					url: "/sponsor/",
				},
				{
					name: "RSS",
					icon: "fa7-solid:rss",
					url: "/rss/",
				},
			],
		},

		carousel: {

			enable: false,

			interval: 5000,

			transitionEffect: "zoom",
		},

		waves: {
			enable: {

				desktop: true,

				mobile: true,
			},
		},

		gradient: {
			enable: {

				desktop: true,

				mobile: true,
			},

			height: "10%",
		},
	},

	banner: {

		position: "0% 20%",

		postInfo: {
			mode: "description",
		},

		navbar: {

			transparentMode: "semi",

			blur: 12,
		},
	},

	overlay: {

		zIndex: -1,

		opacity: 0.8,

		blur: 10,

		cardOpacity: 0.6,
	},

	fullscreen: {

		layout: "classic",

		position: "center",

		navbar: {

			transparentMode: "semifull",

			blur: 12,
		},

		blurRamp: {
			enable: {

				desktop: true,

				mobile: true,
			},
		},
	},
};
