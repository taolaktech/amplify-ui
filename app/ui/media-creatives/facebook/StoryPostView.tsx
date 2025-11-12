import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useState } from "react";
import MaximizeButton from "../MaximizeButton";
import StoryPost from "./StoryPost";
import XIcon from "@/public/x.svg";

export default function StoryPostView({
  photoUrl,
  caption,
}: {
  photoUrl: string;
  caption?: string;
}) {
  const brandName = useSetupStore((state) => state.businessDetails.storeName);
  const location = useCreateCampaignStore(
    (state) => state.adsShow.location[0] || "Location"
  );
  const [maximize, setMaximize] = useState(false);

  const toggleMaximize = () => {
    setMaximize(!maximize);
  };
  return (
    <div className="bg-[#F1F1F1] h-[520px] flex flex-col gap-4 p-6 rounded-3xl">
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">Story Post</div>
        <MaximizeButton onClick={toggleMaximize} />
      </div>
      <div className="flex justify-center">
        <StoryPost
          brandName={brandName}
          location={location}
          photoUrl={photoUrl}
        />
      </div>
      {maximize && (
        <StoryPostViewMaximized
          toggleMaximize={toggleMaximize}
          photoUrl={photoUrl}
          caption={caption}
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
      <div className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.6)] z-20"></div>

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
