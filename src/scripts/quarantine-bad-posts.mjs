import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = "src/content/posts";
const QUARANTINE_DIR = "src/content/_quarantine";

if (!fs.existsSync(QUARANTINE_DIR)) {
	fs.mkdirSync(QUARANTINE_DIR, { recursive: true });
}

function isExternalUrl(url) {
	return /^(https?:\/\/|\/\/|[\w+.-]+:)/i.test(url);
}

function stripCode(md) {
	const out = md
		.replace(/```[\s\S]*?```/g, "")
		.replace(/~~~[\s\S]*?~~~/g, "")
		.replace(/`[^`\n]+`/g, "");

	const lines = out.split("\n");
	const kept = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		const indented = /^ {4,}|\t/.test(line);
		const prevBlank = i === 0 || lines[i - 1].trim() === "";
		if (indented && prevBlank) {
			while (i < lines.length && /^ {4,}|\t/.test(lines[i])) i++;
			continue;
		}
		kept.push(line);
		i++;
	}
	return kept.join("\n");
}

function walk(dir) {
	return fs.readdirSync(dir).flatMap((f) => {
		const p = path.join(dir, f);
		if (fs.statSync(p).isDirectory()) return walk(p);

		return /\.mdx?$/.test(f) ? [p] : [];
	});
}

function hasMissingImage(file) {
	const raw = fs.readFileSync(file, "utf8");
	let data;
	let content;
	try {
		({ data, content } = matter(raw));
	} catch (err) {

		console.warn(
			`⚠️ frontmatter parse failed, quarantining: ${file}\n   ${err.message}`,
		);
		return true;
	}

	const images = new Set();

	if (
		typeof data.image === "string" &&
		data.image !== "api" &&
		!isExternalUrl(data.image)
	) {
		images.add(data.image);
	}

	const codeStripped = stripCode(content);
	const mdImages = [...codeStripped.matchAll(/!\[.*?\]\((.+?)\)/g)]
		.map((m) => m[1])
		.filter((p) => !isExternalUrl(p));

	for (const p of mdImages) images.add(p);

	return [...images].some((img) => {
		const abs = img.startsWith("/")
			? path.join("public", img)
			: path.resolve(path.dirname(file), img);

		return !fs.existsSync(abs);
	});
}

function main() {
	const files = walk(POSTS_DIR);
	let moved = 0;

	for (const file of files) {
		if (hasMissingImage(file)) {

			const target = path.resolve(
				QUARANTINE_DIR,
				path.relative(POSTS_DIR, file),
			);
			fs.mkdirSync(path.dirname(target), { recursive: true });
			fs.renameSync(file, target);
			console.log(`🚫 Quarantined: ${file}`);
			moved++;
		}
	}

	console.log(`\n✅ Done. Quarantined ${moved} broken posts.`);
}

main();
