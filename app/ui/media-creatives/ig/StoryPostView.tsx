import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useMemo, useState } from "react";
import MaximizeButton from "../MaximizeButton";
import StoryPost from "./StoryPost";
import XIcon from "@/public/x.svg";
import useUIStore from "@/app/lib/stores/uiStore";
import BookmarkIcon from "@/public/media-creatives/Bookmark.png";
import Image from "next/image";
import {
  useAssetLibraryStore,
  type AssetPlatform,
  type AssetFormat,
} from "@/app/lib/stores/assetLibraryStore";
import { useToastStore } from "@/app/lib/stores/toastStore";

export default function StoryPostView({
  creative,
  productId,
  productName,
  source,
}: {
  creative: any;
  productId?: string;
  productName?: string;
  source?: "generated" | "uploaded";
}) {
  const brandName = useSetupStore((state) => state.businessDetails.storeName);
  const location = useCreateCampaignStore(
    (state) => state.adsShow.location[0] || "Location"
  );
  const destinationUrl = useCreateCampaignStore(
    (state) => state.campaignSnapshots.destinationUrl,
  );
  const campaignName = useCreateCampaignStore(
    (state) => state.campaignSnapshots.campaignName,
  );
  const [maximize, setMaximize] = useState(false);
  const setToast = useToastStore((state) => state.setToast);
  const { actions: assetActions } = useAssetLibraryStore((state) => state);

  const assetType = "image" as const;
  const url = creative?.url as string | undefined;
  const platform: AssetPlatform = "Meta";
  const format: AssetFormat = "Story";

  const isSaved = useAssetLibraryStore((state) =>
    state.actions.isSavedByUrl({ type: assetType, url }),
  );

  const canSave = useMemo(() => {
    if (!productId) return false;
    return Boolean(url && url.trim().length > 0);
  }, [productId, url]);
  const toggleIsPreviewMaximized = useUIStore(
    (state) => state.actions.toggleIsPreviewMaximized
  );

  const toggleMaximize = () => {
    setMaximize(!maximize);
    toggleIsPreviewMaximized();
  };
  return (
    <div className="bg-[#F1F1F1] h-[520px] flex flex-col gap-4 p-6 rounded-3xl">
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">Story Post</div>
        <div className="flex items-center gap-2">
          <button
            disabled={!canSave || isSaved}
            onClick={() => {
              if (!canSave || isSaved) return;
              assetActions.upsertAsset({
                type: assetType,
                source: source || "generated",
                url,
                productId,
                productName,
                campaignName,
                destinationUrl,
                platform,
                format,
              });
              setToast({
                type: "success",
                title: "Saved to library",
                message: "This creative is now available in Saved Ads.",
              });
            }}
            className={`h-[36px] w-[36px] rounded-full flex items-center justify-center border ${
              isSaved
                ? "bg-[#ECECEC] border-[#E0E0E0]"
                : canSave
                  ? "bg-[#F0E6FB] border-[#D0B0F3]"
                  : "bg-[#ECECEC] border-[#E0E0E0] cursor-not-allowed"
            }`}
          >
            <Image
              src={BookmarkIcon}
              alt="Save"
              width={16}
              height={16}
              className={isSaved ? "opacity-60" : "opacity-100"}
            />
          </button>
          <MaximizeButton onClick={toggleMaximize} />
        </div>
      </div>
      <div className="flex justify-center">
        <StoryPost
          brandName={brandName}
          location={location}
          photoUrl={creative?.url}
        />
      </div>
      {maximize && (
        <StoryPostViewMaximized
          toggleMaximize={toggleMaximize}
          photoUrl={creative?.url}
          caption={creative?.caption}
        />
      )}
    </div>
  );
}

const StoryPostViewMaximized = ({
  photoUrl,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  caption,
  toggleMaximize,
}: {
  photoUrl?: string;
  toggleMaximize: () => void;
  caption?: string;
}) => {
  const brandName = useSetupStore((state) => state.businessDetails.storeName);
  const location = useCreateCampaignStore(
    (state) => state.adsShow.location[0] || "Location"
  );

  return (
    <div className="">
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"
        onClick={toggleMaximize}
      ></div>

      <div className="fixed top-[50%] z-30 -translate-y-[50%] left-[50%] -translate-x-[50%]">
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={toggleMaximize} className="">
              <XIcon width={24} height={24} fill="white" />
            </button>
          </div>
          <StoryPost
            brandName={brandName}
            location={location}
            photoUrl={photoUrl}
            maximized
          />
        </div>
      </div>
    </div>
  );
};
