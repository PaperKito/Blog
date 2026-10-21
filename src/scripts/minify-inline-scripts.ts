import fs from "node:fs/promises";
import { transformSync } from "esbuild";
import { glob } from "glob";
import { resolveSiteRoot } from "./site-root";

const DIST_DIR = resolveSiteRoot();

const SCRIPT_RE = /<script([^>]*)>([\s\S]*?)<\/script>/gi;

const JS_TYPES = new Set([
	"",
	"text/javascript",
	"application/javascript",
	"module",
]);

function shouldMinify(attrs: string): boolean {
	if (/\ssrc\s*=/i.test(attrs)) return false;
	const typeMatch = attrs.match(/\stype\s*=\s*["']?([^"'\s>]*)/i);
	const type = (typeMatch?.[1] ?? "").toLowerCase();
	return JS_TYPES.has(type);
}

function minifyInline(code: string, file: string): string {
	if (!code.trim()) return code;
	try {
		const result = transformSync(code, {
			loader: "js",
			target: "es2018",
			minifyWhitespace: true,
			minifySyntax: true,

			minifyIdentifiers: false,
		});

		if (/<\/script/i.test(result.code)) return code;
		return result.code;
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.warn(`   ⚠ Skipped a script in ${file}: ${message}`);
		return code;
	}
}

async function main() {
	console.log("🗜 Minifying inline scripts in dist/...");

	const htmlFiles = await glob(`${DIST_DIR}/**/*.html`);
	let savedBytes = 0;
	let touchedFiles = 0;
	let scriptCount = 0;

	for (const file of htmlFiles) {
		const html = await fs.readFile(file, "utf-8");
		let fileSaved = 0;

		const output = html.replace(
			SCRIPT_RE,
			(whole, attrs: string, code: string) => {
				if (!shouldMinify(attrs)) return whole;
				const minified = minifyInline(code, file);
				if (minified === code) return whole;
				scriptCount++;
				fileSaved +=
					Buffer.byteLength(code, "utf-8") -
					Buffer.byteLength(minified, "utf-8");
				return `<script${attrs}>${minified}</script>`;
			},
		);

		if (fileSaved !== 0 || output !== html) {
			await fs.writeFile(file, output);
			savedBytes += fileSaved;
			touchedFiles++;
		}
	}

	const savedKiB = (savedBytes / 1024).toFixed(1);
	console.log(
		`✨ Minified ${scriptCount} inline scripts in ${touchedFiles}/${htmlFiles.length} HTML files, saved ${savedKiB} KiB`,
	);
}

main().catch((err) => {
	console.error("❌ Inline script minification failed:", err);
	process.exit(1);
});
