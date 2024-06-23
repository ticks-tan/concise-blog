import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

import { siteConfig } from "~/site.config";
import { getBlogCollection } from "~/utils/content";

export async function GET() {
	const blogs = await getBlogCollection();

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		items: blogs.map((post: any) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.date,
			link: `/posts/${post.data.shortSlug ?? post.slug}`,
		})),
	});
}
