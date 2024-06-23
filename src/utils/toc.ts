import type { MarkdownHeading } from "astro";

export interface TocItem extends MarkdownHeading {
	subheadings: Array<TocItem>;
}

function diveChildren(item: TocItem, depth: number): Array<TocItem> {
	if (depth === 1 || !item.subheadings.length) {
		return item.subheadings;
	} else {
		// e.g., 2
		return diveChildren(
			item.subheadings[item.subheadings.length - 1] as TocItem,
			depth - 1
		);
	}
}

// 根据 MarkdownHeading 数组生成目录
export function generateMarkdownToc(headings: Array<MarkdownHeading>) {
	const filterHeadings = [...headings.filter(({ depth }) => depth < 4)];
	const minDepth = Math.min(...filterHeadings.map(({ depth }) => depth));
	const toc: Array<TocItem> = [];

	filterHeadings.forEach((heading) => {
		const h: TocItem = { ...heading, subheadings: [] };
		if (h.depth === minDepth) {
			toc.push(h);
		} else {
			if (toc.length === 0) {
				throw new Error(`Error heading found: ${h.text}`);
			}
			const lastTocItem = toc[toc.length - 1]!;
			if (h.depth < lastTocItem.depth) {
				throw new Error(`Error heading found: ${h.text}`);
			}
			const depthDiff = h.depth - lastTocItem.depth;
			const target = diveChildren(lastTocItem, depthDiff);
			target.push(h);
		}
	});
	return toc;
}
