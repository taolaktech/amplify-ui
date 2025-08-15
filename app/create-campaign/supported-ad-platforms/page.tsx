"use client";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Toggle from "@/app/ui/Toggle";
import Button from "@/app/ui/Button";
import { ArrowCircleRight2 } from "iconsax-react";
import CircleLoaderModal from "@/app/ui/modals/CircleLoaderModal";
import { useModal } from "@/app/lib/hooks/useModal";
import { useGenerateCreatives } from "@/app/lib/hooks/creatives";

const SupportedAdPlatforms = () => {
  const router = useRouter();
  const { productSelection, supportedAdPlatforms, actions } =
    useCreateCampaignStore((state) => state);

  const { generateCreatives, initialGeneration, googleCreativeIsPending } =
    useGenerateCreatives();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useModal(isLoading);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!productSelection.complete) {
      router.push("/create-campaign/");
    }
  }, []);

  const canProceed =
    supportedAdPlatforms.Google ||
    supportedAdPlatforms.Instagram ||
    supportedAdPlatforms.Facebook;

  const handleProceed = () => {
    initialGeneration();
    // setTimeout(() => {
    //   if (canProceed) {
    //     actions.completeAdsPlatform();
    //     router.push("/create-campaign/campaign-snapshots");
    //   }
    //   setIsLoading(false);
    // }, 2000);
  };

  return (
    <div className="mt-6 pb-10">
      <div className="lg:flex-row flex-col flex gap-4 lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl tracking-40 md:text-2xl font-medium md:font-bold text-heading md:tracking-800">
            <span className="num">3. </span>
            <span>Supported Ad Platforms</span>
          </h1>
          <p className="mt-[0.38rem] text-neutral-light tracking-40 text-xs md:text-sm">
            Your ads will be placed on these channels. Upgrade your subscription
            to add more channels and get even better results from your marketing
          </p>
        </div>
      </div>
      <div className="mt-16 flex flex-col lg:flex-row max-w-[700px] mx-auto lg:max-w-full gap-2 lg:gap-6 pb-9">
        <div className="flex-1 relative w-full">
          <div className="flex w-full items-center  justify-center  rounded-3xl">
            <div className="relative w-full h-[215px] sm:h-[300px] lg:h-[429px] mx-auto">
              <Image
                src={isMobile ? "/google_post_sm.webp" : "/google_post_lg.webp"}
                alt="google ads platform"
                layout="fill"
                objectFit="cover"
                loading="eager"
                priority
                className={`duration-300 transition-all rounded-3xl ${
                  supportedAdPlatforms.Google ? "" : "grayscale opacity-70"
                }`}
                blurDataURL={"/google_post_lg_compressed.webp"}
                placeholder="blur"
              />
            </div>
          </div>
          <div className="flex items-center justify-between lg:mt-5 px-6 h-[50px]">
            <img
              src="/google-ads-custom-logo.png"
              alt="Google Ads Custom Logo"
              height={18}
              width={100}
              className={`rounded-3xl duration-300 transition-all ${
                supportedAdPlatforms.Google ? "" : "grayscale opacity-60"
              }`}
            />
            <Toggle
              on={supportedAdPlatforms.Google}
              toggle={() => actions.toggleAdsPlatform("Google")}
            />
          </div>
        </div>
        <div className="flex-1 relative w-full">
          <div className="flex w-full items-center  justify-center  rounded-3xl">
            <div className="relative w-full h-[215px] sm:h-[300px] lg:h-[429px] mx-auto">
              <Image
                src={isMobile ? "/ig_post_sm.webp" : "/ig_post_lg.webp"}
                alt="instagram ads platform"
                layout="fill"
                objectFit="cover"
                loading="eager"
                priority
                className={`duration-300 transition-all rounded-3xl ${
                  supportedAdPlatforms.Instagram ? "" : "grayscale opacity-70"
                }`}
                blurDataURL={"/ig_post_lg_compressed.webp"}
                placeholder="blur"
              />
            </div>
          </div>
          <div className="flex items-center justify-between lg:mt-5 px-6 h-[50px]">
            <img
              src="/instagram-custom-logo.png"
              alt="Instagram Custom Logo"
              className={`duration-300 transition-all ${
                supportedAdPlatforms.Instagram ? "" : "grayscale opacity-60"
              }`}
              height={18}
              width={100}
            />
            <Toggle
              // on={supportedAdPlatforms.Instagram}
              on={false}
              // toggle={() => actions.toggleAdsPlatform("Instagram")}
              toggle={() => {}}
            />
          </div>
        </div>
        <div className="flex-1 relative w-full">
          <div className="flex w-full items-center  justify-center  rounded-3xl">
            <div className="relative w-full h-[215px] sm:h-[300px] lg:h-[429px] mx-auto">
              <Image
                src={
                  isMobile ? "/facebook_post_sm.webp" : "/facebook_post_lg.webp"
                }
                alt="facebook ads platform"
                layout="fill"
                objectFit="cover"
                loading="eager"
                priority
                className={`duration-300 transition-all rounded-3xl ${
                  supportedAdPlatforms.Facebook ? "" : "grayscale opacity-70"
                }`}
                blurDataURL={"/facebook_post_lg_compressed.webp"}
                placeholder="blur"
              />
            </div>
          </div>
          <div className="flex items-center justify-between lg:mt-5 h-[50px] px-6">
            <img
              src="/facebook-custom.png"
              alt="Facebook Logo"
              height={18}
              width={100}
              className={`rounded-3xl ${
                supportedAdPlatforms.Facebook ? "" : "grayscale opacity-60"
              }`}
            />
            <Toggle
              // on={supportedAdPlatforms.Facebook}
              on={false}
              // toggle={() => actions.toggleAdsPlatform("Facebook")}
              toggle={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 md:mt-7 sm:max-w-[200px] mx-auto">
        <Button
          text="Proceed"
          action={handleProceed}
          disabled={!canProceed}
          hasIconOrLoader
          loading={isLoading}
          icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
          iconPosition="right"
          iconSize={16}
        />
      </div>
      {googleCreativeIsPending && (
        <CircleLoaderModal text="Generating Ad Creatives..." />
      )}
    </div>
  );
};

export default SupportedAdPlatforms;
