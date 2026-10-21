export type SakuraConfig = {
	enable: boolean; // 是否启用樱花特效
	sakuraNum: number; // 樱花数量，默认21
	limitTimes: number; // 樱花越界限制次数，-1为无限循环
	size: {
		min: number; // 樱花最小尺寸倍数
		max: number; // 樱花最大尺寸倍数
	};
	opacity: {
		min: number; // 樱花最小不透明度
		max: number; // 樱花最大不透明度
	};
	speed: {
		horizontal: {
			min: number; // 水平移动速度最小值
			max: number; // 水平移动速度最大值
		};
		vertical: {
			min: number; // 垂直移动速度最小值
			max: number; // 垂直移动速度最大值
		};
		rotation: number; // 旋转速度
		fadeSpeed: number; // 消失速度，不应大于最小不透明度
	};
	zIndex: number; // 层级，确保樱花在合适的层级显示
};

// 萤火虫特效配置（横幅区域漂浮的发光粒子，复刻壁纸中的流萤效果）
export type FireflyConfig = {
	enable: boolean; // 是否启用萤火虫特效
	num: number; // 萤火虫数量
	size: {
		min: number; // 光点最小半径（px）
		max: number; // 光点最大半径（px）
	};
	opacity: {
		min: number; // 最小不透明度
		max: number; // 最大不透明度
	};
	speed: {
		// 漂移速度（像素/秒）
		drift: {
			min: number;
			max: number;
		};
		// 呼吸闪烁速度（相位/秒）
		twinkle: number;
	};
	hue: number; // 光点色相（HSL）
	zIndex: number; // 层级：壁纸之上、内容之下
};
