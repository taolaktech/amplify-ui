import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgo: {
              plugins: [{ removeViewBox: false }, { removeDimensions: false }],
            },
          },
        },
      ],
    });
    return config;
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "cdn.shopify.com",
      "cdn.pixabay.com",
      "s3.us-east-2.amazonaws.com",
      "amplify-shopify-uploads.s3.us-east-2.amazonaws.com",
    ],
  },
  experimental: {
    allowedDevOrigins: ["http://172.20.10.6:3000", "http://192.168.1.168:3000"], // <-- 🔥 This is what you need
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
