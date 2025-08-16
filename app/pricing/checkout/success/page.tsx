"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUIStore from "@/app/lib/stores/uiStore";
import SuccessScreen from "@/app/ui/SuccessScreen";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useToastStore } from "@/app/lib/stores/toastStore";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const isSubscriptionSuccess = useUIStore(
    (state) => state.isSubscriptionSuccess
  );
  const setToast = useToastStore((state) => state.setToast);
  const marketingGoals = useSetupStore((state) => state.marketingGoals);

  const handleContinueCreateCampaign = () => {
    if (marketingGoals.complete) {
      router.push("/create-campaign");
    } else {
      setToast({
        title: "👋 Let's Get You Set Up First",
        message:
          "You need to complete onboarding before launching your first campaign. It only takes a minute!",
        type: "warning",
      });
    }
  };

  useEffect(() => {
    if (!isSubscriptionSuccess) {
      router.push("/");
    }
  }, [isSubscriptionSuccess, router]);

  return (
    <SuccessScreen
      headingText="Your Subscription is Active!"
      subText="You're now ready to launch your first campaign."
      primaryActionText="Continue Campaign Setup"
      primaryAction={handleContinueCreateCampaign}
      secondaryActionText="Manage Subscription"
      secondaryButtonWidth={220}
      primaryButtonWidth={210}
      secondaryAction={() => router.push("/settings")}
    />
  );
}
