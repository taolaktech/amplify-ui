import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useSetupStore } from "../stores/setupStore";
import {
  handleEmailLogin,
  handleForgotPassword,
  handleGoogleLogin,
  handleResetPassword,
} from "../api/base";
import {
  handleGetShopifyAccount,
  handleRetrieveStoreDetails,
  handleGetMe,
} from "../api/integrations";
import { useAuthStore, useCreateUserStore } from "../stores/authStore";
import { useRouter } from "next/navigation";
import { AuthErrorCode } from "../api/errorcodes";
import { Dispatch, SetStateAction, useState } from "react";
import { FieldErrors } from "react-hook-form";
import useGetCampaigns from "./campaigns";
import { useIntegrationStore } from "../stores/integrationStore";

export const useInitialize = () => {
  // const token = useAuthStore((state) => state.token);
  // console.log("token", token);
  console.log("useInitialize");
  const [loading, setLoading] = useState(false);
  const { setShopifyStoreConnected } = useIntegrationStore(
    (state) => state.actions
  );
  const reset = useSetupStore((state) => state.reset);
  const { businessDetails } = useSetupStore((state) => state);
  const {
    storeBusinessDetails,
    completeConnectStore,
    completeMarketingGoals,
    completeBusinessDetails,
    completePreferredSalesLocation,
    storeConnectStore,
    storeMarketingGoals,
    storePreferredSalesLocation,
  } = useSetupStore((state) => state);

  async function getMe(token: string) {
    // tun this to async
    if (token) {
      const response = await handleGetMe(token);
      console.log("User data:", response.onboarding);
      if (!response.onboarding) return false;
      completeConnectStore(response.onboarding?.shopifyAccountConnected);
      completeBusinessDetails(
        response.onboarding?.isBusinessDetailsSet || false
      );
      completeMarketingGoals(response.onboarding?.isBusinessGoalsSet || false);
      completePreferredSalesLocation(
        response.onboarding?.isShippingDetailsSet || false
      );
      return true;
    }
    return false;
  }

  async function getShopifyAccount(token: string, isConnected: boolean) {
    console.log("useEffect triggered with token:", token);
    console.log("connectStore.complete:", isConnected);
    if (token && isConnected) {
      const response = await handleGetShopifyAccount(token);
      console.log("Shopify account data:", response);
      if (!response.account.shop) {
        console.error("No Shopify account found");
        storeConnectStore({
          storeUrl: "",
        });
        completeConnectStore(false);
        setShopifyStoreConnected(false);
        return;
      }
      storeConnectStore({
        storeUrl: response.account.shop,
      });
      completeConnectStore(true);
      setShopifyStoreConnected(true);
    } else {
      reset();
    }
  }

  async function getStoreDetails(token: string, isConnected: boolean) {
    console.log("businessDetails.complete:", businessDetails.complete);
    console.log("token", token);
    if (!isConnected || !token) {
      return;
    }
    const response = await handleRetrieveStoreDetails(token);
    console.log("Store details response:", response);
    if (!response.business || !response.business.shopifyAccounts.length) {
      console.error("No business details found");
      completeBusinessDetails(false);
      return;
    }
    const details = response?.business;
    if (!details) {
      console.error("No details found");
      completeBusinessDetails(false);
      return;
    }
    console.log("Retrieved store details:", details);
    const {
      companyName,
      description,
      contactEmail,
      contactPhone,
      website,
      industry,
      companyRole,
      teamSize,
      estimatedMonthlyBudget,
      estimatedAnnualRevenue,
    } = details;
    console.log("Store Details Data:", details);
    storeBusinessDetails({
      storeName: companyName,
      description,
      storeUrl: website,
      contactEmail,
      contactPhone,
      industry,
      companyRole,
      teamSize: teamSize ? teamSize : { min: 2, max: 5 },
      adSpendBudget: estimatedMonthlyBudget?.amount,
      annualRevenue: estimatedAnnualRevenue?.amount,
    });

    if (details.shippingLocations) {
      console.log("Shipping details found:", details.shippingLocations);
      storePreferredSalesLocation({
        localShippingLocations:
          details.shippingLocations.localShippingLocations.map(
            (location: any) => location.shorthand
          ),
        internationalShippingLocations:
          details.shippingLocations.internationalShippingLocations,
        complete: true,
      });
    } else {
      console.warn("No shipping details found");
      storePreferredSalesLocation({
        localShippingLocations: [],
        internationalShippingLocations: [],
        complete: false,
      });
    }

    if (details.businessGoals) {
      console.log("Business goals found:", details.businessGoals);
      storeMarketingGoals({
        brandAwareness: details.businessGoals.brandAwareness,
        acquireNewCustomers: details.businessGoals.acquireNewCustomers,
        boostRepeatPurchases: details.businessGoals.boostRepeatPurchases,
        complete: true,
      });
    } else {
      console.warn("No business goals found");
      storeMarketingGoals({
        brandAwareness: false,
        acquireNewCustomers: false,
        boostRepeatPurchases: false,
        complete: false,
      });
    }
  }
  return {
    loading,
    getMe,
    getShopifyAccount,
    getStoreDetails,
    setLoading,
  };
};

