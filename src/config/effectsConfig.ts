import type { FireflyConfig, SakuraConfig } from "../types/effectsConfig";

export const fireflyConfig: FireflyConfig = {

	enable: true,

	num: 26,

	size: {
		min: 1.2,
		max: 3,
	},

	opacity: {
		min: 0.25,
		max: 0.85,
	},

	speed: {

		drift: {
			min: 6,
			max: 18,
		},

		twinkle: 1.4,
	},

	hue: 78,

	zIndex: 15,
};

export const sakuraConfig: SakuraConfig = {

	enable: true,

	sakuraNum: 21,

	limitTimes: -1,

	size: {

		min: 0.5,

		max: 1.1,
	},

	opacity: {

		min: 0.3,

		max: 0.9,
	},

	speed: {

		horizontal: {

			min: -1.7,

			max: -1.2,
		},

		vertical: {

			min: 1.5,

			max: 2.2,
		},

		rotation: 0.03,

		fadeSpeed: 0.03,
	},

	zIndex: 100,
};
