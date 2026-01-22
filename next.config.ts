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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "amplify-shopify-uploads.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "amplify-shopify-uploads.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ["http://172.20.10.6:3000", "http://192.168.1.168:3000"],
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
