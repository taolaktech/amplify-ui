// import { useEffect, useState } from "react";
import Image from "next/image";
import { Magicpen } from "iconsax-react";
import GradientCheckbox from "../form/GradientCheckbox2";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { SocialSettingsKey } from "@/app/lib/stores/createCampaignStore";
import GoogleCreatives from "../creatives/Google";
import CarouselArrow from "../CarouselArrow";
import { useRef } from "react";

type PreviewTitle = "Instagram" | "Facebook" | "Google";

const Preview = ({
  adPlatforms,
  isReview,
}: {
  adPlatforms: {
    title: PreviewTitle;
    image: string;
    settings: any;
    creatives?: any[];
  }[];
  isReview?: boolean;
}) => {
  const settings: { label: string; key: SocialSettingsKey }[] = [
    { label: "Static Post (1:1)", key: "staticPost" },
    { label: "Carousel Post", key: "carouselPost" },
    { label: "Story Post", key: "storyPost" },
  ];

  const { toggleFacebookSettings, toggleInstagramSettings } =
    useCreateCampaignStore((state) => state.actions);

  return (
    <div className="flex flex-col gap-12">
      {adPlatforms?.map((item) => (
        <div
          className="h-[300px] md:h-[500px] flex flex-col w-full "
          key={item.title}
        >
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
                {/* <button className="flex gap-1 items-center h-[32px] px-4 bg-[#ECECEC] rounded-[39px]">
                <ArrowForward size={16} color="#000" className="-mt-[2px]" />
                <span className="text-sm"> Undo</span>
              </button> */}
                <button className="flex gap-1 items-center h-[32px] px-4 bg-[#ECECEC] rounded-[39px]">
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
  const containerRef = useRef<HTMLDivElement>(null);

  const width = 350;

  const scrollBy = (offset: number) => {
    console.log("called");
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };
  return (
    <div className="bg-[#f1f1f1] relative rounded-3xl mt-5 overflow-hidden">
      {/* Carousel arrows */}
      <div className="absolute top-0 z-[1] w-full">
        <CarouselArrow title={item.title} scrollBy={scrollBy} />
      </div>

      {item.title === "Google" && (
        <div
          ref={containerRef}
          className="flex overflow-x-auto  items-center flex-1 scroll-smooth gap-6 h-[400px] no-scrollbar  px-10"
        >
          {item.creatives.map((creatives, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[350px]" // or any width you want
            >
              <GoogleCreatives
                headline={creatives.description}
                description={creatives.description}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
