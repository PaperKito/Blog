declare module "subset-font" {

	type VariationAxis =
		| number
		| { min?: number; max?: number; default?: number };

	interface SubsetFontOptions {

		targetFormat?: "sfnt" | "woff" | "woff2";

		preserveNameIds?: number[];

		variationAxes?: Record<string, VariationAxis>;

		noLayoutClosure?: boolean;
	}

	export default function subsetFont(
		originalFont: Buffer,
		text: string,
		options?: SubsetFontOptions,
	): Promise<Buffer>;
}
