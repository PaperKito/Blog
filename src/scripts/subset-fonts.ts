import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import subsetFont from "subset-font";
import { fontConfig, fontsList } from "../config";
import { collectUsedFontCssVars, toPublicPath } from "../utils/fontHelper";
import { resolveSiteRoot } from "./site-root";

const siteRoot = resolveSiteRoot();
const DIST_DIR = siteRoot;
const OUTPUT_DIR = `${siteRoot}/_astro/fonts`;

type LocalSubsetFont = {
	id: string;
	family: string;
	src: string;
	weight?: string | number;
	style?: string;
	display?: string;
	subsetExtraChars?: string;
};

function getLocalSubsetFonts(): LocalSubsetFont[] {
	if (!fontConfig.enable || !fontConfig.subsetFonts) return [];

	const subsetEntries = Object.entries(fontConfig.subsetFonts);
	if (subsetEntries.length === 0) return [];

	const used = collectUsedFontCssVars(fontConfig);

	const fontByCssVar = new Map<string, (typeof fontsList)[number]>();
	for (const f of fontsList) {
		if (f.cssVariable) fontByCssVar.set(f.cssVariable, f);
	}

	const result: LocalSubsetFont[] = [];
	for (const [cssVar, opts] of subsetEntries) {

		if (!used.has(cssVar)) {
			console.log(
				`   ⏭ Skipping '${cssVar}' — not referenced in selected or any font region.`,
			);
			continue;
		}

		const f = fontByCssVar.get(cssVar);
		if (!f?.options?.variants) continue;

		for (const v of f.options.variants) {
			if (!v.src?.length) continue;
			const rawSrc = v.src[0];

			const publicPath = toPublicPath(rawSrc);
			if (publicPath === null) {
				console.warn(
					`   ⚠ Skipping variant with unexpected src path: "${rawSrc}".\n` +
						`     Expected a path under public/ (e.g. "./public/assets/fonts/MyFont.woff2") or an absolute path (e.g. "/assets/fonts/MyFont.woff2").`,
				);
				continue;
			}
			result.push({
				id: `${f.name}-${v.weight || "default"}`
					.toLowerCase()
					.replace(/\s+/g, "-"),
				family: f.name,
				src: publicPath,
				weight: v.weight,
				style: v.style,
				subsetExtraChars: opts.extraChars,
			});
		}
	}
	return result;
}

function extractTextFromHtml(html: string): string {

	let text = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ");

	text = text.replace(/<[^>]+>/g, " ");

	text = text
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, " ");

	const attrMatches = html.matchAll(
		/(?:alt|title|aria-label|placeholder)=["']([^"']+)["']/gi,
	);
	for (const match of attrMatches) {
		text += match[1];
	}
	return text;
}

async function collectChars(): Promise<string> {
	const htmlFiles = await glob(`${DIST_DIR}/**/*.html`);
	const charSet = new Set<string>();

	for (const file of htmlFiles) {
		const html = await fs.readFile(file, "utf-8");
		const text = extractTextFromHtml(html);
		for (const c of text) charSet.add(c);
	}

	return [...charSet].join("");
}

function contentHash(buffer: Buffer): string {
	return crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);
}

function fullHash(buffer: Buffer): string {
	return crypto.createHash("sha256").update(buffer).digest("hex");
}

function resolveFontPath(src: string): string {
	const relativePath = src.startsWith("/") ? src.slice(1) : src;
	return path.resolve("public", relativePath);
}

function detectFontFormat(
	filePath: string,
): "woff2" | "woff" | "truetype" | "opentype" {
	const ext = path.extname(filePath).toLowerCase();
	switch (ext) {
		case ".woff2":
			return "woff2";
		case ".woff":
			return "woff";
		case ".otf":
			return "opentype";

		default:
			return "truetype";
	}
}

interface SubsetResult {
	id: string;
	family: string;
	weight?: string | number;
	style?: string;
	display?: string;
	hash: string;
	format: string;
	originalSrc: string;
	originalHash: string;
	originalSize: number;
}

