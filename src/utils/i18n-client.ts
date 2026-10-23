export type SiteLang = "zh_CN" | "en";

const LANG_STORAGE_KEY = "siteLang";
const DICT_URL = `${import.meta.env.BASE_URL}i18n-dict.json`;

type Dict = {
	zh2en: Record<string, string>;
	en2zh: Record<string, string>;
};

let dictPromise: Promise<Dict> | null = null;

export function getStoredLang(): SiteLang {
	try {
		return localStorage.getItem(LANG_STORAGE_KEY) === "en" ? "en" : "zh_CN";
	} catch {
		return "zh_CN";
	}
}

export function setStoredLang(lang: SiteLang): void {
	try {
		localStorage.setItem(LANG_STORAGE_KEY, lang);
	} catch {

	}
}

export function getAppliedLang(): SiteLang {
	return document.documentElement.getAttribute("lang") === "en"
		? "en"
		: "zh_CN";
}

function loadDict(): Promise<Dict> {
	if (!dictPromise) {
		dictPromise = fetch(DICT_URL)
			.then((res) => {
				if (!res.ok) throw new Error(`i18n dict http ${res.status}`);
				return res.json() as Promise<Dict>;
			})
			.catch((err) => {
				dictPromise = null;
				throw err;
			});
	}
	return dictPromise;
}

const SKIP_TAGS = new Set([
	"SCRIPT",
	"STYLE",
	"NOSCRIPT",
	"TEXTAREA",
	"CODE",
	"PRE",
	"KBD",
	"SAMP",
	"TEMPLATE",
]);

const TRANSLATE_ATTRS = ["title", "aria-label", "placeholder", "alt"];

function translateText(text: string, map: Record<string, string>): string {
	const trimmed = text.trim();
	if (!trimmed) return text;
	const hit = map[trimmed];
	if (!hit || hit === trimmed) return text;
	const leading = text.slice(0, text.length - text.trimStart().length);
	const trailing = text.slice(text.trimEnd().length);
	return leading + hit + trailing;
}

function translateDocument(map: Record<string, string>): void {

	const walker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode(node) {
				const parent = node.parentElement;
				if (!parent) return NodeFilter.FILTER_REJECT;
				if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
				if (parent.closest("[data-no-i18n]")) return NodeFilter.FILTER_REJECT;
				if (!node.nodeValue?.trim()) {
					return NodeFilter.FILTER_REJECT;
				}
				return NodeFilter.FILTER_ACCEPT;
			},
		},
	);
	const textNodes: Text[] = [];
	while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
	for (const node of textNodes) {
		const replaced = translateText(node.nodeValue ?? "", map);
		if (replaced !== node.nodeValue) node.nodeValue = replaced;
	}

	const elements = document.querySelectorAll<HTMLElement>("body *");
	for (const el of elements) {
		if (SKIP_TAGS.has(el.tagName)) continue;
		for (const attr of TRANSLATE_ATTRS) {
			const value = el.getAttribute(attr);
			if (!value) continue;
			const hit = map[value.trim()];
			if (hit && hit !== value) el.setAttribute(attr, hit);
		}
	}
}

export async function applyLang(lang: SiteLang, force = false): Promise<void> {
	if (!force && getAppliedLang() === lang) return;
	try {
		const dict = await loadDict();
		translateDocument(lang === "en" ? dict.zh2en : dict.en2zh);
		document.documentElement.setAttribute(
			"lang",
			lang === "en" ? "en" : "zh-CN",
		);
	} catch {

	}
}
