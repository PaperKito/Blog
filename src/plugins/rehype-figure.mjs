import { h } from "hastscript";
import { visit } from "unist-util-visit";
import { shouldAddNoReferrer } from "../utils/image-utils.ts";

export default function rehypeFigure() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {

			if (node.tagName !== "img") {
				return;
			}

			const classRaw = node.properties?.className;
			const classNames = Array.isArray(classRaw)
				? classRaw
				: typeof classRaw === "string"
					? classRaw.split(/\s+/)
					: [];
			if (classNames.includes("plantuml-image")) {
				return;
			}

			const imgProps = { ...node.properties };

			if (imgProps.src && shouldAddNoReferrer(imgProps.src)) {
				imgProps.referrerpolicy = "no-referrer";
			}

			const alt = imgProps.alt;

			if (!alt || alt.trim() === "") {
				node.properties = imgProps;
				return;
			}

			const figure = h("figure", [

				h("img", {
					...imgProps,
				}),
				h("figcaption", alt),
			]);

			const centerFigure = h("center", figure);

			if (parent && typeof index === "number") {
				parent.children[index] = centerFigure;
			}
		});
	};
}
