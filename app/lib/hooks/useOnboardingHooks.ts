// "use client";
// import { useMutation } from "@tanstack/react-query";
// import { useSetupStore } from "@/app/lib/stores/setupStore";
// import { useEffect, useState } from "react";
// import { useAuthStore } from "@/app/lib/stores/authStore";
// import {
//   handleShopifyAuth,
//   IntegrationErrorCode,
//   handleRetrieveStoreDetails,
//   handleGetCities,
//   postPreferredSalesLocation,
//   postMarketingGoals,
//   handlePostBusinessDetails,
// } from "@/app/lib/api/integrations";
// import { useRouter, useSearchParams } from "next/navigation";
// import useUIStore from "../stores/uiStore";
// import { useToastStore } from "../stores/toastStore";

// export const useLinkShopify = (
//   setErrorMsg: React.Dispatch<React.SetStateAction<string>>,
//   storeUrl: string
// ) => {
//   const storeConnectStore = useSetupStore((state) => state.storeConnectStore);
//   const router = useRouter();
//   const storeUrlFromStore = useSetupStore(
//     (state) => state.connectStore.storeUrl
//   );
//   const token = useAuthStore((state) => state.token);

//   const linkShopifyMutation = useMutation({
//     mutationFn: handleShopifyAuth,
//     onSuccess: (data) => {
//       storeConnectStore({ storeUrl });
//       if (data.url) {
//         window.location.href = data.url;
//       } else {
//       }
//     },
//     onError: (error: any) => {
//       console.error("Error linking Shopify store:", error);
//       switch (error.response.data.message) {
//         case IntegrationErrorCode.E_SHOPIFY_ACCOUNT_ALREADY_EXISTS:
//           setErrorMsg("Shopify account linked already.");
//           setTimeout(() => {
//             router.push("/setup/business-details");
//           }, 1000);
//           break;
//         default:
//           setErrorMsg("Failed to connect to Shopify store. Please try again.");
//           break;
//       }
//     },
//   });

//   const handleConnectStore = (
//     shopifyStore: string,
//     redirect = "/settings/integrations"
//   ) => {
//     setErrorMsg("");
//     if (!token) return;
//     if (storeUrlFromStore === shopifyStore) {
//       // router.replace(redirect);
//       window.location.href = redirect;
//       return;
//     }
//     const shopifyRegex =
//       /^(https?:\/\/)?[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com\/?$/;

//     if (!shopifyRegex.test(shopifyStore)) {
//       setErrorMsg("Please enter a valid Shopify store link");
//       return;
//     }

//     linkShopifyMutation.mutate({
//       shop: shopifyStore,
//       redirect,
//       token,
//     });
//   };

//   return { linkShopifyMutation, handleConnectStore };
// };

// export const useRetrieveStoreDetails = () => {
//   const token = useAuthStore((state) => state.token);
//   const storeBusinessDetails = useSetupStore(
//     (state) => state.storeBusinessDetails
//   );
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [retrieveStoreDetailsData, setRetrieveStoreDetailsData] =
//     useState<any>(null);
//   const [, setShouldFetchData] = useState(false);

//   // const retrieveStoreDetails = useQuery({
//   //   queryKey: ["storeDetails"],
//   //   queryFn: () => {
//   //     if (!token || !shouldFetchData) return;
//   //     else return handleRetrieveStoreDetails(token);
//   //   },
//   //   enabled: false, // Don't auto-run
//   // });

//   const retrieveStoreDetails = async () => {
//     if (!token) return;
//     else {
//       try {
//         setIsLoading(true);
//         const data = await handleRetrieveStoreDetails(token);
//         setIsSuccess(true);
//         setRetrieveStoreDetailsData(data.data);
//       } catch (error) {
//         console.error("Error retrieving store details:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!retrieveStoreDetailsData) return;
//     const {
//       companyName,
//       description,
//       website,
//       industry,
//       companyRole,
//       teamSize,
//       estimatedMonthlyBudget,
//       estimatedAnnualRevenue,
//     } = retrieveStoreDetailsData;
//     storeBusinessDetails({
//       storeName: companyName,
//       description,
//       storeUrl: website,
//       industry: industry || null,
//       companyRole: companyRole || null,
//       teamSize: teamSize ? teamSize : { min: 2, max: 5 },
//       adSpendBudget: estimatedMonthlyBudget?.amount || 0,
//       annualRevenue: estimatedAnnualRevenue?.amount || 0,
//     });
//   }, [isSuccess]);

