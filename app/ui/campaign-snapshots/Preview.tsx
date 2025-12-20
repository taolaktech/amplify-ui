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
import FBStaticPostView from "../media-creatives/facebook/StaticPostView";
import FBCarouselPostView from "../media-creatives/facebook/CarouselPostView";
import FBStoryPostView from "../media-creatives/facebook/StoryPostView";
import CircleLoader from "../loaders/CircleLoader";
import DragScrollContainer from "../DragScrollContainer";
import StoryPostView from "../media-creatives/ig/StoryPostView";

type PreviewTitle = "Instagram" | "Facebook" | "Google";

const Preview = ({
  adPlatforms,
  isReview,
  highlightedProductId,
  generateCreatives,
  loading,
  hidePlatformRegenerate,
}: {
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
  hidePlatformRegenerate?: boolean;
}) => {
  const settings: { label: string; key: SocialSettingsKey }[] = [
    { label: "Static Post", key: "staticPost" },
    { label: "Carousel Post", key: "carouselPost" },
    { label: "Story Post", key: "storyPost" },
  ];
  const creativeLoadingStates = useUIStore(
    (state) => state.creativeLoadingState
  );

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
            <div className="h-[32px]">
              {!hidePlatformRegenerate &&
                !isReview &&
                !creativeLoadingStates?.[highlightedProductId]?.[
                  item.platform
                ] && (
                  <div className="flex gap-2 items-center">
                    {item.creatives && item.creatives?.length > 1 && (
                      <button
                        disabled={
                          creativeLoadingStates?.[highlightedProductId]?.[
                            item.platform
                          ]
                        }
                        onClick={() =>
                          undo(item.platform, highlightedProductId)
                        }
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
  settings?: { label: string; key: SocialSettingsKey }[];
}) => {
  const creativeLoadingStates = useUIStore(
    (state) => state.creativeLoadingState
  );

  const instagramSettings = useCreateCampaignStore(
    (state) => state.instagramSettings
  );
  const facebookSettings = useCreateCampaignStore(
    (state) => state.facebookSettings
  );

  const isLoading = useMemo(() => {
    return creativeLoadingStates?.[highlightedProductId]?.[item.platform];
  }, [highlightedProductId, creativeLoadingStates, item.platform]);

  const lastIndex = item?.creatives?.length - 1 || 0;
  const creativesAvailable = item?.creatives?.length > 0;

  const mediaCreative = item.creatives?.length - 1 || 0;
  const isMediaCreative = item?.creatives;

  const isGoogleAds = platform === "GOOGLE ADS";
  const isInstagram = platform === "INSTAGRAM";
  const isFacebook = platform === "FACEBOOK";

  const facebookWidthSize = useMemo(() => {
    let count = 0;
    if (facebookSettings.staticPost) count += 1;
    if (facebookSettings.carouselPost) count += 1;
    if (facebookSettings.storyPost) count += 1;

    const settings = {
      staticPost: 0,
      carouselPost: 0,
      storyPost: 0,
    };

    if (count === 1) {
      if (facebookSettings.staticPost) {
        settings.staticPost = 100;
      }
      if (facebookSettings.carouselPost) {
        settings.carouselPost = 100;
      }
      if (facebookSettings.storyPost) {
        settings.storyPost = 100;
      }
    } else if (count === 2) {
      if (facebookSettings.carouselPost) {
        settings.carouselPost = 66.66;

        if (facebookSettings.staticPost) {
          settings.staticPost = 33.33;
        }
        if (facebookSettings.storyPost) {
          settings.storyPost = 33.33;
        }
      } else if (facebookSettings.staticPost && facebookSettings.storyPost) {
        settings.staticPost = 50;
        settings.storyPost = 50;
      }
    } else if (count === 3) {
      settings.staticPost = 25;
      settings.carouselPost = 50;
      settings.storyPost = 25;
    }
    return settings;
  }, [
    facebookSettings.carouselPost,
    facebookSettings.staticPost,
    facebookSettings.storyPost,
  ]);

  const instagramWidthSize = useMemo(() => {
    let count = 0;
    if (instagramSettings.staticPost) count += 1;
    if (instagramSettings.carouselPost) count += 1;
    if (instagramSettings.storyPost) count += 1;

    const settings = {
      staticPost: 0,
      carouselPost: 0,
      storyPost: 0,
    };

    if (count === 1) {
      if (instagramSettings.staticPost) {
        settings.staticPost = 100;
      }
      if (instagramSettings.carouselPost) {
        settings.carouselPost = 100;
      }
      if (instagramSettings.storyPost) {
        settings.storyPost = 100;
      }
    } else if (count === 2) {
      if (instagramSettings.carouselPost) {
        settings.carouselPost = 66.66;

        if (instagramSettings.staticPost) {
          settings.staticPost = 33.33;
        }
        if (instagramSettings.storyPost) {
          settings.storyPost = 33.33;
        }
      } else if (instagramSettings.staticPost && instagramSettings.storyPost) {
        settings.staticPost = 50;
        settings.storyPost = 50;
      }
    } else if (count === 3) {
      settings.staticPost = 25;
      settings.carouselPost = 50;
      settings.storyPost = 25;
    }

    return settings;
  }, [
    instagramSettings.carouselPost,
    instagramSettings.staticPost,
    instagramSettings.storyPost,
  ]);

  const hasMediaCreatives = useMemo(() => {
    return (
      isMediaCreative?.[mediaCreative]?.creatives &&
      isMediaCreative[mediaCreative]?.creatives.length > 0
    );
  }, [isMediaCreative, mediaCreative]);

  const showNoPreview = !hasMediaCreatives && !isLoading;

  // No Preview component - reusable
  const NoPreviewPlaceholder = () => (
    <div className="flex flex-col gap-1 items-center">
      <ImageIcon size="48" color="#DADADA" variant="Bold" />
      <p className="text-sm text-[#BFBFBF] font-medium">No Preview</p>
    </div>
  );

  return (
    <>
      {/* Google Ads */}
      {isGoogleAds && (
        <div className="px-5 lg:pl-0 lg:pr-5">
          <div className="bg-[#f1f1f1] max-w-full relative rounded-xl md:rounded-3xl mt-5 min-h-[518px] md:min-h-[600px]">
            {/* Loading State */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <CircleLoader />
            </div>

            {/* Content State */}
            <div
              className={`flex flex-1 h-[350px] sm:h-[350px] md:h-[650px] items-center justify-center transition-opacity duration-300 ${
                creativesAvailable && !isLoading
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {creativesAvailable && (
                <GoogleAdsCreatives
                  creatives={item.creatives[lastIndex]?.creatives}
                />
              )}
            </div>

            {/* No Preview State */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                !creativesAvailable && !isLoading
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <NoPreviewPlaceholder />
            </div>
          </div>
        </div>
      )}

      {/* Instagram */}
      {isInstagram && (
        <div className="relative min-h-[518px]">
          {/* Content with creatives */}
          <div
            className={`transition-opacity duration-300 ${
              !showNoPreview
                ? "opacity-100"
                : "opacity-0 pointer-events-none absolute inset-0"
            }`}
          >
            <DragScrollContainer>
              <div className="mt-5 pl-5 lg:pl-0 flex gap-4 w-full items-center">
                {instagramSettings.staticPost && (
                  <div
                    style={{ width: `${instagramWidthSize.staticPost}%` }}
                    className="min-w-[318.6px] transition-all duration-300"
                  >
                    <IGStaticPostView
                      creative={
                        isMediaCreative?.[mediaCreative]?.creatives?.[0]
                      }
                    />
                  </div>
                )}
                {instagramSettings.carouselPost && (
                  <div
                    style={{
                      width: `${instagramWidthSize.carouselPost}%`,
                    }}
                    className="min-w-[529.6px] transition-all duration-300"
                  >
                    <IGCarouselPostView
                      creatives={
                        isMediaCreative?.[mediaCreative]?.creatives || []
                      }
                    />
                  </div>
                )}
                {instagramSettings.storyPost && (
                  <div
                    style={{
                      width: `${instagramWidthSize.storyPost}%`,
                    }}
                    className="min-w-[318.6px] transition-all duration-300"
                  >
                    <StoryPostView
                      creative={
                        isMediaCreative?.[mediaCreative]?.creatives?.[0]
                      }
                    />
                  </div>
                )}
              </div>
            </DragScrollContainer>
          </div>

          {/* No Preview State */}
          <div
            className={`px-5 lg:pl-0 lg:pr-5 transition-opacity duration-300 ${
              showNoPreview
                ? "opacity-100"
                : "opacity-0 pointer-events-none absolute inset-0"
            }`}
          >
            <div className="flex bg-[#f1f1f1] rounded-xl mt-5 items-center justify-center h-[518px] md:h-[600px]">
              <NoPreviewPlaceholder />
            </div>
          </div>
        </div>
      )}

      {/* Facebook */}
      {isFacebook && (
        <div className="relative min-h-[518px] md:min-h-[600px]">
          {/* Content with creatives */}
          <div
            className={`transition-opacity duration-300 ${
              !showNoPreview
                ? "opacity-100"
                : "opacity-0 pointer-events-none absolute inset-0"
            }`}
          >
            <DragScrollContainer>
              <div className="mt-5 pl-5 lg:pl-0 flex gap-4 w-full items-center">
                {facebookSettings.staticPost && (
                  <div
                    style={{ width: `${facebookWidthSize.staticPost}%` }}
                    className="min-w-[318.6px] transition-all duration-300"
                  >
                    <FBStaticPostView
                      creative={
                        isMediaCreative?.[mediaCreative]?.creatives?.[0]
                      }
                    />
                  </div>
                )}
                {facebookSettings.carouselPost && (
                  <div
                    style={{
                      width: `${facebookWidthSize.carouselPost}%`,
                    }}
                    className="min-w-[529.6px] transition-all duration-300"
                  >
                    <FBCarouselPostView
                      creatives={
                        isMediaCreative?.[mediaCreative]?.creatives || []
                      }
                    />
                  </div>
                )}
                {facebookSettings.storyPost && (
                  <div
                    style={{
                      width: `${facebookWidthSize.storyPost}%`,
                    }}
                    className="min-w-[318.6px] transition-all duration-300"
                  >
                    <FBStoryPostView
                      creative={
                        isMediaCreative?.[mediaCreative]?.creatives?.[0]
                      }
                    />
                  </div>
                )}
              </div>
            </DragScrollContainer>
          </div>

          {/* No Preview State */}
          <div
            className={`px-5 lg:pl-0 lg:pr-5 transition-opacity duration-300 ${
              showNoPreview
                ? "opacity-100"
                : "opacity-0 pointer-events-none absolute inset-0"
            }`}
          >
            <div className="flex bg-[#f1f1f1] rounded-xl mt-5 items-center justify-center h-[518px] md:h-[600px]">
              <NoPreviewPlaceholder />
            </div>
          </div>
        </div>
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
