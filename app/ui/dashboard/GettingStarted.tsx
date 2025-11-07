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

      {/* Hide the entire Steps2 setup card when all steps are completed */}
      {!allCompleted ? (
        <div className="h-[377px] md:h-[416px] flex gap-2">
          <div className="w-[100%] h-full">
            <Steps2 />
          </div>

          <div className="hidden relative flex-col xl:flex w-full max-w-[400px] bg-[#1D0B30] rounded-3xl p-8">
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
                action={navigateToCreateCampaign}
                secondary
              />
            </div>
          </div>
        </div>
      ) : (
        // Show only the campaign card when setup is complete
        <div className="h-[377px] md:h-[416px] flex justify-center">
          <div className="relative flex flex-col w-full max-w-[400px] bg-[#1D0B30] rounded-3xl p-8">
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
                Your setup is complete! Start your first campaign now.
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
      )}
    </div>
  );
}

export default GettingStarted;
