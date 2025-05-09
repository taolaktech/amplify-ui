import ChartIcon from "@/public/chart.svg";
import HomeTrendIcon from "@/public/dashboard-home-trend-up.svg";
import DefaultButton from "../Button";
import { CloseCircle, Notification } from "iconsax-react";
import { useAuthStore } from "@/app/lib/stores/authStore";
import Steps from "./Steps";
import { useState } from "react";

function GettingStarted() {
  const user = useAuthStore((state) => state.user);
  const [cancelNotification, setCancelNotification] = useState(false);

  const firstName = user?.name?.split(" ")[0] || "Unknown";
  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="font-semibold text-2xl">Welcome {firstName} 👋</p>
        <p>Let's get you setup</p>
      </div>
      {!cancelNotification && (
        <div className="bg-[#FEF5EA] p-7 rounded-2xl flex flex-col-reverse lg:flex-row w-full items-center justify-between">
          <div className="flex gap-4 items-center">
            <span className="w-[44px] h-[44px] flex-shrink-0 bg-[#FDE0BD] flex items-center justify-center rounded-full">
              <Notification size={24} color="#FA9B0C" variant="Bold" />
            </span>
            <div>
              <p className="text-[#C67B22] text-xl font-medium mb-1">
                You're almost there!
              </p>
              <p>
                Complete your campaign setup to start running ads and reach your
                audience effectively.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCancelNotification(true)}
            className="mb-3 lg:mb-0 ml-auto lg:ml-0"
          >
            <CloseCircle size={24} color="#333" />
          </button>
        </div>
      )}
      <div className="h-[390px] lg:h-[326px] flex gap-2 overflow-hidden">
        <div className="bg-gradient relative w-full rounded-3xl ">
          <Steps />
          <div className="absolute top-0 right-0 translate-x-[25%] -translate-y-[35%] bg-[rgba(255,255,255,0.05)] h-[610px] w-[610px] flex items-center justify-center rounded-full">
            <div className="bg-[rgba(255,255,255,0.05)] h-[474px] w-[474px] flex items-center justify-center rounded-full">
              <div className="bg-[rgba(255,255,255,0.05)] h-[327px] w-[327px] rounded-full"></div>
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
            <DefaultButton secondary text="Start Campaign" showShadow />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GettingStarted;
