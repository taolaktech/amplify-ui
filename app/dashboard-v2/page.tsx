"use client";
import GettingStartedV2 from "../ui/dashboard/GettingStartedV2";

export default function DashboardV2Page() {
  return (
    <div className="min-h-[calc(100vh-56px)] relative flex flex-col flex-shrink-0 lg:gap-6">
      <div className="mb-3 lg:hidden font-semibold text-lg">Dashboard V2</div>
      <GettingStartedV2 />
    </div>
  );
}
