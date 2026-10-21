import { url } from "@/utils/url-utils";

export function navigateToPage(
	url: string,
	options?: {
		replace?: boolean;
		force?: boolean;
	},
): void {

	if (!url || typeof url !== "string") {
		console.warn("navigateToPage: Invalid URL provided");
		return;
	}

	if (
		url.startsWith("http://") ||
		url.startsWith("https://") ||
		url.startsWith("//")
	) {
		window.open(url, "_blank");
		return;
	}

	if (url.startsWith("#")) {
		const element = document.getElementById(url.slice(1));
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		return;
	}

	if (typeof window !== "undefined" && window.swup) {
		try {

			if (options?.replace) {
				window.swup.navigate(url, { history: false });
			} else {
				window.swup.navigate(url);
			}
		} catch (error) {
			console.error("Swup navigation failed:", error);

			fallbackNavigation(url, options);
		}
	} else {

		fallbackNavigation(url, options);
	}
}

function fallbackNavigation(
	url: string,
	options?: {
		replace?: boolean;
		force?: boolean;
	},
): void {
	if (options?.replace) {
		window.location.replace(url);
	} else {
		window.location.href = url;
	}
}

export function isSwupReady(): boolean {
	return typeof window !== "undefined" && !!window.swup;
}

export function waitForSwup(timeout = 5000): Promise<boolean> {
	return new Promise((resolve) => {
		if (isSwupReady()) {
			resolve(true);
			return;
		}

		let timeoutId: NodeJS.Timeout;

		const checkSwup = () => {
			if (isSwupReady()) {
				clearTimeout(timeoutId);
				document.removeEventListener("swup:enable", checkSwup);
				resolve(true);
			}
		};

		document.addEventListener("swup:enable", checkSwup);

		timeoutId = setTimeout(() => {
			document.removeEventListener("swup:enable", checkSwup);
			resolve(false);
		}, timeout);
	});
}

export function preloadPage(url: string): void {
	if (!url || typeof url !== "string") {
		return;
	}

	if (isSwupReady() && window.swup.preload) {
		try {
			window.swup.preload(url);
		} catch (error) {
			console.warn("Failed to preload page:", error);
		}
	}
}

export function getCurrentPath(): string {
	return typeof window !== "undefined" ? window.location.pathname : "";
}

export function isHomePage(): boolean {
	const path = getCurrentPath();
	return path === url("/") || path === url("");
}

export function isPostPage(): boolean {
	const path = getCurrentPath();
	return path.startsWith(url("/posts/"));
}

export function pathsEqual(path1: string, path2: string): boolean {

	const normalize = (path: string) => {
		return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
	};

	return normalize(path1) === normalize(path2);
}
