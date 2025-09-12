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

  return { data, isLoading, error };
};

export const useUpgradePlan = () => {
  const token = useAuthStore((state) => state.token);
  const { mutate, isPending } = useMutation({
    mutationFn: upgradePlan,

    onError: (error) => {
      console.log(error);
    },
  });

  const handleUpgrade = (data: { newPriceId: string }) => {
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
