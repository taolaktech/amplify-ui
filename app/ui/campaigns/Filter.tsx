import useCampaignsStore from "@/app/lib/stores/campaignsStore";
import { FilterEdit } from "iconsax-react";

export default function Filter({
  dropdownPosition,
}: {
  dropdownPosition?: "top" | "bottom";
}) {
  const filterOpen = useCampaignsStore((state) => state.filterOpen);
  const setFilterOpen = useCampaignsStore(
    (state) => state.actions.setFilterOpen
  );

  return (
    <div className="filter-dropdown relative">
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="w-[73px] h-[32px] bg-[#F3EFF6] rounded-xl flex items-center justify-center gap-1 "
      >
        <FilterEdit size={16} color="#1D0B30" />
        <span className="text-primary text-xs">Filter</span>
      </button>
      {filterOpen && (
        <div
          className={`h-[208px] z-5 absolute left-[-140px] ${
            dropdownPosition === "bottom" ? " bottom-[-214px]" : " top-[-208px]"
          } w-[199px] bg-white shadow-[0_0px_3px_rgba(0,0,0,0.1)] rounded-[10px] border-[0.5px] border-[#B6B3B9]`}
        >
          <div className="h-[52px] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center">
            {/* <Play size={16} color="#101214" /> */}
            <span className="text-sm">Product</span>
          </div>
          <div className="h-[52px] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center">
            {/* <CopySuccess size={16} color="#101214" /> */}
            <span className="text-sm">Campaign</span>
          </div>
          <div className="h-[52px] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center">
            {/* <Archive size={16} color="#101214" /> */}
            <span className="text-sm">TBD</span>
          </div>
          <div className="h-[52px] cursor-pointer px-4 gap-2 flex items-center">
            {/* <PauseCircle size={16} color="#101214" /> */}
            <span className="text-sm">Others</span>
          </div>
        </div>
      )}
    </div>
  );
}
