import {
  Archive,
  Coin1,
  CopySuccess,
  EmptyWalletChange,
  PauseCircle,
  Play,
} from "iconsax-react";

export function ProductOptions({
  dropdownPosition,
}: {
  dropdownPosition?: "top" | "bottom";
}) {
  return (
    <div
      className={`h-[208px] z-5  more-dropdown 
       w-[199px] bg-white custom-shadow-sm rounded-[10px] border-[0.5] border-[#B6B3B9]`}
    >
      <div className="h-[52px] hover:bg-[rgba(243,239,246,0.5)] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center">
        {/* <Play size={16} color="#1D0B30" /> */}
        {/* <Coin1 size="16" color="#1D0B30" /> */}
        <EmptyWalletChange size="17.5" color="#1D0B30" />
        <span className="text-sm font-medium">Change Budget</span>
      </div>
      <div className="h-[52px] hover:bg-[rgba(243,239,246,0.5)] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center">
        <CopySuccess size={16} color="#1D0B30" />
        <span className="text-sm font-medium">Duplicate Campaign</span>
      </div>
      <div className="h-[52px] hover:bg-[rgba(243,239,246,0.5)] cursor-pointer border-b-[0.25px] border-[#B6B3B9] px-4 gap-2 flex items-center">
        <Archive size={16} color="#1D0B30" />
        <span className="text-sm font-medium">Archive Campaign</span>
      </div>
      <div className="h-[52px] hover:bg-[rgba(243,239,246,0.5)] cursor-pointer px-4 gap-2 flex items-center">
        <PauseCircle size={16} color="#1D0B30" />
        <span className="text-sm font-medium">Pause Campaign</span>
      </div>
    </div>
  );
}
