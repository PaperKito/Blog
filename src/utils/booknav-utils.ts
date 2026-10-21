import { booknavConfig } from "../config/booknavConfig";
import type {
	BooknavFaviconConfig,
	BooknavGroup,
	BooknavItem,
} from "../types/booknavConfig";

export type ResolvedBooknavIcon =
	| { kind: "icon"; value: string }
	| { kind: "image"; value: string }
	| { kind: "letter"; value: string };

const ICON_NAME_PATTERN = /^[\w-]+:[\w-]+$/;

export function getBooknavDomain(url: string): string {
	try {
		return new URL(url).hostname;
	} catch {
		return "";
	}
}

export function buildFaviconUrl(api: string, domain: string): string {
	if (!api || !domain) return "";
	return api.replaceAll("{domain}", encodeURIComponent(domain));
}

export function getBooknavLetter(title: string): string {
	return (title || "?").trim().charAt(0).toUpperCase() || "?";
}

export function resolveBooknavIcon(
	item: BooknavItem,
	favicon: BooknavFaviconConfig,
): ResolvedBooknavIcon {
	const icon = item.icon?.trim();

	if (icon) {

		if (/^https?:\/\//.test(icon) || icon.startsWith("/")) {
			return { kind: "image", value: icon };
		}

		if (ICON_NAME_PATTERN.test(icon)) {
			return { kind: "icon", value: icon };
		}

		return { kind: "image", value: icon };
	}

	if (favicon.enabled) {
		const faviconUrl = buildFaviconUrl(favicon.api, getBooknavDomain(item.url));
		if (faviconUrl) {
			return { kind: "image", value: faviconUrl };
		}
	}

	return { kind: "letter", value: getBooknavLetter(item.title) };
}

export function getEnabledBooknavGroups(): BooknavGroup[] {
	return booknavConfig
		.filter((group) => group.enabled !== false)
		.map((group) => ({
			...group,
			items: group.items
				.filter((item) => item.enabled !== false)
				.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0)),
		}))
		.filter((group) => group.items.length > 0)
		.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
}
