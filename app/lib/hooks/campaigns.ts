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

export default function useGetCampaigns() {
  const authTokenFromStore = useAuthStore((state) => state.token);
  const { page, sortBy, type, status, platforms } = useCampaignsStore(
    (state) => state
  );
  const isLoading = useCampaignsStore((state) => state.isLoading);
  const actions = useCampaignsStore((state) => state.actions);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async (authToken?: string, showLoader?: boolean) => {
    const token = authToken || authTokenFromStore;
    if (!token) return setError("No authentication token provided");

    actions.setIsLoading(true);
    if (showLoader) actions.setShowLoader(true);

    const requestData: any = { token };
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

      setError(null);
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
  const { isSetupComplete } = useGetSetupComplete();

  const navigateToCreateCampaign = () => {
    console.log("campaigns data in actions hook:", data);

    // 1️⃣ Setup incomplete → redirect to setup
    if (!isSetupComplete) {
      router.push("/setup?redirect=create-campaign");
      return;
    }

    // 2️⃣ Free plan or missing subscription or no campaign data → pricing
    if (
      subscriptionType?.name?.toLowerCase() === "free" ||
      !subscriptionType ||
      !data ||
      data.length === 0
    ) {
      router.push("/pricing");
      return;
    }

    // 3️⃣ Setup complete + valid subscription → create campaign
    router.push("/create-campaign");
  };

  return {
    navigateToCreateCampaign,
  };
};

export const useLaunchCampaign = (
  setIsLaunchCampaign: (val: boolean) => void
) => {
  const authToken = useAuthStore((state) => state.token);
  const businessDetails = useSetupStore((state) => state.businessDetails);
  const { toneOfVoice, primaryColor, secondaryColor } = useBrandAssetStore(
    (state) => state
  );
  const products = useCreateCampaignStore(
    (state) => state.productSelection.products
  );
  const locations = useCreateCampaignStore((state) => state.adsShow.location);
  const amount = useCreateCampaignStore((state) => state.fundCampaign.amount);
  const supportedAdPlatforms = useCreateCampaignStore(
    (state) => state.supportedAdPlatforms
  );
  const paymentMethodId = useCreateCampaignStore(
    (state) => state.fundCampaign.cardDetails?.id
  );

  const {
    campaignType,
    campaignEndDate,
    campaignStartDate,
    campaignName,
    brandColor,
    accentColor,
  } = useCreateCampaignStore((state) => state.campaignSnapshots);

  const { Facebook, Instagram, Google } = useCreativesStore((state) => state);
  const setToast = useToastStore((state) => state.setToast);

  const { mutate, isPending } = useMutation({
    mutationFn: launchCampaign,
    onSuccess: () => {
      setIsLaunchCampaign(true);
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

    const campaignPlatforms: CampaignPlatformsTitle[] = [];
    if (supportedAdPlatforms.Facebook)
      campaignPlatforms.push(CampaignPlatformsTitle.FACEBOOK);
    if (supportedAdPlatforms.Instagram)
      campaignPlatforms.push(CampaignPlatformsTitle.INSTAGRAM);
    if (supportedAdPlatforms.Google)
      campaignPlatforms.push(CampaignPlatformsTitle.GOOGLE);

    const productsPayload = products.map((product) => {
      const creatives = [];

      if (supportedAdPlatforms.Facebook && Facebook?.[product.node.id]) {
        creatives.push({
          channel: "facebook",
          budget: amount / products.length / campaignPlatforms.length,
          data:
            Facebook?.[product.node.id]?.[
              Facebook?.[product.node.id].length - 1
            ].creatives || [],
        });
      }

      if (supportedAdPlatforms.Instagram && Instagram?.[product.node.id]) {
        creatives.push({
          channel: "instagram",
          data:
            Instagram?.[product.node.id]?.[
              Instagram?.[product.node.id].length - 1
            ].creatives || [],
        });
      }

      if (supportedAdPlatforms.Google && Google?.[product.node.id]) {
        const formatCreatives =
          Google?.[product.node.id]?.[Google?.[product.node.id].length - 1]
            .creatives || [];

        const creativesData = formatCreatives?.map((creative: string) =>
          JSON.stringify(creative)
        );

        creatives.push({
          channel: "google",
          budget: amount / products.length / campaignPlatforms.length,
          data: creativesData || [],
        });
      }

      return {
        shopifyId: product.node.id,
        id: product.node.id,
        title: product.node.title,
        price: parseFloat(product.node.priceRangeV2.minVariantPrice.amount),
        description: product.node.description || "",
        occasion: product.node.occasion || "General",
        features: [
          ...(product.node?.tags || []),
          product.node?.category?.name || "",
          product.node?.productType || "",
          product.node?.handle || "",
        ],
        category: product.node.productType || "General",
        imageLinks: [product.node.media.edges[0]?.node.preview.image.url || ""],
        productLink: product.node.onlineStorePreviewUrl || "",
        creatives,
      };
    });

    const campaignData: LaunchCampaignPayload = {
      businessId: businessDetails.id,
      name: campaignName ?? "Campaign",
      type: campaignType || "Product Launch",
      platforms: campaignPlatforms,
      brandColor: brandColor || primaryColor || "#000000",
      accentColor: accentColor || secondaryColor || "#FFFFFF",
      tone: toneOfVoice || "Professional",
      startDate: campaignStartDate
        ? new Date(campaignStartDate).toISOString()
        : new Date().toISOString(),
      endDate: campaignEndDate
        ? new Date(campaignEndDate).toISOString()
        : new Date(
            new Date().setMonth(new Date().getMonth() + 1)
          ).toISOString(),
      totalBudget: amount,
      products: productsPayload,
      location: locations.map((location) => {
        const splitted = location.split(",").map((part) => part.trim());
        return {
          city: splitted[0],
          state: splitted[1] || "",
          country: splitted[2] || "",
        };
      }),
    };

    const idempotencyKey = crypto.randomUUID();

    mutate({
      token: authToken,
      campaignPayload: campaignData,
      idempotencyKey,
      amount,
      paymentMethodId: paymentMethodId!,
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
