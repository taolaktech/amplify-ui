import { useMutation, useQuery } from "@tanstack/react-query";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useState } from "react";
import { useAuthStore } from "@/app/lib/stores/authStore";
import {
  handleShopifyAuth,
  IntegrationErrorCode,
  handleRetrieveStoreDetails,
  handlePostBusinessDetails,
  handleGetPlacesAutocomplete,
} from "@/app/lib/api/integrations";
import { useRouter } from "next/navigation";

export const useLinkShopify = (
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>,
  storeUrl: string
) => {
  const storeConnectStore = useSetupStore((state) => state.storeConnectStore);
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const linkShopifyMutation = useMutation({
    mutationFn: handleShopifyAuth,
    onSuccess: (data) => {
      storeConnectStore({ storeUrl });
      if (data.url) {
        window.location.href = data.url;
      } else {
      }
    },
    onError: (error: any) => {
      console.error("Error linking Shopify store:", error);
      switch (error.response.data.message) {
        case IntegrationErrorCode.E_SHOPIFY_ACCOUNT_ALREADY_EXISTS:
          setErrorMsg("Shopify account linked already.");
          setTimeout(() => {
            router.push("/setup/business-details");
          }, 1000);
          break;
        default:
          setErrorMsg("Failed to connect to Shopify store. Please try again.");
          break;
      }
    },
  });

  const handleConnectStore = (shopifyStore: string) => {
    setErrorMsg("");
    if (!token) return;
    const shopifyRegex =
      /^(https?:\/\/)?[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com\/?$/;

    if (!shopifyRegex.test(shopifyStore)) {
      setErrorMsg("Please enter a valid Shopify store link");
      return;
    }

    linkShopifyMutation.mutate({
      shop: shopifyStore,
      token,
    });
  };

  return { linkShopifyMutation, handleConnectStore };
};

export const useRetrieveStoreDetails = () => {
  const token = useAuthStore((state) => state.token);

  const retrieveStoreDetails = useQuery({
    queryKey: ["storeDetails", token],
    queryFn: () => handleRetrieveStoreDetails(token || ""),
    enabled: false, // Don't auto-run
  });

  console.log('retrieve details data:', retrieveStoreDetails.data)

  const fetchStoreDetails = () => {
    if (token) retrieveStoreDetails.refetch();
  };
  return {
    retrieveStoreDetails,
    handleRetrieveStoreDetails: fetchStoreDetails,
  };
};

export const useSubmitBusinessDetails = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  const [businessDetails, setBusinessDetails] = useState(null);
  const businessDetailsStore = useSetupStore((state) => state.businessDetails);
  const storeBusinessDetails = useSetupStore(
    (state) => state.storeBusinessDetails
  );

  const completeBusinessDetails = useSetupStore(
    (state) => state.completeBusinessDetails
  );
  const submitBusinessDetailsMutation = useMutation({
    mutationFn: handlePostBusinessDetails,
    onSuccess: (data) => {
      if (businessDetails) storeBusinessDetails(businessDetails);
      completeBusinessDetails(true);
      console.log("Business details submitted successfully:", data);
      router.push("/setup/preferred-sales-location");
    },
    onError: (error: any) => {
      console.error("Error retrieving business details:", error);
    },
  });

  const handleSubmitBusinessDetails = (data: any) => {
    if (!token) return;
    if (JSON.stringify(data) === JSON.stringify(businessDetailsStore)) {
      completeBusinessDetails(true);
      router.push("/setup/preferred-sales-location");
    }
    const businessDetails = {
      companyName: data.storeName,
      description: data.description,
      industry: data.industry,
      website: data.storeUrl,
      estimatedMonthlyBudget: parseInt(data.adSpendBudget),
      estimatedAnnualRevenue: parseInt(data.annualRevenue),
      teamSize: data.teamSize,
      companyRole: data.companyRole,
    };
    setBusinessDetails(data);
    submitBusinessDetailsMutation.mutate({ businessDetails, token });
  };

  return { submitBusinessDetailsMutation, handleSubmitBusinessDetails };
};

export const useGetPlaces = (place: string) => {
  const getPlaces = useQuery({
    queryKey: ["places"],
    queryFn: () => handleGetPlacesAutocomplete({ input: place }),
    enabled: false, // Don't auto-run
  });

  console.log("getPlaces", getPlaces.data);

  const fetchPlaces = () => {
    getPlaces.refetch();
  };
  return {
    getPlaces,
    handleGetPlaces: fetchPlaces,
  };
};
