"use client";

import {
  getCurrentSubscriptionPlan,
  getCustomerPaymentMethods,
  removePaymentMethod,
  setDefaultPaymentMethod,
  subscribeToPlan,
  upgradePlan,
} from "../api/wallet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { planIdToName } from "../pricingPlans";
import { Cycle } from "@/app/ui/pricing/ModelHeader";
import { useRouter } from "next/navigation";
import useUIStore from "../stores/uiStore";
import { useEffect, useState } from "react";
import { useToastStore } from "../stores/toastStore";

export const useGetCustomerPaymentMethods = () => {
  const token = useAuthStore((state) => state.token);
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["customer-payment-methods"],
    queryFn: () => getCustomerPaymentMethods(token || ""),
  });
  return { data, isLoading, error, refetch, isRefetching };
};

export const useSubscribeToPlan = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [planId, setPlanId] = useState<string | null>(null);

  const setIsSubscriptionSuccess = useUIStore(
    (state) => state.actions.setSubscriptionSuccess
  );
  const setSubscriptionType = useAuthStore(
    (state) => state.setSubscriptionType
  );
  const setToast = useToastStore((state) => state.setToast);
  const { mutate, isPending } = useMutation({
    mutationFn: subscribeToPlan,
    onError: (error) => {
      console.log(error);
      setToast({
        title: "Something went wrong",
        message:
          "We couldn’t process your payment method. Please check your connection or try again in a few minutes",
        type: "error",
      });
    },
    onSuccess: (data) => {
      console.log(data);
      setIsSubscriptionSuccess(true);
      const newPlan = planId
        ? planIdToName[planId as keyof typeof planIdToName]
        : {
            name: "Free",
            cycle: "monthly" as Cycle,
          };
      console.log("new plan from subscribe:", newPlan);
      if (newPlan) setSubscriptionType(newPlan);
      // setTimeout(() => {
      router.push("/pricing/checkout/success");
      // }, 500);
    },
  });

  const handleSubscribe = (data: {
    price: string;
    paymentMethodId: string;
  }) => {
    console.log("data from subscribe:", data);
    setPlanId(data.price);
    mutate({
      token: token || "",
      ...data,
    });
  };

  return { handleSubscribe, isPending };
};

export const useGetCurrentSubscriptionPlan = () => {
  const token = useAuthStore((state) => state.token);
  const setSubscriptionType = useAuthStore(
    (state) => state.setSubscriptionType
  );
  const setSubscriptionEndDate = useAuthStore(
    (state) => state.setSubscriptionEndDate
  );
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["current-subscription-plan"],
    queryFn: () => getCurrentSubscriptionPlan(token || ""),
    staleTime: 0,
    gcTime: 0, // (or cacheTime: 0 for React Query v4)
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  useEffect(() => {
    if (isSuccess) {
      const currentPlanId = data?.data?.activeStripePriceId;
      const currentPlan = currentPlanId
        ? planIdToName[currentPlanId as keyof typeof planIdToName]
        : {
            name: "Free",
            cycle: "monthly" as Cycle,
          };

      console.log("current plan:");

      if (currentPlan) {
        setSubscriptionType(currentPlan);
        setSubscriptionEndDate(data?.data?.currentPeriodEnd || null);
      }
    }
  }, [isSuccess]);

  return { data, isLoading, error };
};

export const useUpgradePlan = () => {
  const token = useAuthStore((state) => state.token);
  const setSubscriptionType = useAuthStore(
    (state) => state.setSubscriptionType
  );
  const showToast = useToastStore((state) => state.setToast);
  const [isDowngrade, setIsDowngrade] = useState<boolean>(false);
  const subscriptionEndDate = useAuthStore(
    (state) => state.subscriptionEndDate
  );
  const [planId, setPlanId] = useState<string | null>(null);

  const setIsSubscriptionSuccess = useUIStore(
    (state) => state.actions.setSubscriptionSuccess
  );
  const setToast = useToastStore((state) => state.setToast);
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: upgradePlan,

    onSuccess: (data) => {
      console.log(data);
      setIsSubscriptionSuccess(true);
      const newPlan = planId
        ? planIdToName[planId as keyof typeof planIdToName]
        : {
            name: "Free",
            cycle: "monthly" as Cycle,
          };

      console.log("new plan for upgrade:", newPlan);
      if (newPlan && !isDowngrade) setSubscriptionType(newPlan);
      let downgradeMessage;
      if (isDowngrade) {
        if (subscriptionEndDate) {
          const dateObj = new Date(subscriptionEndDate);
          if (!isNaN(dateObj.getTime())) {
            const endDate = dateObj.toLocaleDateString(
              "en-US",
              { year: "numeric", month: "long", day: "numeric" }
            );
            downgradeMessage = `Your plan downgrade will take effect on ${endDate}. You’ll continue to enjoy your current plan benefits until then.`;
          } else {
            downgradeMessage = "Your plan downgrade has been scheduled.";
          }
        } else {
          downgradeMessage = "Your plan downgrade has been scheduled.";
        }
        showToast({
          title: "Subscription Downgrade",
          message: downgradeMessage,
          type: "success",
        });
      }
      router.push("/pricing/checkout/success");
    },

    onError: (error) => {
      console.log(error);
      setToast({
        title: "Something went wrong",
        message:
          "We couldn’t process your payment method. Please check your connection or try again in a few minutes",
        type: "error",
      });
    },
  });

  const handleUpgrade = (data: {
    newPriceId: string;
    isDowngrade?: boolean;
  }) => {
    console.log("data for upgrade:", data);
    setIsDowngrade(data.isDowngrade || false);
    setPlanId(data.newPriceId);
    mutate({
      token: token || "",
      newPriceId: data.newPriceId,
      prorationBehavior: data.isDowngrade ? "none" : "create_prorations",
    });
  };

  return { handleUpgrade, isPending };
};

export const useStripeCustomerActions = () => {
  const token = useAuthStore((state) => state.token);

  const { mutate: setDefaultPaymentMethodMutate } = useMutation({
    mutationFn: setDefaultPaymentMethod,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: removePaymentMethodMutate } = useMutation({
    mutationFn: removePaymentMethod,
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSetDefaultPaymentMethod = (paymentMethodId: string) => {
    setDefaultPaymentMethodMutate({
      token: token || "",
      paymentMethodId,
    });
  };

  const handleRemovePaymentMethod = (paymentMethodId: string) => {
    removePaymentMethodMutate({
      token: token || "",
      paymentMethodId,
    });
  };

  return { handleSetDefaultPaymentMethod, handleRemovePaymentMethod };
};
