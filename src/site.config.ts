import type { SiteConfig, NavConfig } from "~/types";

export const siteConfig: SiteConfig = {
	title: "Astro Concise",
	description: "my blog websiye",
	author: "Ticks",
	favicon: "/favicon.svg",
	siteYear: 2023,
};

export const navConfig: NavConfig = {
	items: [
		{
			label: "Search",
			href: "/search",
		},
		{
			label: "About",
			href: "/about",
		},
	],
};
