import { useMutation } from "@tanstack/react-query";
import {
  generateGoogleCreatives,
  GoogleCreativesProduct,
} from "../api/ai/creatives";
import { useAuthStore } from "../stores/authStore";
// import useUIStore from "../stores/uiStore";
import { useRouter } from "next/navigation";
import { useCreateCampaignStore } from "../stores/createCampaignStore";
import { useSetupStore } from "../stores/setupStore";
import useBrandAssetStore from "../stores/brandAssetStore";
import useCreativesStore from "../stores/creativesStore";
import { useState } from "react";
import { Platform } from "@/type";

export const useGenerateCreatives = () => {
  const token = useAuthStore((state) => state.token);
  const brandName = useSetupStore((state) => state.businessDetails.storeName);
  const toneOfVoice = useBrandAssetStore((state) => state.toneOfVoice);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const router = useRouter();
  const generate = useCreativesStore((state) => state.actions.generate);
  // const products = useUIStore((state) => state.products);
  const { productSelection } = useCreateCampaignStore((state) => state);
  const actions = useCreateCampaignStore((state) => state.actions);
  // const;
  const { mutate: googleMutate, isPending: googleCreativeIsPending } =
    useMutation({
      mutationFn: generateGoogleCreatives,
      onSuccess: (data: any) => {
        if (data.success) {
          actions.completeAdsPlatform();
          generate("GOOGLE ADS", currentProductId!, data.data);
          router.push("/create-campaign/campaign-snapshots");
        }
      },
      onError: (error) => {
        console.log("Error generating Google creatives", error);
        console.error("Error generating Google creatives", error);
      },
    });

  const generateCreatives = (productId: string, platform?: Platform) => {
    const product = productSelection.products.find(
      (p) => p.node.id === productId
    );
    if (!token || !productSelection.products || !product) return;
    setCurrentProductId(productId);
    const creativeProduct: GoogleCreativesProduct = {
      productPrice: product.node.priceRangeV2.minVariantPrice.amount,
      productDescription: product.node?.description || "",
      productOccasion: product.node?.occasion || "",
      productCategory: product.node?.category?.name || "",
      productFeatures: [
        ...(product.node?.tags || []),
        product.node?.category?.name || "",
        product.node?.productType || "",
        product.node?.handle || "",
      ],
      tone: toneOfVoice || "friendly",
      brandName,
      productName: product.node.title || "",
      productImage: product.node.media.edges[0]?.node.preview.image.url || "",
      productLink: product.node.onlineStorePreviewUrl || "",
      campaignType: "",
    };

    if (platform && platform === "GOOGLE ADS") {
      googleMutate({ token, googleCreativesProduct: creativeProduct });
      return;
    } else {
      googleMutate({ token, googleCreativesProduct: creativeProduct });
    }
  };

  const initialGeneration = () => {
    setCurrentProductId(productSelection.products[0].node.id);
    generateCreatives(productSelection.products[0].node.id);
  };

  return {
    generateCreatives,
    loading: googleCreativeIsPending,
    initialGeneration,
  };
};
