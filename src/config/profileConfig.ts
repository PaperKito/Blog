import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {

	avatar: "assets/images/avatar/avatar.jpg",

	name: "PaperKito",

	bio: "记录技术折腾与日常思考。",

	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/PaperKito",
			showName: false,
		},
		{
			name: "Email",
			icon: "fa7-solid:envelope",
			url: "mailto:gik671@outlook.com",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
		{
			name: "Atom",
			icon: "fa7-solid:atom",
			url: "/atom/",
			showName: false,
		},
	],
};
