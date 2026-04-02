"use client";
import { ArrowCircleRight2, ArrowDown2, ArrowForward } from "iconsax-react";
import UndoIcon from "@/public/undo.png";
import Image from "next/image";
import {
  CampaignSnapshots,
  useCreateCampaignStore,
} from "@/app/lib/stores/createCampaignStore";
import { useEffect, useMemo, useRef, useState } from "react";
import DateSelection from "@/app/ui/campaign-snapshots/DateSelection";
import Preview from "@/app/ui/campaign-snapshots/Preview";
import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";
import Product from "@/app/ui/campaign-snapshots/Product";
import useCreativesStore from "@/app/lib/stores/creativesStore";
import { Platform, ShopifyProduct } from "@/type";
import { useGenerateCreatives } from "@/app/lib/hooks/creatives";
import ProductsForGeneration from "@/app/ui/campaign-snapshots/ProductsForGeneration";
import Input from "@/app/ui/form/Input";
import useUIStore from "@/app/lib/stores/uiStore";
import useBrandAssetStore from "@/app/lib/stores/brandAssetStore";
import { useToastStore } from "@/app/lib/stores/toastStore";
import { buildLaunchCampaignPayload } from "@/app/lib/campaignPayload";
import { useSetupStore } from "@/app/lib/stores/setupStore";

const ProductContainer = ({
  products,
  highlightedProduct,
  handleSetHighlightedProduct,
}: {
  products: ShopifyProduct[];
  highlightedProduct: ShopifyProduct | null;
  handleSetHighlightedProduct: (product: ShopifyProduct) => void;
}) => {
  return (
    <div className="w-[224px] sticky custom-shadow-sm top-20 flex-shrink-0 flex flex-col gap-6 px-1 py-6 bg-[#FBFAFC] rounded-3xl max-h-[calc(100vh-200px)]">
      <div className="flex justify-between gap-2 px-3">
        <span className="text-sm font-medium">Products</span>
        <span>
          <ArrowDown2 size={12} color="#000" />
        </span>
      </div>
      <div className="flex flex-col w-full gap-5 flex-1 break-words pink-scroll overflow-x-hidden overflow-y-auto px-3">
        {products.map((product) => (
          <Product
            product={product}
            key={product.node.id}
            highlightedProduct={highlightedProduct}
            handleSetHighlightedProduct={handleSetHighlightedProduct}
          />
        ))}
      </div>
    </div>
  );
};

const MainActions = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isOnlyGoogle,
  canUndo,
  highlightedProduct,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loading,
  generalUndo,
}: {
  isOnlyGoogle?: boolean;
  canUndo: (id: string) => boolean;
  highlightedProduct: ShopifyProduct;
  loading: boolean;
  generalUndo: (productId: string) => void;
}) => {
  const creativeLoadingStates = useUIStore(
    (state) => state.creativeLoadingState,
  );
  const isLoading = useMemo(() => {
    return (
      creativeLoadingStates?.[highlightedProduct?.node.id || ""] &&
      Object.values(
        creativeLoadingStates?.[highlightedProduct?.node.id || ""] || {},
      ).some((state) => state === true)
    );
  }, [creativeLoadingStates, highlightedProduct?.node.id]);
  return (
    <div className="flex gap-2 md:gap-3">
      {canUndo(highlightedProduct?.node?.id) && (
        <button
          disabled={isLoading}
          onClick={() => generalUndo(highlightedProduct?.node?.id)}
          className={`flex items-center gap-2 h-[40px] w-[115px] md:w-[134px] rounded-[39px]  border justify-center ${
            !isLoading
              ? "bg-[#F0E6FB] border-[#D0B0F3] border"
              : "bg-[#ECECEC] cursor-not-allowed border border-[#E0E0E0]"
          }`}
        >
          {isLoading ? (
            <ArrowForward
              size={18}
              color="#000"
              className="-mt-[2px] -scale-x-100"
            />
          ) : (
            <Image src={UndoIcon} alt="Undo" width={20} height={20} />
          )}
          <span className="text-sm font-medium">Undo</span>
        </button>
      )}
    </div>
  );
};

