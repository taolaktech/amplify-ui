// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayoutWrapper from "./lib/components/ClientLayoutWrapper";
import { inter, rubik } from "./ui/fonts";
import Toast from "./ui/Toast";

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
        <link
          href="https://fonts.cdnfonts.com/css/sf-pro-display"
          rel="stylesheet"
        />
        <link
          href="https://db.onlinewebfonts.com/c/826e807c7cd21cd70d47bb789cc6354c?family=Proxima+Nova+Lt+Regular"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://db.onlinewebfonts.com/c/461b610b52e5f2020d4450abdbbecb73?family=ProximaNova-Semibold"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body className={`antialiased ${inter.className} ${rubik.variable}`}>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        <Toast />
      </body>
      <script
        async
        src="//mozilla.github.io/pdf.js/build/pdf.mjs"
        type="module"
      ></script>
    </html>
  );
}
