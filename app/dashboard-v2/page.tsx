"use client";
import GettingStartedV2 from "../ui/dashboard/GettingStartedV2";
import CompetitorAds from "../ui/dashboard/CompetitorAds";
import AdLibrary from "../ui/dashboard/AdLibrary";

export default function DashboardV2Page() {
  return (
    <div className="min-h-[calc(100vh-56px)] relative flex flex-col flex-shrink-0 lg:gap-6">
      <GettingStartedV2 />
      <div className="mt-6">
        <CompetitorAds />
      </div>
      <div className="mt-6">
        <AdLibrary />
      </div>
    </div>
  );
}
