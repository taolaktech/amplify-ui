import ChartIcon from "@/public/chart.svg";
import HomeTrendIcon from "@/public/dashboard-home-trend-up.svg";
// import DefaultButton from "../Button";
import { CloseCircle, Notification } from "iconsax-react";
import { useAuthStore } from "@/app/lib/stores/authStore";
import Steps from "./Steps";
import { useState } from "react";
import DefaultLink from "../DefaultLink";

function GettingStarted() {
  const user = useAuthStore((state) => state.user);
  const [cancelNotification, setCancelNotification] = useState(false);

  const firstName = user?.name?.split(" ")[0] || "Unknown";
  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="font-semibold text-lg lg:text-2xl">
          Welcome {firstName} 👋
        </p>
        <p className="text-sm lg:text-base">Let's get you setup</p>
      </div>
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
                Complete your campaign setup to start running ads and reach your
                audience effectively.
              </p>
            </div>
          </div>
          <button onClick={() => setCancelNotification(true)} className="">
            <CloseCircle size={24} color="#333" />
          </button>
        </div>
      </div>
      <div className="h-[390px] lg:h-[326px] flex gap-2 overflow-hidden">
        <div className="bg-gradient relative w-full rounded-3xl ">
          <Steps />
          <div className="absolute top-0 right-0 translate-x-[25%] -translate-y-[35%] bg-[rgba(255,255,255,0.05)] h-[305px] w-[305px] md:h-[610px] md:w-[610px] flex items-center justify-center rounded-full">
            <div className="bg-[rgba(255,255,255,0.05)] h-[237px] w-[237px] md:h-[474px] md:w-[474px] flex items-center justify-center rounded-full">
              <div className="bg-[rgba(255,255,255,0.05)] h-[163.5px] w-[163.5px] md:h-[327px] md:w-[327px] rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="hidden relative  flex-col xl:flex w-full max-w-[291px] bg-[#F0E6FB] rounded-2xl p-8">
          <div>
            <HomeTrendIcon width={34} height={34} />
            <span className="absolute bottom-0 right-0">
              <ChartIcon width={126} height={126} />
            </span>
            <h1 className="text-2xl mt-3 font-bold bg-gradient-to-r from-[#A755FF] to-[#6800D7] bg-clip-text text-transparent">
              Ready to Amplify Your Sales?
            </h1>
            <p className="text-sm mt-2">
              Kickstart your first campaign and watch your conversions grow.
            </p>
          </div>
          <div className="max-w-[130px] mt-auto">
            <DefaultLink
              secondary
              text="Start Campaign"
              href="/create-campaign"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GettingStarted;
