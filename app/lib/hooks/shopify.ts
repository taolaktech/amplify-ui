import { useState } from "react";
import { getProducts } from "../api/integrations";
import { useAuthStore } from "../stores/authStore";
import useUIStore from "../stores/uiStore";
import { useCreateCampaignStore } from "../stores/createCampaignStore";
import { useRouter } from "next/navigation";
import { useToastStore } from "../stores/toastStore";

export const useGetShopifyProducts = () => {
  const setProducts = useUIStore((state) => state.actions.setProducts);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);
  const setToast = useToastStore((state) => state.setToast);
  const [error, setError] = useState<any>(null);
  const actions = useCreateCampaignStore((state) => state.actions);
  const router = useRouter();

  const fetchProducts = async (
    data: {
      first?: number;
      after?: string;
      before?: string;
      location?: string[];
      page?: number;
      currentPage?: number;
    },
    isAdShow: boolean,
    shouldRoute: boolean = true,
    onSuccess?: () => void,
    onError?: () => void
  ) => {
    // const isAhead: boolean = data.page > data.currentPage;
    setLoading(true);
    try {
      const response = await getProducts({
        token: token || "",
        after: data.after,
        before: data.before,
      });
      const products = response.products;
      try {
        setProducts(
          products.edges,
          response.productsCount.count,
          products.pageInfo.startCursor,
          products.pageInfo.endCursor,
          products.pageInfo.hasNextPage,
          products.pageInfo.hasPreviousPage,
          data.page || 1
        );
        if (onSuccess) onSuccess();
      } catch (error) {
        console.log("error", error);
        setToast({
          title: "Error fetching products",
          message: "Something went wrong. Please try again later",
          type: "error",
        });
      }

      // if (isAdShow) {
      //   actions.storeAdsShow({
      //     complete: true,
      //     location: data.location || [],
      //   });
      //   if (shouldRoute) router.push("/create-campaign/product-selection");
      // }
    } catch (error: any) {
      setError(error);
      setToast({
        title: "Error fetching products",
        message: "Something went wrong. Please try again later",
        type: "error",
      });
      if (onError) onError();
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
