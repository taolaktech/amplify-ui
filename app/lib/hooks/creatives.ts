import { useMutation } from "@tanstack/react-query";
import { generateGoogleCreatives, GoogleCreativesProduct } from "../api/base/creatives";
import { useAuthStore } from "../stores/authStore";
import useUIStore from "../stores/uiStore";


export const useGenerateCreatives = () => {
    const token = useAuthStore(state => state.token);
    const products = useUIStore(state => state.products);
    const { mutate:googleMutate, isPending: googleIsPending } = useMutation({
        mutationFn: generateGoogleCreatives
    });

   const generateCreatives = (productId: string) => {
    const product = products.find(p => p.node.id === productId);
    if (!token || !products || !product) return;
    const creativeProduct: GoogleCreativesProduct = {
      productPrice: product.node.priceRangeV2.minVariantPrice.amount,
      productDescription: product.node.description
      productOccasion: ''

    };
    googleMutate({ token, googleCreativesProduct: creativeProduct });
   };

   const initialGenerations = (productIds: string[]) => {
    productIds.forEach(productId => generateCreatives(productId));
   };

    return { generateCreatives, googleIsPending };
}