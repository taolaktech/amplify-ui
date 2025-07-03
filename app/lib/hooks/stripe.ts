import { getCustomerPaymentMethods, subscribeToPlan } from "../api/wallet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";

export const useGetCustomerPaymentMethods = () => {
  const token = useAuthStore((state) => state.token);
  const { data, isLoading, error } = useQuery({
    queryKey: ["customer-payment-methods"],
    queryFn: () => getCustomerPaymentMethods(token || ""),
  });
  return { data, isLoading, error };
};

export const useSubscribeToPlan = () => {
  const token = useAuthStore((state) => state.token);
  const { mutate, isPending } = useMutation({
    mutationFn: subscribeToPlan,
    onSuccess: (data) => {
      console.log(data);
    },
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
