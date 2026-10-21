export type SakuraConfig = {
	enable: boolean;
	sakuraNum: number;
	limitTimes: number;
	size: {
		min: number;
		max: number;
	};
	opacity: {
		min: number;
		max: number;
	};
	speed: {
		horizontal: {
			min: number;
			max: number;
		};
		vertical: {
			min: number;
			max: number;
		};
		rotation: number;
		fadeSpeed: number;
	};
	zIndex: number;
};

export type FireflyConfig = {
	enable: boolean;
	num: number;
	size: {
		min: number;
		max: number;
	};
	opacity: {
		min: number;
		max: number;
	};
	speed: {

		drift: {
			min: number;
			max: number;
		};

		twinkle: number;
	};
	hue: number;
	zIndex: number;
};
