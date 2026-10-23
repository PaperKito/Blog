import type { DisplaySettingsConfig } from "../types/displaySettingsConfig";
import { resolveDisplaySettingsConfig } from "../utils/display-settings-utils";

export const displaySettingsConfig: DisplaySettingsConfig =
	resolveDisplaySettingsConfig({

		enable: true,

		themeColorSwitchable: false,

		layoutSwitchable: true,

		cardBorderSwitchable: true,

		cardFollowThemeSwitchable: true,

		wallpaperModeSwitchable: true,

		fullscreenLayoutSwitchable: true,

		wavesSwitchable: true,

		gradientSwitchable: true,

		bannerTitleSwitchable: true,

		bannerCarouselSwitchable: true,

		overlaySwitchable: {
			opacity: true,
			blur: true,
			cardOpacity: true,
		},

		sakuraSwitchable: true,
	});
