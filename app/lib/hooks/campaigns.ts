import { useRouter } from "next/navigation";
import getCampaigns from "../api/base/campaigns";
import { useAuthStore } from "../stores/authStore";
import useCampaignsStore from "../stores/campaignsStore";
import { useState } from "react";

export default function useGetCampaigns() {
  const authTokenFromStore = useAuthStore((state) => state.token);
  const { page, sortBy, type, status, platforms } = useCampaignsStore(
    (state) => state
  );
  const actions = useCampaignsStore((state) => state.actions);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async (authToken: string) => {
    const token = authToken || authTokenFromStore;
    if (!token) return setError("No authentication token provided");
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
      if (data.data) {
        actions.setData(data.data);
      }
      console.log("Fetched campaigns:", data.data);
      setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error("Error fetching campaigns:", error);
      setError(error.message || "Unknown error");
    }
  };

  return {
    fetchCampaigns,
    error,
  };
}

export const useCampaignsActions = () => {
  const data = useCampaignsStore((state) => state.data);
  const subscriptionType = useAuthStore((state) => state.subscriptionType);
  const router = useRouter();

  const navigateToCreateCampaign = () => {
    if (
      (subscriptionType?.name?.toLowerCase() === "free" || !subscriptionType) &&
      (!data || data.length === 0)
    ) {
      router.push("/pricing");
    } else {
      router.push("/create-campaign");
    }
  };

  return {
    navigateToCreateCampaign,
  };
};
