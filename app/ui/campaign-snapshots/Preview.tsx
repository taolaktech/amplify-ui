// import { useEffect, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "iconsax-react";
import { ArrowForward, Magicpen } from "iconsax-react";
import GradientCheckbox from "../form/GradientCheckbox2";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { SocialSettingsKey } from "@/app/lib/stores/createCampaignStore";
import GoogleAdsCreatives from "../creatives/GoogleAds";
import { Platform } from "@/type";
import useCreativesStore from "@/app/lib/stores/creativesStore";
import useUIStore from "@/app/lib/stores/uiStore";
import { useMemo } from "react";
import IGStaticPostView from "../media-creatives/ig/StaticPostView";
import IGCarouselPostView from "../media-creatives/ig/CarouselPostView";
import CircleLoader from "../loaders/CircleLoader";
import { toggle } from "@heroui/theme";
import DragScrollContainer from "../DragScrollContainer";
import StoryPostView from "../media-creatives/ig/StoryPostView";

type PreviewTitle = "Instagram" | "Facebook" | "Google";

const Preview = ({
  adPlatforms,
  isReview,
  highlightedProductId,
  generateCreatives,
}: // loading,
{
  adPlatforms: {
    title: PreviewTitle;
    platform: Platform;
    image: string;
    settings: any;
    creatives?: any[];
  }[];
  highlightedProductId: string;
  isReview?: boolean;
  generateCreatives: (productId: string, platforms: Platform[]) => void;
  loading: boolean;
}) => {
  const settings: { label: string; key: SocialSettingsKey }[] = [
    { label: "Static Post", key: "staticPost" },
    { label: "Carousel Post", key: "carouselPost" },
    { label: "Story Post", key: "storyPost" },
  ];
  const creativeLoadingStates = useUIStore(
    (state) => state.creativeLoadingState
  );

  // const { generateCreatives, loading } = useGenerateCreatives();

  const { toggleFacebookSettings, toggleInstagramSettings } =
    useCreateCampaignStore((state) => state.actions);

  const { undo } = useCreativesStore((state) => state.actions);

  return (
    <div className="flex flex-col gap-12">
      {adPlatforms?.map((item) => (
        <div className="flex flex-col w-full " key={item.title}>
          <div className="flex px-5 lg:pl-0 lg:pr-5  justify-between items-center">
            <div className="flex gap-16 items-center">
              <p className="text-sm flex gap-2 items-center">
                <span className="font-bold ">
                  {item.title === "Instagram" ? (
                    <Image
                      src="/instagram_logo.svg"
                      alt="instagram"
                      width={20}
                      height={20}
                    />
                  ) : item.title === "Facebook" ? (
                    <Image
                      src="/facebook_logo.svg"
                      alt="facebook"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <Image
                      src="/google_ads-icon.svg"
                      alt="google"
                      width={20}
                      height={20}
                    />
                  )}
                </span>
                <span className="font-semibold">
                  {item.title === "Google" ? "Google Ads" : item.title}
                </span>
              </p>
              {/* {!isReview && ( */}
              <div className="hidden md:block">
                {item.title !== "Google" && (
                  <MediaSettingBox
                    item={item}
                    settings={settings}
                    toggleInstagramSettings={toggleInstagramSettings}
                    toggleFacebookSettings={toggleFacebookSettings}
                  />
                )}
              </div>
            </div>

            {!isReview && (
              <div className="flex gap-2 items-center">
                {item.creatives && item.creatives?.length > 1 && (
                  <button
                    disabled={
                      creativeLoadingStates?.[highlightedProductId]?.[
                        item.platform
                      ]
                    }
                    onClick={() => undo(item.platform, highlightedProductId)}
                    className="flex border border-[#E0E0E0] gap-1 items-center h-[32px] px-4 bg-[#ECECEC] rounded-[39px]"
                  >
                    <ArrowForward
                      size={12}
                      color="#000"
                      className="-mt-[2px] -scale-x-100"
                    />
                    <span className="text-xs"> Undo</span>
                  </button>
                )}
                <button
                  disabled={
                    creativeLoadingStates?.[highlightedProductId]?.[
                      item.platform
                    ]
                  }
                  onClick={() =>
                    generateCreatives(highlightedProductId, [item.platform])
                  }
                  className="flex border border-[#E0E0E0] gap-1 items-center h-[32px] px-4 bg-[#ECECEC] rounded-[39px]"
                >
                  <Magicpen size={12} color="#000" />
                  <span className="text-xs tracking-100">Regenerate</span>
                </button>
              </div>
            )}
          </div>
          <div className="md:hidden mt-4">
            {item.title !== "Google" && (
              <MediaSettingBox
                item={item}
                settings={settings}
                toggleInstagramSettings={toggleInstagramSettings}
                toggleFacebookSettings={toggleFacebookSettings}
              />
            )}
          </div>
          <PreviewContainer
            item={item}
            highlightedProductId={highlightedProductId}
            platform={item.platform}
          />
        </div>
      ))}
    </div>
  );
};

