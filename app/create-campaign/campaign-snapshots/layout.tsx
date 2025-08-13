import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplify - Campaign Snapshots",
  description: "Campaign Snapshots",
};

export default function CampaignSnapshotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
