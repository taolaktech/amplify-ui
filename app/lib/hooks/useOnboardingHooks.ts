import { useMutation, useQuery } from "@tanstack/react-query";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/lib/stores/authStore";
import {
  handleShopifyAuth,
  IntegrationErrorCode,
  handleRetrieveStoreDetails,
  handleGetPlacesAutocomplete,
  postPreferredSalesLocation,
  postMarketingGoals,
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
  const storeBusinessDetails = useSetupStore(
    (state) => state.storeBusinessDetails
  );
  const [shouldFetchData, setShouldFetchData] = useState(false);

  const retrieveStoreDetails = useQuery({
    queryKey: ["storeDetails"],
    queryFn: () => {
      if (!token || !shouldFetchData) return;
      else return handleRetrieveStoreDetails(token);
    },
    enabled: false, // Don't auto-run
  });

  console.log("retrieve details data:", retrieveStoreDetails.data);
  console.log("Store Details Data:", retrieveStoreDetails?.data);

  useEffect(() => {
    if (!retrieveStoreDetails?.data) return;
    const {
      companyName,
      description,
      website,
      industry,
      companyRole,
      teamSize,
      estimatedMonthlyBudget,
      estimatedAnnualRevenue,
    } = retrieveStoreDetails?.data;
    console.log("Store Details Data:", retrieveStoreDetails?.data);
    storeBusinessDetails({
      storeName: companyName,
      description,
      storeUrl: website,
      industry: industry || null,
      companyRole: companyRole || null,
      teamSize: teamSize ? teamSize : { min: 2, max: 5 },
      adSpendBudget: estimatedMonthlyBudget?.amount || 0,
      annualRevenue: estimatedAnnualRevenue?.amount || 0,
    });
  }, [retrieveStoreDetails.isSuccess]);

  const fetchStoreDetails = () => {
    if (token) {
      setShouldFetchData(true);
      retrieveStoreDetails.refetch();
    }
  };
  return {
    retrieveStoreDetails,
    handleRetrieveStoreDetails: fetchStoreDetails,
  };
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

export const useSubmitPreferredLocation = () => {
  const token = useAuthStore((state) => state.token);
  const preferredSalesLocationFromStore = useSetupStore(
    (state) => state.preferredSalesLocation
  );
  const [preferredSalesLocation, setPreferredSalesLocation] = useState<{
    localShippingLocations: string[];
    internationalShippingLocations: string[];
  }>({
    localShippingLocations: [],
    internationalShippingLocations: [],
  });
  const storePreferredSalesLocation = useSetupStore(
    (state) => state.storePreferredSalesLocation
  );
  const router = useRouter();

  const submitPreferredLocationMutation = useMutation({
    mutationFn: postPreferredSalesLocation,
    onSuccess: (data) => {
      storePreferredSalesLocation({
        ...preferredSalesLocation,
        complete: true,
      });
      console.log("Preferred location submitted successfully:", data);
      router.push("/setup/marketing-goals");
    },
    onError: (error: any) => {
      console.error("Error submitting preferred location:", error);
    },
  });

  const handleSubmitPreferredLocation = (data: {
    localShippingLocations: string[];
    internationalShippingLocations: string[];
  }) => {
    if (!token) return;
    if (
      JSON.stringify({ data, complete: true }) ===
      JSON.stringify(preferredSalesLocationFromStore)
    ) {
      router.push("/setup/marketing-goals");
      return;
    }
    console.log("data", data);
    console.log("called");
    setPreferredSalesLocation(data);
    submitPreferredLocationMutation.mutate({ data, token });
  };

  return { submitPreferredLocationMutation, handleSubmitPreferredLocation };
};

export const useSubmitBusinessGoals = () => {
  const token = useAuthStore((state) => state.token);
  const marketingGoalsFromStore = useSetupStore(
    (state) => state.marketingGoals
  );
  const [marketingGoals, setMarketingGoals] = useState<{
    brandAwareness: boolean;
    acquireNewCustomers: boolean;
    boostRepeatPurchases: boolean;
  } | null>(null);
  const storeMarketingGoals = useSetupStore(
    (state) => state.storeMarketingGoals
  );
  const router = useRouter();

  const submitMarketingGoalsMutation = useMutation({
    mutationFn: postMarketingGoals,
    onSuccess: (data) => {
      if (!marketingGoals) return;
      storeMarketingGoals({
        ...marketingGoals,
        complete: true,
      });
      console.log("Maketing Goals submitted successfully:", data);
    },
    onError: (error: any) => {
      console.error("Error submitting marketing goals:", error);
    },
  });

  const handleSubmitMarketingGoals = (data: {
    brandAwareness: boolean;
    acquireNewCustomers: boolean;
    boostRepeatPurchases: boolean;
  }) => {
    if (!token) return;

    if (
      JSON.stringify({ data, complete: true }) ===
      JSON.stringify(marketingGoalsFromStore)
    ) {
      router.push("/setup/complete");
      return;
    }
    console.log("data", data);
    console.log("called");
    setMarketingGoals(data);
    submitMarketingGoalsMutation.mutate({ data, token });
  };

  return { submitMarketingGoalsMutation, handleSubmitMarketingGoals };
};
