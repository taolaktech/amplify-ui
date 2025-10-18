import { useMutation } from "@tanstack/react-query";
import {
  generateGoogleCreatives,
  generateMediaCreatives,
  getCreativeSet,
  GoogleCreativesProduct,
  MediaCreativesProduct,
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
import useCampaignsStore from "../stores/campaignsStore";

export const useGenerateCreatives = () => {
  const token = useAuthStore((state) => state.token);
  const primaryBrandColor = useBrandAssetStore((state) => state.primaryColor);
  const brandAccent = useBrandAssetStore((state) => state.secondaryColor);
  const brandName = useSetupStore((state) => state.businessDetails.storeName);
  const toneOfVoice = useBrandAssetStore((state) => state.toneOfVoice);
  const campaignType = useCampaignsStore((state) => state.type);
  const [, setCurrentProductId] = useState<string | null>(null);
  const router = useRouter();
  const generate = useCreativesStore((state) => state.actions.generate);
  const supportedAdPlatforms = useCreateCampaignStore(
    (state) => state.supportedAdPlatforms
  );
  const [isCreativeSetLoading, setIsCreativeSetLoading] = useState(false);
  // const products = useUIStore((state) => state.products);
  const { productSelection } = useCreateCampaignStore((state) => state);
  const actions = useCreateCampaignStore((state) => state.actions);
  // const;
  const { mutateAsync: googleMutate, isPending: googleCreativeIsPending } =
    useMutation({
      mutationFn: generateGoogleCreatives,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onSuccess: (data: any) => {
        // if (data.success) {
        //   actions.completeAdsPlatform();
        //   generate("GOOGLE ADS", currentProductId!, data.data);
        //   router.push("/create-campaign/campaign-snapshots");
        // }
      },
      onError: (error) => {
        console.log("Error generating Google creatives", error);
        console.error("Error generating Google creatives", error);
      },
    });

  const { mutateAsync: mediaMutate, isPending: mediaCreativeIsPending } =
    useMutation({
      mutationFn: generateMediaCreatives,
      onSuccess: (data: any) => {
        console.log("Media creative generation response:", data);
        // if (data.success) {
        //   actions.completeAdsPlatform();
        //   generate("FACEBOOK", currentProductId!, data.data);
        //   router.push("/create-campaign/campaign-snapshots");
        // }
      },
      onError: (error) => {
        console.log("Error generating Media creatives", error);
        console.error("Error generating Media creatives", error);
      },
    });

  const generateCreatives = async (
    productId: string,
    platforms?: Platform[]
  ) => {
    const product = productSelection.products.find(
      (p) => p.node.id === productId
    );
    if (!token || !productSelection.products || !product) return;
    setCurrentProductId(productId);
    const creativeProduct: GoogleCreativesProduct = {
      productPrice: product.node.priceRangeV2.minVariantPrice.amount,
      productDescription:
        product.node?.description ||
        product.node?.productType ||
        product.node?.category?.name ||
        "",
      productOccasion: product.node?.occasion || "-----",
      productCategory:
        product.node?.category?.name || product?.node?.productType || "-----",
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
      campaignType: campaignType || "Product Launch",
    };

    const mediaCreativeProduct: MediaCreativesProduct = {
      productName: product.node.title || "",
      productCategory:
        product.node?.category?.name || product?.node?.productType || "-----",
      productDescription:
        product.node?.description ||
        product.node?.productType ||
        product.node?.category?.name ||
        "",
      channel: "INSTAGRAM",
      productFeatures: [
        ...(product.node?.tags || []),
        product.node?.category?.name || "",
        product.node?.productType || "",
        product.node?.handle || "",
      ],
      tone: toneOfVoice || "friendly",
      brandName,
      productImages: [
        product.node.media.edges[0]?.node.preview.image.url || "",
        product.node.media.edges[0]?.node.preview.image.url || "",
        product.node.media.edges[0]?.node.preview.image.url || "",
      ],
      campaignType: campaignType || "Product Launch",
      type: "IMAGE",
      brandColor: primaryBrandColor || "#000000",
      brandAccent: brandAccent || "#FFFFFF",
      siteUrl: product.node.onlineStorePreviewUrl || "",
    };

    const generateForGoogleAds = async () => {
      if (platforms?.length && platforms.includes("GOOGLE ADS")) {
        return googleMutate({ token, googleCreativesProduct: creativeProduct });
      }
      return Promise.resolve(null);
    };
    const generateForInstagram = async () => {
      if (
        platforms?.length &&
        (platforms.includes("INSTAGRAM") || platforms.includes("FACEBOOK"))
      ) {
        return mediaMutate({
          token,
          product: { ...mediaCreativeProduct, channel: "INSTAGRAM" },
        });
      }
      return Promise.resolve(null);
    };

    // const generateForFacebook = async () => {
    //   if (platforms?.length && platforms.includes("FACEBOOK")) {
    //     mediaCreativeProduct.channel = "INSTAGRAM";
    //     return mediaMutate({
    //       token,
    //       product: { ...mediaCreativeProduct, channel: "FACEBOOK" },
    //     });
    //   }
    //   return Promise.resolve(null);
    // };

    if (platforms?.length) {
      // const [googleResult, instagramResult, facebookResult] = await Promise.all(
      //   [generateForGoogleAds(), generateForInstagram(), generateForFacebook()]
      // );
      const [googleResult, instagramResult] = await Promise.all([
        generateForGoogleAds(),
        generateForInstagram(),
        //  generateForFacebook(),
      ]);

      console.log("Results:", {
        googleResult,
        instagramResult,
        // facebookResult,
      });
      let arrLen = 0;
      if (platforms.includes("GOOGLE ADS")) arrLen += 1;
      if (platforms.includes("FACEBOOK") || platforms.includes("GOOGLE ADS"))
        arrLen += 1;
      const isLoading: boolean[] = new Array(arrLen).fill(true);
      setIsCreativeSetLoading(true);

      if (googleResult) {
        console.log("Google Creative Result:", googleResult.data);
        generate("GOOGLE ADS", productId, googleResult.data);
        isLoading[0] = false;
      }

      if (instagramResult) {
        for (let i = 0; i < 10; i++) {
          setIsCreativeSetLoading(true);
          // if (facebookResult && isLoading[1]) {
          //   const creativeSet = await getCreativeSet({
          //     creativeSetId: facebookResult.creativeSetId,
          //     token,
          //   });
          //   console.log("Facebook Creative Set Status:", creativeSet.status);
          //   if (creativeSet.status === "completed") {
          //     isLoading[1] = false;
          //     generate("FACEBOOK", productId, creativeSet.urls);
          //   }
          // }
          if (instagramResult && isLoading[1]) {
            const creativeSet = await getCreativeSet({
              creativeSetId: instagramResult.creativeSetId,
              token,
            });
            console.log("Media Creative Set Status:", creativeSet.status);
            if (creativeSet.status === "completed") {
              isLoading[1] = false;
              if (supportedAdPlatforms.Instagram)
                generate("INSTAGRAM", productId, creativeSet.urls);
              if (supportedAdPlatforms.Facebook)
                generate("FACEBOOK", productId, creativeSet.urls);
            }
          }
          if (isLoading.every((loading) => loading === false)) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      }

      actions.completeAdsPlatform();
      setIsCreativeSetLoading(false);
      router.push("/create-campaign/campaign-snapshots");
    }
  };
  const initialGeneration = () => {
    const platforms: Platform[] = [];
    if (supportedAdPlatforms.Facebook) platforms.push("FACEBOOK");
    if (supportedAdPlatforms.Instagram) platforms.push("INSTAGRAM");
    if (supportedAdPlatforms.Google) platforms.push("GOOGLE ADS");
    console.log(
      "Initial generation for platforms:",
      productSelection.products[0].node.id,
      platforms
    );
    setCurrentProductId(productSelection.products[0].node.id);
    generateCreatives(productSelection.products[0].node.id, platforms);
  };

  return {
    generateCreatives,
    loading:
      googleCreativeIsPending || mediaCreativeIsPending || isCreativeSetLoading,
    initialGeneration,
  };
};
