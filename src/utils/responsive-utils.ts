import { sidebarLayoutConfig } from "@/config";

const SIDEBAR_WIDTH = "17.5rem";

const SIDEBAR_TRACK = "var(--grid-sidebar-width)";

export interface ResponsiveSidebarConfig {

	hasLeftComponents: boolean;
	hasRightComponents: boolean;
	tabletSidebar: "left" | "right";

	hasLeftWidgetsOnPost: boolean;
	hasLeftWidgetsOnNonPost: boolean;
	hasRightWidgetsOnPost: boolean;
	hasRightWidgetsOnNonPost: boolean;
}

export function isWidgetVisibleOnPageType(
	comp: {
		enable: boolean;
		showOnPostPage?: boolean;
		hideOnNonPostPage?: boolean;
	},
	isPostPage: boolean,
): boolean {
	if (!comp.enable) return false;
	if (isPostPage && comp.showOnPostPage === false) return false;
	if (!isPostPage && comp.hideOnNonPostPage === true) return false;
	return true;
}

export function getResponsiveSidebarConfig(): ResponsiveSidebarConfig {
	const position = sidebarLayoutConfig.position;
	const tabletSidebar = sidebarLayoutConfig.tabletSidebar ?? "left";

	const hasLeftComponents =
		sidebarLayoutConfig.enable &&
		position !== "right" &&
		sidebarLayoutConfig.leftComponents.some((comp) => comp.enable);

	const hasRightComponents =
		sidebarLayoutConfig.enable &&
		position !== "left" &&
		sidebarLayoutConfig.rightComponents.some((comp) => comp.enable);

	const visibleOn = (
		comps: {
			enable: boolean;
			showOnPostPage?: boolean;
			hideOnNonPostPage?: boolean;
		}[],
		isPostPage: boolean,
	): boolean =>
		comps.some((comp) => isWidgetVisibleOnPageType(comp, isPostPage));

	return {
		hasLeftComponents,
		hasRightComponents,
		tabletSidebar,
		hasLeftWidgetsOnPost: visibleOn(sidebarLayoutConfig.leftComponents, true),
		hasLeftWidgetsOnNonPost: visibleOn(
			sidebarLayoutConfig.leftComponents,
			false,
		),
		hasRightWidgetsOnPost: visibleOn(sidebarLayoutConfig.rightComponents, true),
		hasRightWidgetsOnNonPost: visibleOn(
			sidebarLayoutConfig.rightComponents,
			false,
		),
	};
}

export interface GridColumnsInput {
	enabled: boolean;
	position: "left" | "right" | "both";
	tabletSidebar: "left" | "right";
	hideSidebarOnPostPage: boolean;
	isPostPage: boolean;
	hasLeftWidgets: boolean;
	hasRightWidgets: boolean;

	noSidebarContentWidth?: number;
}

export interface GridColumnVars {
	"--cols-md": string;
	"--cols-xl": string;
	"--left-display-md": "contents" | "none";
	"--left-display-xl": "contents" | "none";
	"--right-display-md": "contents" | "none";
	"--right-display-xl": "contents" | "none";

	"--grid-sidebar-width": string;

	"--content-ratio-md": number;
	"--content-ratio-xl": number;
}

function trackSegments(left: boolean, right: boolean): string {
	if (left && right) return `${SIDEBAR_TRACK} 1fr ${SIDEBAR_TRACK}`;
	if (left) return `${SIDEBAR_TRACK} 1fr`;
	if (right) return `1fr ${SIDEBAR_TRACK}`;
	return "1fr";
}

export function computeGridColumns(input: GridColumnsInput): GridColumnVars {

	const sidebarActive =
		input.enabled && !(input.isPostPage && input.hideSidebarOnPostPage);

	const leftIn =
		sidebarActive && input.hasLeftWidgets && input.position !== "right";
	const rightIn =
		sidebarActive && input.hasRightWidgets && input.position !== "left";

	const mdLeft =
		leftIn &&
		(input.position === "left" ||
			(input.position === "both" && input.tabletSidebar === "left"));
	const mdRight =
		rightIn &&
		(input.position === "right" ||
			(input.position === "both" && input.tabletSidebar === "right"));

	const raw = input.noSidebarContentWidth;
	const ratio =
		raw == null || !Number.isFinite(raw) ? 1 : Math.min(1, Math.max(0, raw));
	const ratioMd = input.enabled && !mdLeft && !mdRight ? ratio : 1;
	const ratioXl = input.enabled && !leftIn && !rightIn ? ratio : 1;

	return {
		"--cols-md": trackSegments(mdLeft, mdRight),
		"--cols-xl": trackSegments(leftIn, rightIn),
		"--left-display-md": mdLeft ? "contents" : "none",
		"--left-display-xl": leftIn ? "contents" : "none",
		"--right-display-md": mdRight ? "contents" : "none",
		"--right-display-xl": rightIn ? "contents" : "none",
		"--grid-sidebar-width": SIDEBAR_WIDTH,
		"--content-ratio-md": ratioMd,
		"--content-ratio-xl": ratioXl,
	};
}

export function gridColumnVarsToStyle(vars: GridColumnVars): string {
	return Object.entries(vars)
		.map(([key, value]) => `${key}:${value}`)
		.join(";");
}
