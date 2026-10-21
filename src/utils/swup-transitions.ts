import { expressiveCodeConfig, navbarMode, siteConfig } from "@/config";
import type { WALLPAPER_MODE } from "@/types/config";
import { scheduleContentOverflowEnhancements } from "@/utils/content-overflow-utils";
import { initializeFloatingPanels } from "@/utils/floating-panel-utils";
import {
	syncFullscreenBlur,
	syncFullscreenOverlays,
	updateFullscreenTitleParallax,
} from "@/utils/fullscreen-wallpaper-utils";
import {
	updateMainGridCols,
	updateSidebarComponentsVisibility,
} from "@/utils/grid-layout-utils";
import { scrollFunction } from "@/utils/scroll-utils";
import {
	syncBannerHomeTextVisibility,
	updateNavbarTransparency,
} from "@/utils/setting-utils";
import { pathsEqual, url } from "@/utils/url-utils";

function startProgressBar(): void {
	const bar = document.getElementById("progress-bar");
	if (!bar) return;
	bar.getAnimations().forEach((a) => {
		a.cancel();
	});
	bar.animate(
		[
			{ transform: "scaleX(0)", opacity: 1 },
			{ transform: "scaleX(0.95)", opacity: 1 },
		],
		{
			duration: 8000,
			easing: "cubic-bezier(0.1, 0.05, 0.1, 1)",
			fill: "forwards",
		},
	);
}

function finishProgressBar(): void {
	const bar = document.getElementById("progress-bar");
	if (!bar) return;
	bar.getAnimations().forEach((a) => {
		a.cancel();
	});
	bar.animate(
		[
			{ transform: "scaleX(1)", opacity: 1 },
			{ transform: "scaleX(1)", opacity: 0 },
		],
		{ duration: 500, easing: "ease-out", fill: "forwards" },
	);
}

