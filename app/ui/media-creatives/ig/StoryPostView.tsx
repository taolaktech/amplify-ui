import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useState } from "react";
import MaximizeButton from "../MaximizeButton";
import StoryPost from "./StoryPost";

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
      {/* {maximize && (
        <StaticPostViewMaximized
          toggleMaximize={toggleMaximize}
          photoUrl={photoUrl}
          caption={caption}
        />
      )} */}
    </div>
  );
}
