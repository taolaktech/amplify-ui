// import { useEffect, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "iconsax-react";
import { ArrowForward, Magicpen } from "iconsax-react";
import GradientCheckbox from "../form/GradientCheckbox2";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { SocialSettingsKey } from "@/app/lib/stores/createCampaignStore";
// import { useRef } from "react";
import GoogleAdsCreatives from "../creatives/GoogleAds";
import { Platform } from "@/type";
import useCreativesStore from "@/app/lib/stores/creativesStore";

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
    { label: "Static Post (1:1)", key: "staticPost" },
    { label: "Carousel Post", key: "carouselPost" },
    { label: "Story Post", key: "storyPost" },
  ];

  // const { generateCreatives, loading } = useGenerateCreatives();

  const { toggleFacebookSettings, toggleInstagramSettings } =
    useCreateCampaignStore((state) => state.actions);

  const { undo } = useCreativesStore((state) => state.actions);

  return (
    <div className="flex flex-col gap-12">
      {adPlatforms?.map((item) => (
        <div className="flex flex-col w-full " key={item.title}>
          <div className="flex justify-between items-center">
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
              <>
                {item.title !== "Google" && (
                  <div className="flex gap-6 items-center">
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
                          <p className="text-sm font-medium tracking-100">
                            {setting.label}
                          </p>
                        </div>
                        <div>
                          <GradientCheckbox
                            ticked={item.settings[setting.key]}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
              {/* )} */}
            </div>

            {!isReview && (
              <div className="flex gap-2 items-center">
                {item.creatives && item.creatives?.length > 1 && (
                  <button
                    onClick={() => undo(item.platform, highlightedProductId)}
                    className="flex gap-1 items-center h-[32px] px-4 bg-[#ECECEC] rounded-[39px]"
                  >
                    <ArrowForward
                      size={16}
                      color="#000"
                      className="-mt-[2px] -scale-x-100"
                    />
                    <span className="text-sm"> Undo</span>
                  </button>
                )}
                <button
                  onClick={() =>
                    generateCreatives(highlightedProductId, [item.platform])
                  }
                  className="flex gap-1 items-center h-[32px] px-4 bg-[#ECECEC] rounded-[39px]"
                >
                  <Magicpen size={12} color="#000" />
                  <span className="text-xs tracking-100">Generate</span>
                </button>
              </div>
            )}
          </div>
          <PreviewContainer item={item} />
        </div>
      ))}
    </div>
  );
};

export default Preview;

const PreviewContainer = ({ item }: { item: any }) => {
  // const containerRef = useRef<HTMLDivElement>(null);
  console.log("PreviewContainer item:", item);

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
  return (
    <div className="bg-[#f1f1f1] max-w-full relative rounded-xl md:rounded-3xl mt-5">
      {/* Carousel arrows */}

      {creativesAvailable ? (
        <>
          {item.title === "Google" ? (
            <div className="flex flex-1 h-[350px] sm:h-[350px] md:h-[650px] items-center justify-center">
              <GoogleAdsCreatives
                creatives={item.creatives[lastIndex]?.creatives}
              />
            </div>
          ) : (
            <div className="flex flex-1 h-[350px] flex-row gap-2 sm:h-[350px] md:h-[650px] items-center justify-center">
              {isMediaCreative[mediaCreative]?.creatives.map(
                (creative: string, index: number) => (
                  <img
                    key={creative}
                    src={isMediaCreative[mediaCreative]?.creatives[index]}
                    alt={`${item.title} ad preview`}
                    width={300}
                    height={600}
                    className="object-contain w-[150px] h-[300px] lg:w-[200px] lg:h-[500px] xl:w-[300px] xl:h-[600px] rounded-2xl"
                  />
                )
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-[518px] md:h-[600px]">
          <div className="flex flex-col gap-1 items-center">
            <ImageIcon size="48" color="#DADADA" variant="Bold" />
            <p className="text-sm text-[#BFBFBF] font-medium">No Preview</p>
          </div>
        </div>
      )}
    </div>
  );
};