export default Preview;

const PreviewContainer = ({
  item,
  highlightedProductId,
  platform,
}: {
  item: any;
  highlightedProductId: string;
  platform: Platform;
}) => {
  // const containerRef = useRef<HTMLDivElement>(null);
  console.log("PreviewContainer item:", item);

  const creativeLoadingStates = useUIStore(
    (state) => state.creativeLoadingState
  );

  const isLoading = useMemo(() => {
    console.log("highlightedProductId:", highlightedProductId);
    console.log("item.platform:", item?.platform);
    console.log(
      "creativeLoadingStates:",
      creativeLoadingStates?.[highlightedProductId]
    );
    console.log(
      "isLoading:",
      creativeLoadingStates?.[highlightedProductId]?.[item.platform]
    );
    return creativeLoadingStates?.[highlightedProductId]?.[item.platform];
  }, [
    highlightedProductId,
    creativeLoadingStates,
    creativeLoadingStates?.[highlightedProductId],
  ]);

  // const width = 350;

  // const scrollBy = (offset: number) => {
  //   console.log("called");
  //   if (containerRef.current) {
  //     containerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  //   }
  // };

  const lastIndex = item?.creatives?.length - 1 || 0;
  const creativesAvailable = item?.creatives?.length > 0;

  const mediaCreative = item.creatives?.length - 1 || 0;
  const isMediaCreative = item?.creatives;
  console.log("isMediaCreative:", isMediaCreative);
  console.log(isMediaCreative[mediaCreative]?.creatives);
  // if (!item?.creatives?.length) return null;
  const isGoogleAds = platform === "GOOGLE ADS";
  const isInstagram = platform === "INSTAGRAM";
  const isFacebook = platform === "FACEBOOK";
  return (
    <>
      {isGoogleAds && (
        <div className="px-5 lg:pl-0 lg:pr-5">
          <div className="bg-[#f1f1f1]  max-w-full relative rounded-xl md:rounded-3xl mt-5">
            {isLoading ? (
              <div className="flex items-center justify-center h-[518px] md:h-[600px]">
                <CircleLoader />
              </div>
            ) : creativesAvailable ? (
              <>
                <div className="flex flex-1 h-[350px] sm:h-[350px] md:h-[650px] items-center justify-center">
                  <GoogleAdsCreatives
                    creatives={item.creatives[lastIndex]?.creatives}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[518px] md:h-[600px]">
                <div className="flex flex-col gap-1 items-center">
                  <ImageIcon size="48" color="#DADADA" variant="Bold" />
                  <p className="text-sm text-[#BFBFBF] font-medium">
                    No Preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isInstagram && (
        <DragScrollContainer>
          <div className="mt-5 pl-5 flex gap-4 max-w-full items-center">
            <div className="w-[25%] min-w-[308.6px]">
              <IGStaticPostView
                photoUrl={isMediaCreative[mediaCreative]?.creatives[0]}
              />
            </div>
            <div className="w-[50%] min-w-[529.6px]">
              <IGCarouselPostView
                photoUrls={isMediaCreative[mediaCreative]?.creatives || []}
              />
            </div>
            <div className="w-[25%] min-w-[308.6px]">
              <StoryPostView
                photoUrl={isMediaCreative[mediaCreative]?.creatives[0] || []}
              />
            </div>
          </div>
        </DragScrollContainer>
      )}
    </>
  );
};

const MediaSettingBox = ({
  item,
  settings,
  toggleInstagramSettings,
  toggleFacebookSettings,
}: {
  item: any;
  toggleInstagramSettings: (key: SocialSettingsKey) => void;
  toggleFacebookSettings: (key: SocialSettingsKey) => void;
  settings: { label: string; key: SocialSettingsKey }[];
}) => {
  return (
    <div className="flex px-5 lg:px-0 gap-3 md:gap-6 items-center">
      {settings.map((setting) => (
        <div
          onClick={() => {
            if (item.title === "Instagram") {
              toggleInstagramSettings(setting.key);
            } else if (item.title === "Facebook") {
              toggleFacebookSettings(setting.key);
            }
          }}
          key={setting.key}
          className="flex flex-row-reverse gap-1 items-center cursor-pointer"
        >
          <div>
            <p className="text-sm font-medium tracking-100">{setting.label}</p>
          </div>
          <div>
            <GradientCheckbox ticked={item.settings[setting.key]} />
          </div>
        </div>
      ))}
    </div>
  );
};
