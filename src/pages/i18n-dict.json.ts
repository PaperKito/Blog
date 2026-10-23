import type { APIRoute } from "astro";
import { en } from "@/i18n/languages/en";
import { zh_CN } from "@/i18n/languages/zh_CN";

export const prerender = true;

export const GET: APIRoute = () => {
	const zh2en: Record<string, string> = {};
	const en2zh: Record<string, string> = {};

	for (const key of Object.keys(zh_CN) as (keyof typeof zh_CN)[]) {
		const zh = zh_CN[key];
		const enValue = en[key];

		if (!zh || !enValue || zh === enValue) continue;
		zh2en[zh] = enValue;
		if (!(enValue in en2zh)) en2zh[enValue] = zh;
	}

	return new Response(JSON.stringify({ zh2en, en2zh }), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
