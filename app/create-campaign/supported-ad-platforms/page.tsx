"use client";
import { googleAdImgBlur } from "@/app/lib/blurHash";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Toggle from "@/app/ui/Toggle";
import Button from "@/app/ui/Button";
import { ArrowCircleRight2 } from "iconsax-react";
import CircleLoaderModal from "@/app/ui/modals/CircleLoaderModal";
import { useModal } from "@/app/lib/hooks/useModal";

const SupportedAdPlatforms = () => {
  const router = useRouter();
  const { productSelection, supportedAdPlatforms, actions } =
    useCreateCampaignStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  useModal(isLoading);

  useEffect(() => {
    if (!productSelection.complete) {
      router.push("/create-campaign/product-selection");
    }
  }, []);

  const canProceed =
    supportedAdPlatforms.google ||
    supportedAdPlatforms.instagram ||
    supportedAdPlatforms.facebook;

  const handleProceed = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (canProceed) {
        actions.completeAdsPlatform();
        router.push("/create-campaign/campaign-snapshots");
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="mt-6 pb-10">
      <div className="lg:flex-row flex-col flex gap-4 lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl tracking-40 md:text-2xl font-medium md:font-bold text-heading md:tracking-800">
            <span className="num">3. </span>
            <span>Supported Ad Platforms</span>
          </h1>
          <p className="text-neutral-light tracking-40 text-xs md:text-sm">
            Your ads will be placed on these channels. Upgrade your subscription
            to add more channels and get even better results from your marketing
          </p>
        </div>
      </div>
      <div className="mt-16 flex flex-col lg:flex-row max-w-[700px] mx-auto lg:max-w-full gap-2 lg:gap-6 pb-9">
        <div className="flex-1 relative w-full">
          <div className="flex w-full items-center h-[215px] sm:h-[300px] lg:h-[430px] justify-center bg-[#ECECEC] rounded-3xl">
            <div className="relative w-full h-full max-w-[289px] max-h-[314px] mx-auto">
              <Image
                src={"/google-ads-platform.webp"}
                alt="google ads platform"
                layout="fill"
                objectFit="cover"
                loading="eager"
                priority
                sizes="(max-width: 767px) 0px, 100vw"
                className={`rounded-3xl duration-300 transition-all ${
                  supportedAdPlatforms.google ? "" : "grayscale opacity-70"
                }`}
                blurDataURL={googleAdImgBlur}
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
                supportedAdPlatforms.google ? "" : "grayscale opacity-60"
              }`}
            />
            <Toggle
              on={supportedAdPlatforms.google}
              toggle={() => actions.toggleAdsPlatform("google")}
            />
          </div>
        </div>
        <div className="flex-1 relative w-full">
          <div className="flex w-full items-center h-[215px] sm:h-[300px] lg:h-[430px] justify-center bg-[#ECECEC] rounded-3xl">
            <div className="relative w-full h-full max-w-[289px] max-h-[314px] mx-auto">
              <Image
                src={"/google-ads-platform.webp"}
                alt="google ads platform"
                layout="fill"
                objectFit="cover"
                loading="eager"
                priority
                sizes="(max-width: 767px) 0px, 100vw"
                className={`rounded-3xl duration-300 transition-all ${
                  supportedAdPlatforms.instagram ? "" : "grayscale opacity-70"
                }`}
                blurDataURL={googleAdImgBlur}
                placeholder="blur"
              />
            </div>
          </div>
          <div className="flex items-center justify-between lg:mt-5 px-6 h-[50px]">
            <img
              src="/instagram-custom-logo.png"
              alt="Instagram Custom Logo"
              className={`duration-300 transition-all ${
                supportedAdPlatforms.instagram ? "" : "grayscale opacity-60"
              }`}
              height={18}
              width={100}
            />
            <Toggle
              on={supportedAdPlatforms.instagram}
              toggle={() => actions.toggleAdsPlatform("instagram")}
            />
          </div>
        </div>
        <div className="flex-1 relative w-full">
          <div className="flex w-full items-center h-[215px] sm:h-[300px] lg:h-[430px] justify-center bg-[#ECECEC] rounded-3xl">
            <div className="relative w-full h-full max-w-[289px] max-h-[314px] mx-auto">
              <Image
                src={"/google-ads-platform.webp"}
                alt="google ads platform"
                layout="fill"
                objectFit="cover"
                loading="eager"
                priority
                className={`duration-300 transition-all rounded-3xl ${
                  supportedAdPlatforms.facebook ? "" : "grayscale opacity-70"
                }`}
                sizes="(max-width: 767px) 0px, 100vw"
                blurDataURL={googleAdImgBlur}
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
                supportedAdPlatforms.facebook ? "" : "grayscale opacity-60"
              }`}
            />
            <Toggle
              on={supportedAdPlatforms.facebook}
              toggle={() => actions.toggleAdsPlatform("facebook")}
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
      {isLoading && <CircleLoaderModal text="Generating Ad Creatives..." />}
    </div>
  );
};

export default SupportedAdPlatforms;
