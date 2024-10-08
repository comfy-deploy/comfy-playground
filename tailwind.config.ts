import { nextui } from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(autocomplete|badge|button|card|checkbox|chip|code|divider|dropdown|input|kbd|navbar|select|skeleton|slider|spinner|toggle|popover|ripple|listbox|scroll-shadow|menu).js"
  ],
  theme: {
    extend: {
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    addCommonColors: true,
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#000000",
            foreground: "#ffffff",
          },
        },
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: "#ffffff",
            foreground: "#000000",
          },
        },
      },
    },
    layout: {
      radius: {
        large: "0.9rem",
        medium: "0.75rem",
        small: "0.5rem",
      },
    },
  })],
};
export default config;