//   const fetchStoreDetails = () => {
//     if (token) {
//       setShouldFetchData(true);
//       retrieveStoreDetails();
//     }
//   };
//   return {
//     isLoading,
//     isSuccess,
//     retrieveStoreDetailsData,
//     handleRetrieveStoreDetails: fetchStoreDetails,
//   };
// };

// export const useSubmitBusinessDetails = (isStoreDetails?: boolean) => {
//   const token = useAuthStore((state) => state.token);
//   const router = useRouter();
//   const setToast = useToastStore((state) => state.setToast);
//   const [companyRoleError, setCompanyRoleError] = useState(false);
//   const [productCategoryError, setProductCategoryError] = useState(false);
//   const isRouteToCampaigns =
//     useSearchParams().get("redirect") === "create-campaign";
//   const [businessDetails, setBusinessDetails] = useState(null);
//   const businessDetailsStore = useSetupStore((state) => state.businessDetails);
//   const storeBusinessDetails = useSetupStore(
//     (state) => state.storeBusinessDetails
//   );

//   const completeBusinessDetails = useSetupStore(
//     (state) => state.completeBusinessDetails
//   );
//   const submitBusinessDetailsMutation = useMutation({
//     mutationFn: handlePostBusinessDetails,
//     onSuccess: () => {
//       if (businessDetails) storeBusinessDetails(businessDetails);
//       completeBusinessDetails(true);
//       if (!isStoreDetails && isRouteToCampaigns)
//         router.push("/setup/preferred-sales-location?redirect=create-campaign");
//       else if (!isStoreDetails) router.push("/setup/preferred-sales-location");
//       else
//         setToast({
//           type: "success",
//           title: "Store details updated",
//           message: "Your store details has successfully been updated",
//         });
//     },
//     onError: (error: any) => {
//       console.error("Error retrieving business details:", error);
//     },
//   });

//   const handleSubmitBusinessDetails = (data: any) => {
//     if (!token) return;
//     if (!data.companyRole) {
//       setCompanyRoleError(true);
//       return;
//     } else {
//       setCompanyRoleError(false);
//     }
//     if (!data.industry) {
//       setProductCategoryError(true);
//       return;
//     } else {
//       setProductCategoryError(false);
//     }

//     const normalizedNewData = {
//       storeName: data.storeName,
//       description: data.description,
//       storeUrl: data.storeUrl,
//       industry: data.industry,
//       companyRole: data.companyRole,
//       teamSize: data.teamSize,
//       adSpendBudget: parseInt(data.adSpendBudget),
//       annualRevenue: parseInt(data.annualRevenue),
//       complete: true,
//     };

//     if (
//       JSON.stringify(normalizedNewData) === JSON.stringify(businessDetailsStore)
//     ) {
//       completeBusinessDetails(true);
//       if (isRouteToCampaigns) {
//         router.push("/setup/preferred-sales-location?redirect=create-campaign");
//         return;
//       }
//       router.push("/setup/preferred-sales-location");
//       return;
//     }

//     const businessDetails = {
//       companyName: data.storeName,
//       description: data.description,
//       industry: data.industry,
//       website: data.storeUrl,
//       estimatedMonthlyBudget: parseInt(data.adSpendBudget),
//       estimatedAnnualRevenue: parseInt(data.annualRevenue),
//       teamSize: data.teamSize,
//       companyRole: data.companyRole,
//     };

//     setBusinessDetails(data);
//     submitBusinessDetailsMutation.mutate({ businessDetails, token });
//   };

//   return {
//     submitBusinessDetailsMutation,
//     handleSubmitBusinessDetails,
//     companyRoleError,
//     setCompanyRoleError,
//     productCategoryError,
//     setProductCategoryError,
//   };
// };

// export const useGetPlaces = () => {
//   const token = useAuthStore((state) => state.token);
//   const [citiesData, setCitiesData] = useState<any[] | null>(null);