function registerSwupHooks(): void {

	window.swup.hooks.on(
		"link:click",
		(_visit: unknown, { el }: { el: HTMLAnchorElement }) => {

			document.documentElement.style.setProperty("--content-delay", "0ms");

			const targetHref = el.getAttribute("href") || "";
			const targetPathname = (() => {
				try {
					return new URL(targetHref, window.location.href).pathname;
				} catch {
					return targetHref;
				}
			})();
			const isSamePage = pathsEqual(targetPathname, window.location.pathname);
			if (isSamePage) {
				document.documentElement.classList.remove("is-page-transitioning");
			}
			if (!isSamePage) {

				document.documentElement.classList.add("is-page-transitioning");
			}

			const navbar = document.getElementById("navbar-wrapper");
			if (navbar && navbarMode === "dynamic") {

				navbar.classList.remove("navbar-hidden");
				document.body.classList.remove("dynamic-navbar-hidden");
			} else if (navbar) {

				navbar.classList.remove("navbar-hidden");
			}
		},
	);
	window.swup.hooks.on("content:replace", () => {
		initializeFloatingPanels();

		scheduleContentOverflowEnhancements();

		import("@/utils/icon-loader").then(({ initIconLoader }) => {
			initIconLoader();
		});

		const navbar = document.getElementById("navbar");
		if (navbar) {
			const transparentMode = navbar.getAttribute("data-transparent-mode");
			const navWallpaperMode = document.documentElement.getAttribute(
				"data-wallpaper-mode",
			);

			if (transparentMode === "semifull" && navWallpaperMode !== "fullscreen") {

				if (typeof window.initSemifullScrollDetection === "function") {
					window.initSemifullScrollDetection();
				}
			}
		}
	});
	window.swup.hooks.on("visit:start", (visit: { to: { url: string } }) => {

		startProgressBar();

		if (window.innerWidth >= 768) {
			window.scrollTo({ top: 0, behavior: "instant" });
		}

		const bodyElement = document.querySelector("body") as HTMLElement;
		const isHomePage = pathsEqual(visit.to.url, url("/"));
		const wasHome = bodyElement.classList.contains("is-home");
		const contentPanel = document.querySelector(
			".content-panel",
		) as HTMLElement | null;

		if (isHomePage !== wasHome && contentPanel) {
			const oldTop = contentPanel.getBoundingClientRect().top;
			bodyElement.classList.toggle("is-home", isHomePage);
			const newTop = contentPanel.getBoundingClientRect().top;
			const delta = oldTop - newTop;

			const isFullscreen =
				document.documentElement.getAttribute("data-wallpaper-mode") ===
				"fullscreen";
			if (
				delta !== 0 &&
				(isFullscreen || Math.abs(delta) <= window.innerHeight * 0.75)
			) {

				contentPanel.style.transition = "none";
				contentPanel.style.transform = `translateY(${delta}px)`;
				void contentPanel.offsetWidth;
				contentPanel.style.transition = "";
				contentPanel.style.transform = "";
			}
		}

		const navbar = document.getElementById("navbar");
		if (navbar) {
			navbar.setAttribute("data-is-home", isHomePage.toString());

			const transparentMode = navbar.getAttribute("data-transparent-mode");
			const navWallpaperMode = document.documentElement.getAttribute(
				"data-wallpaper-mode",
			);
			if (transparentMode === "semifull" && navWallpaperMode !== "fullscreen") {

				if (typeof window.initSemifullScrollDetection === "function") {
					window.initSemifullScrollDetection();
				}
			}
		}

		if (window.innerWidth < 1024) {
			const postListContainer = document.getElementById("post-list-container");
			if (postListContainer) {
				postListContainer.style.transition = "none";
			}
		}
	});
	window.swup.hooks.on("page:view", () => {

		updateMainGridCols();
		updateSidebarComponentsVisibility();

		window.setTimeout(() => updateSidebarComponentsVisibility(), 300);

		updateFullscreenTitleParallax();
		syncFullscreenOverlays();
		syncFullscreenBlur();

		syncBannerHomeTextVisibility();

		updateNavbarTransparency(
			document.documentElement.getAttribute(
				"data-wallpaper-mode",
			) as WALLPAPER_MODE,
		);

		const isMobile = window.innerWidth < 1024;
		if (isMobile) {
			setTimeout(() => {
				const postListContainer = document.getElementById(
					"post-list-container",
				);
				if (postListContainer) {
					postListContainer.style.transition = "";
				}
			}, 600);
		}

		const storedTheme =
			localStorage.getItem("theme") ||
			siteConfig.themeColor.defaultMode ||
			"light";
		let isDark = false;

		if (storedTheme === "system") {
			isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		} else {
			isDark = storedTheme === "dark";
		}

		const expectedTheme = isDark
			? expressiveCodeConfig.darkTheme
			: expressiveCodeConfig.lightTheme;
		const currentTheme = document.documentElement.getAttribute("data-theme");

		if (currentTheme !== expectedTheme) {
			document.documentElement.setAttribute("data-theme", expectedTheme);
		}

		setTimeout(() => {
			if (document.getElementById("tcomment")) {

				const pageLoadedEvent = new CustomEvent("firefly:page:loaded", {
					detail: {
						path: window.location.pathname,
						timestamp: Date.now(),
					},
				});
				document.dispatchEvent(pageLoadedEvent);
				console.log(
					"Layout: 触发 firefly:page:loaded 事件，路径:",
					window.location.pathname,
				);
			}
		}, 300);
	});
	window.swup.hooks.on("visit:end", (_visit: { to: { url: string } }) => {

		finishProgressBar();

		setTimeout(() => {

			document.documentElement.classList.remove("is-page-transitioning");
			scrollFunction();
		}, 200);
	});
}

export function setupSwupTransitions(): void {
	if (window?.swup?.hooks) {
		registerSwupHooks();
	} else {
		document.addEventListener("swup:enable", registerSwupHooks);
	}
}
