import type { DisplaySettingsConfig } from "@/types/displaySettingsConfig";

const TRUTHY_VALUES = ["true", "1", "on", "yes", "enable", "enabled"];
const FALSY_VALUES = ["false", "0", "off", "no", "disable", "disabled"];

function parseBooleanEnv(raw: unknown): boolean | undefined {
	if (typeof raw !== "string") return undefined;
	const value = raw.trim().toLowerCase();
	if (TRUTHY_VALUES.includes(value)) return true;
	if (FALSY_VALUES.includes(value)) return false;
	return undefined;
}

const DISABLED_SETTINGS: DisplaySettingsConfig = {
	enable: false,
	themeColorSwitchable: false,
	layoutSwitchable: false,
	cardBorderSwitchable: false,
	cardFollowThemeSwitchable: false,
	wallpaperModeSwitchable: false,
	fullscreenLayoutSwitchable: false,
	wavesSwitchable: false,
	gradientSwitchable: false,
	bannerTitleSwitchable: false,
	bannerCarouselSwitchable: false,
	overlaySwitchable: false,
	sakuraSwitchable: false,
};

function readEnableEnv(): unknown {
	try {
		return import.meta.env.PUBLIC_DISPLAY_SETTINGS;
	} catch {
		return typeof process === "undefined"
			? undefined
			: process.env.PUBLIC_DISPLAY_SETTINGS;
	}
}

export function resolveDisplaySettingsConfig(
	config: DisplaySettingsConfig,
): DisplaySettingsConfig {
	const enable = parseBooleanEnv(readEnableEnv()) ?? config.enable;
	return enable ? { ...config, enable: true } : DISABLED_SETTINGS;
}
