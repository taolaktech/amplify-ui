import { useAuthStore } from "../stores/authStore";
import useGetCampaigns from "./campaigns";
import { useInitialize } from "./useLoginHooks";
import { useEffect, useState } from "react";

export default function useRefreshInitialize() {
  const { getMe, getShopifyAccount, getStoreDetails } = useInitialize();
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
    await getShopifyAccount(token, isConnected);
    await getStoreDetails(token, isConnected);
    await fetchCampaigns(token);
    setLoading(false);
    console.log("Initialization complete");
  };

  useEffect(() => {
    refreshInitialize();
  }, [token]);

  return { refreshInitialize };
}
