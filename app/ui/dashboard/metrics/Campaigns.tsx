import useMetricsStore from "@/app/lib/stores/metricsStore";
import {
  ArrowCircleRight2,
  ArrowRight,
  InfoCircle,
  CalendarRemove,
} from "iconsax-react";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useToastStore } from "@/app/lib/stores/toastStore";
import { useRouter } from "next/navigation";
import Button from "../../Button";

function Campaigns() {
  const campaigns = useMetricsStore((state) => state.campaigns);
  const marketingGoals = useSetupStore((state) => state.marketingGoals);
  const setToast = useToastStore((state) => state.setToast);
  const router = useRouter();

  const handleCreateCampaign = () => {
    if (marketingGoals.complete) {
      router.push("/pricing");
      return;
    }
    setToast({
      title: "👋 Let's Get You Set Up First",
      message:
        "You need to complete onboarding before launching your first campaign. It only takes a minute!",
      type: "warning",
    });
  };

  return (
    <div>
      <MetricsPoint isCampaignsAvailable={!!campaigns} />
      <div
        className={`mt-7 mb-7 ${
          !campaigns
            ? "min-h-[350px] lg:min-h-[550px] bg-[#FBFAFC] flex flex-col"
            : ""
        }`}
      >
        {!campaigns && (
          <NoCampaigns handleCreateCampaign={handleCreateCampaign} />
        )}
      </div>
    </div>
  );
}

export default Campaigns;

function NoCampaigns({
  handleCreateCampaign,
}: {
  handleCreateCampaign: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col gap-6 items-center justify-center h-full ">
      <span className="hidden lg:block">
        <CalendarRemove size="72" color="#B6B3B9" variant="Bulk" />
      </span>
      <span className="lg:hidden">
        <CalendarRemove size="48" color="#B6B3B9" variant="Bulk" />
      </span>

      <div className="flex flex-col gap-1 justify-center items-center">
        <div className="lg:text-xl font-medium text-heading">
          No campaigns yet.
        </div>
        <div className="lg:text-base text-gray-500 text-sm">
          Start your first campaign after setup!
        </div>
      </div>
      <div>
        <Button
          text="Setup your first Campaign"
          buttonSize="small"
          hasIconOrLoader
          icon={<ArrowCircleRight2 size="18" color="#ffffff" />}
          iconPosition="right"
          action={handleCreateCampaign}
        />
      </div>
    </div>
  );
}

function MetricsPoint({
  isCampaignsAvailable,
}: {
  isCampaignsAvailable: boolean;
}) {
  const metricsPoints = useMetricsStore((state) => state.metricsPoints);
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xl:gap-3">
      {metricsPoints.map((metric) => (
        <div
          className={`
        h-[120px] border border-[#F3EFF6] rounded-[20px] p-5 flex flex-col justify-center bg-white relative`}
          key={metric.title}
        >
          {!isCampaignsAvailable && (
            <div className="absolute rounded-[20px] backdrop-blur-[5px] bg-transparent top-0 right-0 bottom-0 left-0 w-full"></div>
          )}
          <div>
            <div className="text-xs text-[#555456] flex items-center gap-1">
              <span>{metric.title}</span>
              <InfoCircle size="12" color="#555456" />
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xl font-bold num">{metric.value}</span>
              {metric.rate === "increase" ? (
                <span className="w-[36px] h-[20px] rounded-[125px] bg-[#EAF7EF] flex items-center justify-center gap-1">
                  {isCampaignsAvailable && (
                    <ArrowRight
                      size="7"
                      color="#27AE60"
                      style={{ transform: "rotate(-45deg)" }}
                    />
                  )}
                  <span className="text-[7.5px] text-[#27AE60] font-medium">
                    {metric.percentage}%
                  </span>
                </span>
              ) : metric.rate === "decrease" ? (
                <span className="w-[36px] h-[20px] rounded-[125px] bg-[#FEE8E6] flex items-center justify-center gap-1">
                  {isCampaignsAvailable && (
                    <ArrowRight
                      size="7"
                      color="#EB5757"
                      style={{ transform: "rotate(45deg)" }}
                    />
                  )}
                  <span className="text-[7.5px] text-[#EB5757] font-medium">
                    {metric.percentage}%
                  </span>
                </span>
              ) : (
                <span className="w-[36px] h-[20px] rounded-[125px] bg-[#F3F4F6] flex items-center justify-center gap-1">
                  <span className="text-[7.5px] text-[#B0B0B0] font-medium">
                    {metric.percentage}%
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
