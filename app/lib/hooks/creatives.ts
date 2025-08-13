import { useMutation } from "@tanstack/react-query";
import { generateGoogleCreatives, GoogleCreativesProduct } from "../api/base/creatives";
import { useAuthStore } from "../stores/authStore";


export const useGenerateCreatives = () => {
    const token = useAuthStore(state => state.token);
    const { mutate:googleMutate, isPending: googleIsPending } = useMutation({
        mutationFn: generateGoogleCreatives
    });

   const generateCreatives = (product: GoogleCreativesProduct) => {
    if (!token) return
    googleMutate({ token, googleCreativesProduct: product });
   };

    return { generateCreatives, googleIsPending };
}