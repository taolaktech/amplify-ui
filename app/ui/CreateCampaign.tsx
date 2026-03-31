"use client";
import { ArrowLeft } from "iconsax-react";
import XCloseIcon from "@/public/x-close-big.svg";
import XCloseIconSM from "@/public/x-close.svg";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "../lib/stores/authStore";
import CreditUsageWidget from "./usage/CreditUsageWidget";
import { getUsageLimits } from "./usage/usageLimits";
import { getSubscriptionUsageSummary } from "../lib/api/base";
import { useCreateCampaignStore } from "../lib/stores/createCampaignStore";
import useUIStore from "../lib/stores/uiStore";

export default function CreateCampaign({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const subscriptionType = useAuthStore((s) => s.subscriptionType);
  const subscriptionEndDate = useAuthStore((s) => s.subscriptionEndDate);
  const creditUsageRefreshTrigger = useAuthStore(
    (s) => s.creditUsageRefreshTrigger,
  );
  const { currentProgressStep } = useUIStore((state) => state);
  const setProgressStep = useUIStore((state) => state.actions.setProgressStep);
  const { adsShow, productSelection } = useCreateCampaignStore(
    (state) => state,
  );
  const supportedAdPlatforms = useCreateCampaignStore(
    (state) => state.supportedAdPlatforms,
  );
  // const [step, setStep] = useState(1);
  const [backText, setBackText] = useState("");
  const [route, setRoute] = useState("");

  const showCreditWidget =
    pathname.includes("campaign-snapshots") ||
    pathname.includes("choose-ad-style") ||
    pathname.includes("creative-ready");

  const planName = (() => {
    const n = (subscriptionType as any)?.name;
    if (!n) return "Starter";
    if (typeof n === "string") return n;
    return "Starter";
  })();

  const [creditsRemaining, setCreditsRemaining] = useState<number>(() => {
    const limits = getUsageLimits(planName);
    return limits.creditsLimit;
  });

  const [creditsLimit, setCreditsLimit] = useState<number>(() => {
    const limits = getUsageLimits(planName);
    return limits.creditsLimit;
  });

  useEffect(() => {
    if (!token) return;
    if (!showCreditWidget) return;

    const controller = new AbortController();

    const fetchUsage = async () => {
      const summary = await getSubscriptionUsageSummary({
        token,
        signal: controller.signal,
      });

      if (!summary) return;

      if (
        typeof summary.creditsRemaining === "number" &&
        Number.isFinite(summary.creditsRemaining)
      ) {
        setCreditsRemaining(summary.creditsRemaining);
      }

      if (
        typeof summary.creditsLimit === "number" &&
        Number.isFinite(summary.creditsLimit)
      ) {
        setCreditsLimit(summary.creditsLimit);
      }
    };

    fetchUsage();
    return () => controller.abort();
  }, [token, creditUsageRefreshTrigger, planName, showCreditWidget]);

  useEffect(() => {
    // actions.reset();
    setProgressStep(1, 8);
  }, []);

  useEffect(() => {
    if (pathname.includes("review")) {
      setProgressStep(8, 8);
      setBackText("Campaign Snapshot");
      setRoute("/create-campaign/campaign-snapshots");
      return;
    }

    if (pathname.includes("fund-campaign")) {
      setProgressStep(7, 8);
      setBackText("Campaign Snapshots");
      setRoute("/create-campaign/campaign-snapshots");
      return;
    }

    if (pathname.includes("campaign-snapshots")) {
      setProgressStep(6, 8);
      if (!supportedAdPlatforms.Facebook) {
        setBackText("Supported Ad Platforms");
        setRoute("/create-campaign/supported-ad-platforms");
        return;
      }
      setBackText("Creative Ready");
      setRoute("/create-campaign/creative-ready");
      return;
    }

    if (pathname.includes("creative-ready")) {
      setProgressStep(6, 8);
      setBackText("Choose Ad Style");
      setRoute("/create-campaign/choose-ad-style");
      return;
    }

    if (pathname.includes("choose-ad-style")) {
      setProgressStep(5, 8);
      setBackText("Product Kit");
      setRoute("/create-campaign/product-kit");
      return;
    }

    if (pathname.includes("product-kit")) {
      setProgressStep(4, 8);
      setBackText("Supported Ad Platforms");
      setRoute("/create-campaign/supported-ad-platforms");
      return;
    }

    if (
      productSelection.complete &&
      pathname.includes("supported-ad-platforms")
    ) {
      setProgressStep(3, 8);
      setBackText("Select Products");
      setRoute("/create-campaign/product-selection");
      return;
    }

    if (adsShow.complete && pathname.includes("product-selection")) {
      setProgressStep(2, 8);
      setBackText("Create Campaign");
      setRoute("/create-campaign");
      return;
    }

    setProgressStep(1, 8);
    setBackText("");
    setRoute("");
  }, [
    adsShow.complete,
    productSelection.complete,
    pathname,
    supportedAdPlatforms.Facebook,
  ]);

  const handleBack = () => {
    router.push(route);
  };

  return (
    <div>
      {/* <ProgressBar width={(step / 6) * 100} /> */}
      <div
        className={`flex px-5 items-center h-[40px] mt-6 ${
          currentProgressStep > 1 ? "justify-between" : "justify-end"
        }`}
      >
        <>
          {currentProgressStep > 1 && (
            <button
              className="flex items-center cursor-pointer gap-2"
              onClick={handleBack}
            >
              <ArrowLeft size={24} color="#333" className="hidden md:block" />
              <ArrowLeft size={20} color="#333" className="block md:hidden" />
              <span className="text-sm md:text-lg tracking-250 font-medium">
                {backText}
              </span>
            </button>
          )}
        </>
        <div className="flex items-center gap-3">
          {showCreditWidget && (
            <CreditUsageWidget
              planName={planName}
              nextResetDate={subscriptionEndDate}
              creditsRemaining={creditsRemaining}
              creditsLimit={creditsLimit}
              token={token}
            />
          )}
          <button
            className="flex py-2 px-2 items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <XCloseIcon width={24} height={24} className="hidden md:block" />
            <XCloseIconSM width={16} height={16} className="block md:hidden" />
            <span className="text-sm font-medium">Close</span>
          </button>
        </div>
      </div>
      <main
        className={`${
          pathname.includes("campaign-snapshots") ||
          pathname.includes("product-kit") ||
          pathname.includes("choose-ad-style") ||
          pathname.includes("creative-ready")
            ? ""
            : "px-5"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
