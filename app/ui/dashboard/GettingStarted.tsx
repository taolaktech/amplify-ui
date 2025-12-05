"use client";
import HomeTrendIcon from "@/public/dashboard-home-trend-up.svg";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useCampaignsActions } from "@/app/lib/hooks/campaigns";
import Button from "../Button";
import Image from "next/image";
import Steps2 from "./Steps2";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useIntegrationStore } from "@/app/lib/stores/integrationStore";
import { useMemo } from "react";

function GettingStarted() {
  const user = useAuthStore((state) => state.user);
  const { navigateToCreateCampaign } = useCampaignsActions();

  // Get completion states from setupStore
  const { businessDetails, preferredSalesLocation, marketingGoals } =
    useSetupStore();

  const { instagram, facebook } = useIntegrationStore();

  const firstName = user?.name?.split(" ")[0] || "Unknown";

  // Check if all steps are completed
  const allCompleted = useMemo(() => {
    return (
      businessDetails.complete &&
      preferredSalesLocation.complete &&
      marketingGoals.complete &&
      instagram &&
      facebook
    );
  }, [
    businessDetails.complete,
    preferredSalesLocation.complete,
    marketingGoals.complete,
    instagram,
    facebook,
  ]);

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="font-semibold text-lg lg:text-2xl">
          Welcome {firstName} 👋
        </p>
        <p className="text-sm lg:text-base">
          {allCompleted ? "Your setup is complete!" : "Let's get you setup"}
        </p>
      </div>

      {/* SETUP INCOMPLETE - Show both cards side by side on desktop, stacked on mobile */}
      {!allCompleted ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Steps2 - Setup Progress Card */}
          <div className="w-full lg:w-2/3">
            <Steps2 />
          </div>

          {/* Right Card - Campaign Card - Shows on ALL screens when setup incomplete */}
          <div className="w-full lg:w-1/3">
            <div className="relative w-full bg-[#1D0B30] rounded-3xl p-6 h-full">
              <div className="flex flex-col h-full justify-between">
                {/* Top Content with Home Icon Above Text */}
                <div className="flex-1">
                  {/* Home Icon */}
                  <div className="mb-3">
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.4"
                        d="M30.0601 10.2295L21.4201 4.18454C19.0651 2.53454 15.4501 2.62454 13.1851 4.37954L5.67011 10.2445C4.17011 11.4145 2.98511 13.8145 2.98511 15.7045V26.0545C2.98511 29.8795 6.09011 32.9995 9.91511 32.9995H26.0851C29.9101 32.9995 33.0151 29.8945 33.0151 26.0695V15.8995C33.0151 13.8745 31.7101 11.3845 30.0601 10.2295Z"
                        fill="url(#paint0_linear_4326_7781)"
                      />
                      <path
                        d="M25.245 16.9048C25.14 16.6498 24.93 16.4398 24.675 16.3348C24.54 16.2748 24.405 16.2598 24.27 16.2598H21.48C20.895 16.2598 20.43 16.7248 20.43 17.3098C20.43 17.8948 20.895 18.3598 21.48 18.3598H21.75L18.585 21.5248L17.055 19.2448C16.875 18.9898 16.605 18.8098 16.29 18.7798C15.96 18.7498 15.675 18.8548 15.45 19.0798L10.98 23.5498C10.575 23.9548 10.575 24.6148 10.98 25.0348C11.19 25.2448 11.445 25.3348 11.715 25.3348C11.985 25.3348 12.255 25.2298 12.45 25.0348L16.02 21.4648L17.55 23.7448C17.73 23.9998 18 24.1798 18.315 24.2098C18.645 24.2398 18.93 24.1348 19.155 23.9098L23.235 19.8298V20.0998C23.235 20.6848 23.7 21.1498 24.285 21.1498C24.87 21.1498 25.335 20.6848 25.335 20.0998V17.3098C25.32 17.1598 25.305 17.0248 25.245 16.9048Z"
                        fill="url(#paint1_linear_4326_7781)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_4326_7781"
                          x1="9.68194"
                          y1="7.92041"
                          x2="33.1741"
                          y2="31.432"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#A755FF" />
                          <stop offset="1" stop-color="#6800D7" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_4326_7781"
                          x1="13.9452"
                          y1="17.7475"
                          x2="20.3077"
                          y2="28.0218"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#A755FF" />
                          <stop offset="1" stop-color="#6800D7" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Text Content */}
                  <div>
                    <h1 className="text-2xl lg:text-[36px] font-bold bg-gradient-to-r from-[#A755FF] to-[#6800D7] bg-clip-text text-transparent leading-tight Satoshi">
                      Ready to Amplify Your Sales?
                    </h1>
                    <p className="text-sm text-white mt-2 opacity-80 leading-relaxed">
                      Kickstart your first campaign and watch your conversions
                      grow.
                    </p>
                  </div>
                </div>

                {/* Bottom Section with Button and Charts */}
                <div className="flex items-end justify-between mt-6">
                  {/* Start Campaign Button */}
                  <div className="flex-1 max-w-[160px]">
                    <Button
                      text="Start Campaign"
                      height={44}
                      action={navigateToCreateCampaign}
                      secondary
                    />
                  </div>

                  {/* Bar Charts - Fixed to touch bottom with darker colors */}
                  <div className="flex items-end space-x-3 ml-4 h-full">
                    {/* Chart 1 - Shortest */}
                    <div className="flex flex-col items-center justify-end h-full">
                      <div className="w-[35px] bg-gradient-to-t from-[#240343] to-[#270440] rounded-t-lg h-24"></div>
                    </div>

                    {/* Chart 3 - Tallest */}
                    <div className="flex flex-col items-center justify-end h-full">
                      <div className="w-[35px] bg-gradient-to-t from-[#32075b] to-[#3c0464] rounded-t-lg h-32"></div>
                    </div>

                    {/* Chart 2 - Medium */}
                    <div className="flex flex-col items-center justify-end h-full">
                      <div className="w-[35px] bg-gradient-to-t from-[#2e0752] to-[#2e024d] rounded-t-lg h-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // SETUP COMPLETE - Show only the campaign card on mobile, nothing on desktop
        <div className="lg:hidden w-full bg-[#1D0B30] rounded-3xl p-6 md:p-8">
          <div className="flex flex-col items-center text-center">
            <HomeTrendIcon width={48} height={48} className="mb-4" />
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#A755FF] to-[#6800D7] bg-clip-text text-transparent mb-2">
              Ready to Amplify Your Sales?
            </h1>
            <p className="text-sm text-white mb-6 max-w-md">
              Your setup is complete! Start your first campaign now and watch
              your business grow.
            </p>
            <div className="w-full max-w-[200px]">
              <Button
                text="Start Campaign"
                height={50}
                action={navigateToCreateCampaign}
                secondary
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GettingStarted;
