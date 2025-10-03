import { CloseCircle, Edit2, PauseCircle } from "iconsax-react";

export default function SelectedCampaignsNav() {
  // const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  return (
    <div
      className={`w-full max-w-[1105px] flex items-center justify-center
      fixed bottom-[58px] rounded-full`}
    >
      <div className="flex h-[58px] px-4 rounded-full items-center justify-between bg-[#1D0B30] w-[533px]">
        <div className="flex gap-3 items-center">
          <CloseCircle size="22" color="#FFF" />
          <div className="flex gap-1 items-center">
            <div
              className="py-[2px] px-[4px] rounded-full bg-[rgba(255,255,255,0.15)]
        text-white text-[10px]"
            >
              04
            </div>
            <div className="text-white text-sm">Item Selected</div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button className="w-[72px] h-[34px] rounded-xl bg-[rgba(255,255,255,0.10)] flex items-center justify-center gap-1">
            <Edit2 size={12} color="#FFF" />
            <span className="text-white text-sm">Edit</span>
          </button>
          <button className="w-[72px] h-[34px] rounded-xl bg-[rgba(255,255,255,0.10)] flex items-center justify-center gap-1">
            <PauseCircle size={12} color="#FFF" />
            <span className="text-white text-sm">Pause</span>
          </button>
          <button className="w-[79px] h-[34px] rounded-xl bg-[#FF4949] flex items-center justify-center gap-1">
            <PauseCircle size={12} color="#FFF" />
            <span className="text-white text-sm">Archive</span>
          </button>
        </div>
      </div>
    </div>
  );
}
