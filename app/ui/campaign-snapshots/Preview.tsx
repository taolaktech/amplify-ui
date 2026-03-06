import Image from "next/image";
import { ArrowDown2, Image as ImageIcon } from "iconsax-react";
import { ArrowForward, Magicpen } from "iconsax-react";
import GradientCheckbox from "../form/GradientCheckbox2";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { SocialSettingsKey } from "@/app/lib/stores/createCampaignStore";
import GoogleAdsCreatives from "../creatives/GoogleAds";
import { Platform } from "@/type";
import useCreativesStore from "@/app/lib/stores/creativesStore";
import useUIStore from "@/app/lib/stores/uiStore";
import { useEffect, useMemo, useRef, useState } from "react";
import FBStaticPostView from "../media-creatives/facebook/StaticPostView";
import FBCarouselPostView from "../media-creatives/facebook/CarouselPostView";
import FBStoryPostView from "../media-creatives/facebook/StoryPostView";
import CircleLoader from "../loaders/CircleLoader";
import DragScrollContainer from "../DragScrollContainer";
import { useToastStore } from "@/app/lib/stores/toastStore";
import { useRouter } from "next/navigation";
import {
  useMetaCreativeUploadStore,
  type MetaUploadedCreative,
} from "@/app/lib/stores/metaCreativeUploadStore";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { getAssetById } from "@/app/lib/api/base/assets";

type PreviewTitle = "Instagram" | "Facebook" | "Meta" | "Google";

const GOOGLE_CAMPAIGN_TYPES: Array<{ label: string; description: string }> = [
  {
    label: "Product Launch",
    description: "Promote new arrivals or collections",
  },
  {
    label: "Flash Sale / Limited Time",
    description: "Create urgency with time-bound offers",
  },
  {
    label: "Abandoned Cart Recovery",
    description: "Retarget users who didn’t complete purchases",
  },
  {
    label: "Upsell / Cross-sell",
    description: "Recommend related or higher-ticket items post-purchase",
  },
  {
    label: "Seasonal Campaigns",
    description: "Tie to holidays, events, or seasons",
  },
  {
    label: "Free Shipping Promo",
    description: "Boost conversions with limited-time free delivery",
  },
  {
    label: "Customer Reactivation",
    description: "Win back inactive customers",
  },
  {
    label: "Bestseller Boost",
    description: "Highlight top-selling products",
  },
  {
    label: "High ROAS Booster",
    description:
      "Scale campaigns with high return based on real-time performance",
  },
  {
    label: "Slow-Mover Inventory Push",
    description: "Promote items with low sales velocity",
  },
  {
    label: "Valentine’s Day",
    description: "Gifts for Her/Him, Romantic Bundles, Self-Love Sale",
  },
  {
    label: "Easter",
    description: "Spring Essentials, Easter Gift Ideas, Hop into Deals",
  },
  {
    label: "Back-to-School",
    description: "School Essentials, Study Gear Bundle, New Term Styles",
  },
  {
    label: "Black Friday/Cyber Monday",
    description: "Doorbuster Deals, Early Access Sale, Cyber Blowout",
  },
  {
    label: "Christmas/Holidays",
    description: "Holiday Gift Guide, 12 Days of Deals, Stocking Stuffers",
  },
  {
    label: "New Year / Fitness Resets",
    description: "New Year, New Gear, Resolution Ready Sale",
  },
  {
    label: "Mother’s/Father’s Day",
    description: "Gifts They’ll Love, Mom’s Day Favorites, Dad Approved",
  },
];

