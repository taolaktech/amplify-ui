import HomeTrendIcon from "@/public/dashboard-home-trend-up.svg";
import { CloseCircle, Notification } from "iconsax-react";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useState } from "react";
import { useCampaignsActions } from "@/app/lib/hooks/campaigns";
import Button from "../Button";
import Link from "next/link";
import Image from "next/image";
import Steps from "./Steps";
import { useGetSetupComplete } from "@/app/lib/hooks/useGetSetupComplete";

function GettingStarted() {
  const user = useAuthStore((state) => state.user);
  const [cancelNotification, setCancelNotification] = useState(false);
  const { navigateToCreateCampaign } = useCampaignsActions();
  const { isSetupComplete, link } = useGetSetupComplete();

  const firstName = user?.name?.split(" ")[0] || "Unknown";
  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="font-semibold text-lg lg:text-2xl">
          Welcome {firstName} 👋
        </p>
        <p className="text-sm lg:text-base">
          Let's start growing your business.
        </p>
      </div>
      {!isSetupComplete && (
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
                  <Link href={link} className="underline font-medium">
                    Complete your campaign setup
                  </Link>{" "}
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
      <div className="h-[377px] md:h-[416px] flex gap-2  ">
        <div className="w-[100%] h-full">
          <Steps />
        </div>
        {/* <div className="bg-gradient relative w-full rounded-3xl overflow-hidden arrow-shadow">
          <Steps />
          <div className="absolute top-0 right-0 translate-x-[25%] -translate-y-[35%] bg-[rgba(255,255,255,0.05)] h-[305px] w-[305px] md:h-[610px] md:w-[610px] flex items-center justify-center rounded-full">
            <div className="bg-[rgba(255,255,255,0.05)] h-[237px] w-[237px] md:h-[474px] md:w-[474px] flex items-center justify-center rounded-full">
              <div className="bg-[rgba(255,255,255,0.05)] h-[163.5px] w-[163.5px] md:h-[327px] md:w-[327px] rounded-full"></div>
            </div>
          </div>
        </div> */}
        <div className="hidden relative flex-col xl:flex w-full overflow-hidden max-w-[400px] bg-[#1D0B30] rounded-3xl p-8">
          <div>
            <HomeTrendIcon width={34} height={34} />
            <span className="absolute bottom-0 z-[1] right-0">
              {/* <ChartIcon width={226} height={226} />
               */}
              <Image alt="chart" src={"/chart.png"} width={276} height={276} />
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
              action={navigateToCreateCampaign}
              secondary
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GettingStarted;
