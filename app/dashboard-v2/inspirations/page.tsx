"use client";
import CompetitorAds from "../../ui/dashboard/CompetitorAds";
import AdLibrary from "../../ui/dashboard/AdLibrary";

export default function CompetitorAdsPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] relative flex flex-col flex-shrink-0 lg:gap-6">
      <div className="mb-3 lg:hidden font-semibold text-lg">Use Our Ready Made Creative Templates</div>
      <div className="flex flex-col gap-7">
        <div className="flex w-full flex-col-reverse gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="font-medium tracking-150 text-sm lg:text-base">
            Get inspired with top performing ads from competitors or from our templates
          </div>
        </div>
        <CompetitorAds />
        <AdLibrary />
      </div>
    </div>
  );
}
