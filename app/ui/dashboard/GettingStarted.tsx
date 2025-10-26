"use client";
import HomeTrendIcon from "@/public/dashboard-home-trend-up.svg";
import { CloseCircle, Notification } from "iconsax-react";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useState, useMemo } from "react";
import { useCampaignsActions } from "@/app/lib/hooks/campaigns";
import Button from "../Button";
import Link from "next/link";
import Image from "next/image";
import Steps2 from "./Steps2";

function GettingStarted() {
  const user = useAuthStore((state) => state.user);
  const [cancelNotification, setCancelNotification] = useState(false);
  const { navigateToCreateCampaign } = useCampaignsActions();

  const firstName = user?.name?.split(" ")[0] || "Unknown";

  // 👇 Access the onboarding data (example shape)
  // e.g., user.onboarding = { profile: true, payment: false, campaign: false, verification: true }
  const onboarding = (user as any)?.me?.onboarding ?? null;

  // 👇 Compute whether all steps are completed
  const allCompleted = useMemo(() => {
    if (!onboarding) return false;
    return Object.values(onboarding).every((flag) => flag === true);
  }, [onboarding]);

  // 👇 Find the next step that is still false
  const nextIncompleteStep = useMemo(() => {
    if (!onboarding) return null;
    return Object.keys(onboarding).find((key) => onboarding[key] === false);
  }, [onboarding]);

  // 👇 Determine correct link path for next step
  const nextStepLink = useMemo(() => {
    if (!nextIncompleteStep) return "/setup"; // fallback
    switch (nextIncompleteStep) {
      case "profile":
        return "/setup/profile";
      case "payment":
        return "/setup/payment";
      case "campaign":
        return "/setup/campaign";
      case "verification":
        return "/setup/verification";
      default:
        return "/setup";
    }
  }, [nextIncompleteStep]);

  // 👇 If user canceled or completed all steps, hide banner
  const showBanner = !cancelNotification && !allCompleted;

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="font-semibold text-lg lg:text-2xl">
          Welcome {firstName} 👋
        </p>
        <p className="text-sm lg:text-base">Let's get you setup</p>
      </div>

      {showBanner && (
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
                  <Link href={nextStepLink} className="underline font-medium">
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

      <div className="h-[377px] md:h-[416px] flex gap-2">
        <div className="w-[100%] h-full">
          <Steps2 />
        </div>

        <div className="hidden relative flex-col xl:flex w-full max-w-[400px] bg-[#1D0B30] rounded-3xl p-8">
          <div>
            <HomeTrendIcon width={34} height={34} />
            <span className="absolute bottom-0 z-[1] right-0">
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
