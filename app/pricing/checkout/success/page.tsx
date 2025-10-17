"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUIStore from "@/app/lib/stores/uiStore";
import SuccessScreen from "@/app/ui/SuccessScreen";
// import { useSetupStore } from "@/app/lib/stores/setupStore";
// import { useToastStore } from "@/app/lib/stores/toastStore";
import { useCampaignsActions } from "@/app/lib/hooks/campaigns";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const isSubscriptionSuccess = useUIStore(
    (state) => state.isSubscriptionSuccess
  );
  const { navigateToCreateCampaign } = useCampaignsActions();

  const handleContinueCreateCampaign = () => {
    navigateToCreateCampaign();
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
