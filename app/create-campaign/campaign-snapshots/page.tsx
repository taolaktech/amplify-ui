"use client";
import {
  ArrowCircleRight2,
  ArrowDown2,
  ArrowForward,
  Magicpen,
} from "iconsax-react";
import UndoIcon from "@/public/undo.png";
import RegenerateIcon from "@/public/magicpen.png";
import {
  CampaignSnapshots,
  useCreateCampaignStore,
} from "@/app/lib/stores/createCampaignStore";
import { useEffect, useMemo, useRef, useState } from "react";
import BrandColors from "@/app/ui/campaign-snapshots/BrandColors";
import DateSelection from "@/app/ui/campaign-snapshots/DateSelection";
import CampaignTypeInput from "@/app/ui/campaign-snapshots/CampaigtTypeInput";
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
import { getCampaignTypes } from "@/app/lib/campaignTypes";
import { useToastStore } from "@/app/lib/stores/toastStore";
import { isAllProductGenerated } from "@/app/lib/utils";

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
  generateCreatives,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loading,
  generalUndo,
}: {
  isOnlyGoogle?: boolean;
  canUndo: (id: string) => boolean;
  highlightedProduct: ShopifyProduct;
  generateCreatives: (productId: string, platform: Platform[]) => Promise<void>;
  loading: boolean;
  generalUndo: (productId: string) => void;
}) => {
  const supportedAdPlatforms = useCreateCampaignStore(
    (state) => state.supportedAdPlatforms
  );
  const creativeLoadingStates = useUIStore(
    (state) => state.creativeLoadingState
  );
  const isLoading = useMemo(() => {
    return (
      creativeLoadingStates?.[highlightedProduct?.node.id || ""] &&
      Object.values(
        creativeLoadingStates?.[highlightedProduct?.node.id || ""] || {}
      ).some((state) => state === true)
    );
  }, [creativeLoadingStates, highlightedProduct?.node.id]);

  console.log("Supported Ad Platforms in MainActions:", supportedAdPlatforms);
  const supportedPlatformArr = useMemo(() => {
    const platforms: Platform[] = [];
    if (!supportedAdPlatforms) {
      return platforms;
    }

    const platformMap: Record<string, Platform> = {
      Facebook: "FACEBOOK",
      Instagram: "INSTAGRAM",
      Google: "GOOGLE ADS",
    };

    // Treat supportedAdPlatforms as a string-keyed record so we can safely index with dynamic keys
    const supported = supportedAdPlatforms as Record<string, boolean>;

    Object.entries(platformMap).forEach(([key, platform]) => {
      if (supported[key] === true) {
        platforms.push(platform);
      }
    });

    return platforms;
  }, [supportedAdPlatforms]);
  return (
    <div className="flex gap-2 md:gap-3">
      {/* {!isOnlyGoogle && (
        <button className="flex items-center gap-2 h-[40px] w-[115px] md:w-[134px] rounded-[39px]  justify-center bg-[#F0E6FB] border-[#D0B0F3] border ">
          
          <img
            src={MagicStarIcon.src}
            alt="Magic Star"
            width={20}
            height={20}
          />
          <span className="text-sm font-medium">Mix</span>
        </button>
      )} */}
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
            <img src={UndoIcon.src} alt="Undo" width={20} height={20} />
          )}
          <span className="text-sm font-medium">Undo</span>
        </button>
      )}

      <button
        disabled={isLoading}
        onClick={() => {
          console.log("Supported Platform Array:", supportedAdPlatforms);
          console.log(
            "Regenerate clicked for",
            highlightedProduct?.node?.id,
            supportedPlatformArr
          );
          generateCreatives(highlightedProduct?.node?.id, supportedPlatformArr);
        }}
        className={`flex items-center gap-2 h-[40px] w-[134px] rounded-[39px]  justify-center ${
          !isLoading
            ? "bg-[#F0E6FB] border-[#D0B0F3] border"
            : "bg-[#ECECEC] cursor-not-allowed border border-[#E0E0E0]"
        }`}
      >
        {isLoading ? (
          <Magicpen size={18} color="#000" />
        ) : (
          <img src={RegenerateIcon.src} alt="Generate" width={20} height={20} />
        )}
        <span className="text-sm font-medium">Regenerate</span>
      </button>
    </div>
  );
};

