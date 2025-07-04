"use client";
import { ArrowLeft } from "iconsax-react";
import ProgressBar from "./ProgressBar";
import XCloseIcon from "@/public/x-close-big.svg";
import XCloseIconSM from "@/public/x-close.svg";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCreateCampaignStore } from "../lib/stores/createCampaignStore";

export default function CreateCampaign({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { adsShow, actions, productSelection, supportedAdPlatforms } =
    useCreateCampaignStore((state) => state);
  const [step, setStep] = useState(1);
  const [backText, setBackText] = useState("");

  useEffect(() => {
    actions.reset();
  }, []);

  useEffect(() => {
    if (pathname.includes("fund-campaign")) {
      setStep(5);
      setBackText("Campaign Snapshots");
    } else if (
      supportedAdPlatforms.complete &&
      pathname.includes("campaign-snapshots")
    ) {
      setStep(4);
      setBackText("Supported Ad Platforms");
    } else if (
      productSelection.complete &&
      pathname.includes("supported-ad-platforms")
    ) {
      setStep(3);
      setBackText("Select Products");
    } else if (adsShow.complete && pathname.includes("product-selection")) {
      setStep(2);
      setBackText("Create Campaign");
    } else {
      setStep(1);
      setBackText("");
    }
  }, [adsShow.complete, productSelection.complete, pathname]);

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <ProgressBar width={(step / 6) * 100} />
      <div
        className={`flex items-center h-[40px] mt-6 ${
          step > 1 ? "justify-between" : "justify-end"
        }`}
      >
        <>
          {step > 1 && (
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
          onClick={() => router.push("/dashboard")}
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
