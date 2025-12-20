import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify - Dashboard V2",
  description: "Dashboard Version 2",
};

export default function DashboardV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
