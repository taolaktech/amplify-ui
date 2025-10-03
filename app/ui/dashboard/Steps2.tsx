import { useGetSetupComplete } from "@/app/lib/hooks/useGetSetupComplete";
import useBrandAssetStore from "@/app/lib/stores/brandAssetStore";
import { useIntegrationStore } from "@/app/lib/stores/integrationStore";
import { TickCircle } from "iconsax-react";
import ArrowRightIcon from "@/public/arrow-right-gradient-alt.svg";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Steps2() {
  const { isSetupComplete, link } = useGetSetupComplete();
  const [step, setStep] = useState(1);
  const { primaryLogo, brandGuide, brandGuideName } = useBrandAssetStore(
    (state) => state
  );
  const router = useRouter();

  const { google, instagram, facebook } = useIntegrationStore((state) => state);

  useEffect(() => {
    console.log("isSetupComplete", isSetupComplete, link);
    let step = 1;
    if (primaryLogo && (brandGuide || brandGuideName)) {
      step += 1;
    }
    if (instagram) step += 1;

    if (facebook) step += 1;

    if (google) step += 1;

    if (isSetupComplete) step += 1;
    console.log("step", step);

    setStep(step);
  }, [isSetupComplete, link]);

  const handleUploadBrandKit = () => {
    router.push("/company/brand-assets");
  };

  return (
    <div className=" bg-[rgba(246,246,246,0.75)] p-6 rounded-3xl flex-1 h-full">
      <h2 className="font-medium md:text-xl">Complete your Setup</h2>
      <div className="flex flex-row mt-2 items-center flex-shrink-0">
        <div className="text-xs font-medium text-[#787779] w-[70px]">
          {step} / 5 Steps
        </div>
        <div className="w-full bg-[#E6E6E6] h-[3px] rounded-[2.5px]">
          <div
            style={{
              width: `${(step / 5) * 100}%`,
              backgroundColor: "#27AE60",
              borderRadius: 2.5,
              height: 3,
            }}
          ></div>
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-5">
        <StepsItem
          text="Connect your Store"
          connected={isSetupComplete!}
          action={() => router.push(link!)}
        />
        <StepsItem
          text="Connect to Google Ads"
          connected={google}
          action={() => router.push("/settings/integrations")}
        />
        <StepsItem
          text="Connect your Instagram account"
          connected={instagram}
          action={() => router.push("/settings/integrations")}
        />
        <StepsItem
          text="Connect your Facebook account"
          connected={facebook}
          action={() => router.push("/settings/integrations")}
        />
        <StepsItem
          text="Upload Brand Kit"
          connected={facebook}
          isOptional
          action={handleUploadBrandKit}
        />
      </div>
    </div>
  );
}

const StepsItem = ({
  text,
  connected,
  action,
  isOptional,
}: {
  text: string;
  connected: boolean;
  action: () => void;
  isOptional?: boolean;
}) => {
  return (
    <div className="h-[48px] md:h-[56px] px-4 bg-[#F1F1F1] flex justify-between items-center rounded-xl">
      <div className="flex gap-2 items-center">
        <span className="hidden md:block">
          <TickCircle
            size={connected ? "17.5" : "16"}
            color={connected ? "#BFBFBF" : "#101214"}
            variant={connected ? "Bold" : "Outline"}
          />
        </span>
        <span className="md:hidden">
          <TickCircle
            size={connected ? "12.5" : "12"}
            color={connected ? "#BFBFBF" : "#101214"}
            variant={connected ? "Bold" : "Outline"}
          />
        </span>
        <span className="text-xs md:text-sm font-medium">
          <span className={connected ? "line-through text-[#BFBFBF]" : ""}>
            {text}
          </span>
          {isOptional && (
            <span className="text-xs ml-2 font-normal text-[9px]">
              Optional
            </span>
          )}
        </span>
      </div>
      {!connected && (
        <button
          onClick={action}
          className="w-[85px] md:w-[92px] h-[32px] bg-[#1D0B30] gap-1 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-xs">
            {text === "Upload Brand Kit" ? "Upload" : "Connect"}
          </span>
          <ArrowRightIcon />
        </button>
      )}
      {connected && (
        <div
          className={`w-[92px] h-[32px] justify-center rounded-full flex items-center gap-1 ${
            connected ? "bg-[#EAF7EF]" : "bg-[#FFECED]"
          }`}
        >
          <span className={`w-2 h-2 rounded-full bg-[#27AE60]`}></span>{" "}
          <span className={`text-xs font-medium text-[#27AE60]`}>
            Connected
          </span>
        </div>
      )}
    </div>
  );
};
