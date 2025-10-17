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
  const { mutate, isPending } = useMutation({
    mutationFn: subscribeToPlan,
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubscribe = (data: {
    price: string;
    paymentMethodId: string;
  }) => {
    console.log("data:", data);
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
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["current-subsctiption-plan"],
    queryFn: () => getCurrentSubscriptionPlan(token || ""),
  });
  useEffect(() => {
    console.log("current plan data:", data);

    if (isSuccess) {
      const currentPlanId = data?.data?.activeStripePriceId;
      const currentPlan = currentPlanId
        ? planIdToName[currentPlanId as keyof typeof planIdToName]
        : {
            name: "Free",
            cycle: "monthly" as Cycle,
          };

      if (currentPlan) setSubscriptionType(currentPlan);
    }
  }, [isSuccess]);

  return { data, isLoading, error };
};

export const useUpgradePlan = () => {
  const token = useAuthStore((state) => state.token);
  const setSubscriptionType = useAuthStore(
    (state) => state.setSubscriptionType
  );
  const [planId, setPlanId] = useState<string | null>(null);
  const setSubscriptionSuccess = useUIStore(
    (state) => state.actions.setSubscriptionSuccess
  );
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: upgradePlan,

    onSuccess: (data) => {
      console.log(data);
      setSubscriptionSuccess(true);
      const newPlan = planId
        ? planIdToName[planId as keyof typeof planIdToName]
        : {
            name: "Free",
            cycle: "monthly" as Cycle,
          };
      if (newPlan) setSubscriptionType(newPlan);
      router.push("/pricing/checkout/success");
    },

    onError: (error) => {
      console.log(error);
    },
  });

  const handleUpgrade = (data: { newPriceId: string }) => {
    console.log("data:", data);
    setPlanId(data.newPriceId);
    mutate({
      token: token || "",
      ...data,
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
