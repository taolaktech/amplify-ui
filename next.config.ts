import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // images: {
  //   unoptimized: true,
  // },
  // output: "export",
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgo: {
              plugins: [
                { removeViewBox: false },
                { removeDimensions: false }, // Ensures width/height are not removed
              ],
            },
          },
        },
      ],
    });
    return config;
  },
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

export default nextConfig;
