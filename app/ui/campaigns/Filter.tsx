import useCampaignsStore from "@/app/lib/stores/campaignsStore";
import { FilterEdit } from "iconsax-react";
import { GreenCheckbox } from "../form/GreenCheckbox";

export default function Filter({
  dropdownPosition,
}: {
  dropdownPosition?: "top" | "bottom";
}) {
  const filters = useCampaignsStore((state) => state.filters);
  const filterOpen = useCampaignsStore((state) => state.filterOpen);
  const setFilterOpen = useCampaignsStore(
    (state) => state.actions.setFilterOpen
  );
  const toggleFilters = useCampaignsStore(
    (state) => state.actions.toggleFilters
  );

  const borderColor = "#595959";

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
          <div
            onClick={() => toggleFilters("Product")}
            className="h-[52px] hover:bg-[rgba(243,239,246,0.5)] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center"
          >
            <GreenCheckbox
              ticked={filters.has("Product")}
              borderWidth={1}
              borderColor={borderColor}
            />
            <span className="text-sm font-medium">Product</span>
          </div>
          <div
            onClick={() => toggleFilters("Campaign")}
            className="h-[52px] hover:bg-[rgba(243,239,246,0.5)] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center"
          >
            <GreenCheckbox
              ticked={filters.has("Campaign")}
              borderWidth={1}
              borderColor={borderColor}
            />

            <span className="text-sm font-medium">Campaign</span>
          </div>
          <div
            onClick={() => toggleFilters("TBD")}
            className="h-[52px] hover:bg-[rgba(243,239,246,0.5)] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center"
          >
            <GreenCheckbox
              ticked={filters.has("TBD")}
              borderWidth={1}
              borderColor={borderColor}
            />

            <span className="text-sm font-medium">TBD</span>
          </div>
          <div
            onClick={() => toggleFilters("Others")}
            className="h-[52px] hover:bg-[rgba(243,239,246,0.5)] cursor-pointer px-4 gap-2 flex items-center"
          >
            <GreenCheckbox
              ticked={filters.has("Others")}
              borderWidth={1}
              borderColor={borderColor}
            />
            <span className="text-sm font-medium">Others</span>
          </div>
        </div>
      )}
    </div>
  );
}
