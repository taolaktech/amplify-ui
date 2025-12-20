"use client";
import GettingStartedV2 from "../ui/dashboard/GettingStartedV2";
import CompetitorAds from "../ui/dashboard/CompetitorAds";

export default function DashboardV2Page() {
  return (
    <div className="min-h-[calc(100vh-56px)] relative flex flex-col flex-shrink-0 lg:gap-6">
      <div className="mb-3 lg:hidden font-semibold text-lg">Dashboard V2</div>
      <GettingStartedV2 />
      <div className="mt-6 flex gap-2">
        <div className="w-full xl:max-w-[calc(100%-408px)]">
          <CompetitorAds limit={10} showViewAllButton={true} />
        </div>
        <div className="hidden xl:block w-full max-w-[400px]"></div>
      </div>
    </div>
  );
}
