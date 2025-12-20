import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify - Campaigns V2",
  description: "Manage your marketing campaigns",
};

export default function CampaignsV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