async function main() {
	console.log("🔤 Font subsetting started...");

	const localSubsetFonts = getLocalSubsetFonts();

	if (localSubsetFonts.length === 0) {
		console.log("   No local fonts with subset: true found. Skipping.");
		return;
	}

	console.log(
		`   Found ${localSubsetFonts.length} font(s) to subset: ${localSubsetFonts.map((f) => f.id).join(", ")}`,
	);

	console.log("🔍 Collecting characters from dist/...");
	const pageChars = await collectChars();
	console.log(`   Collected ${pageChars.length} unique characters.`);

	if (pageChars.length === 0) {
		console.warn("⚠ No characters found in dist/. Skipping subsetting.");
		return;
	}

	await fs.mkdir(OUTPUT_DIR, { recursive: true });

	const results: SubsetResult[] = [];

	for (const font of localSubsetFonts) {
		const fontPath = resolveFontPath(font.src);

		try {
			await fs.access(fontPath);
		} catch {
			console.error(`❌ Font file not found: ${fontPath} (src: ${font.src})`);
			continue;
		}

		let chars = pageChars;
		if (font.subsetExtraChars) {
			const extraSet = new Set<string>([
				...pageChars,
				...font.subsetExtraChars,
			]);
			chars = [...extraSet].join("");
		}

		console.log(`⏳ Generating subset for '${font.id}' (${font.family})...`);

		const fontBuffer = await fs.readFile(fontPath);
		const originalFormat = detectFontFormat(fontPath);

		try {
			const subsetBuffer = await subsetFont(fontBuffer, chars, {
				targetFormat: "woff2",
			});

			const hash = contentHash(subsetBuffer);
			const outFile = path.join(OUTPUT_DIR, `${hash}.woff2`);
			await fs.writeFile(outFile, subsetBuffer);

			const sizeKB = (subsetBuffer.length / 1024).toFixed(1);
			const originalSizeKB = (fontBuffer.length / 1024).toFixed(1);
			const ratio = (
				((fontBuffer.length - subsetBuffer.length) / fontBuffer.length) *
				100
			).toFixed(1);

			console.log(
				`   ✔ ${hash}.woff2 (${sizeKB} KB, original: ${originalSizeKB} KB, saved ${ratio}%)`,
			);

			results.push({
				id: font.id,
				family: font.family,
				weight: font.weight,
				style: font.style,
				display: font.display,
				hash,
				format: originalFormat,
				originalSrc: font.src,
				originalHash: fullHash(fontBuffer),
				originalSize: fontBuffer.length,
			});
		} catch (err) {
			console.error(`   ❌ Failed to subset '${font.id}':`, err);
		}
	}

	if (results.length === 0) {
		console.warn("⚠ No subsets were generated.");
		return;
	}

	console.log("🔄 Replacing original font URLs in dist/ CSS and HTML files...");
	const filesToReplace = await glob(`${DIST_DIR}/**/*.{css,html}`);
	const distFontFiles = await glob(`${DIST_DIR}/**/*.{ttf,otf,woff,woff2}`, {
		nodir: true,
	});
	const originalFilesByResult = new Map<SubsetResult, string[]>();

	for (const result of results) {
		const originalFiles: string[] = [];

		for (const distFontFile of distFontFiles) {
			const stat = await fs.stat(distFontFile);
			if (stat.size !== result.originalSize) continue;

			if (fullHash(await fs.readFile(distFontFile)) === result.originalHash) {
				originalFiles.push(distFontFile);
			}
		}

		originalFilesByResult.set(result, originalFiles);
		if (originalFiles.length === 0) {
			console.warn(
				`   ⚠ Original asset for '${result.id}' was not found in dist/.`,
			);
		}
	}

	for (const file of filesToReplace) {
		let content = await fs.readFile(file, "utf-8");
		let replaced = false;

		for (const result of results) {
			const subsetUrl = `/_astro/fonts/${result.hash}.woff2`;
			const originalFiles = originalFilesByResult.get(result) ?? [];

			for (const originalFile of originalFiles) {
				const relativePath = path
					.relative(DIST_DIR, originalFile)
					.split(path.sep)
					.join("/");
				const originalUrl = `/${relativePath}`;

				if (!content.includes(originalUrl)) continue;

				const originalExtension = path
					.extname(originalFile)
					.slice(1)
					.toLowerCase();
				content = content
					.replaceAll(
						`url("${originalUrl}") format("${result.format}")`,
						`url("${subsetUrl}") format("woff2")`,
					)
					.replaceAll(
						`href="${originalUrl}" as="font" type="font/${originalExtension}"`,
						`href="${subsetUrl}" as="font" type="font/woff2"`,
					)
					.replaceAll(originalUrl, subsetUrl);
				replaced = true;
			}
		}

		if (replaced) {
			await fs.writeFile(file, content);
			console.log(`   ✔ Updated: ${file}`);
		}
	}

	console.log("🗑 Cleaning up original font files from dist/...");
	for (const originalFiles of originalFilesByResult.values()) {
		for (const originalFile of originalFiles) {
			await fs.unlink(originalFile);
			console.log(`   ✔ Removed: ${originalFile}`);
		}
	}

	console.log("✨ Font subsetting completed!");
}

main().catch((err) => {
	console.error("❌ Font subsetting failed:", err);
	process.exit(1);
});
