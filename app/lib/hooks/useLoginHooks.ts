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
import { Dispatch, SetStateAction, useEffect } from "react";
import { FieldErrors } from "react-hook-form";

export const useInitialize = () => {
  const token = useAuthStore((state) => state.token);
  console.log("token", token);
  const reset = useSetupStore((state) => state.reset);
  const { connectStore, businessDetails } = useSetupStore((state) => state);
  const {
    storeBusinessDetails,
    completeConnectStore,
    completeMarketingGoals,
    completeBusinessDetails,
    completePreferredSalesLocation,
    storeConnectStore,
    storeMarketingGoals,
    // storePreferredSalesLocation,
  } = useSetupStore((state) => state);

  useEffect(() => {
    if (token) {
      handleGetMe(token)
        .then((response) => {
          console.log("User data:", response.onboarding);
          if (!response.onboarding) return;
          completeConnectStore(response.onboarding?.shopifyAccountConnected);
          completeBusinessDetails(
            response.onboarding?.isBusinessDetailsSet || false
          );
          completeMarketingGoals(
            response.onboarding?.isBusinessGoalsSet || false
          );
          completePreferredSalesLocation(
            response.onboarding?.isShippingDetailsSet || false
          );
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  useEffect(() => {
    console.log("useEffect triggered with token:", token);
    console.log("connectStore.complete:", connectStore.complete);
    if (token && connectStore.complete) {
      handleGetShopifyAccount(token)
        .then((response) => {
          console.log("Shopify account data:", response);
          storeConnectStore({
            storeUrl: response.account.shop,
          });
          completeConnectStore(true);
        })
        .catch((error) => {
          console.error("Error fetching Shopify account data:", error);
        });
    } else {
      reset();
    }
  }, [token, connectStore.complete]);

  useEffect(() => {
    console.log("businessDetails.complete:", businessDetails.complete);
    console.log("token", token);
    if (!connectStore.complete) return;
    if (!token) return;
    handleRetrieveStoreDetails(token).then((response) => {
      console.log("Store details response:", response);
      if (!response.businessDetails) {
        console.error("No business details found");
        completeBusinessDetails(false);
        return;
      }
      const details = response.businessDetails;
      if (!details) {
        console.error("No details found");
        completeBusinessDetails(false);
        return;
      }
      const {
        companyName,
        description,
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
        industry,
        companyRole,
        teamSize: teamSize ? teamSize : { min: 2, max: 5 },
        adSpendBudget: estimatedMonthlyBudget?.amount,
        annualRevenue: estimatedAnnualRevenue?.amount,
      });

      if (details.businessGoals) {
        console.log("Business goals found:", details.businessGoals);
        storeMarketingGoals({
          brandAwareness: details.brandAwareness,
          acquireNewCustomers: details?.acquireNewCustomers,
          boostRepeatPurchases: details.businessGoals?.boostRepeatPurchases,
          complete: true,
        });
      }
    });
  }, [connectStore.complete, token]);
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
  useInitialize();
  const emailLoginMutation = useMutation({
    mutationFn: handleEmailLogin,
    onSuccess: (response: AxiosResponse<any, any>) => {
      if (response.status === 200 || response.status === 201) {
        const isShopifyAccountConnected =
          response.data?.user?.shopifyAccountConnected;
        completeConnectStore(isShopifyAccountConnected);
        login(response.data?.access_token, response.data?.user);
        router.push("/");
      }
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

  useInitialize();

  const googleLoginMutation = useMutation({
    mutationFn: handleGoogleLogin,
    onSuccess: (response: AxiosResponse<any, any>) => {
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
          login(response.data?.access_token, response.data?.user);
          completeConnectStore(isShopifyAccountConnected);
          router.push("/");
        }
      }
    },
    onError: () => {
      if (onSignupScreen) {
        setErrorMsg("We couldn’t create your account. Please try again.");
      }
    },
  });

  return { googleLoginMutation };
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
