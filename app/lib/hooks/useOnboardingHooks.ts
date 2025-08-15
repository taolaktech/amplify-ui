"use client";
import { useMutation } from "@tanstack/react-query";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/lib/stores/authStore";
import {
  handleShopifyAuth,
  IntegrationErrorCode,
  handleRetrieveStoreDetails,
  handleGetCities,
  postPreferredSalesLocation,
  postMarketingGoals,
  handlePostBusinessDetails,
} from "@/app/lib/api/integrations";
import { useRouter } from "next/navigation";
import useUIStore from "../stores/uiStore";
import { useToastStore } from "../stores/toastStore";

export const useLinkShopify = (
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>,
  storeUrl: string
) => {
  const storeConnectStore = useSetupStore((state) => state.storeConnectStore);
  const router = useRouter();
  const storeUrlFromStore = useSetupStore(
    (state) => state.connectStore.storeUrl
  );
  const token = useAuthStore((state) => state.token);

  const linkShopifyMutation = useMutation({
    mutationFn: handleShopifyAuth,
    onSuccess: (data) => {
      storeConnectStore({ storeUrl });
      console.log("Shopify store linked successfully:", data);
      if (data.url) {
        console.log("Redirecting to Shopify auth URL:", data.url);
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

  const handleConnectStore = (
    shopifyStore: string,
    redirect = "/settings/integrations"
  ) => {
    setErrorMsg("");
    if (!token) return;
    if (storeUrlFromStore === shopifyStore) {
      router.push("/setup/business-details");
      return;
    }
    const shopifyRegex =
      /^(https?:\/\/)?[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com\/?$/;

    if (!shopifyRegex.test(shopifyStore)) {
      setErrorMsg("Please enter a valid Shopify store link");
      return;
    }

    linkShopifyMutation.mutate({
      shop: shopifyStore,
      redirect,
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [retrieveStoreDetailsData, setRetrieveStoreDetailsData] =
    useState<any>(null);
  const [shouldFetchData, setShouldFetchData] = useState(false);

  console.log(shouldFetchData);

  // const retrieveStoreDetails = useQuery({
  //   queryKey: ["storeDetails"],
  //   queryFn: () => {
  //     if (!token || !shouldFetchData) return;
  //     else return handleRetrieveStoreDetails(token);
  //   },
  //   enabled: false, // Don't auto-run
  // });

  const retrieveStoreDetails = async () => {
    if (!token) return;
    else {
      try {
        setIsLoading(true);
        const data = await handleRetrieveStoreDetails(token);
        setIsSuccess(true);
        setRetrieveStoreDetailsData(data.data);
      } catch (error) {
        console.error("Error retrieving store details:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  console.log("retrieve details data:", retrieveStoreDetailsData);
  console.log("Store Details Data:", retrieveStoreDetailsData);

  useEffect(() => {
    if (!retrieveStoreDetailsData) return;
    const {
      companyName,
      description,
      website,
      industry,
      companyRole,
      teamSize,
      estimatedMonthlyBudget,
      estimatedAnnualRevenue,
    } = retrieveStoreDetailsData;
    console.log("Store Details Data:", retrieveStoreDetailsData);
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
  }, [isSuccess]);

  const fetchStoreDetails = () => {
    if (token) {
      setShouldFetchData(true);
      retrieveStoreDetails();
    }
  };
  return {
    isLoading,
    isSuccess,
    retrieveStoreDetailsData,
    handleRetrieveStoreDetails: fetchStoreDetails,
  };
};

export const useSubmitBusinessDetails = (isStoreDetails?: boolean) => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const setToast = useToastStore((state) => state.setToast);

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
      if (!isStoreDetails) router.push("/setup/preferred-sales-location");
      else
        setToast({
          type: "success",
          title: "Store details updated",
          message: "Your store details has successfully been updated",
        });
    },
    onError: (error: any) => {
      console.error("Error retrieving business details:", error);
    },
  });

  const handleSubmitBusinessDetails = (data: any) => {
    if (!token) return;
    console.log("data", data);
    console.log("businessDetailsStore", businessDetailsStore);

    const normalizedNewData = {
      storeName: data.storeName,
      description: data.description,
      storeUrl: data.storeUrl,
      industry: data.industry,
      companyRole: data.companyRole,
      teamSize: data.teamSize,
      adSpendBudget: parseInt(data.adSpendBudget),
      annualRevenue: parseInt(data.annualRevenue),
      complete: true,
    };

    if (
      JSON.stringify(normalizedNewData) === JSON.stringify(businessDetailsStore)
    ) {
      console.log("equal");
      completeBusinessDetails(true);
      router.push("/setup/preferred-sales-location");
      return;
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

export const useGetPlaces = () => {
  const token = useAuthStore((state) => state.token);
  const [citiesData, setCitiesData] = useState<any[] | null>(null);

  const getCitiesMutation = useMutation({
    mutationFn: handleGetCities,
    onSuccess: (data) => {
      console.log("Cities fetched successfully:", data);
      setCitiesData(data);
    },
    onError: (error: any) => {
      console.error("Error fetching cities:", error);
    },
  });

  const fetchPlaces = (input: string) => {
    if (!token || input.trim().length < 2) return;
    getCitiesMutation.mutate({ input, token });
  };
  return {
    getCitiesMutation,
    handleGetPlaces: fetchPlaces,
    citiesData,
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
      console.log("post preferred location data:", data);
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

    const normalizedNewData = {
      localShippingLocations: data.localShippingLocations,
      internationalShippingLocations: data.internationalShippingLocations,
      complete: true,
    };

    console.log("Comparing preferred locations:");
    console.log("New data:", JSON.stringify(normalizedNewData, null, 2));
    console.log(
      "Store data:",
      JSON.stringify(preferredSalesLocationFromStore, null, 2)
    );

    if (
      JSON.stringify(normalizedNewData) ===
      JSON.stringify(preferredSalesLocationFromStore)
    ) {
      router.push("/setup/marketing-goals");
      return;
    }

    setPreferredSalesLocation(data);
    const localShippingLocations = data.localShippingLocations.map(
      (location) => {
        const [city, state, country] = location.split(", ");
        return {
          shorthand: location,
          country,
          city,
          state,
        };
      }
    );
    submitPreferredLocationMutation.mutate({
      data: {
        localShippingLocations,
        internationalShippingLocations: data.internationalShippingLocations,
      },
      token,
    });
  };

  return { submitPreferredLocationMutation, handleSubmitPreferredLocation };
};

export const useSubmitBusinessGoals = () => {
  const token = useAuthStore((state) => state.token);
  const marketingGoalsFromStore = useSetupStore(
    (state) => state.marketingGoals
  );
  const { setOnboardingCompleted } = useUIStore((state) => state.actions);
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
      setOnboardingCompleted(true);
      router.push("/setup?onboarding=success");
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

    const normalizedNewData = {
      brandAwareness: data.brandAwareness,
      acquireNewCustomers: data.acquireNewCustomers,
      boostRepeatPurchases: data.boostRepeatPurchases,
      complete: true,
    };

    console.log("Comparing marketing goals:");
    console.log("New data:", JSON.stringify(normalizedNewData, null, 2));
    console.log(
      "Store data:",
      JSON.stringify(marketingGoalsFromStore, null, 2)
    );

    if (
      JSON.stringify(normalizedNewData) ===
      JSON.stringify(marketingGoalsFromStore)
    ) {
      setOnboardingCompleted(true);
      router.push("/setup?onboarding=success");
      return;
    }

    setMarketingGoals(data);
    submitMarketingGoalsMutation.mutate({ data, token });
  };

  return { submitMarketingGoalsMutation, handleSubmitMarketingGoals };
};
