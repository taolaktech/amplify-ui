import { useAuthStore } from "../stores/authStore";
import useGetCampaigns from "./campaigns";
import { useInitialize } from "./useLoginHooks";
import { useEffect, useState } from "react";

export default function useRefreshInitialize() {
  const { getMe, getShopifyAccount, getStoreDetails, handleGetBrandAssets } =
    useInitialize();
  const token = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  console.log("loading", loading);
  const { fetchCampaigns } = useGetCampaigns();

  const refreshInitialize = async () => {
    console.log("refreshInitialize");
    if (!token) return;
    console.log("token", token);
    const isConnected = await getMe(token);
    console.log("isConnected", isConnected);
    await Promise.all([
      getShopifyAccount(token, isConnected),
      getStoreDetails(token, isConnected),
      fetchCampaigns(token),
      handleGetBrandAssets(token),
    ]);
    setLoading(false);
    console.log("Initialization complete");
  };

  useEffect(() => {
    refreshInitialize();
  }, [token]);

  return { refreshInitialize };
}
