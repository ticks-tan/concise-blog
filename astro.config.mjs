import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

import { remarkReadingTime } from "./src/plugins/RemarkReadingTime";

// https://astro.build/config
export default defineConfig({
	site: "https://blog.example.com",
	integrations: [tailwind(), sitemap(), icon()],
	prefetch: {
		defaultStrategy: "hover",
	},
	output: "static",
	markdown: {
		shikiConfig: {
			themes: {
				light: "github-light",
				dark: "github-dark",
			},
		},
		remarkPlugins: [remarkReadingTime],
	},
});
