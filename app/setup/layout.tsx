import type React from "react";
import SetupSideBar from "../ui/SetupSideBar";

export const metadata = {
  title: "Amplify - Connect your Store",
  description: "Connect your Shopify store or website to Amplify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col xl:flex-row max-w-[836px] xl:max-w-full mx-auto">
      {/* Sidebar */}
      <SetupSideBar />
      {/* Main Content */}
      <div className="px-5 flex-1 flex">
        <div className="flex-1 pt-3 w-full xl:pt-22 max-w-[836px] mx-auto mb-5">
          {children}
        </div>
      </div>
    </main>
  );
}
