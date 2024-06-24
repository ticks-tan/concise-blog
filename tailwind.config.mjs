/** @type {import('tailwindcss').Config} */
/** @type {import('tailwind-material-colors').ColorsMap} */
/** @type {import('tailwind-material-colors').Options} */

import typography from "@tailwindcss/typography";
import { withMaterialColors } from "tailwind-material-colors";

module.exports = withMaterialColors(
	{
		content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
		darkMode: ["selector"],
		theme: {
			extend: {},
		},
		plugins: [typography],
	},
	{
		primary: "#2357de",
	},
	{
		scheme: "content",
		contrast: 0,
		extend: false,
	}
);
