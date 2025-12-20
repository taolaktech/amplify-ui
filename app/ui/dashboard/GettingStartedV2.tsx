"use client";
import HomeTrendIcon from "@/public/dashboard-home-trend-up.svg";
import { useState } from "react";
import Button from "../Button";
import Image from "next/image";
import StepsV2 from "./StepsV2";

function GettingStartedV2() {
  const [stepsComplete, setStepsComplete] = useState(false);

  const handleStartCampaign = () => {
    console.log("Start Campaign clicked");
  };

  return (
    <div className="flex flex-col gap-7">
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
