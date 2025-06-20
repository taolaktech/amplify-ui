import { useEffect, useState } from "react";
import { useCreateCampaignStore } from "../stores/createCampaignStore";

export default function useCampaignSnapshot() {
  const { campaignSnapshots, actions } = useCreateCampaignStore(
    (state) => state
  );

  const [campaignType, setCampaignType] = useState("");
  const [brandColor, setBrandColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [campaignStartDate, setCampaignStartDate] = useState(new Date());
  const [campaignEndDate, setCampaignEndDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  ); //in 1 month from campaignStartDate

  useEffect(() => {
    if (campaignSnapshots.campaignType) {
      setCampaignType(campaignSnapshots.campaignType);
    }
    if (campaignSnapshots.brandColor) {
      setBrandColor(campaignSnapshots.brandColor);
    }
    if (campaignSnapshots.accentColor) {
      setAccentColor(campaignSnapshots.accentColor);
    }
    if (campaignSnapshots.campaignStartDate) {
      setCampaignStartDate(new Date(campaignSnapshots.campaignStartDate));
    }
    if (campaignSnapshots.campaignEndDate) {
      setCampaignEndDate(new Date(campaignSnapshots.campaignEndDate));
    }
  }, []);

  return {
    campaignSnapshots,
    actions,
    campaignType,
    brandColor,
    accentColor,
    campaignStartDate,
    campaignEndDate,
    setCampaignType,
    setBrandColor,
    setAccentColor,
    setCampaignStartDate,
    setCampaignEndDate,
  };
}
