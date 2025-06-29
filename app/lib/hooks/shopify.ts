import { useState } from "react";
import { getProducts } from "../api/integrations";
import { useAuthStore } from "../stores/authStore";
import useUIStore from "../stores/uiStore";
import { useCreateCampaignStore } from "../stores/createCampaignStore";
import { useRouter } from "next/navigation";

export const useGetShopifyProducts = () => {
  const setProducts = useUIStore((state) => state.actions.setProducts);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);
  const [error, setError] = useState<any>(null);
  const actions = useCreateCampaignStore((state) => state.actions);
  const router = useRouter();
  const fetchProducts = async (
    data: {
      first?: number;
      after?: string;
      location?: string[];
    },
    isAdShow: boolean
  ) => {
    setLoading(true);
    try {
      console.log("data", token);
      const response = await getProducts({
        token: token || "",
        first: 10,
        after: data.after,
      });
      console.log("response", response);
      setProducts(data.first?.toString() || "0", response.data);
      if (isAdShow) {
        actions.storeAdsShow({
          complete: true,
          location: data.location || [],
        });
      }
      router.push("/create-campaign/product-selection");
    } catch (error) {
      setError(error);
      if (isAdShow) {
        actions.storeAdsShow({
          complete: false,
          location: data.location || [],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchProducts,
  };
};
