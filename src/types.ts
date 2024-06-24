// 网站配置
export type SiteConfig = {
	title: string;
	description: string;
	author: string;
	favicon: string;
	siteYear: number;
	proseStyle?: string;
};

// 导航配置
export type NavConfig = {
	items: {
		label: string;
		href: string;
	}[];
};

// 页面 Meta 配置
export type SiteMeta = {
	title: string;
	description?: string;
};
