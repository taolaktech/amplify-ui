import useCampaignsStore from "@/app/lib/stores/campaignsStore";
import { Add } from "iconsax-react";

export default function ToggleHeader({
  dropdownPosition,
}: {
  dropdownPosition?: "top" | "bottom";
}) {
  const toggleHeaderOpen = useCampaignsStore((state) => state.toggleHeaderOpen);
  const setToggleHeaderOpen = useCampaignsStore(
    (state) => state.actions.setToggleHeaderOpen
  );

  return (
    <div className="toggle-header relative">
      <button
        onClick={() => setToggleHeaderOpen(!toggleHeaderOpen)}
        className="w-[32px] h-[32px] flex items-center justify-center bg-[#F3EFF6] rounded-[12px]"
      >
        <Add size="12" color="#000" />
      </button>

      {toggleHeaderOpen && (
        <div
          className={`h-[208px] z-5 absolute left-[-140px] ${
            dropdownPosition === "bottom" ? " bottom-[-214px]" : " top-[-208px]"
          } w-[199px] bg-white shadow-[0_0px_3px_rgba(0,0,0,0.1)] rounded-[10px] border-[#B6B3B9]`}
        >
          <div className="h-[52px] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center">
            {/* <Play size={16} color="#101214" /> */}
            <span className="text-sm">Impressions</span>
          </div>
          <div className="h-[52px] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center">
            {/* <CopySuccess size={16} color="#101214" /> */}
            <span className="text-sm">Clicks</span>
          </div>
          <div className="h-[52px] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center">
            {/* <Archive size={16} color="#101214" /> */}
            <span className="text-sm">Start Date</span>
          </div>
          <div className="h-[52px] cursor-pointer px-4 gap-2 flex items-center">
            {/* <PauseCircle size={16} color="#101214" /> */}
            <span className="text-sm">End Date</span>
          </div>
        </div>
      )}
    </div>
  );
}
