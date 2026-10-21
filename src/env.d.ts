declare global {
	interface ImportMetaEnv {
		readonly MEILI_MASTER_KEY: string;

		readonly PUBLIC_DISPLAY_SETTINGS?: string;
	}

	interface ITOCManager {
		init: () => void;
		render: () => void;
		attach: () => void;
		cleanup: () => void;
	}

	interface Window {
		SidebarTOC: {
			manager: ITOCManager | null;
		};
		FloatingTOC: {
			btn: HTMLElement | null;
			panel: HTMLElement | null;
			manager: ITOCManager | null;
			isPostPage: () => boolean;
		};
		toggleFloatingTOC: () => void;
		tocInternalNavigation: boolean;
		ImmersiveReading: {
			btn: HTMLElement | null;
			tocBtn: HTMLElement | null;
			toc: HTMLElement | null;
			manager: ITOCManager | null;
			prevScroll: number;
			isImmersive: boolean;
		};
		toggleImmersiveReading: () => void;
		enterImmersiveReading: () => void;
		exitImmersiveReading: () => void;
		toggleImmersiveTOC: () => void;
		__immersiveReadingInit?: boolean;

		spine: any;
		closeAnnouncement: () => void;

		semifullScrollHandler?: (() => void) | undefined;
		initSemifullScrollDetection?: () => void;
	}
}

export {};
