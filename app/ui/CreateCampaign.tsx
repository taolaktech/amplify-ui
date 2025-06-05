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
  const { adsShow, actions, productSelection } = useCreateCampaignStore(
    (state) => state
  );
  const [step, setStep] = useState(1);

  useEffect(() => {
    actions.reset();
  }, []);

  useEffect(() => {
    if (adsShow.complete && pathname.includes("product-selection")) {
      setStep(2);
    }
  }, [adsShow.complete, productSelection.complete, pathname]);

  const handleBack = () => {
    if (step == 2) {
      setStep(1);
      router.push("/create-campaign");
    } else {
      router.back();
    }
  };

  return (
    <div>
      <ProgressBar width={(step / 6) * 100} />
      <div className="flex items-center h-[40px] justify-between">
        <button onClick={() => handleBack()}>
          {step > 1 && <ArrowLeft />}
        </button>
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
