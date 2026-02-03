"use client";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Toggle from "@/app/ui/Toggle";
import Button from "@/app/ui/Button";
import { ArrowCircleRight2 } from "iconsax-react";
import GooglePostSM from "@/public/google_post_sm.webp";
import GooglePostLG from "@/public/google_post_lg.webp";
import IGPostSM from "@/public/ig_post_sm.webp";
import IGPostLG from "@/public/ig_post_lg.webp";
import FacebookPostSM from "@/public/facebook_post_sm.webp";
import FacebookPostLG from "@/public/facebook_post_lg.webp";
import { useModal } from "@/app/lib/hooks/useModal";
import { useIntegrationStore } from "@/app/lib/stores/integrationStore";
import AdPlatformConnect from "@/app/ui/modals/AdPlatformConnect";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { getIntegrationsStatus } from "@/app/lib/api/integrations";

const SupportedAdPlatforms = () => {
  const router = useRouter();
  const productSelection = useCreateCampaignStore(
    (state) => state.productSelection,
  );
  const supportedAdPlatforms = useCreateCampaignStore(
    (state) => state.supportedAdPlatforms,
  );

  const [activePlatform, setActivePlatform] = useState<
    "Instagram" | "Facebook"
  >("Facebook");

  const [showAdPlatformConnectModal, setShowAdPlatformConnectModal] =
    useState(false);

  const actions = useCreateCampaignStore((state) => state.actions);

  const [isLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const token = useAuthStore((state) => state.token);
  const { instagram, facebook, google } = useIntegrationStore((state) => state);
  const integrationActions = useIntegrationStore((state) => state.actions);
  const [socialModalKind, setSocialModalKind] = useState<
    "INSTAGRAM" | "FACEBOOK"
  >("FACEBOOK");

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
    if (!token) return;

    (async () => {
      try {
        const res = await getIntegrationsStatus({ token });
        const status = res?.status;
        if (!status) return;

        integrationActions.setShopifyStoreConnected(
          Boolean(status.shopify?.connected),
        );
        integrationActions.setGoogle(Boolean(status.googleAds?.connected));
        integrationActions.setFacebook(Boolean(status.facebook?.connected));
        integrationActions.setInstagram(Boolean(status.instagram?.connected));
      } catch (e) {
        console.error("Failed to sync integrations status:", e);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!instagram) {
      actions.setAdsPlatform("Instagram", false);
    }

    if (!facebook) {
      actions.setAdsPlatform("Facebook", false);
    }

    if (!google) {
      actions.setAdsPlatform("Google", false);
    }
  }, [instagram, facebook, google]);

  useEffect(() => {
    if (!productSelection.complete) {
      router.push("/create-campaign/");
    }
  }, []);

  const canProceed =
    (supportedAdPlatforms.Google && google) ||
    (supportedAdPlatforms.Instagram && instagram) ||
    (supportedAdPlatforms.Facebook && facebook);

  const handleProceed = () => {
    actions.completeAdsPlatform();

    router.push("/create-campaign/product-kit");
  };

  const handleToggleFacebook = () => {
    if (supportedAdPlatforms.Facebook) {
      actions.toggleAdsPlatform("Facebook");
      return;
    }
    if (!facebook) {
      setSocialModalKind("FACEBOOK");
      setActivePlatform("Facebook");
      setShowAdPlatformConnectModal(true);
      return;
    }
    actions.toggleAdsPlatform("Facebook");
  };
  const handleToggleInstagram = () => {
    if (supportedAdPlatforms.Instagram) {
      actions.toggleAdsPlatform("Instagram");
      return;
    }
    if (!instagram) {
      setSocialModalKind("INSTAGRAM");
      setActivePlatform("Instagram");
      setShowAdPlatformConnectModal(true);
      return;
    }
    actions.toggleAdsPlatform("Instagram");
  };

  const handleToggleGoogle = () => {
    if (supportedAdPlatforms.Google) {
      actions.toggleAdsPlatform("Google");
      return;
    }
    if (!google) {
      router.push(
        `/settings/integrations?platform=GOOGLE&route=create-campaign`,
      );
      return;
    }
    actions.toggleAdsPlatform("Google");
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
                src={isMobile ? GooglePostSM : GooglePostLG}
                alt="google ads platform"
                layout="fill"
                objectFit="cover"
                className={`duration-300 transition-all rounded-3xl ${
                  supportedAdPlatforms.Google && google
                    ? ""
                    : "grayscale opacity-70"
                }`}
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
                supportedAdPlatforms.Google && google
                  ? ""
                  : "grayscale opacity-60"
              }`}
            />
            <Toggle
              on={supportedAdPlatforms.Google && google}
              toggle={handleToggleGoogle}
            />
          </div>
        </div>
        <div className="flex-1 relative w-full">
          <div className="flex w-full items-center  justify-center  rounded-3xl">
            <div className="relative w-full h-[215px] sm:h-[300px] lg:h-[429px] mx-auto">
              <Image
                src={isMobile ? IGPostSM : IGPostLG}
                alt="instagram ads platform"
                layout="fill"
                objectFit="cover"
                className={`duration-300 transition-all rounded-3xl ${
                  supportedAdPlatforms.Instagram && instagram
                    ? ""
                    : "grayscale opacity-70"
                }`}
                placeholder="blur"
              />
            </div>
          </div>
          <div className="flex items-center justify-between lg:mt-5 px-6 h-[50px]">
            <img
              src="/instagram-custom-logo.png"
              alt="Instagram Custom Logo"
              className={`duration-300 transition-all ${
                supportedAdPlatforms.Instagram && instagram
                  ? ""
                  : "grayscale opacity-60"
              }`}
              height={18}
              width={100}
            />
            <Toggle
              on={supportedAdPlatforms.Instagram && instagram}
              toggle={handleToggleInstagram}
            />
          </div>
        </div>
        <div className="flex-1 relative w-full">
          <div className="flex w-full items-center  justify-center  rounded-3xl">
            <div className="relative w-full h-[215px] sm:h-[300px] lg:h-[429px] mx-auto">
              <Image
                src={isMobile ? FacebookPostSM : FacebookPostLG}
                alt="facebook ads platform"
                layout="fill"
                objectFit="cover"
                className={`duration-300 transition-all rounded-3xl ${
                  supportedAdPlatforms.Facebook && facebook
                    ? ""
                    : "grayscale opacity-70"
                }`}
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
                supportedAdPlatforms.Facebook && facebook
                  ? ""
                  : "grayscale opacity-60"
              }`}
            />
            <Toggle
              on={supportedAdPlatforms.Facebook && facebook}
              toggle={handleToggleFacebook}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 md:mt-9 sm:max-w-[200px] mx-auto">
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
      {showAdPlatformConnectModal && (
        <AdPlatformConnect
          platform={activePlatform.toUpperCase() as "FACEBOOK" | "INSTAGRAM"}
          handleClose={() => setShowAdPlatformConnectModal(false)}
          socialModalKind={socialModalKind}
        />
      )}
    </div>
  );
};

export default SupportedAdPlatforms;
