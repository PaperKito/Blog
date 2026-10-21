import type { ExpressiveCodeConfig } from "../types/expressiveCodeConfig";

export const expressiveCodeConfig: ExpressiveCodeConfig = {

	darkTheme: "one-dark-pro",

	lightTheme: "one-light",

	pluginCollapsible: {
		enable: true,
		lineThreshold: 15,
		previewLines: 8,
		defaultCollapsed: true,
	},

	pluginLanguageBadge: {

		enable: true,
	},

	pluginLanguageLogo: {

		enable: false,

		color: "mono",

		excludedLangs: [],
	},
};
