import type React from "react";
import SetupSideBar from "../ui/SetupSideBar";
import SetupMainContainer from "../ui/SetupMainContainer";

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
      <SetupMainContainer>{children}</SetupMainContainer>
    </main>
  );
}
