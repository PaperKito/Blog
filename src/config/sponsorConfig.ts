import type { SponsorConfig } from "../types/sponsorConfig";

export const sponsorConfig: SponsorConfig = {

	title: "",

	description: "",

	showSponsorsList: true,

	showComment: true,

	showButtonInPost: true,

	methods: [
		{
			name: "支付宝",
			icon: "fa7-brands:alipay",

			qrCode: "/assets/images/sponsor/alipay.png",
			link: "",
			description: "使用 支付宝 扫码赞助",
			enabled: true,
		},
		{
			name: "微信",
			icon: "fa7-brands:weixin",
			qrCode: "/assets/images/sponsor/wechat.png",
			link: "",
			description: "使用 微信 扫码赞助",
			enabled: true,
		},
		{

			name: "ko-fi",
			icon: "simple-icons:kofi",
			qrCode: "",
			link: "",
			description: "Buy me a coffee",
			enabled: false,
		},
		{
			name: "爱发电",
			icon: "simple-icons:afdian",
			qrCode: "",
			link: "https://afdian.com/a/PaperKito",
			description: "通过 爱发电 进行赞助",
			enabled: true,
		},
	],

	sponsors: [],
};
