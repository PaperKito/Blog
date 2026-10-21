import { loadRenderers } from "astro:container";
import type { CollectionEntry } from "astro:content";
import { render } from "astro:content";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx/container-renderer";
import { getContainerRenderer as getSvelteRenderer } from "@astrojs/svelte/container-renderer";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { url } from "@utils/url-utils";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import sanitizeHtml from "sanitize-html";

export type FeedEntry = {
	post: CollectionEntry<"posts">;
	title: string;

	link: string;
	published: Date;
	updated: Date;
	description: string;

	content: string;
	isPasswordProtected: boolean;
};

export function stripInvalidXmlChars(str: string): string {
	return str.replace(

		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

export function escapeXml(str: string): string {
	return stripInvalidXmlChars(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export function cdataWrapped(text: string): string {
	return `<![CDATA[${text.replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}

function collapseFeedWhitespace(html: string): string {
	const protectedBlocks: string[] = [];
	const masked = html.replace(
		/<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>/gi,
		(match) => {
			protectedBlocks.push(match);
			return `@@PRE_BLOCK_${protectedBlocks.length - 1}@@`;
		},
	);

	const collapsed = masked.replace(/\n[ \t]*\n[ \t]*\n+/g, "\n\n");
	return collapsed.replace(/@@PRE_BLOCK_(\d+)@@/g, (_, index) => {
		return protectedBlocks[Number(index)];
	});
}

export function toAbsoluteUrl(site: URL, path: string): string {
	return new URL(path.startsWith("/") ? path : `/${path}`, site).href;
}

export async function renderFeedEntries(
	posts: CollectionEntry<"posts">[],
	opts: { includeContent?: boolean } = {},
): Promise<FeedEntry[]> {
	const { includeContent = true } = opts;
	const renderers = await loadRenderers([
		getMDXRenderer(),
		getSvelteRenderer(),
	]);
	const container = await AstroContainer.create({ renderers });
	const entries: FeedEntry[] = [];
	for (const post of posts) {
		const link = url(`/posts/${post.id}/`);
		const updated = post.data.updated ?? post.data.published;
		const base: Omit<FeedEntry, "content" | "isPasswordProtected"> = {
			post,
			title: post.data.title,
			link,
			published: post.data.published,
			updated,
			description: post.data.description || "",
		};
		if (post.data.password) {
			entries.push({
				...base,
				content: includeContent ? i18n(I18nKey.passwordProtectedRss) : "",
				isPasswordProtected: true,
			});
			continue;
		}

		if (!includeContent) {
			entries.push({ ...base, content: "", isPasswordProtected: false });
			continue;
		}
		const { Content } = await render(post);
		const rawContent = await container.renderToString(Content);
		const cleanedContent = stripInvalidXmlChars(rawContent);
		entries.push({
			...base,
			content: collapseFeedWhitespace(
				sanitizeHtml(cleanedContent, {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			),
			isPasswordProtected: false,
		});
	}
	return entries;
}

export function buildAtomFeed(opts: {
	site: URL;
	title: string;
	subtitle: string;
	entries: FeedEntry[];
	authorName: string;
	generator: string;
	includeContent?: boolean;
}): string {
	const {
		site,
		title,
		subtitle,
		entries,
		authorName,
		generator,
		includeContent = true,
	} = opts;
	const siteRoot = toAbsoluteUrl(site, "/");
	const selfLink = toAbsoluteUrl(site, "atom.xml");
	const feedUpdated =
		entries.reduce<Date | null>(
			(latest, e) =>
				latest === null || e.updated > latest ? e.updated : latest,
			null,
		) ?? new Date();

	const entryXml = entries
		.map((e) => {
			const entryUrl = toAbsoluteUrl(site, e.link);
			const entryAuthor = e.post.data.author?.trim() || authorName;
			const contentXml = includeContent
				? `\n      <content type="html">${cdataWrapped(e.content)}</content>`
				: "";
			return `    <entry>
      <id>${escapeXml(entryUrl)}</id>
      <title type="text">${escapeXml(e.title)}</title>
      <published>${e.published.toISOString()}</published>
      <updated>${e.updated.toISOString()}</updated>
      <author><name>${escapeXml(entryAuthor)}</name></author>
      <link rel="alternate" href="${escapeXml(entryUrl)}"/>
      <summary type="text">${escapeXml(e.description)}</summary>${contentXml}
    </entry>`;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${escapeXml(siteRoot)}</id>
  <title type="text">${escapeXml(title)}</title>
  <subtitle type="text">${escapeXml(subtitle)}</subtitle>
  <updated>${feedUpdated.toISOString()}</updated>
  <author><name>${escapeXml(authorName)}</name></author>
  <link rel="alternate" href="${escapeXml(siteRoot)}"/>
  <link rel="self" href="${escapeXml(selfLink)}"/>
  <generator uri="https://github.com/CuteLeaf/Firefly">${escapeXml(generator)}</generator>
${entryXml}
</feed>
`;
}
