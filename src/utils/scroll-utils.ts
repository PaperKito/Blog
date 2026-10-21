import { navbarMode } from "@/config";
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_HOME,
	BANNER_HEIGHT_NON_HOME,
} from "@/constants/constants";
import { isBannerMode, isFullscreenMode } from "@/utils/banner-utils";
import { updateSidebarStickySpacing } from "@/utils/grid-layout-utils";

const backToTopBtn = document.getElementById("back-to-top-btn");
const navbar = document.getElementById("navbar-wrapper");

let lastScrollTop = 0;

export function scrollFunction(): void {
	if (document.documentElement.classList.contains("is-page-transitioning")) {
		return;
	}

	const scrollTop = document.documentElement.scrollTop;
	const bannerHeight = window.innerHeight * (BANNER_HEIGHT / 100);
	const navbarElement = document.getElementById("navbar");

	updateSidebarStickySpacing();

	const operations: (() => void)[] = [];

	if (backToTopBtn) {
		operations.push(() => {
			if (scrollTop > bannerHeight) {
				backToTopBtn.classList.remove("hide");
			} else {
				backToTopBtn.classList.add("hide");
			}
		});
	}

	if (navbarMode === "fixed" && navbar) {
		operations.push(() => {
			navbar.classList.remove("navbar-hidden");
		});
	} else if (navbarMode === "dynamic" && navbar) {

		const delta = scrollTop - lastScrollTop;
		lastScrollTop = scrollTop;
		operations.push(() => {
			const isHome = document.body.classList.contains("is-home");

			const heroBoundary = isFullscreenMode()
				? isHome
					? window.innerHeight
					: 0
				: isBannerMode()
					? window.innerHeight *
						((isHome ? BANNER_HEIGHT_HOME : BANNER_HEIGHT_NON_HOME) / 100)
					: 0;
			const overHero = scrollTop < heroBoundary;
			if (overHero || delta < 0 || scrollTop <= 80) {
				navbar.classList.remove("navbar-hidden");
			} else if (delta > 0 && scrollTop > 150) {
				navbar.classList.add("navbar-hidden");
			}
			document.body.classList.toggle(
				"dynamic-navbar-hidden",
				navbar.classList.contains("navbar-hidden"),
			);
		});
	} else if (navbar && (isBannerMode() || isFullscreenMode())) {

		operations.push(() => {
			const isHome = document.body.classList.contains("is-home");

			const threshold = isFullscreenMode()
				? window.innerHeight - 88
				: window.innerHeight *
						((isHome ? BANNER_HEIGHT_HOME : BANNER_HEIGHT_NON_HOME) / 100) -
					88;

			if (scrollTop >= threshold) {
				navbar.classList.add("navbar-hidden");
			} else {
				navbar.classList.remove("navbar-hidden");
			}
		});
	}

	if (navbarElement) {
		operations.push(() => {
			if (scrollTop > 8) {
				navbarElement.classList.add("navbar-sticky-shadow");
			} else {
				navbarElement.classList.remove("navbar-sticky-shadow");
			}
		});
	}

	if (operations.length > 0) {
		requestAnimationFrame(() => {
			operations.forEach((op) => {
				op();
			});
		});
	}
}

let scrollTimeout: number;

export function initScroll(): void {

	window.addEventListener(
		"scroll",
		() => {
			if (scrollTimeout) {
				cancelAnimationFrame(scrollTimeout);
			}
			scrollTimeout = requestAnimationFrame(scrollFunction);
		},
		{ passive: true },
	);

	scrollFunction();
}
