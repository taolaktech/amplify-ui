import { useAuthStore } from "../stores/authStore";
import useGetCampaigns from "./campaigns";
import { useInitialize } from "./useLoginHooks";
import { useEffect, useState } from "react";

export default function useRefreshInitialize() {
  const {
    getMe,
    getShopifyAccount,
    getStoreDetails,
    handleGetBrandAssets,
    handleGetCurrentSubscriptionPlan,
  } = useInitialize();
  const token = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  const { fetchCampaigns } = useGetCampaigns();

  const refreshInitialize = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    const isConnected = await getMe(token);
    await Promise.all([
      getShopifyAccount(token, isConnected),
      getStoreDetails(token, isConnected),
      fetchCampaigns(token),
      handleGetBrandAssets(token),
      handleGetCurrentSubscriptionPlan(token),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshInitialize();
  }, [token]);

  return { refreshInitialize, loading };
}
