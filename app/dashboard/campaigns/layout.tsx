import { Metadata } from "next";
// import '@ant-design/v5-patch-for-react-19';

export const metadata: Metadata = {
  title: "Amplify - Campaigns",
  description: "View your campaigns",
};

export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
