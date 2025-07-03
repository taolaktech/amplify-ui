import { getCustomerPaymentMethods } from "../api/wallet";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";

export const useGetCustomerPaymentMethods = () => {
  const token = useAuthStore((state) => state.token);
  const { data, isLoading, error } = useQuery({
    queryKey: ["customer-payment-methods"],
    queryFn: () => getCustomerPaymentMethods(token || ""),
  });
  return { data, isLoading, error };
};
