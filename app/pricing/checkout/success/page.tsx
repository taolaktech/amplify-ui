"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUIStore from "@/app/lib/stores/uiStore";
import SuccessScreen from "@/app/ui/SuccessScreen";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const isSubscriptionSuccess = useUIStore(
    (state) => state.isSubscriptionSuccess
  );

  useEffect(() => {
    if (!isSubscriptionSuccess) {
      router.push("/dashboard");
    }
  }, [isSubscriptionSuccess, router]);

  return (
    <SuccessScreen
      headingText="Your Subscription is Active!"
      subText="You're now ready to launch your first campaign."
      primaryActionText="Continue Campaign Setup"
      primaryAction={() => router.push("/create-campaign")}
      secondaryActionText="Manage Subscription"
      secondaryButtonWidth={220}
      primaryButtonWidth={210}
      secondaryAction={() => router.push("/dashboard")}
    />
  );
}