//   const getCitiesMutation = useMutation({
//     mutationFn: handleGetCities,
//     onSuccess: (data) => {
//       setCitiesData(data);
//     },
//     onError: (error: any) => {
//       console.error("Error fetching cities:", error);
//     },
//   });

//   const fetchPlaces = (input: string) => {
//     if (!token || input.trim().length < 2) return;
//     getCitiesMutation.mutate({ input, token });
//   };
//   return {
//     getCitiesMutation,
//     handleGetPlaces: fetchPlaces,
//     citiesData,
//   };
// };

// export const useSubmitPreferredLocation = () => {
//   const token = useAuthStore((state) => state.token);
//   const preferredSalesLocationFromStore = useSetupStore(
//     (state) => state.preferredSalesLocation
//   );
//   const isRouteToCampaigns =
//     useSearchParams().get("redirect") === "create-campaign";
//   const [preferredSalesLocation, setPreferredSalesLocation] = useState<{
//     localShippingLocations: string[];
//     internationalShippingLocations: string[];
//   }>({
//     localShippingLocations: [],
//     internationalShippingLocations: [],
//   });
//   const storePreferredSalesLocation = useSetupStore(
//     (state) => state.storePreferredSalesLocation
//   );
//   const router = useRouter();

//   const submitPreferredLocationMutation = useMutation({
//     mutationFn: postPreferredSalesLocation,
//     onSuccess: () => {
//       storePreferredSalesLocation({
//         ...preferredSalesLocation,
//         complete: true,
//       });
//       if (isRouteToCampaigns) {
//         router.push("/setup/marketing-goals?redirect=create-campaign");
//         return;
//       }
//       router.push("/setup/marketing-goals");
//     },
//     onError: (error: any) => {
//       console.error("Error submitting preferred location:", error);
//     },
//   });

//   const handleSubmitPreferredLocation = (data: {
//     localShippingLocations: string[];
//     internationalShippingLocations: string[];
//   }) => {
//     if (!token) return;

//     const normalizedNewData = {
//       localShippingLocations: data.localShippingLocations,
//       internationalShippingLocations: data.internationalShippingLocations,
//       complete: true,
//     };

//     if (
//       JSON.stringify(normalizedNewData) ===
//       JSON.stringify(preferredSalesLocationFromStore)
//     ) {
//       if (isRouteToCampaigns) {
//         router.push("/setup/marketing-goals?redirect=create-campaign");
//         return;
//       }
//       router.push("/setup/marketing-goals");
//       return;
//     }

//     setPreferredSalesLocation(data);
//     const localShippingLocations = data.localShippingLocations.map(
//       (location) => {
//         const [city, state, country] = location.split(", ");
//         return {
//           shorthand: location,
//           country,
//           city,
//           state,
//         };
//       }
//     );
//     submitPreferredLocationMutation.mutate({
//       data: {
//         localShippingLocations,
//         internationalShippingLocations: data.internationalShippingLocations,
//       },
//       token,
//     });
//   };

//   return { submitPreferredLocationMutation, handleSubmitPreferredLocation };
// };

// export const useSubmitBusinessGoals = () => {
//   const token = useAuthStore((state) => state.token);
//   const marketingGoalsFromStore = useSetupStore(
//     (state) => state.marketingGoals
//   );
//   const { setOnboardingCompleted } = useUIStore((state) => state.actions);
//   const [marketingGoals, setMarketingGoals] = useState<{
//     brandAwareness: boolean;
//     acquireNewCustomers: boolean;
//     boostRepeatPurchases: boolean;
//   } | null>(null);
//   const storeMarketingGoals = useSetupStore(
//     (state) => state.storeMarketingGoals
//   );
//   const router = useRouter();
//   const isRouteToCampaigns =
//     useSearchParams().get("redirect") === "create-campaign";

//   const submitMarketingGoalsMutation = useMutation({
//     mutationFn: postMarketingGoals,
//     onSuccess: () => {
//       if (!marketingGoals) return;
//       storeMarketingGoals({
//         ...marketingGoals,
//         complete: true,
//       });
//       setOnboardingCompleted(true);
//       if (isRouteToCampaigns) {
//         router.push("/setup?onboarding=success&redirect=create-campaign");
//         return;
//       }
//       router.push("/setup?onboarding=success");
//     },
//     onError: (error: any) => {
//       console.error("Error submitting marketing goals:", error);
//     },
//   });

