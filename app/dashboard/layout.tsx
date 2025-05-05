import { Metadata } from "next";
import DashboardSideBar from "../ui/DashboardSideBar";

export const metadata: Metadata = {
  title: "Amplify - Dashboard",
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col xl:flex-row xl:max-w-full">
      {/* Sidebar */}
      <DashboardSideBar />
      {/* Main Content */}
      <div className="px-5 flex-1 flex xl:ml-[279px]">
        <div className="flex-1 flex flex-col pt-3 w-full xl:pt-10 max-w-[1106px] mx-auto mb-5">
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
