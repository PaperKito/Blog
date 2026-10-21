import { existsSync } from "node:fs";

export function resolveSiteRoot(): string {
	return existsSync("dist/client") ? "dist/client" : "dist";
}
