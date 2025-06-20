import { InfoCircle } from "iconsax-react";
import useMetricsStore from "@/app/lib/stores/metricsStore";
import Image from "next/image";
import TimelineFilter from "./TimelineFilter";

export default function MetricsLayout({}) {
  const campaignsFilter = useMetricsStore((state) => state.campaignsFilter);
  const setCampaignsFilter = useMetricsStore(
    (state) => state.actions.setCampaignsFilter
  );

  const filterAll = campaignsFilter === "all";
  const filterGoogle = campaignsFilter === "google";
  const filterInstagram = campaignsFilter === "instagram";
  const filterFacebook = campaignsFilter === "facebook";

  return (
    <div className="flex justify-between items-center my-2 py-5">
      <div className="flex items-center gap-1">
        <span className="font-medium text-xs">KEY METRICS</span>
        <InfoCircle size="18" color="#333" />
      </div>
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center text-xs gap-3 bg-[#FBFAFC] rounded-lg py-3 px-4">
          <div>Filter by</div>
          <button
            onClick={() => setCampaignsFilter("all")}
            className={`px-3 py-2 text-xs w-[110px] text-center font-semibold h-[30px] ${
              filterAll ? "bg-[#F3EFF6] rounded-lg " : ""
            }`}
          >
            All Channels
          </button>
          <button
            onClick={() => setCampaignsFilter("google")}
            className={`px-3 py-2 flex gap-1 items-center justify-center font-semibold w-[110px] h-[30px] ${
              filterGoogle ? "bg-[#F3EFF6] rounded-lg" : ""
            }`}
          >
            <Image
              src="/google_ads-icon.svg"
              width={17}
              height={17}
              alt="Google Ads"
            />
            <span>Google Ads</span>
          </button>
          <button
            onClick={() => setCampaignsFilter("instagram")}
            className={`px-3 py-2 flex gap-1 items-center justify-center font-semibold w-[110px] h-[30px] ${
              filterInstagram ? "bg-[#F3EFF6] rounded-lg" : ""
            }`}
          >
            <Image
              src="/instagram_logo.svg"
              width={17}
              height={17}
              alt="Instagram"
            />
            <span>Instagram</span>
          </button>
          <button
            onClick={() => setCampaignsFilter("facebook")}
            className={`px-3 py-2 flex gap-1 items-center font-semibold justify-center w-[110px] h-[30px] ${
              filterFacebook ? "bg-[#F3EFF6] rounded-lg" : ""
            }`}
          >
            <Image
              src="/facebook_logo.svg"
              width={17}
              height={17}
              alt="Instagram"
            />
            <span>Facebook</span>
          </button>
        </div>
        <TimelineFilter />
      </div>
    </div>
  );
}
