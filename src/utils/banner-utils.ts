export function isBannerMode(): boolean {
	return (
		document.documentElement.getAttribute("data-wallpaper-mode") === "banner"
	);
}

export function isFullscreenMode(): boolean {
	return (
		document.documentElement.getAttribute("data-wallpaper-mode") ===
		"fullscreen"
	);
}
