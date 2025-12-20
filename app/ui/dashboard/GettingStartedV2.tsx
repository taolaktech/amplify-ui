"use client";
import HomeTrendIcon from "@/public/dashboard-home-trend-up.svg";
import { CloseCircle, Notification } from "iconsax-react";
import { useState } from "react";
import Button from "../Button";
import Image from "next/image";
import StepsV2 from "./StepsV2";

function GettingStartedV2() {
  const [cancelNotification, setCancelNotification] = useState(false);
  const [stepsComplete, setStepsComplete] = useState(false);

  const firstName = "Unknown";

  const handleStartCampaign = () => {
    console.log("Start Campaign clicked");
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-lg lg:text-2xl">
            Welcome {firstName} 👋
          </p>
          <p className="text-sm lg:text-base">
            Let's start growing your business.
          </p>
        </div>
      </div>
      {!stepsComplete && (
        <div
          className={`${
            cancelNotification
              ? "h-0 opacity-0"
              : "h-[112px] sm:h-[84px] lg:h-[108px] opacity-100"
          } transition-all duration-300`}
        >
          <div className="bg-[#FEF5EA] p-5 lg:p-7 rounded-2xl flex flex-row w-full items-center justify-between gap-3 lg:gap-0">
            <div className="flex w-full gap-3 lg:gap-4 items-start lg:items-center">
              <span className="w-[44px] h-[44px] flex-shrink-0 bg-[#FDE0BD] flex items-center justify-center rounded-full">
                <Notification size={24} color="#FA9B0C" variant="Bold" />
              </span>
              <div>
                <p className="text-[#C67B22] text-sm lg:text-xl font-medium mb-1">
                  You're almost there!
                </p>
                <p className="text-xs lg:text-sm w-full">
                  <span className="underline font-medium cursor-pointer">
                    Complete your campaign setup
                  </span>{" "}
                  to start running ads and reach your audience effectively.
                </p>
              </div>
            </div>
            <button onClick={() => setCancelNotification(true)} className="">
              <CloseCircle size={24} color="#333" />
            </button>
          </div>
        </div>
      )}
      {!stepsComplete && (
        <div className="h-[280px] md:h-[320px] flex gap-2">
          <div className="w-[100%] h-full">
            <StepsV2 />
          </div>
          <div className="hidden relative flex-col xl:flex w-full overflow-hidden max-w-[400px] bg-[#1D0B30] rounded-3xl p-8">
            <div>
              <HomeTrendIcon width={34} height={34} />
              <span className="absolute bottom-0 z-[1] right-0">
                <Image
                  alt="chart"
                  src={"/chart.png"}
                  width={276}
                  height={276}
                />
              </span>
              <h1 className="text-4xl mt-3 font-extrabold bg-gradient-to-r max-w-[300px] from-[#A755FF] to-[#6800D7] bg-clip-text text-transparent">
                Ready to Amplify Your Sales?
              </h1>
              <p className="text-sm text-white mt-2 max-w-[220px]">
                Kickstart your first campaign and watch your conversions grow.
              </p>
            </div>
            <div className="max-w-[140px] z-[2] mt-auto">
              <Button
                text="Start Campaign"
                height={50}
                action={handleStartCampaign}
                secondary
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GettingStartedV2;
