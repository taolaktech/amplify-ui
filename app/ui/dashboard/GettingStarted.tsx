"use client";
import HomeTrendIcon from "@/public/dashboard-home-trend-up.svg";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useCampaignsActions } from "@/app/lib/hooks/campaigns";
import Button from "../Button";
import Image from "next/image";
import Steps2 from "./Steps2";

import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useIntegrationStore } from "@/app/lib/stores/integrationStore";
import { useMemo, useState } from "react";
import { useGetSetupComplete } from "@/app/lib/hooks/useGetSetupComplete";
import { Notification, CloseCircle } from "iconsax-react";
import Link from "next/link";

function GettingStarted() {
  const user = useAuthStore((state) => state.user);
  const { navigateToCreateCampaign } = useCampaignsActions();
  const { isSetupComplete, link } = useGetSetupComplete();

  const { businessDetails, preferredSalesLocation, marketingGoals } =
    useSetupStore();
  const { instagram, facebook } = useIntegrationStore();

  const [cancelNotification, setCancelNotification] = useState(false);

  const firstName = user?.name?.split(" ")[0] || "Unknown";

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

      {/* ✅ SHOW NOTIFICATION WHEN SETUP NOT COMPLETE */}
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

            <button onClick={() => setCancelNotification(true)}>
              <CloseCircle size={24} color="#333" />
            </button>
          </div>
        </div>
      )}

      {/* ✅ SETUP NOT COMPLETE → Show Steps2 + Campaign card (on all screens) */}
      {!allCompleted ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <Steps2 />
          </div>

          <div className="w-full lg:w-1/3">
            <div className="relative w-full bg-[#1D0B30] rounded-3xl p-6 h-full">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <HomeTrendIcon width={34} height={34} />
                  <h1 className="text-2xl lg:text-3xl mt-3 font-extrabold bg-gradient-to-r from-[#A755FF] to-[#6800D7] bg-clip-text text-transparent">
                    Ready to Amplify Your Sales?
                  </h1>
                  <p className="text-sm text-white mt-2">
                    Kickstart your first campaign and watch your conversions
                    grow.
                  </p>
                </div>

                <div className="mt-4">
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
        </div>
      ) : (
        /* ✅ SETUP COMPLETE → Full-screen card on mobile & tablet, hidden on desktop */
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
