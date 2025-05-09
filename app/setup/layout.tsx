import type React from "react";
import SetupSideBar, { GoBack } from "../ui/SetupSideBar";

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
      <div className="px-5 flex-1 flex xl:ml-[402px]">
        <div className="flex-1 flex flex-col pt-3 w-full xl:pt-10 max-w-[836px] mx-auto mb-5">
          <div className="hidden xl:block mb-3">
            <GoBack />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}
