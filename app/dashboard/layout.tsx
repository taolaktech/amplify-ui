import { Metadata } from "next";
import DashboardSideBar from "../ui/DashboardSidebar";
import DashboardChildren from "../ui/dashboard/DashboardChildren";

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
      <DashboardChildren>{children}</DashboardChildren>
    </div>
  );
}
