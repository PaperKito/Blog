import { sidebarLayoutConfig } from "@/config";
import {
	computeGridColumns,
	getResponsiveSidebarConfig,
	gridColumnVarsToStyle,
} from "@/utils/responsive-utils";

export interface EffectiveSidebarContext {
	isPostPage: boolean;
}

export interface EffectiveSidebarState {
	hideSidebarOnPostPage: boolean;
	hasLeftComponents: boolean;
	hasRightComponents: boolean;
	sidebarClass: string;
	staticBarClass: string;
	gridColumnStyle: string;

	gridDataAttrs: Record<string, string>;
}

export function getEffectiveSidebarState(
	ctx: EffectiveSidebarContext,
): EffectiveSidebarState {
	const { isPostPage } = ctx;

	const sidebarConfig = getResponsiveSidebarConfig();

	const hideSidebarOnPostPage =
		sidebarLayoutConfig.hideSidebarOnPostPage === true;

	const gridColumnVars = computeGridColumns({
		enabled: sidebarLayoutConfig.enable,
		position: sidebarLayoutConfig.position,
		tabletSidebar: sidebarConfig.tabletSidebar,
		hideSidebarOnPostPage,
		isPostPage,
		hasLeftWidgets: isPostPage
			? sidebarConfig.hasLeftWidgetsOnPost
			: sidebarConfig.hasLeftWidgetsOnNonPost,
		hasRightWidgets: isPostPage
			? sidebarConfig.hasRightWidgetsOnPost
			: sidebarConfig.hasRightWidgetsOnNonPost,
		noSidebarContentWidth: sidebarLayoutConfig.noSidebarContentWidth,
	});

	return {
		hideSidebarOnPostPage,
		hasLeftComponents: sidebarConfig.hasLeftComponents,
		hasRightComponents: sidebarConfig.hasRightComponents,

		sidebarClass: "mb-4 onload-animation",

		staticBarClass: "min-w-0 overflow-x-clip overflow-y-visible",
		gridColumnStyle: gridColumnVarsToStyle(gridColumnVars),
		gridDataAttrs: {
			"data-sidebar-enable": sidebarLayoutConfig.enable ? "true" : "false",
			"data-grid-hide-sidebar-on-post": hideSidebarOnPostPage
				? "true"
				: "false",
			"data-sidebar-position": sidebarLayoutConfig.position,
			"data-tablet-sidebar": sidebarConfig.tabletSidebar,

			"data-no-sidebar-content-width": String(
				sidebarLayoutConfig.noSidebarContentWidth ?? "",
			),
			"data-has-left-on-post": sidebarConfig.hasLeftWidgetsOnPost
				? "true"
				: "false",
			"data-has-left-on-non-post": sidebarConfig.hasLeftWidgetsOnNonPost
				? "true"
				: "false",
			"data-has-right-on-post": sidebarConfig.hasRightWidgetsOnPost
				? "true"
				: "false",
			"data-has-right-on-non-post": sidebarConfig.hasRightWidgetsOnNonPost
				? "true"
				: "false",
		},
	};
}
