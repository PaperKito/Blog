import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";
import { live2dWidgetConfig, spineModelConfig } from "../config";
import { resolveSiteRoot } from "./site-root";

const DIST_DIR = resolveSiteRoot();

const PIO_ROOT = "pio";

const LIVE2D_ASSETS = ["pio/models/live2d"];

const SPINE_ASSETS = ["pio/models/spine", "pio/static"];

const L2D_CHUNK_GLOB = "_astro/Live2DWidget.astro_astro_type_script*";

async function sizeOf(target: string): Promise<number | null> {
	let stat: Awaited<ReturnType<typeof fs.stat>>;
	try {
		stat = await fs.stat(target);
	} catch {
		return null;
	}
	if (!stat.isDirectory()) return stat.size;

	const names = await fs.readdir(target);
	let total = 0;
	for (const name of names) {
		total += (await sizeOf(path.join(target, name))) ?? 0;
	}
	return total;
}

async function remove(relPath: string): Promise<number | null> {
	const target = path.join(DIST_DIR, relPath);

	const bytes = await sizeOf(target);
	if (bytes === null) return null;

	await fs.rm(target, { recursive: true, force: true });
	console.log(`   ✂ ${relPath} (${(bytes / 1024 / 1024).toFixed(2)} MiB)`);
	return bytes;
}

async function findLive2dChunks(): Promise<string[]> {

	return glob(L2D_CHUNK_GLOB, { cwd: DIST_DIR, posix: true });
}

async function main() {
	const live2dEnabled = live2dWidgetConfig.enable;
	const spineEnabled = spineModelConfig.enable;

	if (live2dEnabled && spineEnabled) {
		console.log(
			"🎎 Live2D + Spine models are both enabled, keeping all pio assets",
		);
		return;
	}

	console.log("🎎 Pruning unused mascot assets in dist/...");

	const targets: string[] = [];
	if (!live2dEnabled && !spineEnabled) {

		targets.push(PIO_ROOT);
	} else {
		if (!live2dEnabled) targets.push(...LIVE2D_ASSETS);
		if (!spineEnabled) targets.push(...SPINE_ASSETS);
	}
	if (!live2dEnabled) targets.push(...(await findLive2dChunks()));

	let freed = 0;
	let removedCount = 0;
	for (const target of targets) {
		const bytes = await remove(target);
		if (bytes === null) continue;
		freed += bytes;
		removedCount++;
	}

	if (removedCount === 0) {
		console.log("✨ No mascot assets to prune");
		return;
	}
	console.log(
		`✨ Pruned ${removedCount} mascot assets, freed ${(freed / 1024 / 1024).toFixed(2)} MiB`,
	);
}

main().catch((err) => {
	console.error("❌ Failed to prune mascot assets:", err);
	process.exit(1);
});
