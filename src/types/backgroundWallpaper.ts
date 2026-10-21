export type FullscreenWallpaperLayout = "classic" | "hero";

export type BackgroundWallpaperConfig = {
	mode: "banner" | "fullscreen" | "overlay" | "none";
	playerEnable?: boolean;
	src:
		| string
		| string[]
		| {
				desktop?: string | string[];
				mobile?: string | string[];
				playerUrl?: string | string[];
		  };

	common?: {
		dimOpacity?: number;
		playerMode?: "order" | "random";
		homeText?: {
			enable: boolean;
			title?: string;
			subtitle?: string | string[];
			titleSize?: string;
			subtitleSize?: string;
			typewriter?: {
				enable: boolean;
				speed: number;
				deleteSpeed: number;
				pauseTime: number;
			};

			linksEnable?: boolean;
			links?: {
				name: string;
				url: string;
				icon: string;
				showName?: boolean;
			}[];
		};

		carousel?: {
			enable: boolean;
			interval?: number;
			transitionEffect?: "fade" | "zoom" | "slide" | "kenburns";
		};

		waves?: {
			enable:
				| boolean
				| {
						desktop: boolean;
						mobile: boolean;
				  };
		};

		gradient?: {
			enable:
				| boolean
				| {
						desktop: boolean;
						mobile: boolean;
				  };
			height?: string;
		};
	};

	banner?: {
		position?:
			| "top"
			| "center"
			| "bottom"
			| "top left"
			| "top center"
			| "top right"
			| "center left"
			| "center center"
			| "center right"
			| "bottom left"
			| "bottom center"
			| "bottom right"
			| "left top"
			| "left center"
			| "left bottom"
			| "right top"
			| "right center"
			| "right bottom"
			| string;

		postInfo?: {
			mode: "description" | "meta";
		};
		navbar?: {
			transparentMode?: "semi" | "semifull" | "none";
			blur?: number;
		};
	};

	overlay?: {
		zIndex?: number;
		opacity?: number;
		blur?: number;
		cardOpacity?: number;
	};

	fullscreen?: {
		layout?: FullscreenWallpaperLayout;
		position?: string;

		navbar?: {
			transparentMode?: "semi" | "semifull";
			blur?: number;
		};

		blurRamp?: {
			enable:
				| boolean
				| {
						desktop: boolean;
						mobile: boolean;
				  };
		};
	};
};
