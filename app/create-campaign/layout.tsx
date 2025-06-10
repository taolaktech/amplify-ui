import { Metadata } from "next";
import CreateCampaign from "../ui/CreateCampaign";

export const metadata: Metadata = {
  title: "Amplify - Create Campaign",
  description: "Create a new campaign",
};

export default function CreateCampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1300px] mx-auto px-5">
      <CreateCampaign>{children}</CreateCampaign>
    </div>
  );
}