//   const handleSubmitMarketingGoals = (data: {
//     brandAwareness: boolean;
//     acquireNewCustomers: boolean;
//     boostRepeatPurchases: boolean;
//   }) => {
//     if (!token) return;

//     const normalizedNewData = {
//       brandAwareness: data.brandAwareness,
//       acquireNewCustomers: data.acquireNewCustomers,
//       boostRepeatPurchases: data.boostRepeatPurchases,
//       complete: true,
//     };

//     if (
//       JSON.stringify(normalizedNewData) ===
//       JSON.stringify(marketingGoalsFromStore)
//     ) {
//       setOnboardingCompleted(true);
//       router.push("/setup?onboarding=success");
//       return;
//     }

//     setMarketingGoals(data);
//     submitMarketingGoalsMutation.mutate({ data, token });
//   };

//   return { submitMarketingGoalsMutation, handleSubmitMarketingGoals };
// };

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
import { useRouter, useSearchParams } from "next/navigation";
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

  const handleConnectStore = (
    shopifyStore: string,
    redirect = "/settings/integrations"
  ) => {
    setErrorMsg("");
    if (!token) return;
    if (storeUrlFromStore === shopifyStore) {
      // router.replace(redirect);
      window.location.href = redirect;
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
  const [, setShouldFetchData] = useState(false);

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
  const [companyRoleError, setCompanyRoleError] = useState(false);
  const [productCategoryError, setProductCategoryError] = useState(false);
  const isRouteToCampaigns =
    useSearchParams().get("redirect") === "create-campaign";
  const [businessDetails, setBusinessDetails] = useState<any>(null);
  const businessDetailsStore = useSetupStore((state) => state.businessDetails);
  const storeBusinessDetails = useSetupStore(
    (state) => state.storeBusinessDetails
  );

  const completeBusinessDetails = useSetupStore(
    (state) => state.completeBusinessDetails
  );
  const submitBusinessDetailsMutation = useMutation({
    mutationFn: handlePostBusinessDetails,
    onSuccess: () => {
      if (businessDetails) storeBusinessDetails(businessDetails);
      completeBusinessDetails(true);
      if (!isStoreDetails && isRouteToCampaigns)
        router.push("/setup/preferred-sales-location?redirect=create-campaign");
      else if (!isStoreDetails) router.push("/setup/preferred-sales-location");
      else
        setToast({
          type: "success",
          title: "Store details updated",
          message: "Your store details has successfully been updated",
        });
    },
    onError: (error: any) => {
      console.error("❌ Error submitting business details:", error);
      if (error.response) {
        console.error("📡 Server response:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
        setToast({
          type: "error",
          title: "Failed to save business details",
          message:
            error.response.data?.message ||
            "Please check all fields and try again",
        });
      }
    },
  });

  const handleSubmitBusinessDetails = (data: any) => {
    if (!token) {
      console.error("❌ No token found");
      setToast({
        type: "error",
        title: "Authentication error",
        message: "Please log in again",
      });
      return;
    }

    // Validation for ALL required fields
    if (!data.companyRole) {
      setCompanyRoleError(true);
      setToast({
        type: "error",
        title: "Missing required field",
        message: "Company role is required",
      });
      return;
    } else {
      setCompanyRoleError(false);
    }

    if (!data.industry) {
      setProductCategoryError(true);
      setToast({
        type: "error",
        title: "Missing required field",
        message: "Industry is required",
      });
      return;
    } else {
      setProductCategoryError(false);
    }

    // CRITICAL: Validate the new contact fields
    if (!data.contactEmail?.trim()) {
      setToast({
        type: "error",
        title: "Missing required field",
        message: "Contact email is required",
      });
      return;
    }

    if (!data.contactPhone?.trim()) {
      setToast({
        type: "error",
        title: "Missing required field",
        message: "Contact phone is required",
      });
      return;
    }

    // Transform data to match backend API
    const backendPayload = {
      companyName: data.companyName || data.storeName || "",
      description: data.description || "",
      website: data.website || data.storeUrl || "",
      industry: data.industry || "",
      companyRole: data.companyRole || "",
      contactEmail: data.contactEmail || "",
      contactPhone: data.contactPhone || "",
      teamSize: data.teamSize || { min: 1, max: 1 },
      estimatedMonthlyBudget: Number(
        data.estimatedMonthlyBudget || data.adSpendBudget || 0
      ),
      estimatedAnnualRevenue: Number(
        data.estimatedAnnualRevenue || data.annualRevenue || 0
      ),
    };

    console.log("🚀 === FINAL PAYLOAD BEING SENT ===");
    console.log("Backend payload:", JSON.stringify(backendPayload, null, 2));

    // Final validation check - FIXED VERSION
    const requiredFields = [
      { key: "companyName", name: "Company Name" },
      { key: "description", name: "Description" },
      { key: "website", name: "Website" },
      { key: "industry", name: "Industry" },
      { key: "companyRole", name: "Company Role" },
      { key: "contactEmail", name: "Contact Email" },
      { key: "contactPhone", name: "Contact Phone" },
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = backendPayload[field.key as keyof typeof backendPayload];
      return !value || (typeof value === "string" && !value.trim());
    });

    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields);
      setToast({
        type: "error",
        title: "Missing required fields",
        message: `Please fill in: ${missingFields
          .map((f) => f.name)
          .join(", ")}`,
      });
      return;
    }

    console.log("✅ All required fields present");
    console.log("==================================");

    // Create store data for local state
    const storeData = {
      storeName: backendPayload.companyName,
      description: backendPayload.description,
      storeUrl: backendPayload.website,
      industry: backendPayload.industry,
      companyRole: backendPayload.companyRole,
      teamSize: backendPayload.teamSize,
      adSpendBudget: backendPayload.estimatedMonthlyBudget,
      annualRevenue: backendPayload.estimatedAnnualRevenue,
      contactEmail: backendPayload.contactEmail,
      contactPhone: backendPayload.contactPhone,
      complete: true,
    };

    // Check if data changed
    if (JSON.stringify(storeData) === JSON.stringify(businessDetailsStore)) {
      completeBusinessDetails(true);
      router.push(
        isRouteToCampaigns
          ? "/setup/preferred-sales-location?redirect=create-campaign"
          : "/setup/preferred-sales-location"
      );
      return;
    }

    setBusinessDetails(storeData);

    // Call API with the expected structure
    submitBusinessDetailsMutation.mutate({
      businessDetails: backendPayload,
      token,
    });
  };

  return {
    submitBusinessDetailsMutation,
    handleSubmitBusinessDetails,
    companyRoleError,
    setCompanyRoleError,
    productCategoryError,
    setProductCategoryError,
  };
};

