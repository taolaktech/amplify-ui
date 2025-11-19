import useCampaignsStore, {
  CampaignTab,
} from "@/app/lib/stores/campaignsStore";
import { SearchNormal } from "iconsax-react";
import ToggleHeader from "./ToggleHeader";
import Filter from "./Filter";

export const tableTabs = [
  CampaignTab.ALL,
  CampaignTab.IN_REVIEW,
  CampaignTab.ACTIVE,
  CampaignTab.PAUSED,
  CampaignTab.COMPLETED,
  //   CampaignTab.RECENTLY_ACTIVE,
];

export default function TableHeader() {
  const activeTab = useCampaignsStore((state) => state.activeTab);
  const paginationInfo = useCampaignsStore((state) => state.paginationInfo);
  const { setActiveTab } = useCampaignsStore((state) => state.actions);

  const numFormatter = (num: string) => {
    if (num.length < 2) {
      return num.padStart(2, "0");
    }
    return num;
  };

  const getCount = (tab: CampaignTab) => {
    if (!paginationInfo) return "0";
    switch (tab) {
      case CampaignTab.ALL:
        return numFormatter(paginationInfo.total.toString());
      default:
        return "0";
    }
  };

  return (
    <div className="lg:flex justify-between flex-shrink-0 items-center">
      <div className="flex h-[48px]">
        {tableTabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 rounded-t-xl h-[48px] flex gap-2 items-center cursor-pointer font-medium text-sm
                ${
                  activeTab === tab
                    ? "bg-[#F3EFF6] border-b border-[#A755FF]"
                    : "text-[#8C8C8C] border-b border-transparent"
                } 
                `}
          >
            <span
              className={`${
                activeTab === tab ? "text-gradient" : "text-[#555456]"
              }`}
            >
              {tab}
            </span>
            <span
              className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-medium ${
                activeTab === tab
                  ? "text-white bg-gradient"
                  : "text-[#928F94] bg-[#DBD7DD]"
              }`}
            >
              {getCount(tab)}
            </span>
          </div>
        ))}
      </div>
      <div className="items-center my-3 lg:my-0 flex gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products and campaigns..."
            className=" h-[34px] text-xs min-w-[285px] placeholder:text-[#928F94] pl-8 pr-4 border border-[#E1E1E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A755FF]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#928F94] w-4 h-4">
            <SearchNormal size={16} color="#928F94" />
          </span>
        </div>
        <ToggleHeader dropdownPosition={"bottom"} />
        <Filter dropdownPosition={"bottom"} />
      </div>
    </div>
  );
}
