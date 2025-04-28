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
  content: [
    // your paths here
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
