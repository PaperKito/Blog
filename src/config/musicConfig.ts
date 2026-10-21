import type { MusicPlayerConfig } from "../types/musicConfig";

export const musicPlayerConfig: MusicPlayerConfig = {

	showInNavbar: false,

	showInSidebar: false,

	showInDock: true,

	mode: "local",

	volume: 0.7,

	playMode: "list",

	showLyrics: false,

	meting: {

		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",

		server: "netease",

		type: "playlist",

		id: "10046455237",

		auth: "",

		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},

	local: {
		playlist: [
			{
				name: "缘纺祈系",
				artist: "战双帕弥什 · 赛琳娜·希声",
				url: "/assets/music/缘纺祈系.mp3",
				cover: "/assets/music/cover/yuanfang-qixi.webp",
				lrc: "",
			},
		],
	},
};
