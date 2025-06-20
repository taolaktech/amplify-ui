import {heroui} from '@heroui/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      transitionProperty: {
        shadow: "box-shadow",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [heroui()],
  content: [
    "// your paths here\r\n    \"./src/**/*.{js,ts,jsx,tsx}\"",
    "./node_modules/@heroui/theme/dist/components/(date-picker|button|ripple|spinner|calendar|date-input|form|popover).js"
  ],
};

export default config;
