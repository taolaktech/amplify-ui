import { Minus } from "iconsax-react";
import SelectedCampaignsNav from "./SelectedCampaignsNav";
import { useEffect, useMemo, useRef, useState } from "react";
import useCampaignsStore from "@/app/lib/stores/campaignsStore";
import TableData from "./TableData";

export default function Table() {
  const moreOpen = useCampaignsStore((state) => state.moreOpen);
  const setMoreOpen = useCampaignsStore((state) => state.actions.setMoreOpen);
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">(
    "bottom"
  );
  const [campaignOpen, setCampaignOpen] = useState<null | number>(null);

  const campaignData = useCampaignsStore((state) => state.data);

  const isAllCampaignsSelected = useCampaignsStore(
    (state) => state.isAllCampaignsSelected
  );
  const excludeDataIds = useCampaignsStore((state) => state.excludeDataIds);
  const { toggleSelectAllData } = useCampaignsStore((state) => state.actions);
  console.log("Campaign Data in Table:", campaignData);
  const moreRef = useRef<HTMLButtonElement>(null);

  const toggleCampaignOpen = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCampaignOpen(campaignOpen === index ? null : index);
  };

  useEffect(() => {
    if (moreOpen != null && moreRef.current) {
      const rect = moreRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      console.log({ spaceBelow, spaceAbove });
      if (spaceBelow < 224 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [moreOpen]);

  const handleMoreClick = (e: any, index: number) => {
    e.stopPropagation();
    setMoreOpen(moreOpen === index ? null : index);
    moreRef.current = e.currentTarget;
  };

  const allSelectedCheck = useMemo(() => {
    return isAllCampaignsSelected && excludeDataIds.length === 0;
  }, [isAllCampaignsSelected, excludeDataIds]);

  return (
    <div className="mt-[2px] relative">
      <div className="grid grid-cols-[1.2fr_2fr_repeat(8,1fr)_0.3fr] text-sm">
        {/* <!-- Header --> */}
        <div className="contents [&>*]:bg-[rgba(243,239,246,0.8)] [&>*]:text-sm  [&>*]:text-[#928F94] [&>*]:font-medium [&>*]:h-[44px] [&>*]:flex [&>*]:items-center [&>*]:justify-start">
          <div
            onClick={toggleSelectAllData}
            className="px-5 border-l-4 border-transparent "
          >
            <button
              onClick={() => {
                console.log("Select all clicked");
              }}
              className={`${
                allSelectedCheck
                  ? "bg-gradient "
                  : "bg-transparent border-[#CFCFCF] border-[1.5px]"
              } w-[16px] h-[16px] rounded-[4px] flex items-center justify-center`}
            >
              {allSelectedCheck && <Minus size="14" color="#FFF" />}
            </button>
          </div>
          <div className=" ">Products & Campaigns</div>
          <div className=" ">Status</div>
          <div className=" ">Budget($)</div>
          <div className=" ">Spend($)</div>
          <div className=" ">Revenue($)</div>
          <div className=" ">Orders</div>
          <div className=" ">Clicks</div>
          <div className=" ">ROAS</div>
          <div className="">Channels</div>
          <div className=""></div>
        </div>
        {/* Row 2 */}
        {campaignData?.map((campaign, index) => (
          <TableData
            key={index}
            campaign={campaign}
            index={index}
            moreRef={moreRef}
            moreOpen={moreOpen}
            dropdownPosition={dropdownPosition}
            handleMoreClick={handleMoreClick}
            campaignOpen={campaignOpen}
            toggleCampaignOpen={toggleCampaignOpen}
          />
        ))}
      </div>
      <div className="h-[100px]" />
      <SelectedCampaignsNav />
    </div>
  );
}
