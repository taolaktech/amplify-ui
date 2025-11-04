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
import { useCreateCampaignStore } from "../stores/createCampaignStore";
import { useSetupStore } from "../stores/setupStore";
import useBrandAssetStore from "../stores/brandAssetStore";
import useCreativesStore from "../stores/creativesStore";
import { useRef, useState } from "react";
import { Platform } from "@/type";

import useUIStore from "../stores/uiStore";

export const useGenerateCreatives = () => {
  const token = useAuthStore((state) => state.token);
  const primaryBrandColor = useCreateCampaignStore(
    (state) => state.campaignSnapshots.brandColor
  );
  const brandAccent = useCreateCampaignStore(
    (state) => state.campaignSnapshots.accentColor
  );
  const brandName = useSetupStore((state) => state.businessDetails.storeName);
  const toneOfVoice = useBrandAssetStore((state) => state.toneOfVoice);
  const campaignType = useCreateCampaignStore(
    (state) => state.campaignSnapshots.campaignType
  );
  // const campaignName = useCreateCampaignStore(
  //   (state) => state.campaignSnapshots.campaignName
  // );
  const creativeLoadingStates = useUIStore(
    (state) => state.creativeLoadingState
  );

  const creativeLoadingRef = useRef<Record<string, Record<Platform, boolean>>>(
    {}
  );

  const setCreativeLoadingStates = useUIStore(
    (state) => state.actions.setCreativeLoadingState
  );

  const [, setCurrentProductId] = useState<string | null>(null);
  // const router = useRouter();
  const generate = useCreativesStore((state) => state.actions.generate);
  const supportedAdPlatforms = useCreateCampaignStore(
    (state) => state.supportedAdPlatforms
  );

  const [isCreativeSetLoading] = useState(false);
  // const products = useUIStore((state) => state.products);
  const { productSelection } = useCreateCampaignStore((state) => state);

  // const actions = useCreateCampaignStore((state) => state.actions);
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
    console.log("Generating creatives for product:", productId);
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
      const isLoading =
        creativeLoadingRef.current[productId]?.["GOOGLE ADS"] === true;
      console.log("Google Ads loading state for", productId, ":", isLoading);
      if (!isLoading && platforms?.length && platforms.includes("GOOGLE ADS")) {
        if (platforms.includes("GOOGLE ADS")) {
          creativeLoadingRef.current[productId]["GOOGLE ADS"] = true;
          setCreativeLoadingStates(
            productId,
            creativeLoadingRef.current[productId]
          );
        }

        return googleMutate({ token, googleCreativesProduct: creativeProduct });
      }
      // creativeLoadingRef.current[productId]["GOOGLE ADS"] = false;
      // setCreativeLoadingStates(
      //   productId,
      //   creativeLoadingRef.current[productId]
      // );
      return Promise.resolve(null);
    };
    const generateForInstagram = async () => {
      const isLoading =
        creativeLoadingRef.current[productId]?.["INSTAGRAM"] === true;
      console.log("Instagram loading state for", productId, ":", isLoading);
      if (
        !isLoading &&
        platforms?.length &&
        (platforms.includes("INSTAGRAM") || platforms.includes("FACEBOOK"))
      ) {
        if (platforms.includes("INSTAGRAM")) {
          creativeLoadingRef.current[productId]["INSTAGRAM"] = true;
        }
        if (platforms.includes("FACEBOOK")) {
          creativeLoadingRef.current[productId]["FACEBOOK"] = true;
        }
        setCreativeLoadingStates(
          productId,
          creativeLoadingRef.current[productId]
        );
        return mediaMutate({
          token,
          product: { ...mediaCreativeProduct, channel: "INSTAGRAM" },
        });
      }
      // if (platforms?.includes("INSTAGRAM")) {
      //   creativeLoadingRef.current[productId]["INSTAGRAM"] = false;
      // }
      // if (platforms?.includes("FACEBOOK")) {
      //   creativeLoadingRef.current[productId]["FACEBOOK"] = false;
      // }
      // setCreativeLoadingStates(
      //   productId,
      //   creativeLoadingRef.current[productId]
      // );
      return Promise.resolve(null);
    };

    if (platforms?.length) {
      const loadingStates: Record<Platform, boolean> = {
        "GOOGLE ADS": false,
        FACEBOOK: false,
        INSTAGRAM: false,
      };

      creativeLoadingRef.current[productId] = loadingStates;
      setCreativeLoadingStates(productId, loadingStates);
      console.log("Starting generation for platforms:", platforms);
      const [googleResult, mediaResult] = await Promise.allSettled([
        generateForGoogleAds(),
        generateForInstagram(),
      ]);

      console.log("Results:", {
        googleResult,
        mediaResult,
      });

      if (googleResult.status === "fulfilled" && googleResult.value?.data) {
        console.log("Google Creative Result:", googleResult.value);
        generate("GOOGLE ADS", productId, googleResult.value?.data);
        loadingStates["GOOGLE ADS"] = false;
      }

      console.log("Platforms to generate:", platforms);

      setCreativeLoadingStates(productId, loadingStates);
      creativeLoadingRef.current[productId] = loadingStates;
      // const isInstagram = platforms.includes("INSTAGRAM");
      // const isFacebook = platforms.includes("FACEBOOK");

      if (mediaResult.status === "fulfilled" && mediaResult.value) {
        for (let i = 0; i < 10; i++) {
          const creativeSet = await getCreativeSet({
            creativeSetId: mediaResult.value.creativeSetId,
            token,
          });
          console.log("Media Creative Set Status:", creativeSet.status);
          if (creativeSet.status === "completed") {
            if (platforms.includes("INSTAGRAM"))
              loadingStates["INSTAGRAM"] = false;
            generate("INSTAGRAM", productId, creativeSet.urls);
            if (platforms.includes("FACEBOOK"))
              loadingStates["FACEBOOK"] = false;
            generate("FACEBOOK", productId, creativeSet.urls);
          }
          if (
            creativeSet.status === "completed" ||
            creativeSet.status === "failed"
          ) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      }
      loadingStates["INSTAGRAM"] = false;
      loadingStates["FACEBOOK"] = false;
      loadingStates["GOOGLE ADS"] = false;
      console.log("Generation completed for product:", productId);
      // actions.completeAdsPlatform();
      creativeLoadingRef.current[productId] = loadingStates;
      setCreativeLoadingStates(productId, loadingStates);

      // router.push("/create-campaign/campaign-snapshots");
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
    creativeLoadingStates,
    creativeLoadingRef: creativeLoadingRef.current,
  };
};