export const useEmailLogin = (
  setErrorMsg: Dispatch<SetStateAction<string>>,
  email: string,
  setError: Dispatch<SetStateAction<boolean>>
) => {
  const router = useRouter();
  const { storeEmail, storeRetryError } = useCreateUserStore(
    (state) => state.actions
  );
  const completeConnectStore = useSetupStore(
    (state) => state.completeConnectStore
  );
  const login = useAuthStore((state) => state.login);
  const { loading, getMe, getShopifyAccount, getStoreDetails, setLoading } =
    useInitialize();
  const { fetchCampaigns } = useGetCampaigns();

  const emailLoginMutation = useMutation({
    mutationFn: handleEmailLogin,
    onSuccess: async (response: AxiosResponse<any, any>) => {
      setLoading(true);
      if (response.status === 200 || response.status === 201) {
        const isShopifyAccountConnected =
          response.data?.user?.shopifyAccountConnected;
        completeConnectStore(isShopifyAccountConnected);
        try {
          const isConnected = await getMe(response.data?.access_token);
          await getShopifyAccount(response.data?.access_token, isConnected);
          await getStoreDetails(response.data?.access_token, isConnected);
          await fetchCampaigns(response.data?.access_token);
          login(response.data?.access_token, response.data?.user);
          router.push("/");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setLoading(false);
    },
    onError: (error: any) => {
      let errorParsed;
      try {
        errorParsed = JSON.parse(error.message);
        setErrorMsg(errorParsed.message);
        if (errorParsed.code === AuthErrorCode.E_UNVERIFIED_EMAIL) {
          storeEmail(email);
          storeRetryError(true);
          router.push("/auth/signup/create/verify-account");
        }
      } catch (parseError) {
        console.error("Failed to parse error message:", parseError);
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
      setError(true);
    },
  });

  return {
    emailLoginMutation,
    loading,
  };
};

export const useGoogleLogin = (
  onSignupScreen = false,
  setErrorMsg: Dispatch<SetStateAction<string | null>> = () => {}
) => {
  const router = useRouter();
  const { storeEmail, storeJustCreated } = useCreateUserStore(
    (state) => state.actions
  );
  const completeConnectStore = useSetupStore(
    (state) => state.completeConnectStore
  );

  const login = useAuthStore((state) => state.login);

  const { loading, getMe, getShopifyAccount, getStoreDetails, setLoading } =
    useInitialize();

  const { fetchCampaigns } = useGetCampaigns();

  const googleLoginMutation = useMutation({
    mutationFn: handleGoogleLogin,
    onSuccess: async (response: AxiosResponse<any, any>) => {
      setLoading(true);
      console.log("Google login response:", response);
      if (response.status === 200 || response.status === 201) {
        if (response.data?.userCreated) {
          storeEmail(response.data?.user.email);
          storeJustCreated(true);
          login(response.data?.access_token, response.data?.user);
          setTimeout(() => {
            router.push("/auth/signup/create/verify-account?verified=true");
          }, 0);
        } else {
          const isShopifyAccountConnected =
            response.data?.user?.shopifyAccountConnected;
          completeConnectStore(isShopifyAccountConnected);
          try {
            const isConnected = await getMe(response.data?.access_token);
            await getShopifyAccount(response.data?.access_token, isConnected);
            await getStoreDetails(response.data?.access_token, isConnected);
            await fetchCampaigns(response.data?.access_token);
            login(response.data?.access_token, response.data?.user);

            router.push("/");
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
      }
      setLoading(false);
    },
    onError: () => {
      if (onSignupScreen) {
        setErrorMsg("We couldn’t create your account. Please try again.");
      }
    },
  });

  return { googleLoginMutation, loading };
};

export const useResetPassword = (
  setPasswordChangeSuccessful: Dispatch<SetStateAction<boolean>>,
  setErrorMsg: Dispatch<SetStateAction<string>>,
  errorMsg: string,
  errors: FieldErrors<{
    password: string;
    confirmPassword: string;
  }>
) => {
  const resetPasswordMutation = useMutation({
    mutationFn: handleResetPassword,
    onSuccess: (response: AxiosResponse<any, any>) => {
      setPasswordChangeSuccessful(true);
      console.log("Password reset successful:", response);
    },
    onError: (error: any) => {
      if (error.response.data.message === "E_INVALID_TOKEN") {
        setErrorMsg("This reset link is invalid or has expired.");
      } else if (error.response.status === 500) {
        setErrorMsg("Unable to process your request. Please try again later.");
      }
    },
  });

  const handleError = () => {
    if (errorMsg) return errorMsg;
    if (
      errors.password?.type === "required" ||
      errors.confirmPassword?.type === "required"
    )
      return "Please fill out all required fields.";
    if (errors.password?.type === "pattern")
      return "Password must be at least 8 characters, including a number and a symbol.";
    if (errors.confirmPassword?.type === "validate")
      return "Passwords do not match.";
  };

  return {
    resetPasswordMutation,
    handleError,
  };
};

export const useForgotPassword = (
  setSent: Dispatch<SetStateAction<boolean>>,
  setErrorMsg: Dispatch<SetStateAction<string>>
) => {
  const forgotPasswordMutation = useMutation({
    mutationFn: handleForgotPassword,
    onSuccess: () => {
      setSent(true);
      setErrorMsg("");
    },
    onError: (error: any) => {
      if (error.response.data.message === AuthErrorCode.E_USER_NOT_FOUND) {
        setErrorMsg("We couldn't find an account with that email");
      } else {
        setErrorMsg("Unable to process your request. Please try again later.");
      }
    },
  });

  return {
    forgotPasswordMutation,
  };
};
