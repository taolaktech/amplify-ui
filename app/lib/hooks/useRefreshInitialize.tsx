import { useAuthStore } from "../stores/authStore";
import { useInitialize } from "./useLoginHooks";
import { useEffect } from "react";

export default function useRefreshInitialize() {
  const { getMe, getShopifyAccount, getStoreDetails } = useInitialize();
  const token = useAuthStore((state) => state.token);

  const refreshInitialize = async () => {
    console.log("refreshInitialize");
    if (!token) return;
    console.log("token", token);
    const isConnected = await getMe(token);
    console.log("isConnected", isConnected);
    await getShopifyAccount(token, isConnected);
    await getStoreDetails(token, isConnected);
  };

  useEffect(() => {
    refreshInitialize();
  }, [token]);

  return { refreshInitialize };
}
