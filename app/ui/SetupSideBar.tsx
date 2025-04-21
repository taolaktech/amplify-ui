"use client";
import { TickCircle, Next } from "iconsax-react";
import { useSetupStore } from "../lib/stores/setupStore";
import { useEffect, useState } from "react";

function SetupSideBar() {
  const { connectStore, businessDetails } = useSetupStore();
  const [step, setStep] = useState(1);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    let step = 1;
    let lineProgress = 0;
    if (connectStore) {
      step += 1;
      lineProgress += 33.33;
    }
    if (businessDetails) {
      step += 1;
      lineProgress += 33.33;
    }
    setLineProgress(lineProgress);
    setStep(step);
  }, [connectStore, businessDetails]);

  return (
    <div className="w-[402px] px-5 bg-[#FBFAFC] min-h-[calc(100vh-56px)] pt-18">
      <div className="bg-[#F3EFF6] rounded-[20px] gap-4 py-6 px-8 relative flex items-center w-[330px] mx-auto">
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
              strokeDashoffset={100 - (step / 4) * 100}
              strokeLinecap="round"
            ></circle>
          </svg>
          <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <span className="text-center text-heading ">{step}/4</span>
          </div>
        </div>

        <div>
          <h1 className="text-xl text-heading font-medium">
            Setup your Account
          </h1>
          <div className="mt-2">
            <button className="bg-white rounded-xl h-[34px] w-[102px] flex items-center justify-center gap-1 hover:bg-gray-50 transition duration-200 ease-in-out">
              <span className="text-xs">Skip Setup</span>
              <Next size="14" color="#1D0B30" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 w-[330px] mx-auto px-11">
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
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FBFAFC] z-10">
              <div className="w-6 h-6 rounded-full flex items-center justify-center ">
                <TickCircle
                  width="24"
                  height="24"
                  color={step >= 1 ? "#D0B0F3" : "#BFBFBF"}
                  variant={step >= 1 ? "Bold" : "Linear"}
                />
              </div>
            </div>
            <div className="ml-1 pt-2">
              <div className="text-xs text-gray-light font-medium">STEP 1</div>
              <div className="font-medium text-gray-light">
                Connect your Store
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex mb-8 relative">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FBFAFC] z-10">
              <div className="w-6 h-6 rounded-full flex items-center justify-center ">
                <TickCircle
                  width="24"
                  height="24"
                  color={step >= 2 ? "#D0B0F3" : "#BFBFBF"}
                  variant={step >= 2 ? "Bold" : "Linear"}
                />
              </div>
            </div>
            <div className="ml-1 pt-2">
              <div className="text-xs text-gray-light font-medium">STEP 2</div>
              <div className="font-medium text-gray-light">
                Business Details
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex mb-8 relative">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FBFAFC] z-10">
              <div className="w-6 h-6 rounded-full flex items-center justify-center ">
                <TickCircle
                  width="24"
                  height="24"
                  color={step >= 3 ? "#D0B0F3" : "#BFBFBF"}
                  variant={step >= 3 ? "Bold" : "Linear"}
                />
              </div>
            </div>
            <div className="ml-1 pt-2">
              <div className="text-xs text-gray-light font-medium">STEP 3</div>
              <div className="font-medium text-gray-light">
                Preferred Sales Location
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex relative">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FBFAFC] z-10">
              <div className="w-6 h-6 rounded-full flex items-center justify-center ">
                <TickCircle
                  width="24"
                  height="24"
                  color={step >= 4 ? "#D0B0F3" : "#BFBFBF"}
                  variant={step >= 4 ? "Bold" : "Linear"}
                />
              </div>
            </div>
            <div className="ml-1 pt-2">
              <div className="text-xs text-gray-light">STEP 4</div>
              <div className="font-medium text-gray-light">Business Goal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupSideBar;
