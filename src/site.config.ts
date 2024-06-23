import type { SiteConfig, NavConfig } from "~/types";

export const siteConfig: SiteConfig = {
	title: "My Blog",
	description: "my blog websiye",
	author: "Ticks",
	favicon: "/favicon.svg",
	siteYear: 2023,
};

export const navConfig: NavConfig = {
	items: [
		{
			label: "搜索",
			href: "/search",
		},
		{
			label: "关于",
			href: "/about",
		},
	],
};
