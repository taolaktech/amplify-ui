import useCampaignsStore from "@/app/lib/stores/campaignsStore";
import { CloseCircle, Edit2, PauseCircle } from "iconsax-react";
import { useMemo } from "react";

export default function SelectedCampaignsNav() {
  // const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const paginationInfo = useCampaignsStore((state) => state.paginationInfo);
  const excludeDataIds = useCampaignsStore((state) => state.excludeDataIds);
  const { clearSelectedData } = useCampaignsStore((state) => state.actions);

  console.log("Rendering SelectedCampaignsNav", paginationInfo);
  const selectedNo = useMemo(() => {
    return paginationInfo.total - excludeDataIds.length;
  }, [paginationInfo, excludeDataIds]);
  return (
    <>
      {selectedNo > 0 && (
        <div
          className={`w-full max-w-[1105px] pointer-events-none flex items-center justify-center
      fixed bottom-[58px] rounded-full`}
        >
          <div className="flex h-[58px] pointer-events-auto z-1 px-4 rounded-full items-center justify-between bg-[#1D0B30] w-[533px]">
            <div className="flex gap-3 items-center">
              <button onClick={clearSelectedData}>
                <CloseCircle size="22" color="#FFF" />
              </button>
              <div className="flex gap-1 items-center">
                <div
                  className="py-[2px] font-medium px-[4px] min-w-[20px] min-h-[20px] flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.15)]
        text-white text-[10px]"
                >
                  {selectedNo}
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
      )}
    </>
  );
}
