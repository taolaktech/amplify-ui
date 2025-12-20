import Link from "next/link";
import { HomeTrendUp, Magicpen, CalendarEdit } from "iconsax-react";

export const Version2SideBar = ({
  on,
  isSidebarOpen,
  isDashboardV2,
  isInspirationsV2,
  isCampaignsV2,
  closeSidebar,
}: {
  on: boolean;
  isSidebarOpen: boolean;
  isDashboardV2: boolean;
  isInspirationsV2: boolean;
  isCampaignsV2: boolean;
  closeSidebar?: () => void;
}) => {
  return (
    <ul
      className={`flex flex-col overflow-hidden gap-1 transition-all duration-300 ${
        on ? "h-[120px] mt-2" : "h-0"
      }`}
    >
      <li className={`px-4 rounded-xl py-2 ${isDashboardV2 ? "bg-[#F6F6F6]" : ""}`}>
        <Link
          onClick={closeSidebar}
          href="/dashboard-v2"
          className="flex items-center gap-2"
        >
          {isDashboardV2 ? (
            <HomeTrendUp size="18" color="#000" />
          ) : (
            <HomeTrendUp size="18" color={"#737373"} />
          )}
          {isSidebarOpen && (
            <span
              className={`text-xs ${
                isDashboardV2 ? "text-[#000]" : "text-[#595959]"
              }`}
            >
              Dashboard V2
            </span>
          )}
        </Link>
      </li>
      <li
        className={`px-4 py-2 rounded-xl cursor-pointer ${
          isInspirationsV2 ? "bg-[#F6F6F6]" : ""
        }`}
      >
        <Link
          onClick={closeSidebar}
          href="/dashboard-v2/inspirations"
          className="flex items-center gap-2"
        >
          {isInspirationsV2 ? (
            <Magicpen size="18" color="#000" />
          ) : (
            <Magicpen size="18" color={"#737373"} />
          )}
          {isSidebarOpen && (
            <span
              className={`text-xs ${
                isInspirationsV2 ? "text-[#000]" : "text-[#595959]"
              }`}
            >
              Competitor Ads
            </span>
          )}
        </Link>
      </li>
      <li
        className={`px-4 py-2 rounded-xl cursor-pointer ${
          isCampaignsV2 ? "bg-[#F6F6F6]" : ""
        }`}
      >
        <Link
          onClick={closeSidebar}
          href="/dashboard-v2/campaigns"
          className="flex items-center gap-2"
        >
          {isCampaignsV2 ? (
            <CalendarEdit size="18" color="#000" />
          ) : (
            <CalendarEdit size="18" color={"#737373"} />
          )}
          {isSidebarOpen && (
            <span
              className={`text-xs ${
                isCampaignsV2 ? "text-[#000]" : "text-[#595959]"
              }`}
            >
              Campaigns
            </span>
          )}
        </Link>
      </li>
    </ul>
  );
};
