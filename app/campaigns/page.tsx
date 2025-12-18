"use client";
import { CalendarEdit } from "iconsax-react";
import { useCampaignsActions } from "../lib/hooks/campaigns";
import useCampaignsStore from "../lib/stores/campaignsStore";
import { useMemo } from "react";
import { CircleLoader2 } from "../ui/loaders/CircleLoader";
import CampaignsOverview from "../lib/components/CampaignsOverview";

export default function CampaignsPage() {
  const { navigateToCreateCampaign } = useCampaignsActions();
  const data = useCampaignsStore((state) => state.data);
  const loading = useCampaignsStore((state) => state.showLoader);

  const hasCampaigns = useMemo(() => data && data.length > 0, [data]);

  return (
    <div className="min-h-[calc(100vh-181px)] mb-6 flex flex-col justify-center items-center">
      {!data && loading ? (
        <CircleLoader2 />
      ) : (
        <CampaignsOverview
          data={data}
          loading={loading}
          hasCampaigns={hasCampaigns}
        />
      )}
    </div>
  );
}
