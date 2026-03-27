import { useRouter } from "next/navigation";
import getCampaigns, {
  CampaignPlatformsTitle,
  launchCampaign,
  LaunchCampaignPayload,
} from "../api/base/campaigns";
import { useAuthStore } from "../stores/authStore";
import useCampaignsStore from "../stores/campaignsStore";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useCreativesStore from "../stores/creativesStore";
import { useSetupStore } from "../stores/setupStore";
import { useCreateCampaignStore } from "../stores/createCampaignStore";
import useBrandAssetStore from "../stores/brandAssetStore";
import { useToastStore } from "../stores/toastStore";
import { useGetSetupComplete } from "./useGetSetupComplete";
import { buildLaunchCampaignPayload } from "../campaignPayload";

export default function useGetCampaigns() {
  const authTokenFromStore = useAuthStore((state) => state.token);
  const { page, sortBy, type, status, platforms } = useCampaignsStore(
    (state) => state,
  );
  const isLoading = useCampaignsStore((state) => state.isLoading);
  const actions = useCampaignsStore((state) => state.actions);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async (authToken?: string, showLoader?: boolean) => {
    const token = authToken || authTokenFromStore;
    if (!token) return setError("No authentication token provided");
    actions.setIsLoading(true);
    if (showLoader) actions.setShowLoader(true);
    const requestData: any = {
      token,
    };
    if (page) requestData.page = page;
    if (sortBy) requestData.sortBy = sortBy;
    if (type) requestData.type = type;
    if (status) requestData.status = status;
    if (platforms) requestData.platforms = platforms;
    try {
      const data = await getCampaigns(requestData);
      console.log("Fetched campaigns data:", data);
      if (data.data) {
        actions.setData(data.data.campaigns);
        actions.setPaginationInfo(data.data.pagination);
      }
      setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error("Error fetching campaigns:", error);
      setError(error.message || "Unknown error");
    } finally {
      actions.setIsLoading(false);
      actions.setShowLoader(false);
    }
  };

  return {
    fetchCampaigns,
    error,
    isLoading,
  };
}

export const useCampaignsActions = () => {
  const data = useCampaignsStore((state) => state.data);
  const subscriptionType = useAuthStore((state) => state.subscriptionType);
  const router = useRouter();
  const { isSetupComplete, hasShopifyStore } = useGetSetupComplete();

  const navigateToCreateCampaign = () => {
    console.log("campaigns data in actions hook:", data);

    if (!isSetupComplete) {
      router.push("/setup?redirect=create-campaign");
      return;
    }
    if (!hasShopifyStore) {
      router.push("/settings/integrations");
      return;
    }

    if (
      (!data || data?.length === 0) &&
      !localStorage.getItem("seen-pricing")
    ) {
      localStorage.setItem("seen-pricing", "true");
      router.push("/pricing");
    } else {
      router.push("/create-campaign");
    }
  };

  return {
    navigateToCreateCampaign,
  };
};

export const useLaunchCampaign = (
  setIsLaunchCampaign: (val: boolean) => void,
) => {
  const authToken = useAuthStore((state) => state.token);
  const businessDetails = useSetupStore((state) => state.businessDetails);
  const { toneOfVoice, primaryColor, secondaryColor } = useBrandAssetStore(
    (state) => state,
  );
  const products = useCreateCampaignStore(
    (state) => state.productSelection.products,
  );
  const locations = useCreateCampaignStore((state) => state.adsShow.location);
  const amount = useCreateCampaignStore((state) => state.fundCampaign.amount);
  const supportedAdPlatforms = useCreateCampaignStore(
    (state) => state.supportedAdPlatforms,
  );

  const {
    campaignType,
    campaignEndDate,
    campaignStartDate,
    campaignName,
    brandColor,
    accentColor,
    campaignPayload: storedCampaignPayload,
  } = useCreateCampaignStore((state) => state.campaignSnapshots);
  const { Facebook, Google } = useCreativesStore((state) => state);
  const setToast = useToastStore((state) => state.setToast);

  const { mutate, isPending } = useMutation({
    mutationFn: launchCampaign,
    onSuccess: () => {
      setIsLaunchCampaign(true);
      // setToast({
      //   title: "Campaign Launched 🎉",
      //   message: "Your campaign has been launched successfully.",
      //   type: "success",
      // });
    },
    onError: (error: any) => {
      console.error("Error launching campaign:", error);
      setToast({
        title: "Error launching campaign",
        message:
          "There was an error launching your campaign. Please try again.",
        type: "error",
      });
    },
  });

  const handleLaunchCampaign = () => {
    if (!authToken || !businessDetails.id || !products.length) return;
    const campaignData: LaunchCampaignPayload =
      storedCampaignPayload && storedCampaignPayload.businessId
        ? storedCampaignPayload
        : buildLaunchCampaignPayload({
            businessId: businessDetails.id,
            campaignName: campaignName ?? "Campaign",
            campaignType: campaignType || "Product Launch",
            brandColor: brandColor || primaryColor || "#000000",
            accentColor: accentColor || secondaryColor || "#FFFFFF",
            tone: toneOfVoice || "Professional",
            startDateIso: campaignStartDate
              ? new Date(campaignStartDate).toISOString()
              : new Date().toISOString(),
            endDateIso: campaignEndDate
              ? new Date(campaignEndDate).toISOString()
              : new Date(
                  new Date().setMonth(new Date().getMonth() + 1),
                ).toISOString(),
            totalBudget: amount,
            products,
            locations,
            supportedAdPlatforms,
            creativesStore: { Google, Facebook },
          });

    mutate({
      token: authToken,
      campaignPayload: campaignData,
    });
  };

  return {
    handleLaunchCampaign,
    isPending,
  };
};

export const useCampaignPageActions = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const { fetchCampaigns } = useGetCampaigns();

  const navigateToCampaignPage = () => {
    if (token) fetchCampaigns(token, true);
    router.push(`/campaigns`);
  };

  return { navigateToCampaignPage };
};
