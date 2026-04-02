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
    (state) => state.campaignSnapshots.brandColor,
  );
  const brandAccent = useCreateCampaignStore(
    (state) => state.campaignSnapshots.accentColor,
  );
  const brandName = useSetupStore((state) => state.businessDetails.storeName);
  const toneOfVoice = useBrandAssetStore((state) => state.toneOfVoice);
  const campaignType = useCreateCampaignStore(
    (state) => state.campaignSnapshots.campaignType,
  );
  // const campaignName = useCreateCampaignStore(
  //   (state) => state.campaignSnapshots.campaignName
  // );
  const creativeLoadingStates = useUIStore(
    (state) => state.creativeLoadingState,
  );

  const creativeLoadingRef = useRef<Record<string, Record<Platform, boolean>>>(
    {},
  );

  const setCreativeLoadingStates = useUIStore(
    (state) => state.actions.setCreativeLoadingState,
  );

  const [, setCurrentProductId] = useState<string | null>(null);
  // const router = useRouter();
  const generate = useCreativesStore((state) => state.actions.generate);
  const supportedAdPlatforms = useCreateCampaignStore(
    (state) => state.supportedAdPlatforms,
  );

  // const [isCreativeSetLoading] = useState(false);
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
        console.error("Error generating Google creatives", error);
      },
    });

  const { mutateAsync: mediaMutate, isPending: mediaCreativeIsPending } =
    useMutation({
      mutationFn: generateMediaCreatives,
      onSuccess: (data: any) => {
        // if (data.success) {
        //   actions.completeAdsPlatform();
        //   generate("FACEBOOK", currentProductId!, data.data);
        //   router.push("/create-campaign/campaign-snapshots");
        // }
      },
      onError: (error) => {
        console.error("Error generating Media creatives", error);
      },
    });

  const generateCreatives = async (
    productId: string,
    platforms?: Platform[],
  ) => {
    const product = productSelection.products.find(
      (p) => p.node.id === productId,
    );

    const generatorId = `gen-${Math.random().toString(36).substring(2, 15)}`;
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
      channel: "FACEBOOK",
      productFeatures: [
        ...(product.node?.tags || []),
        product.node?.category?.name || "",
        product.node?.productType || "",
        product.node?.handle || "",
      ],
      tone: toneOfVoice || "friendly",
      brandName,
      productImages: new Array(5).fill(
        product.node.media.edges[0]?.node.preview.image.url || "",
      ),
      campaignType: campaignType || "Product Launch",
      type: "IMAGE",
      brandColor: primaryBrandColor || "#000000",
      brandAccent: brandAccent || "#FFFFFF",
      siteUrl: product.node.onlineStorePreviewUrl || "",
    };

    const generateForGoogleAds = async () => {
      const isLoading =
        creativeLoadingRef.current[productId]?.["GOOGLE ADS"] === true;
      if (!isLoading && platforms?.length && platforms.includes("GOOGLE ADS")) {
        if (platforms.includes("GOOGLE ADS")) {
          creativeLoadingRef.current[productId]["GOOGLE ADS"] = true;
          setCreativeLoadingStates(
            productId,
            creativeLoadingRef.current[productId],
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
    const generateForFacebook = async () => {
      const isLoading =
        creativeLoadingRef.current[productId]?.["FACEBOOK"] === true;
      if (!isLoading && platforms?.length && platforms.includes("FACEBOOK")) {
        creativeLoadingRef.current[productId]["FACEBOOK"] = true;
        generate("FACEBOOK", productId, null, generatorId);
        setCreativeLoadingStates(
          productId,
          creativeLoadingRef.current[productId],
        );
        return mediaMutate({
          token,
          product: mediaCreativeProduct,
        });
      }
      return Promise.resolve(null);
    };

    if (platforms?.length) {
      const loadingStates: Record<Platform, boolean> = {
        "GOOGLE ADS": false,
        FACEBOOK: false,
      };

      creativeLoadingRef.current[productId] = loadingStates;
      setCreativeLoadingStates(productId, loadingStates);
      const [googleResult, mediaResult] = await Promise.allSettled([
        generateForGoogleAds(),
        generateForFacebook(),
      ]);

      if (googleResult.status === "fulfilled") {
        const googlePayload: any = googleResult.value;
        const googleCreatives = googlePayload?.data ?? googlePayload;

        if (
          googleCreatives &&
          (Array.isArray(googleCreatives) ? googleCreatives.length > 0 : true)
        ) {
          generate("GOOGLE ADS", productId, googleCreatives, generatorId);
        }

        loadingStates["GOOGLE ADS"] = false;
      }

      setCreativeLoadingStates(productId, loadingStates);
      creativeLoadingRef.current[productId] = loadingStates;
      // const isInstagram = platforms.includes("INSTAGRAM");
      // const isFacebook = platforms.includes("FACEBOOK");

      if (mediaResult.status === "fulfilled" && mediaResult.value) {
        for (let i = 0; i < 10; i++) {
          try {
            const creativeSet = await getCreativeSet({
              creativeSetId: mediaResult.value.creativeSetId,
              token,
            });

            if (creativeSet.creatives && creativeSet.creatives.length > 0) {
              const creatives = creativeSet.creatives.map((creative: any) => ({
                ...creative,
                id: mediaResult.value.creativeSetId,
                caption: creative.bodyText,
              }));

              if (platforms.includes("FACEBOOK")) {
                generate("FACEBOOK", productId, creatives, generatorId);
              }
            }
            if (
              (creativeSet.creatives.length > 4 &&
                creativeSet.status === "completed") ||
              creativeSet.status === "failed"
            ) {
              break;
            }

            await new Promise((resolve) => setTimeout(resolve, 10000));
          } catch (error) {
            console.error("Error fetching creative set:", error);
            if (platforms.includes("FACEBOOK")) {
              loadingStates["FACEBOOK"] = false;
            }
            creativeLoadingRef.current[productId] = loadingStates;
            break;
          }
        }
      }
      if (platforms.includes("FACEBOOK")) loadingStates["FACEBOOK"] = false;
      if (platforms.includes("GOOGLE ADS")) loadingStates["GOOGLE ADS"] = false;
      // actions.completeAdsPlatform();
      creativeLoadingRef.current[productId] = loadingStates;
      setCreativeLoadingStates(productId, loadingStates);

      // router.push("/create-campaign/campaign-snapshots");
    }
  };
  const initialGeneration = () => {
    const platforms: Platform[] = [];
    if (supportedAdPlatforms.Facebook) platforms.push("FACEBOOK");
    if (supportedAdPlatforms.Google) platforms.push("GOOGLE ADS");

    setCurrentProductId(productSelection.products[0].node.id);
    generateCreatives(productSelection.products[0].node.id, platforms);
  };

  return {
    generateCreatives,
    loading: googleCreativeIsPending || mediaCreativeIsPending,
    initialGeneration,
    creativeLoadingStates,
    creativeLoadingRef: creativeLoadingRef.current,
  };
};
