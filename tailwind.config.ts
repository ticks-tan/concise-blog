import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import { withMaterialColors } from "tailwind-material-colors";

const config: Config = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: ["selector"],
	theme: {
		extend: {},
	},
	plugins: [typography]
};

export default withMaterialColors(
	config,
	{
		primary: "#2357de",
	},
	{
		scheme: "neutral",
		contrast: 0,
		extend: false,
	}
);
