"use client";
import { TickCircle, Next } from "iconsax-react";
import { useSetupStore } from "../lib/stores/setupStore";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NextSM from "@/public/next-sm.svg";
import ArrowLeftIcon from "@/public/arrow-left.svg";
import OnboadingSuccess from "./OnboadingSuccess";
import useUIStore from "../lib/stores/uiStore";
// import ProgressBar from "./ProgressBar";

function SetupSideBar() {
  const { connectStore, businessDetails, preferredSalesLocation } =
    useSetupStore();
  const { setOnboardingCompleted } = useUIStore((state) => state.actions);
  const isOnboardingCompleted = useUIStore(
    (state) => state.isOnboardingCompleted
  );
  const [step] = useState(1);
  const { setProgressStep } = useUIStore((state) => state.actions);
  const [stepText, setStepText] = useState("Connect your Store");
  const [lineProgress, setLineProgress] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const onboarding = searchParams.get("onboarding");

  const isCompleted = onboarding === "success" && isOnboardingCompleted;
  const pathname = usePathname().trim().replace(/\/$/, "");

  useEffect(() => {
    return () => {
      setOnboardingCompleted(false);
    };
  }, []);

  useEffect(() => {
    let step = 1;

    let lineProgress = 0;
    if (preferredSalesLocation && pathname === "/setup/marketing-goals") {
      lineProgress = 100;
      step = 4;
      setStepText("Marketing Goals");
    } else if (
      businessDetails.complete &&
      pathname === "/setup/preferred-sales-location"
    ) {
      lineProgress = 66.66;
      step = 3;
      setStepText("Preferred Sales Location");
    } else if (
      connectStore.complete &&
      pathname === "/setup/business-details"
    ) {
      lineProgress = 33.33;
      step = 2;
      setStepText("Business Details");
    } else if (pathname === "/setup") {
      lineProgress = 0;
      step = 1;
      setStepText("Connect your Store");
    } else {
      router.replace("/setup");
      lineProgress = 0;
      step = 1;
      setStepText("Connect your Store");
    }
    setLineProgress(lineProgress);
    setProgressStep(step, 4);
  }, [connectStore, businessDetails, preferredSalesLocation, pathname]);

  return (
    <>
      <div>
        <div className="hidden xl:block w-[402px] px-5 pt-[115px] bg-[#FBFAFC] h-screen fixed top-0 left-0 bottom-0">
          <div className="bg-[#F3EFF6] rounded-[20px] gap-4 py-6 px-7 relative flex items-center max-w-[330px] mx-auto">
            <div className="relative size-16">
              <svg
                className="size-full -rotate-90"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-current text-[#FBFAFC]"
                  strokeWidth="2"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-current text-[#27AE60]"
                  strokeWidth="2"
                  strokeDasharray="100"
                  strokeDashoffset={((step / 4) * 100 - 100) * -1}
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <span className="text-center text-heading num">{step}/4</span>
              </div>
            </div>

            <div>
              <h1 className="text-xl text-heading font-medium ">
                Setup your Account
              </h1>
              <div className="mt-2">
                <button className="bg-white rounded-xl h-[34px] w-[102px] flex items-center justify-center gap-1 custom-shadow-sm transition duration-200 ease-in-out">
                  <span className="text-xs">Skip Setup</span>
                  <Next size="14" color="#1D0B30" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 w-[330px] mx-auto px-10">
            <div className="relative">
              {/* Step connector line */}
              <div
                className="absolute top-6 left-4 bottom-10 w-[1.5px]"
                style={{
                  background: `linear-gradient(to bottom, #D0B0F3 ${lineProgress}%, #d1d5db ${lineProgress}%)`,
                }}
              ></div>

              {/* Step 1 */}
              <div className="flex mb-8 relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FBFAFC] z-5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center ">
                    <TickCircle
                      size={24}
                      color={step >= 1 ? "#D0B0F3" : "#BFBFBF"}
                      variant={step >= 1 ? "Bold" : "Linear"}
                    />
                  </div>
                </div>
                <div className="ml-1 pt-2">
                  <div
                    className={`text-xs ${
                      step >= 0 ? "text-black" : "text-gray-light"
                    } font-medium`}
                  >
                    STEP 1
                  </div>
                  <div
                    className={`font-medium ${
                      step >= 0 ? "text-purple-dark" : "text-gray-light"
                    }`}
                  >
                    Connect your Store
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex mb-8 relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FBFAFC] z-5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center ">
                    <TickCircle
                      size={24}
                      color={step >= 2 ? "#D0B0F3" : "#BFBFBF"}
                      variant={step >= 2 ? "Bold" : "Linear"}
                    />
                  </div>
                </div>
                <div className="ml-1 pt-2">
                  <div
                    className={`text-xs ${
                      step >= 2 ? "text-black" : "text-gray-light"
                    } font-medium`}
                  >
                    STEP 2
                  </div>
                  <div
                    className={`font-medium ${
                      step >= 2 ? "text-purple-dark" : "text-gray-light"
                    }`}
                  >
                    Business Details
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex mb-8 relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FBFAFC] z-5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center ">
                    <TickCircle
                      size={24}
                      color={step >= 3 ? "#D0B0F3" : "#BFBFBF"}
                      variant={step >= 3 ? "Bold" : "Linear"}
                    />
                  </div>
                </div>
                <div className="ml-1 pt-2">
                  <div
                    className={`text-xs ${
                      step >= 3 ? "text-black" : "text-gray-light"
                    } font-medium`}
                  >
                    STEP 3
                  </div>
                  <div
                    className={`font-medium ${
                      step >= 3 ? "text-purple-dark" : "text-gray-light"
                    }`}
                  >
                    Preferred Sales Location
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FBFAFC] z-5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center ">
                    <TickCircle
                      size={24}
                      color={step >= 4 ? "#D0B0F3" : "#BFBFBF"}
                      variant={step >= 4 ? "Bold" : "Linear"}
                    />
                  </div>
                </div>
                <div className="ml-1 pt-2">
                  <div
                    className={`text-xs ${
                      step >= 4 ? "text-black" : "text-gray-light"
                    } font-medium`}
                  >
                    STEP 4
                  </div>
                  <div
                    className={`font-medium ${
                      step >= 4 ? "text-purple-dark" : "text-gray-light"
                    }`}
                  >
                    Marketing Goals
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <ProgressBar width={(step / 4) * 100} /> */}
        <div className="px-5 mt-12 xl:hidden">
          <div className="flex items-center justify-between mb-3">
            <GoBack />
            <button className="bg-[#FBFAFC] rounded-xl py-2 px-4 flex items-center justify-center gap-1">
              <span className="text-xs">Skip Setup</span>
              <NextSM width="12" height="12" />
            </button>
          </div>
          <div className="text-xs rounded-3xl bg-[#F3EFF6] py-2.5 px-5 inline-block">
            STEP{` ${step}`}/4 - {stepText}
          </div>
        </div>
      </div>
      {isCompleted && (
        <div className="fixed z-10 top-[54px] left-0 right-0 bottom-0 min-h-[calc(100vh-54px)] bg-white">
          <OnboadingSuccess />
        </div>
      )}
    </>
  );
}

export default SetupSideBar;

const goBackPaths = new Map()
  .set("/setup", "/setup")
  .set("/setup/business-details", "/setup")
  .set("/setup/preferred-sales-location", "/setup/business-details")
  .set("/setup/marketing-goals", "/setup/preferred-sales-location");

export function GoBack() {
  const pathname = usePathname().trim().replace(/\/$/, "");

  const router = useRouter();

  return (
    <div
      className={`${
        pathname === "/setup" ? "invisible" : "visible"
      } flex items-center `}
    >
      <button
        onClick={() => router.push(goBackPaths.get(pathname))}
        className="bg-white transition-colors duration-300 ease-in-out hover:bg-[#F3EFF6] rounded-lg gap-[2px] py-2 px-3 -ml-[6px] flex items-center justify-center"
      >
        <ArrowLeftIcon width={20} height={20} className="-ml-2" />
        <span className="text-sm font-medium">Go Back</span>
      </button>
    </div>
  );
}