const Preview = ({
  adPlatforms,
  isReview,
  highlightedProductId,
  generateCreatives,
}: {
  adPlatforms: {
    title: PreviewTitle;
    platform: Platform;
    image: string;
    settings: unknown;
    creatives?: unknown[];
  }[];
  highlightedProductId: string;
  isReview?: boolean;
  generateCreatives: (productId: string, platforms: Platform[]) => void;
  loading: boolean;
}) => {
  const router = useRouter();
  const [googleCampaignTypeOpen, setGoogleCampaignTypeOpen] = useState(false);
  const googleCampaignTypeDesktopRef = useRef<HTMLDivElement>(null);
  const googleCampaignTypeMobileRef = useRef<HTMLDivElement>(null);

  const campaignType = useCreateCampaignStore(
    (state) => state.campaignSnapshots.campaignType,
  );
  const storeCampaignSnapshots = useCreateCampaignStore(
    (state) => state.actions.storeCampaignSnapshots,
  );

  const settings: { label: string; key: SocialSettingsKey }[] = [
    { label: "Static Post", key: "staticPost" },
    { label: "Carousel Post", key: "carouselPost" },
    { label: "Story Post", key: "storyPost" },
  ];
  const creativeLoadingStates = useUIStore(
    (state) => state.creativeLoadingState,
  );

  const { toggleFacebookSettings } = useCreateCampaignStore(
    (state) => state.actions,
  );

  const { undo } = useCreativesStore((state) => state.actions);
  const destinationUrl = useCreateCampaignStore(
    (state) => state.campaignSnapshots.destinationUrl,
  );
  const setToast = useToastStore((state) => state.setToast);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const inDesktop =
        googleCampaignTypeDesktopRef.current?.contains(event.target as Node) ||
        false;
      const inMobile =
        googleCampaignTypeMobileRef.current?.contains(event.target as Node) ||
        false;

      if (!inDesktop && !inMobile) {
        setGoogleCampaignTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isValidHttpUrl = (value: string) => {
    if (!value) return false;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const normalizedAdPlatforms = useMemo(() => {
    return (adPlatforms || [])
      .filter((p) => p.platform !== ("INSTAGRAM" as Platform))
      .map((p) => {
        if (p.platform === "FACEBOOK") {
          return { ...p, title: "Meta" as const };
        }
        return p;
      });
  }, [adPlatforms]);

  const isDestinationUrlValid = isValidHttpUrl(destinationUrl);

  const { Google, Facebook } = useCreativesStore((state) => state);

  const hasGeneratedOnceForPlatform = (platform: Platform) => {
    const store = platform === "GOOGLE ADS" ? Google : Facebook;
    const list = store?.[highlightedProductId];
    return Array.isArray(list) && list.length > 0;
  };

  return (
    <div className="flex flex-col gap-12">
      {normalizedAdPlatforms?.map((item) => (
        <div className="flex flex-col w-full " key={item.title}>
          <div className="flex px-5 lg:pl-0 lg:pr-5  justify-between items-center">
            <div className="flex gap-16 items-center">
              <div
                className={
                  item.title === "Google"
                    ? "flex flex-col items-start gap-2"
                    : "flex items-center"
                }
              >
                <p className="text-sm flex gap-2 items-center">
                  <span className="font-bold ">
                    {item.title === "Instagram" ? (
                      <Image
                        src="/instagram_logo.svg"
                        alt="instagram"
                        width={20}
                        height={20}
                      />
                    ) : item.title === "Meta" ? (
                      <Image
                        src="/facebook_logo.svg"
                        alt="meta"
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

                {item.title === "Google" && (
                  <div
                    ref={googleCampaignTypeDesktopRef}
                    className="hidden md:block"
                  >
                    <div className="relative">
                      <div className="text-xs tracking-tight block">
                        Campaign Type
                      </div>
                      <button
                        type="button"
                        onClick={() => setGoogleCampaignTypeOpen((p) => !p)}
                        className={`mt-2 px-4 h-[40px] w-[260px] flex items-center justify-between rounded-lg text-sm font-medium border-[1.2px] bg-white ${
                          googleCampaignTypeOpen
                            ? "border-[#A755FF]"
                            : "border-input-border"
                        }`}
                      >
                        <span className="truncate">
                          {campaignType || "Product Launch"}
                        </span>
                        <ArrowDown2 size={14} color="#292D32" />
                      </button>

                      {googleCampaignTypeOpen && (
                        <div className="absolute left-0 right-0 z-50 bg-white max-h-[300px] rounded-md w-full custom-shadow-select overflow-y-auto top-full mt-2">
                          {GOOGLE_CAMPAIGN_TYPES.map((opt) => (
                            <div
                              key={opt.label}
                              title={opt.description}
                              onClick={() => {
                                storeCampaignSnapshots({
                                  ...useCreateCampaignStore.getState()
                                    .campaignSnapshots,
                                  campaignType: opt.label,
                                });
                                setGoogleCampaignTypeOpen(false);
                              }}
                              className="p-3 relative hover:bg-[#FBFAFC] text-[#333] cursor-pointer"
                            >
                              <span>{opt.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden md:block">
                {item.title !== "Google" && (
                  <MediaSettingBox
                    item={item}
                    settings={settings}
                    toggleFacebookSettings={toggleFacebookSettings}
                  />
                )}
              </div>
            </div>
            <div className="h-[32px]">
              {!isReview &&
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
                  </div>
                )}
            </div>
          </div>
          <div className="md:hidden mt-4">
            {item.title !== "Google" && (
              <MediaSettingBox
                item={item}
                settings={settings}
                toggleFacebookSettings={toggleFacebookSettings}
              />
            )}
            {item.title === "Google" && (
              <div
                ref={googleCampaignTypeMobileRef}
                className="px-5 lg:pl-0 lg:pr-5"
              >
                <div className="relative">
                  <div className="text-xs tracking-tight block">
                    Campaign Type
                  </div>
                  <button
                    type="button"
                    onClick={() => setGoogleCampaignTypeOpen((p) => !p)}
                    className={`mt-2 px-4 h-[40px] w-full flex items-center justify-between rounded-lg text-sm font-medium border-[1.2px] bg-white ${
                      googleCampaignTypeOpen
                        ? "border-[#A755FF]"
                        : "border-input-border"
                    }`}
                  >
                    <span className="truncate">
                      {campaignType || "Product Launch"}
                    </span>
                    <ArrowDown2 size={14} color="#292D32" />
                  </button>

                  {googleCampaignTypeOpen && (
                    <div className="absolute left-0 right-0 z-50 bg-white max-h-[300px] rounded-md w-full custom-shadow-select overflow-y-auto top-full mt-2">
                      {GOOGLE_CAMPAIGN_TYPES.map((opt) => (
                        <div
                          key={opt.label}
                          title={opt.description}
                          onClick={() => {
                            storeCampaignSnapshots({
                              ...useCreateCampaignStore.getState()
                                .campaignSnapshots,
                              campaignType: opt.label,
                            });
                            setGoogleCampaignTypeOpen(false);
                          }}
                          className="p-3 relative hover:bg-[#FBFAFC] text-[#333] cursor-pointer"
                        >
                          <span>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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

const EMPTY_UPLOADS: MetaUploadedCreative[] = [];

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

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
    (state) => state.creativeLoadingState,
  );

  const token = useAuthStore((state) => state.token);

  const productName = useCreateCampaignStore((state) => {
    const product = state.productSelection.products.find(
      (p) => p.node.id === highlightedProductId,
    );
    return product?.node?.title || "";
  });

  const facebookSettings = useCreateCampaignStore(
    (state) => state.facebookSettings,
  );

  const isLoading = useMemo(() => {
    return creativeLoadingStates?.[highlightedProductId]?.[item.platform];
  }, [highlightedProductId, creativeLoadingStates, item.platform]);

  const lastIndex = item?.creatives?.length - 1 || 0;
  const creativesAvailable = item?.creatives?.length > 0;

  const mediaCreative = item.creatives?.length - 1 || 0;
  const isMediaCreative = item?.creatives;

  const isGoogleAds = platform === "GOOGLE ADS";
  const isFacebook = platform === "FACEBOOK";

  const generatedImageAssetIdsByPresetId = useCreateCampaignStore(
    (state) => state.adStyle.imageAssetIdsByPresetId || {},
  );
  const generatedVideoAssetId = useCreateCampaignStore(
    (state) => state.adStyle.videoAssetId || null,
  );

  const videoCaption = useCreateCampaignStore(
    (state) => state.adStyle.videoCaption || "",
  );
  const imageCaptionsByPresetId = useCreateCampaignStore(
    (state) => state.adStyle.imageCaptionsByPresetId || {},
  );

  const orderedImagePresetIds = useMemo(() => {
    return Object.entries(generatedImageAssetIdsByPresetId)
      .filter(
        ([presetId, assetId]) =>
          typeof presetId === "string" &&
          presetId.trim().length > 0 &&
          typeof assetId === "string" &&
          assetId.trim().length > 0,
      )
      .slice(0, 5)
      .map(([presetId]) => presetId);
  }, [generatedImageAssetIdsByPresetId]);

  const attachedAssets = useCreateCampaignStore(
    (state) => state.attachedAssets.assets,
  );

  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isFacebook) return;
    if (!token) return;

    const imageAssetIds = Object.values(generatedImageAssetIdsByPresetId)
      .filter((v) => typeof v === "string" && v.trim().length > 0)
      .slice(0, 5);
    const videoAssetId =
      typeof generatedVideoAssetId === "string" &&
      generatedVideoAssetId.trim().length > 0
        ? generatedVideoAssetId
        : null;

    if (imageAssetIds.length === 0 && !videoAssetId) {
      setGeneratedImageUrls([]);
      setGeneratedVideoUrl(null);
      return;
    }

    const attachedById = new Map(
      (attachedAssets || []).map((a) => [a.assetId, a]),
    );

    const attachedImages = imageAssetIds
      .map((id) => attachedById.get(id)?.url)
      .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
    const attachedVideo = videoAssetId
      ? attachedById.get(videoAssetId)?.url
      : undefined;

    if (
      attachedImages.length > 0 ||
      (attachedVideo && attachedVideo.trim().length > 0)
    ) {
      setGeneratedImageUrls(attachedImages);
      setGeneratedVideoUrl(
        typeof attachedVideo === "string" && attachedVideo.trim().length > 0
          ? attachedVideo
          : null,
      );
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const imageResults = await Promise.allSettled(
          imageAssetIds.map(async (assetId) => {
            const res = await getAssetById({ token, assetId });
            const asset = res?.data;
            const url = asset?.mediaUrl || asset?.url;
            return typeof url === "string" ? url : "";
          }),
        );

        const nextImages = imageResults
          .map((r) => (r.status === "fulfilled" ? r.value : ""))
          .filter((u) => typeof u === "string" && u.trim().length > 0);

        let nextVideo: string | null = null;
        if (videoAssetId) {
          const res = await getAssetById({ token, assetId: videoAssetId });
          const asset = res?.data;
          const url = asset?.mediaUrl || asset?.url;
          nextVideo =
            typeof url === "string" && url.trim().length > 0 ? url : null;
        }

        if (cancelled) return;
        setGeneratedImageUrls(nextImages);
        setGeneratedVideoUrl(nextVideo);
      } catch {
        if (cancelled) return;
        setGeneratedImageUrls([]);
        setGeneratedVideoUrl(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isFacebook,
    token,
    generatedVideoAssetId,
    highlightedProductId,
    generatedImageAssetIdsByPresetId,
    attachedAssets,
  ]);

  const uploaded = useMetaCreativeUploadStore(
    (state) => state.uploadsByProductId[highlightedProductId] ?? EMPTY_UPLOADS,
  );

  const uploadedVideoPreview = useMemo(() => {
    const vid = uploaded.find((u) => u.type === "video");
    if (!vid?.previewUrl) return null;
    return {
      url: "",
      videoUrl: vid.previewUrl,
      caption: "",
    };
  }, [uploaded]);

  const showUploadedCreatives = uploaded.length > 0;
  const showGeneratedAssets =
    !showUploadedCreatives &&
    (generatedImageUrls.length > 0 || Boolean(generatedVideoUrl));
  const assetSource = showUploadedCreatives
    ? ("uploaded" as const)
    : ("generated" as const);

  const uploadedImages = useMemo(() => {
    return uploaded.filter((u) => u.type === "image" && u.previewUrl);
  }, [uploaded]);

  const uploadedSelection = useMemo(() => {
    if (uploadedImages.length === 0) {
      return {
        staticCreative: null as null | { url: string; caption: string },
        storyCreative: null as null | { url: string; caption: string },
        carouselCreatives: [] as Array<{ url: string; caption: string }>,
      };
    }

    const seedSource = uploadedImages.map((u) => u.id).join("|");
    const rand = mulberry32(hashString(seedSource));

    const shuffled = [...uploadedImages].sort(() => rand() - 0.5);
    const staticIdx = Math.floor(rand() * shuffled.length);

    let storyIdx = Math.floor(rand() * shuffled.length);
    if (shuffled.length > 1) {
      while (storyIdx === staticIdx)
        storyIdx = Math.floor(rand() * shuffled.length);
    }

    const staticCreative = {
      url: shuffled[staticIdx]!.previewUrl,
      caption: "",
    };

    const storyCreative = {
      url: shuffled[storyIdx]!.previewUrl,
      caption: "",
    };

    const carouselCreatives = Array.from({ length: 5 }).map((_, idx) => {
      const img = shuffled[idx % shuffled.length]!;
      return { url: img.previewUrl, caption: "" };
    });

    return { staticCreative, storyCreative, carouselCreatives };
  }, [uploadedImages]);

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

  const hasMediaCreatives = useMemo(() => {
    const hasGenerated =
      isMediaCreative?.[mediaCreative]?.creatives &&
      isMediaCreative[mediaCreative]?.creatives.length > 0;
    const hasUploads = uploaded.length > 0;
    const hasAssets =
      generatedImageUrls.length > 0 || Boolean(generatedVideoUrl);
    return Boolean(hasGenerated || hasUploads || hasAssets);
  }, [
    generatedImageUrls.length,
    generatedVideoUrl,
    isMediaCreative,
    mediaCreative,
    uploaded.length,
  ]);

  const showNoPreview = !hasMediaCreatives && !isLoading;

  const NoPreviewPlaceholder = () => (
    <div className="flex flex-col gap-1 items-center">
      <ImageIcon size="48" color="#DADADA" variant="Bold" />
      <p className="text-sm text-[#BFBFBF] font-medium">No Preview</p>
    </div>
  );

  return (
    <>
      {isGoogleAds && (
        <div className="px-5 lg:pl-0 lg:pr-5">
          <div className="bg-[#f1f1f1] max-w-full relative rounded-xl md:rounded-3xl mt-5 min-h-[518px] md:min-h-[600px]">
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <CircleLoader />
            </div>

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

      {isFacebook && (
        <div className="relative min-h-[518px] md:min-h-[600px]">
          <div
            className={`transition-opacity duration-300 ${
              !showNoPreview
                ? "opacity-100"
                : "opacity-0 pointer-events-none absolute inset-0"
            }`}
          >
            <DragScrollContainer>
              <div className="mt-5 pl-5 lg:pl-0 flex gap-4 w-full items-center">
                {facebookSettings.staticPost &&
                  (showUploadedCreatives ? (
                    <>
                      {uploadedSelection.staticCreative && (
                        <div
                          style={{ width: `${facebookWidthSize.staticPost}%` }}
                          className="min-w-[318.6px] transition-all duration-300"
                        >
                          <FBStaticPostView
                            creative={uploadedSelection.staticCreative}
                            productId={highlightedProductId}
                            productName={productName}
                            source={"uploaded"}
                            hideBookmark
                          />
                        </div>
                      )}
                      {uploadedVideoPreview && (
                        <div
                          style={{ width: `${facebookWidthSize.staticPost}%` }}
                          className="min-w-[318.6px] transition-all duration-300"
                        >
                          <FBStaticPostView
                            creative={uploadedVideoPreview}
                            productId={highlightedProductId}
                            productName={productName}
                            source={"uploaded"}
                            hideBookmark
                          />
                        </div>
                      )}
                    </>
                  ) : showGeneratedAssets ? (
                    <>
                      {generatedImageUrls[0] && (
                        <div
                          style={{ width: `${facebookWidthSize.staticPost}%` }}
                          className="min-w-[318.6px] transition-all duration-300"
                        >
                          <FBStaticPostView
                            creative={{
                              url: generatedImageUrls[0],
                              caption:
                                imageCaptionsByPresetId[
                                  orderedImagePresetIds[0] || ""
                                ] ||
                                isMediaCreative?.[mediaCreative]?.creatives?.[0]
                                  ?.caption,
                              title:
                                isMediaCreative?.[mediaCreative]?.creatives?.[0]
                                  ?.title,
                            }}
                            productId={highlightedProductId}
                            productName={productName}
                            source={"generated"}
                            hideBookmark
                          />
                        </div>
                      )}
                      {generatedVideoUrl && (
                        <div
                          style={{ width: `${facebookWidthSize.staticPost}%` }}
                          className="min-w-[318.6px] transition-all duration-300"
                        >
                          <FBStaticPostView
                            creative={{
                              url: "",
                              videoUrl: generatedVideoUrl,
                              caption:
                                videoCaption ||
                                isMediaCreative?.[mediaCreative]?.creatives?.[0]
                                  ?.caption,
                              title:
                                isMediaCreative?.[mediaCreative]?.creatives?.[0]
                                  ?.title,
                            }}
                            productId={highlightedProductId}
                            productName={productName}
                            source={"generated"}
                            hideBookmark
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      style={{ width: `${facebookWidthSize.staticPost}%` }}
                      className="min-w-[318.6px] transition-all duration-300"
                    >
                      <FBStaticPostView
                        creative={
                          isMediaCreative?.[mediaCreative]?.creatives?.[0]
                        }
                        productId={highlightedProductId}
                        productName={productName}
                        source={assetSource}
                        hideBookmark
                      />
                    </div>
                  ))}

                {facebookSettings.carouselPost && (
                  <div
                    style={{ width: `${facebookWidthSize.carouselPost}%` }}
                    className="min-w-[529.6px] transition-all duration-300"
                  >
                    {showUploadedCreatives ? (
                      <FBCarouselPostView
                        creatives={uploadedSelection.carouselCreatives}
                      />
                    ) : showGeneratedAssets ? (
                      <FBCarouselPostView
                        creatives={Array.from({ length: 5 }).map((_, idx) => {
                          const url =
                            generatedImageUrls[
                              idx % Math.max(1, generatedImageUrls.length)
                            ];
                          return {
                            url,
                            caption:
                              imageCaptionsByPresetId[
                                orderedImagePresetIds[
                                  idx %
                                    Math.max(1, orderedImagePresetIds.length)
                                ] || ""
                              ] ||
                              isMediaCreative?.[mediaCreative]?.creatives?.[0]
                                ?.caption,
                            title:
                              isMediaCreative?.[mediaCreative]?.creatives?.[0]
                                ?.title,
                          };
                        })}
                      />
                    ) : (
                      <FBCarouselPostView
                        creatives={
                          isMediaCreative?.[mediaCreative]?.creatives || []
                        }
                      />
                    )}
                  </div>
                )}

                {facebookSettings.storyPost && (
                  <div
                    style={{ width: `${facebookWidthSize.storyPost}%` }}
                    className="min-w-[318.6px] transition-all duration-300"
                  >
                    {showUploadedCreatives ? (
                      <FBStoryPostView
                        creative={uploadedSelection.storyCreative}
                        productId={highlightedProductId}
                        productName={productName}
                        source={"uploaded"}
                        hideBookmark
                      />
                    ) : showGeneratedAssets ? (
                      <FBStoryPostView
                        creative={{
                          url:
                            generatedImageUrls[1] ||
                            generatedImageUrls[0] ||
                            "",
                          caption:
                            imageCaptionsByPresetId[
                              orderedImagePresetIds[1] ||
                                orderedImagePresetIds[0] ||
                                ""
                            ] ||
                            isMediaCreative?.[mediaCreative]?.creatives?.[0]
                              ?.caption,
                          title:
                            isMediaCreative?.[mediaCreative]?.creatives?.[0]
                              ?.title,
                        }}
                        productId={highlightedProductId}
                        productName={productName}
                        source={"generated"}
                        hideBookmark
                      />
                    ) : (
                      <FBStoryPostView
                        creative={
                          isMediaCreative?.[mediaCreative]?.creatives?.[0]
                        }
                        productId={highlightedProductId}
                        productName={productName}
                        source={assetSource}
                        hideBookmark
                      />
                    )}
                  </div>
                )}
              </div>
            </DragScrollContainer>
          </div>

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
  toggleFacebookSettings,
}: {
  item: any;
  toggleFacebookSettings: (key: SocialSettingsKey) => void;
  settings: { label: string; key: SocialSettingsKey }[];
}) => {
  return (
    <div className="flex px-5 lg:px-0 gap-3 md:gap-6 items-center">
      {settings.map((setting) => (
        <div
          onClick={() => {
            if (item.title === "Facebook" || item.title === "Meta") {
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
