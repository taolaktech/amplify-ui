"use client";
import { ArrowLeft } from "iconsax-react";
import XCloseIcon from "@/public/x-close-big.svg";
import XCloseIconSM from "@/public/x-close.svg";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCreateCampaignStore } from "../lib/stores/createCampaignStore";
import useUIStore from "../lib/stores/uiStore";

export default function CreateCampaign({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentProgressStep } = useUIStore((state) => state);
  const setProgressStep = useUIStore((state) => state.actions.setProgressStep);
  const { adsShow, productSelection, supportedAdPlatforms } =
    useCreateCampaignStore((state) => state);
  // const [step, setStep] = useState(1);
  const [backText, setBackText] = useState("");
  const [route, setRoute] = useState("");

  useEffect(() => {
    // actions.reset();
    setProgressStep(1, 6);
  }, []);

  useEffect(() => {
    if (pathname.includes("review")) {
      setProgressStep(6, 6);
      setBackText("Fund Campaign");
      setRoute("/create-campaign/fund-campaign");
    } else if (pathname.includes("fund-campaign")) {
      setProgressStep(5, 6);
      setBackText("Campaign Snapshots");
      setRoute("/create-campaign/campaign-snapshots");
    } else if (
      supportedAdPlatforms.complete &&
      pathname.includes("campaign-snapshots")
    ) {
      setProgressStep(4, 6);
      setBackText("Supported Ad Platforms");
      setRoute("/create-campaign/supported-ad-platforms");
    } else if (
      productSelection.complete &&
      pathname.includes("supported-ad-platforms")
    ) {
      setProgressStep(3, 6);
      setBackText("Select Products");
      setRoute("/create-campaign/product-selection");
    } else if (adsShow.complete && pathname.includes("product-selection")) {
      setProgressStep(2, 6);
      setBackText("Create Campaign");
      setRoute("/create-campaign/create-campaign");
    } else {
      setProgressStep(1, 6);
      setBackText("");
    }
  }, [adsShow.complete, productSelection.complete, pathname]);

  const handleBack = () => {
    router.push(route);
  };

  return (
    <div>
      {/* <ProgressBar width={(step / 6) * 100} /> */}
      <div
        className={`flex items-center h-[40px] mt-6 ${
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
        <button
          className="flex py-2 px-2 items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <XCloseIcon width={24} height={24} className="hidden md:block" />
          <XCloseIconSM width={16} height={16} className="block md:hidden" />
          <span className="text-sm font-medium">Close</span>
        </button>
      </div>
      <main>{children}</main>
    </div>
  );
}
