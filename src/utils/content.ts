import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

// 获取全部博客文章，按时间最近排序
export async function getBlogCollection() {
	const posts = (await getCollection("blog")).sort((a, b) => {
		return (
			new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
		);
	});
	if (posts && posts.length > 0) {
		return posts.filter(({ data }) => {
			return import.meta.env.PROD ? !data.draft : true;
		});
	} else {
		return [];
	}
}

// 根据标签获取文章
export async function getBlogCollectionByTag(tag: string) {
	const posts = await getBlogCollection();
	return posts.filter((post) =>
		post.data.tags ? post.data.tags.includes(tag) : false
	);
}

// 获取最近最多 count 篇文章
export async function getRecentBlogCollection(count: number) {
	const posts = await getBlogCollection();
	return posts.slice(0, count);
}

// 获取文章并按年份分组
export async function getBlogCollectionGroupByYear() {
	const posts = await getBlogCollection();
	const groupByYear = new Map<number, Array<CollectionEntry<"blog">>>();
	const sortGroupByYear = new Array<{
		year: number;
		blogs: Array<CollectionEntry<"blog">>;
	}>();
	posts.forEach((post) => {
		const year = new Date(post.data.date).getFullYear();
		if (groupByYear.has(year)) {
			groupByYear.get(year)!.push(post);
		} else {
			groupByYear.set(year, [post]);
		}
	});
	groupByYear.forEach((blogs, year) => {
		sortGroupByYear.push({ year, blogs });
	});
	sortGroupByYear.sort((a, b) => b.year - a.year);
	return sortGroupByYear;
}