const productTypes = getCampaignTypes();

export default function CampaignSnapshotsPage() {
  const {
    productSelection,
    supportedAdPlatforms,
    instagramSettings,
    facebookSettings,
    googleSettings,
  } = useCreateCampaignStore((state) => state);
  const { canUndo } = useCreativesStore((state) => state.actions);
  const { Google, Instagram, Facebook } = useCreativesStore((state) => state);
  const { generalUndo } = useCreativesStore((state) => state.actions);
  const [adPlatforms, setAdPlatforms] = useState<any[]>([]);

  const actions = useCreateCampaignStore((state) => state.actions);

  const [highlightedProduct, setHighlightedProduct] =
    useState<ShopifyProduct | null>(productSelection.products[0] || null);
  const { generateCreatives, loading, creativeLoadingRef } =
    useGenerateCreatives();

  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const creativeLoadingStates = useUIStore(
    (state) => state.creativeLoadingState
  );

  const hasRunRef = useRef<{ [key: string]: boolean }>({});
  useEffect(() => {
    const productId = highlightedProduct?.node.id;
    if (!productId || hasRunRef.current[productId]) return;

    const activePlatforms = [];
    if (supportedAdPlatforms.Google) activePlatforms.push("GOOGLE ADS");
    if (supportedAdPlatforms.Instagram) activePlatforms.push("INSTAGRAM");
    if (supportedAdPlatforms.Facebook) activePlatforms.push("FACEBOOK");

    const isLoading =
      creativeLoadingRef?.[productId] &&
      Object.values(creativeLoadingRef[productId] || {}).some(
        (state) => state === true
      );

    console.log("Auto-generating creatives for", productId, activePlatforms);
    console.log("Is Loading:", isLoading);
    console.log(creativeLoadingRef);

    if (isLoading) return;

    const hasCreative =
      (supportedAdPlatforms.Google && Google?.[productId]) ||
      (supportedAdPlatforms.Instagram && Instagram?.[productId]) ||
      (supportedAdPlatforms.Facebook && Facebook?.[productId]);

    if (!hasCreative) {
      hasRunRef.current[productId] = true;
      generateCreatives(productId, activePlatforms as Platform[]);
    }
  }, [highlightedProduct?.node.id]);

  useEffect(() => {
    const resultAdPlatforms = Object.keys(supportedAdPlatforms)
      .filter(
        (platform) =>
          platform !== "complete" &&
          supportedAdPlatforms[platform as keyof typeof supportedAdPlatforms]
      )
      .map((platform) => ({
        title: platform as "Instagram" | "Facebook" | "Google",
        platform:
          platform === "Google"
            ? "GOOGLE ADS"
            : (platform.toUpperCase() as Platform),
        image: `/${platform.toLowerCase()}_logo.svg`,
        settings: {
          ...(platform === "Instagram"
            ? instagramSettings
            : platform === "Facebook"
            ? facebookSettings
            : googleSettings),
        },
        creatives: highlightedProduct?.node?.id
          ? platform === "Google"
            ? Google?.[highlightedProduct.node.id] ?? []
            : platform === "Instagram"
            ? Instagram?.[highlightedProduct.node.id] ?? []
            : platform === "Facebook"
            ? Facebook?.[highlightedProduct.node.id] ?? []
            : []
          : [],
      }))
      .sort((a, b) => {
        const order = { Google: 0, Instagram: 1, Facebook: 2 };
        return order[a.title] - order[b.title];
      });
    setAdPlatforms(resultAdPlatforms);
    console.log("Ad Platforms:", resultAdPlatforms);
  }, [
    supportedAdPlatforms,
    instagramSettings,
    facebookSettings,
    googleSettings,
    highlightedProduct?.node.id,
    Google?.[highlightedProduct?.node.id || ""],
    Instagram?.[highlightedProduct?.node.id || ""],
    Facebook?.[highlightedProduct?.node.id || ""],
  ]);

  const setToast = useToastStore((state) => state.setToast);

  const campaignDetails = useCreateCampaignStore(
    (state) => state.campaignSnapshots
  );
  const setCampaignDetails = useCreateCampaignStore(
    (state) => state.actions.storeCampaignSnapshots
  );

  const primaryColor = useBrandAssetStore((state) => state.primaryColor);
  const secondaryColor = useBrandAssetStore((state) => state.secondaryColor);

  useEffect(() => {
    console.log("Current Campaign Details:", campaignDetails);
    console.log("Primary Color from Brand Assets:", primaryColor);
    console.log("Secondary Color from Brand Assets:", secondaryColor);
    setCampaignDetails({
      brandColor: primaryColor,
      accentColor: secondaryColor,
    });
  }, [primaryColor, secondaryColor]);

  const [error, setError] = useState(false);

  const handleCampaignDetails = (
    key: keyof CampaignSnapshots,
    value: string
  ) => {
    // setCampaignDetails((prev) => ({ ...prev, [key]: value }));
    setCampaignDetails({ ...campaignDetails, [key]: value });
  };

  const isLoading = useMemo(() => {
    return productSelection.products.some((product) => {
      return (
        creativeLoadingStates?.[product?.node.id]?.["GOOGLE ADS"] ||
        creativeLoadingStates?.[product?.node.id]?.["FACEBOOK"] ||
        creativeLoadingStates?.[product?.node.id]?.["INSTAGRAM"]
      );
    });
  }, [productSelection.products, creativeLoadingStates]);

  const handleProceed = () => {
    if (campaignDetails.campaignName.trim() === "") {
      setError(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    } else if (isLoading) {
      setToast({
        type: "warning",
        message: "Please wait for the creatives to finish generating.",
        title: "Generation in Progress",
      });
      return;
    } else if (
      !isAllProductGenerated(
        supportedAdPlatforms,
        productSelection.products,
        Facebook,
        Google,
        Instagram
      )
    ) {
      setToast({
        type: "error",
        message:
          "Some selected products don’t have creatives yet. Please generate creatives for all selected products to continue.",
        title: "Creatives Missing",
      });
      return;
    } else {
      setError(false);
    }
    console.log("Proceed to next step", campaignDetails);
    actions.storeCampaignSnapshots({
      campaignName: campaignDetails.campaignName,
      campaignType: campaignDetails.campaignType,
      brandColor: campaignDetails.brandColor,
      accentColor: campaignDetails.accentColor,
      campaignStartDate: new Date(
        campaignDetails.campaignStartDate
      ).toISOString(),
      campaignEndDate: new Date(campaignDetails.campaignEndDate).toISOString(),
    });
    actions.completeCampaignSnapshots();
    router.push("/create-campaign/fund-campaign");
  };

  useEffect(() => {
    if (!supportedAdPlatforms.complete) {
      router.push("/create-campaign/");
    }
  }, []);

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
                <span>Campaign Snapshots</span>
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
                generateCreatives={generateCreatives}
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
              generateCreatives={generateCreatives}
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
              console.log("onBlur");
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
        <div className="mt-5 px-5 lg:pl-0 lg:pr-5 flex flex-col md:flex-row gap-4 md:gap-14">
          <div className="flex-1">
            <div className="w-full">
              <CampaignTypeInput
                label="Campaign Type"
                placeholder="Product Launch"
                options={productTypes}
                background="rgba(232,232,232,0.35)"
                borderless
                selected={campaignDetails.campaignType}
                setSelected={(value: string) =>
                  handleCampaignDetails("campaignType", value)
                }
                large
                setError={() => {}}
              />
            </div>
          </div>
          {!isOnlyGoogle && (
            <BrandColors
              brandColor={campaignDetails.brandColor}
              accentColor={campaignDetails.accentColor}
              setBrandColor={(
                key: "brandColor" | "accentColor",
                value: string
              ) => handleCampaignDetails(key, value)}
            />
          )}
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
            icon={<ArrowCircleRight2 size="16" color="#FFFFFF" />}
            iconPosition="right"
            iconSize={16}
          />
        </div>
      </div>
      {/* {loading && <CircleLoaderModal text="Generating Ad Creatives..." />} */}
    </div>
  );
}
