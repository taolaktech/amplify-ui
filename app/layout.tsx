// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayoutWrapper from "./lib/components/ClientLayoutWrapper";
import { inter, rubik } from "./ui/fonts";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  themeColor: "#FBFAFC",
};

export const metadata: Metadata = {
  title: "Amplify - Maximize Your Store's Potential",
  description:
    "Amplify is a powerful tool that helps you drive sales and traffic to your store. Choose the right connection option for your business.",
  keywords: [
    "Amplify",
    "sales",
    "traffic",
    "store",
    "connection",
    "shopify",
    "ads",
  ],
  authors: [{ name: "Amplify" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
      </head>
      <body className={`antialiased ${inter.className} ${rubik.variable}`}>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
