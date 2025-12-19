import useCampaignsStore from "@/app/lib/stores/campaignsStore";
import { Add } from "iconsax-react";
import { GreenCheckbox } from "../form/GreenCheckbox";

export default function ToggleHeader({
  dropdownPosition,
}: {
  dropdownPosition?: "top" | "bottom";
}) {
  const toggleHeaderOpen = useCampaignsStore((state) => state.toggleHeaderOpen);
  const setToggleHeaderOpen = useCampaignsStore(
    (state) => state.actions.setToggleHeaderOpen
  );
  const sort = useCampaignsStore((state) => state.sort);
  const toggleSort = useCampaignsStore((state) => state.actions.toggleSort);

  const borderColor = "#595959";

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
          <div
            onClick={() => toggleSort("Impressions")}
            className="h-[52px] hover:bg-[rgba(243,239,246,0.5)] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center"
          >
            <GreenCheckbox
              ticked={sort.has("Impressions")}
              borderWidth={1}
              borderColor={borderColor}
            />
            <span className="text-sm font-medium">Impressions</span>
          </div>
          <div
            onClick={() => toggleSort("Clicks")}
            className="h-[52px] hover:bg-[rgba(243,239,246,0.5)] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center"
          >
            <GreenCheckbox
              ticked={sort.has("Clicks")}
              borderWidth={1}
              borderColor={borderColor}
            />
            <span className="text-sm font-medium">Clicks</span>
          </div>
          <div
            onClick={() => toggleSort("Start Date")}
            className="h-[52px] hover:bg-[rgba(243,239,246,0.5)] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center"
          >
            <GreenCheckbox
              ticked={sort.has("Start Date")}
              borderWidth={1}
              borderColor={borderColor}
            />
            <span className="text-sm font-medium">Start Date</span>
          </div>
          <div
            onClick={() => toggleSort("End Date")}
            className="h-[52px] hover:bg-[rgba(243,239,246,0.5)] cursor-pointer px-4 gap-2 flex items-center"
          >
            <GreenCheckbox
              ticked={sort.has("End Date")}
              borderWidth={1}
              borderColor={borderColor}
            />
            <span className="text-sm font-medium">End Date</span>
          </div>
        </div>
      )}
    </div>
  );
}
