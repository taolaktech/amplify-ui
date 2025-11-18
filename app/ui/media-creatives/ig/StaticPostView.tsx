import StaticPost from "./StaticPost";
import MaximizeButton from "../MaximizeButton";
import { useState } from "react";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import XIcon from "@/public/x.svg";
import useUIStore from "@/app/lib/stores/uiStore";

export default function StaticPostView({
  creative,
  isLoading,
}: {
  creative: any;
  isLoading?: boolean;
}) {
  const brandName = useSetupStore((state) => state.businessDetails.storeName);
  const location = useCreateCampaignStore(
    (state) => state.adsShow.location[0] || "Location"
  );
  const [maximize, setMaximize] = useState(false);

  console.log("photoUrl in StaticPostView:", creative?.url);

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
        <div className="font-medium text-sm">Static Post (1:1)</div>
        <MaximizeButton onClick={toggleMaximize} />
      </div>
      <div className="flex justify-center">
        <StaticPost
          brandName={brandName}
          location={location}
          photoUrl={creative?.url}
          caption={creative?.caption}
          isLoading={isLoading}
        />
      </div>
      {maximize && (
        <StaticPostViewMaximized
          toggleMaximize={toggleMaximize}
          photoUrl={creative?.url}
          caption={creative?.caption}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

const StaticPostViewMaximized = ({
  photoUrl,
  caption,
  toggleMaximize,
  isLoading,
}: {
  photoUrl: string;
  toggleMaximize: () => void;
  caption?: string;
  isLoading?: boolean;
}) => {
  const brandName = useSetupStore((state) => state.businessDetails.storeName);
  const location = useCreateCampaignStore(
    (state) => state.adsShow.location[0] || "Location"
  );

  return (
    <div className="">
      <div className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"></div>

      <div className="fixed top-[50%] z-30 -translate-y-[50%] left-[50%] -translate-x-[50%]">
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={toggleMaximize} className="">
              <XIcon width={24} height={24} fill="white" />
            </button>
          </div>
          <StaticPost
            brandName={brandName}
            location={location}
            photoUrl={photoUrl}
            caption={caption}
            isLoading={isLoading}
            maximized
          />
        </div>
      </div>
    </div>
  );
};
