"use client";

import type { Metadata } from "next";
import "./globals.css";
import AuthBlock from "./lib/components/AuthBlock";
import Navbar from "./ui/Navbar";
import SplashScreen from "./ui/loaders/SplashScreen";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
        {/* <link rel="icon" href="/fav0" type="image/ico" /> */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </head>
      <QueryClientProvider client={queryClient}>
        <body className={`antialiased min-h-screen`}>
          <Navbar />
          <AuthBlock>
            <div>{children}</div>
          </AuthBlock>
          <SplashScreen />
        </body>
      </QueryClientProvider>
    </html>
  );
}
