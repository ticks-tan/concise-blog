import { defineCollection, z } from "astro:content";

function removeDupsAndLowerCase(array: string[]) {
	if (!array.length) return array;
	const lowercaseItems = array.map((str) => str.toLowerCase());
	const distinctItems = new Set(lowercaseItems);
	return Array.from(distinctItems);
}

const blog = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string().max(60),
		description: z.string().default("").nullable(),
		date: z.date(),
		tags: z
			.array(z.string())
			.default([])
			.transform(removeDupsAndLowerCase)
			.nullable(),
		draft: z.boolean().default(false).nullable(),
		mathjax: z.boolean().default(false).nullable(),
		donate: z.boolean().default(false).nullable(),
	}),
});

export const collections = { blog };
