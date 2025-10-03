import { Archive, CopySuccess, PauseCircle, Play } from "iconsax-react";

export function ProductOptions({
  dropdownPosition,
}: {
  dropdownPosition?: "top" | "bottom";
}) {
  return (
    <div
      className={`h-[208px] absolute left-[-100px]${
        dropdownPosition === "bottom" ? " bottom-[-184px]" : " top-[-208px]"
      } w-[199px] bg-white shadow-[0_0px_3px_rgba(0,0,0,0.1)] rounded-[10px] border-[#B6B3B9]`}
    >
      <div className="h-[52px] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center">
        <Play size={16} color="#101214" />
        <span className="text-sm">View Campaign</span>
      </div>
      <div className="h-[52px] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center">
        <CopySuccess size={16} color="#101214" />
        <span className="text-sm">Duplicate Campaign</span>
      </div>
      <div className="h-[52px] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center">
        <Archive size={16} color="#101214" />
        <span className="text-sm">Archive Campaign</span>
      </div>
      <div className="h-[52px] cursor-pointer px-4 gap-2 flex items-center">
        <PauseCircle size={16} color="#101214" />
        <span className="text-sm">Pause Campaign</span>
      </div>
    </div>
  );
}
