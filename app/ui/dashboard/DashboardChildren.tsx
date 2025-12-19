"use client";
import useUIStore from "@/app/lib/stores/uiStore";
import { usePathname } from "next/navigation";

export default function DashboardChildren({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const pathname = usePathname();

  const isCampaigns = pathname.startsWith("/campaigns");
  console.log("isCampaigns", isCampaigns);

  return (
    <div
      className={` ${isSidebarOpen ? "xl:ml-[279px]" : "xl:ml-[91px]"} ${
        !isCampaigns ? "px-5" : "px-0"
      } flex-1 flex `}
    >
      <div className="flex-1 flex flex-col pt-3 w-full xl:pt-10 max-w-[1116px] mx-auto mb-5">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
