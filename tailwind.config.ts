import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      transitionProperty: {
        shadow: "box-shadow",
      },
    },
  },
  content: [
    // your paths here
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
