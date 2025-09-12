import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import { topUpWallet } from "../api/wallet";
import { useToastStore } from "../stores/toastStore";
import { useCreateCampaignStore } from "../stores/createCampaignStore";

export function useTopUpWallet(onSuccess?: (data: any) => void) {
  const token = useAuthStore((state) => state.token);
  const setToast = useToastStore((state) => state.setToast);
  const paymentMethodId = useCreateCampaignStore(
    (state) => state.fundCampaign.cardDetails?.id
  );

  const { mutate, isPending } = useMutation({
    mutationFn: topUpWallet,
    onSuccess: (data) => {
      setToast({
        title: "Wallet Topped Up",
        message: "Your wallet has been topped up successfully.",
        type: "success",
      });
      if (onSuccess) onSuccess(data);
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ['wallet'] })
    },
    onError: (error) => {
      console.error("Error topping up wallet", error);
      setToast({
        title: "Error Topping Up Wallet",
        message: "There was an error topping up your wallet.",
        type: "error",
      });
    },
  });

  const handleTopUpWallet = (amount: number) => {
    if (!token || !paymentMethodId) {
      console.error("No authentication token found");
      return;
    }
    if (amount < 50) {
      return;
    }
    const idempotencyKey = crypto.randomUUID();
    mutate({ token, amount, paymentMethodId, idempotencyKey });
  };

  return { handleTopUpWallet, isPending };
}
