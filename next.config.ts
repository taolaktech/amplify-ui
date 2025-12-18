import type { NextConfig } from "next";

const allowedOrigins = [
  "http://127.0.0.1",
  "http://localhost",
];

if (process.env.REPLIT_DEV_DOMAIN) {
  allowedOrigins.push(`https://${process.env.REPLIT_DEV_DOMAIN}`);
}

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
  allowedDevOrigins: allowedOrigins,
};

export default nextConfig;