export const useGetPlaces = () => {
  const token = useAuthStore((state) => state.token);
  const [citiesData, setCitiesData] = useState<any[] | null>(null);

  const getCitiesMutation = useMutation({
    mutationFn: handleGetCities,
    onSuccess: (data) => {
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
  const isRouteToCampaigns =
    useSearchParams().get("redirect") === "create-campaign";
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
    onSuccess: () => {
      storePreferredSalesLocation({
        ...preferredSalesLocation,
        complete: true,
      });
      if (isRouteToCampaigns) {
        router.push("/setup/marketing-goals?redirect=create-campaign");
        return;
      }
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

    if (
      JSON.stringify(normalizedNewData) ===
      JSON.stringify(preferredSalesLocationFromStore)
    ) {
      if (isRouteToCampaigns) {
        router.push("/setup/marketing-goals?redirect=create-campaign");
        return;
      }
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
  const isRouteToCampaigns =
    useSearchParams().get("redirect") === "create-campaign";

  const submitMarketingGoalsMutation = useMutation({
    mutationFn: postMarketingGoals,
    onSuccess: () => {
      if (!marketingGoals) return;
      storeMarketingGoals({
        ...marketingGoals,
        complete: true,
      });
      setOnboardingCompleted(true);
      if (isRouteToCampaigns) {
        router.push("/setup?onboarding=success&redirect=create-campaign");
        return;
      }
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
