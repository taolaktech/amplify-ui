"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { useSetupStore } from "@/app/lib/stores/setupStore";
// import { useToastStore } from "@/app/lib/stores/toastStore";
import { useCampaignsActions } from "@/app/lib/hooks/campaigns";
import useUIStore from "@/app/lib/stores/uiStore";
import SuccessScreen from "@/app/ui/SuccessScreen";

export default function CheckoutSuccessPage() {
	const router = useRouter();
	const isSubscriptionSuccess = useUIStore(
		(state) => state.isSubscriptionSuccess,
	);
	const setIsSubscriptionSuccess = useUIStore(
		(state) => state.actions.setSubscriptionSuccess,
	);
	const { navigateToCreateCampaign } = useCampaignsActions();

	const handleContinueCreateCampaign = () => {
		navigateToCreateCampaign();
	};

	useEffect(() => {
		if (!isSubscriptionSuccess) {
			router.push("/");
		}
		return () => {
			setIsSubscriptionSuccess(false);
		};
	}, [isSubscriptionSuccess, router.push, setIsSubscriptionSuccess]);

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
