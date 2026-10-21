import type { NavbarMode } from "../types/siteConfig";
import { siteConfig } from "./siteConfig";

export function resolveNavbarMode(navbar: {
	navbarMode?: NavbarMode;
	stickyNavbar?: boolean;
}): NavbarMode {
	if (navbar.navbarMode) return navbar.navbarMode;
	return navbar.stickyNavbar === false ? "static" : "fixed";
}

export const navbarMode: NavbarMode = resolveNavbarMode(siteConfig.navbar);

export type {
	AdConfig,
	AnalyticsConfig,
	AnnouncementConfig,
	BackgroundWallpaperConfig,
	BooknavFaviconConfig,
	BooknavGroup,
	BooknavItem,
	BooknavPageConfig,
	CommentConfig,
	CoverImageConfig,
	DisplaySettingsConfig,
	DynamicConfig,
	ExpressiveCodeConfig,
	GalleryAlbum,
	GalleryConfig,
	LicenseConfig,
	MermaidConfig,
	MusicPlayerConfig,
	NavBarConfig,
	PlantUMLConfig,
	ProfileConfig,
	SakuraConfig,
	SidebarLayoutConfig,
	SiteConfig,
	SponsorConfig,
	SponsorItem,
	SponsorMethod,
	WidgetComponentConfig,
	WidgetComponentType,
	WidgetSpecificConfig,
} from "../types/config";
export type {
	BuiltinFontProvider,
	CustomFontProvider,
	FontDefinition,
	FontSelectionConfig,
} from "../types/fontConfig";
export { analyticsConfig } from "./analyticsConfig";
export { announcementConfig } from "./announcementConfig";

export { backgroundWallpaper } from "./backgroundWallpaper";
export { booknavConfig, booknavPageConfig } from "./booknavConfig";

export { commentConfig } from "./commentConfig";
export { coverImageConfig } from "./coverImageConfig";
export { displaySettingsConfig } from "./displaySettingsConfig";
export { dynamicConfig } from "./dynamicConfig";
export { fireflyConfig, sakuraConfig } from "./effectsConfig";
export { expressiveCodeConfig } from "./expressiveCodeConfig";
export { fontConfig, fontsList } from "./fontConfig";
export { friendsPageConfig, getEnabledFriends } from "./friendsConfig";
export { galleryConfig } from "./galleryConfig";
export { licenseConfig } from "./licenseConfig";

export { mermaidConfig } from "./mermaidConfig";
export { musicPlayerConfig } from "./musicConfig";
export { navBarConfig, navBarSearchConfig } from "./navBarConfig";
export { live2dWidgetConfig, spineModelConfig } from "./pioConfig";
export { plantumlConfig } from "./plantumlConfig";
export { profileConfig } from "./profileConfig";

export { sidebarLayoutConfig } from "./sidebarConfig";

export { siteConfig } from "./siteConfig";
export { sponsorConfig } from "./sponsorConfig";