export default function CampaignSnapshotsPage() {
  const {
    productSelection,
    supportedAdPlatforms,
    facebookSettings,
    googleSettings,
    attachedAssets,
  } = useCreateCampaignStore((state) => state);
  const { canUndo } = useCreativesStore((state) => state.actions);
  const { Google, Facebook } = useCreativesStore((state) => state);
  const { generalUndo } = useCreativesStore((state) => state.actions);
  const [adPlatforms, setAdPlatforms] = useState<any[]>([]);

  const actions = useCreateCampaignStore((state) => state.actions);

  const [highlightedProduct, setHighlightedProduct] =
    useState<ShopifyProduct | null>(productSelection.products[0] || null);
  const { generateCreatives, loading } = useGenerateCreatives();

  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const creativeLoadingStates = useUIStore(
    (state) => state.creativeLoadingState,
  );

  useEffect(() => {
    const resultAdPlatforms = Object.keys(supportedAdPlatforms)
      .filter(
        (platform) =>
          platform !== "complete" &&
          supportedAdPlatforms[platform as keyof typeof supportedAdPlatforms],
      )
      .map((platform) => ({
        title: platform as "Facebook" | "Google",
        platform:
          platform === "Google"
            ? "GOOGLE ADS"
            : (platform.toUpperCase() as Platform),
        image: `/${platform.toLowerCase()}_logo.svg`,
        settings: {
          ...(platform === "Facebook" ? facebookSettings : googleSettings),
        },
        creatives: highlightedProduct?.node?.id
          ? platform === "Google"
            ? (Google?.[highlightedProduct.node.id] ?? [])
            : platform === "Facebook"
              ? (Facebook?.[highlightedProduct.node.id] ?? [])
              : []
          : [],
      }))
      .sort((a, b) => {
        const order = { Google: 0, Facebook: 1 };
        return order[a.title] - order[b.title];
      });
    setAdPlatforms(resultAdPlatforms);
  }, [
    supportedAdPlatforms,
    facebookSettings,
    googleSettings,
    highlightedProduct?.node.id,
    Google?.[highlightedProduct?.node.id || ""],
    Facebook?.[highlightedProduct?.node.id || ""],
  ]);

  const setToast = useToastStore((state) => state.setToast);
  const businessDetails = useSetupStore((state) => state.businessDetails);

  const campaignDetails = useCreateCampaignStore(
    (state) => state.campaignSnapshots,
  );
  const setCampaignDetails = useCreateCampaignStore(
    (state) => state.actions.storeCampaignSnapshots,
  );

  useEffect(() => {
    if (!highlightedProduct?.node?.onlineStorePreviewUrl) return;
    if (campaignDetails.destinationUrl?.trim()) return;

    setCampaignDetails({
      ...campaignDetails,
      destinationUrl: highlightedProduct.node.onlineStorePreviewUrl,
    });
  }, [campaignDetails, highlightedProduct?.node?.onlineStorePreviewUrl]);

  const primaryColor = useBrandAssetStore((state) => state.primaryColor);
  const secondaryColor = useBrandAssetStore((state) => state.secondaryColor);

  useEffect(() => {
    if (
      campaignDetails.brandColor?.trim() ||
      campaignDetails.accentColor?.trim()
    ) {
      return;
    }

    if (!primaryColor?.trim() && !secondaryColor?.trim()) {
      return;
    }

    setCampaignDetails({
      brandColor: primaryColor,
      accentColor: secondaryColor,
    });
  }, [
    campaignDetails.accentColor,
    campaignDetails.brandColor,
    primaryColor,
    secondaryColor,
  ]);

  const [error, setError] = useState(false);
  const [destinationUrlError, setDestinationUrlError] = useState<string>("");
  const initialCampaignDetailsRef = useRef<string>("");

  const isValidHttpUrl = (value: string) => {
    if (!value) return false;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleCampaignDetails = (
    key: keyof CampaignSnapshots,
    value: string,
  ) => {
    // setCampaignDetails((prev) => ({ ...prev, [key]: value }));
    setCampaignDetails({ ...campaignDetails, [key]: value });
  };

  const clampBudget = (raw: string) => {
    if (!raw) return "";
    const n = Number(raw);
    if (!Number.isFinite(n)) return "";
    return `${Math.max(5, n)}`;
  };

  useEffect(() => {
    if (!initialCampaignDetailsRef.current) {
      initialCampaignDetailsRef.current = JSON.stringify(campaignDetails);
    }
  }, [campaignDetails]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const initial = initialCampaignDetailsRef.current;
      const current = JSON.stringify(campaignDetails);
      if (initial && initial !== current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [campaignDetails]);

  const isLoading = useMemo(() => {
    return productSelection.products.some((product) => {
      return (
        creativeLoadingStates?.[product?.node.id]?.["GOOGLE ADS"] ||
        creativeLoadingStates?.[product?.node.id]?.["FACEBOOK"] ||
        creativeLoadingStates?.[product?.node.id]?.["INSTAGRAM"]
      );
    });
  }, [productSelection.products, creativeLoadingStates]);

  const campaignPayloadHasCreatives = (
    payload: ReturnType<typeof buildLaunchCampaignPayload>,
  ) => {
    const products = Array.isArray(payload?.products) ? payload.products : [];
    if (products.length === 0) return false;

    return products.every((p) => {
      const creatives = Array.isArray((p as any)?.creatives)
        ? (p as any).creatives
        : [];

      if (supportedAdPlatforms.Facebook) {
        const fb = creatives.find((c: any) => c?.channel === "facebook");
        if (!fb || !Array.isArray(fb.data) || fb.data.length === 0) {
          return false;
        }
      }

      // if (supportedAdPlatforms.Instagram) {
      //   const ig = creatives.find((c: any) => c?.channel === "instagram");
      //   if (!ig || !Array.isArray(ig.data) || ig.data.length === 0) {
      //     return false;
      //   }
      // }

      if (supportedAdPlatforms.Google) {
        const g = creatives.find((c: any) => c?.channel === "google");
        if (!g || !Array.isArray(g.data) || g.data.length === 0) {
          return false;
        }
      }

      return true;
    });
  };

  const handleProceed = () => {
    if (campaignDetails.campaignName.trim() === "") {
      setError(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    } else if (!isValidHttpUrl(campaignDetails.destinationUrl)) {
      setDestinationUrlError("Please enter a valid URL");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    } else if (isLoading) {
      setToast({
        type: "warning",
        message: "Please wait for the creatives to finish generating.",
        title: "Generation in Progress",
      });
      return;
    } else {
      setError(false);
    }

    const businessId = businessDetails?.id;
    if (!businessId) {
      setToast({
        type: "error",
        title: "Missing business",
        message: "Business details are missing. Please refresh and try again.",
      });
      return;
    }

    const campaignPayload = buildLaunchCampaignPayload({
      businessId,
      campaignName: campaignDetails.campaignName,
      campaignType: campaignDetails.campaignType || "Product Launch",
      brandColor: campaignDetails.brandColor || primaryColor || "#000000",
      accentColor: campaignDetails.accentColor || secondaryColor || "#FFFFFF",
      tone: "Professional",
      startDateIso: campaignDetails.campaignStartDate,
      endDateIso: campaignDetails.campaignEndDate,
      totalBudget: Number(campaignDetails.googleDailyBudget || "0"),
      products: productSelection.products,
      locations: useCreateCampaignStore.getState().adsShow.location,
      supportedAdPlatforms,
      creativesStore: { Google, Facebook },
      attachedAssets: attachedAssets?.assets,
    });

    if (!campaignPayloadHasCreatives(campaignPayload)) {
      setToast({
        type: "error",
        message:
          "Some selected products don’t have creatives yet. Please generate creatives for all selected products to continue.",
        title: "Creatives Missing",
      });
      return;
    }

    actions.storeCampaignSnapshots({
      campaignName: campaignDetails.campaignName,
      campaignType: campaignDetails.campaignType || "Product Launch",
      brandColor: campaignDetails.brandColor || primaryColor || "#000000",
      accentColor: campaignDetails.accentColor || secondaryColor || "#FFFFFF",
      destinationUrl: campaignDetails.destinationUrl,
      googleDailyBudget: clampBudget(campaignDetails.googleDailyBudget) || "5",
      metaDailyBudget: clampBudget(campaignDetails.metaDailyBudget) || "5",
      campaignStartDate: new Date(
        campaignDetails.campaignStartDate,
      ).toISOString(),
      campaignEndDate: new Date(campaignDetails.campaignEndDate).toISOString(),
      campaignPayload,
    });
    actions.completeCampaignSnapshots();
    router.push("/create-campaign/review");
  };

  useEffect(() => {
    if (!supportedAdPlatforms.complete) {
      router.push("/create-campaign/");
    }
  }, []);

  // useEffect(() => {
  //   // window.scrollTo({ top: 0, behavior: "instant" });
  // }, [highlightedProduct?.node.id]);

  const isOnlyGoogle = supportedAdPlatforms.Google && adPlatforms.length === 1;

  const handleSetHighlightedProduct = (product: ShopifyProduct) => {
    setHighlightedProduct(product);
  };

  const products = productSelection.products;
  return (
    <div className="flex items-start flex-shrink-0 gap-6 mt-6 pb-12">
      {products.length > 0 && (
        <div className="hidden w-[224px] lg:block sticky top-20 flex-shrink-0">
          <ProductContainer
            highlightedProduct={highlightedProduct}
            products={products}
            handleSetHighlightedProduct={handleSetHighlightedProduct}
          />
        </div>
      )}
      <div className="w-full lg:w-[calc(100%-248px)] max-w-full">
        <div className="flex px-5 lg:pl-0 lg:pr-5 flex-col lg:flex-row gap-3 justify-between">
          <div className="flex flex-col lg:flex-row gap-3 justify-between">
            <div>
              <h1 className="text-xl tracking-40 md:text-2xl font-medium md:font-bold text-heading md:tracking-800">
                <span className="num">4. </span>
                <span>Campaign Snapshot</span>
              </h1>
              <p className="mt-[0.38rem] text-neutral-light tracking-40 text-xs md:text-sm my-2 md:my-0">
                Here's a view of how your brand will be showcased across
                multiple ad platforms.
              </p>
            </div>
          </div>
          <div className="hidden px-5 lg:pl-0 lg:pr-5 lg:block">
            {highlightedProduct && (
              <MainActions
                isOnlyGoogle={isOnlyGoogle}
                canUndo={canUndo}
                highlightedProduct={highlightedProduct}
                loading={loading}
                generalUndo={generalUndo}
              />
            )}
          </div>
        </div>
        <div className="px-5 lg:pl-0 lg:pr-5">
          <ProductsForGeneration
            highlightedProductId={highlightedProduct?.node.id || "1"}
            setHighlightedProduct={setHighlightedProduct}
          />
        </div>
        <div className="flex px-5 lg:pl-0 lg:pr-5 flex-row justify-end mt-6 lg:hidden">
          {highlightedProduct && (
            <MainActions
              isOnlyGoogle={isOnlyGoogle}
              canUndo={canUndo}
              highlightedProduct={highlightedProduct}
              loading={loading}
              generalUndo={generalUndo}
            />
          )}
        </div>
        <div className="mt-6 px-5 lg:pl-0 lg:pr-5">
          <Input
            type="text"
            label="Campaign Name"
            name="campaignName"
            placeholder="My Campaign"
            large
            onBlur={() => {
              setError(false);
            }}
            background="rgba(232,232,232,0.35)"
            borderless
            error={error ? "Campaign name is required" : ""}
            value={campaignDetails.campaignName}
            onChange={(e) =>
              handleCampaignDetails("campaignName", e.target.value)
            }
          />
          {error && (
            <div className="text-[#BE343B] text-xs mt-1">
              Campaign name is required
            </div>
          )}
        </div>
        <div className="mt-5 px-5 lg:pl-0 lg:pr-5">
          <Input
            type="url"
            label="Destination URL"
            name="destinationUrl"
            placeholder="https://yourstore.com/products/lilac-dress"
            large
            background="rgba(232,232,232,0.35)"
            borderless
            error={destinationUrlError}
            showErrorMessage
            value={campaignDetails.destinationUrl}
            onBlur={() => {
              if (!campaignDetails.destinationUrl) {
                setDestinationUrlError("Destination URL is required");
                return;
              }
              if (!isValidHttpUrl(campaignDetails.destinationUrl)) {
                setDestinationUrlError("Please enter a valid URL");
                return;
              }
              setDestinationUrlError("");
            }}
            onChange={(e) => {
              handleCampaignDetails("destinationUrl", e.target.value);
              if (destinationUrlError) {
                setDestinationUrlError("");
              }
            }}
          />
          <p className="mt-2 text-neutral-light tracking-40 text-xs md:text-sm">
            Where customers land after they click your ad.
          </p>
        </div>

        <div className="mt-5 px-5 lg:pl-0 lg:pr-5">
          <div className="text-sm font-medium text-heading">Daily Budget</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Google Daily Budget ($)"
              name="googleDailyBudget"
              placeholder="5"
              large
              background="rgba(232,232,232,0.35)"
              borderless
              min={5}
              step={1}
              value={campaignDetails.googleDailyBudget}
              onChange={(e) =>
                handleCampaignDetails("googleDailyBudget", e.target.value)
              }
              onBlur={() => {
                handleCampaignDetails(
                  "googleDailyBudget",
                  clampBudget(campaignDetails.googleDailyBudget) || "5",
                );
              }}
            />
            {supportedAdPlatforms.Facebook && (
              <Input
                type="number"
                label="Meta Daily Budget ($)"
                name="metaDailyBudget"
                placeholder="5"
                large
                background="rgba(232,232,232,0.35)"
                borderless
                min={5}
                step={1}
                value={campaignDetails.metaDailyBudget}
                onChange={(e) =>
                  handleCampaignDetails("metaDailyBudget", e.target.value)
                }
                onBlur={() => {
                  handleCampaignDetails(
                    "metaDailyBudget",
                    clampBudget(campaignDetails.metaDailyBudget) || "5",
                  );
                }}
              />
            )}
          </div>
          <p className="mt-2 text-neutral-light tracking-40 text-xs md:text-sm">
            Minimum daily budget is $5.
          </p>
        </div>
        <div className="px-5 lg:pl-0 lg:pr-5">
          <DateSelection
            setStartDate={(date: Date) =>
              handleCampaignDetails("campaignStartDate", date.toISOString())
            }
            setEndDate={(date: Date) =>
              handleCampaignDetails("campaignEndDate", date.toISOString())
            }
          />
        </div>
        <div className="mt-10">
          <Preview
            key={highlightedProduct?.node.id || "1"}
            adPlatforms={adPlatforms}
            highlightedProductId={highlightedProduct?.node.id || "1"}
            generateCreatives={generateCreatives}
            loading={loading}
          />
        </div>
        <div className="mt-5 md:mt-20 px-5 lg:pl-0 lg:pr-5 sm:max-w-[200px] mx-auto">
          <Button
            text="Proceed"
            action={handleProceed}
            hasIconOrLoader
            disabled={isLoading}
            icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
            iconPosition="right"
            iconSize={16}
          />
        </div>
      </div>
    </div>
  );
}
