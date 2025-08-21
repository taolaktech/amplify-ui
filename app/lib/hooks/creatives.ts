import { useMutation } from "@tanstack/react-query";
import {
  generateGoogleCreatives,
  GoogleCreativesProduct,
} from "../api/ai/creatives";
import { useAuthStore } from "../stores/authStore";
// import useUIStore from "../stores/uiStore";
import { useRouter } from "next/navigation";
import { useCreateCampaignStore } from "../stores/createCampaignStore";

export const useGenerateCreatives = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  // const products = useUIStore((state) => state.products);
  const { productSelection } = useCreateCampaignStore((state) => state);
  const actions = useCreateCampaignStore((state) => state.actions);
  // const;
  const { mutate: googleMutate, isPending: googleCreativeIsPending } =
    useMutation({
      mutationFn: generateGoogleCreatives,
      onSuccess: (data: any) => {
        console.log("Google creatives generated successfully", data);
        if (data.status) {
          actions.completeAdsPlatform();
          router.push("/create-campaign/campaign-snapshots");
        }
      },
      onError: (error) => {
        console.log("Error generating Google creatives", error);
        console.error("Error generating Google creatives", error);
      },
    });

  const generateCreatives = (productId: string) => {
    const product = productSelection.products.find(
      (p) => p.node.id === productId
    );
    if (!token || !productSelection.products || !product) return;
    const creativeProduct: GoogleCreativesProduct = {
      productPrice: product.node.priceRangeV2.minVariantPrice.amount,
      productDescription: product.node.description,
      productOccasion: product.node?.occasion || "",
      productCategory: product.node.productType || "",
      productFeature: product.node.tags || [],
      tone: "friendly",
      brandName: product.node?.brandName || "",
      productName: product.node.title || "",
      productImage: product.node.media.edges[0]?.node.preview.image.src || "",
      productLink: product.node.onlineStorePreviewUrl || "",
      campaignType: "Google Ads",
    };
    googleMutate({ token, googleCreativesProduct: creativeProduct });
  };

  const initialGeneration = () => {
    generateCreatives(productSelection.products[0].node.id);
  };

  return { generateCreatives, googleCreativeIsPending, initialGeneration };
};
