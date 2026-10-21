import { getImage } from "astro:assets";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import { siteConfig } from "../config/siteConfig";
import { loadLocalImage } from "./schema-image";
import { getFileDirFromPath, url } from "./url-utils";

async function resolveOptimizedCoverUrl(
	src: string,
	filePath?: string,
): Promise<string> {
	if (!src) return "";
	if (/^(?:https?:)?\/\//i.test(src) || src.startsWith("data:")) return src;
	if (src.startsWith("/")) return url(src);
	const img = await loadLocalImage(src, getFileDirFromPath(filePath || ""));
	if (!img) return "";
	const optimized = await getImage({ src: img, width: 1600 });
	return optimized.src;
}

export async function resolveProjectImage(
	src: string,
	filePath?: string,
): Promise<string> {
	return resolveOptimizedCoverUrl(src, filePath);
}

export async function resolveProjectImageAbsolute(
	src: string,
	filePath?: string,
): Promise<string> {
	const sameOrigin = await resolveOptimizedCoverUrl(src, filePath);
	if (!sameOrigin) return "";
	if (/^(?:https?:)?\/\//i.test(sameOrigin) || sameOrigin.startsWith("data:")) {
		return sameOrigin;
	}
	return new URL(url(sameOrigin), siteConfig.site_url).toString();
}

const ICON_NAME_PATTERN = /^[\w-]+:[\w-]+$/;

export type ResolvedLinkIcon =
	| { kind: "icon"; value: string }
	| { kind: "image"; value: string }
	| { kind: "letter"; value: string };

export function resolveLinkIcon(icon: string, label: string): ResolvedLinkIcon {
	const trimmed = icon?.trim();
	if (trimmed) {
		if (/^https?:\/\//.test(trimmed) || trimmed.startsWith("/")) {
			return { kind: "image", value: trimmed };
		}
		if (ICON_NAME_PATTERN.test(trimmed)) {
			return { kind: "icon", value: trimmed };
		}
		return { kind: "image", value: trimmed };
	}
	const letter = (label || "?").trim().charAt(0).toUpperCase() || "?";
	return { kind: "letter", value: letter };
}

const PROJECT_STATUS_META: Record<
	string,
	{ key: I18nKey; icon: string; className: string; coverClassName: string }
> = {
	planning: {
		key: I18nKey.projectStatusPlanning,
		icon: "material-symbols:schedule",
		className:
			"bg-neutral-200/80 text-neutral-600 dark:bg-neutral-700/60 dark:text-neutral-300",

		coverClassName: "bg-neutral-500/85 text-white dark:bg-neutral-600/85",
	},
	developing: {
		key: I18nKey.projectStatusDeveloping,
		icon: "material-symbols:code",
		className: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
		coverClassName: "bg-amber-500/90 text-white dark:bg-amber-600/90",
	},
	published: {
		key: I18nKey.projectStatusPublished,
		icon: "material-symbols:rocket-launch",
		className: "bg-green-500/15 text-green-600 dark:text-green-400",
		coverClassName: "bg-green-600/90 text-white dark:bg-green-700/90",
	},
	archived: {
		key: I18nKey.projectStatusArchived,
		icon: "material-symbols:archive",
		className:
			"bg-neutral-200/80 text-neutral-600 dark:bg-neutral-700/60 dark:text-neutral-300",
		coverClassName: "bg-neutral-500/85 text-white dark:bg-neutral-600/85",
	},
};

export const PROJECT_STATUS_KEYS: string[] = Object.keys(PROJECT_STATUS_META);

const NEUTRAL_STATUS_CLASS =
	"bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300";
const NEUTRAL_COVER_CLASS =
	"bg-neutral-500/85 text-white dark:bg-neutral-600/85";

export function getProjectStatusMeta(status: string): {
	label: string;
	icon: string;
	className: string;
	coverClassName: string;
	known: boolean;
} {
	if (!status)
		return {
			label: "",
			icon: "",
			className: NEUTRAL_STATUS_CLASS,
			coverClassName: NEUTRAL_COVER_CLASS,
			known: false,
		};
	const meta = PROJECT_STATUS_META[status];
	if (!meta)
		return {
			label: status,
			icon: "",
			className: NEUTRAL_STATUS_CLASS,
			coverClassName: NEUTRAL_COVER_CLASS,
			known: false,
		};
	return {
		label: i18n(meta.key),
		icon: meta.icon,
		className: meta.className,
		coverClassName: meta.coverClassName,
		known: true,
	};
}
