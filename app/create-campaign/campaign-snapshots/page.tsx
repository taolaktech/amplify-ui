"use client";
import { ArrowCircleRight2, ArrowDown2 } from "iconsax-react";
import MagicStarIcon from "@/public/magic-star.png";
import UndoIcon from "@/public/undo.png";
import RegenerateIcon from "@/public/magicpen.png";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useEffect, useMemo, useState } from "react";
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
import CircleLoaderModal from "@/app/ui/modals/CircleLoaderModal";
import ProductsForGeneration from "@/app/ui/campaign-snapshots/ProductsForGeneration";
import Input from "@/app/ui/form/Input";

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
    <div className="w-[224px] sticky top-20 flex-shrink-0 flex flex-col gap-6 px-1 py-6 bg-[#FBFAFC] rounded-3xl max-h-[calc(100vh-200px)]">
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
  isOnlyGoogle,
  canUndo,
  highlightedProduct,
  generateCreatives,
  loading,
  generalUndo,
  supportedAdPlatforms,
}: {
  isOnlyGoogle?: boolean;
  canUndo: (id: string) => boolean;
  highlightedProduct: ShopifyProduct;
  generateCreatives: (productId: string, platform: Platform[]) => Promise<void>;
  loading: boolean;
  supportedAdPlatforms?: any;
  generalUndo: (productId: string) => void;
}) => {
  const supportedPlatformArr = useMemo(() => {
    const platforms: Platform[] = [];
    if (!supportedAdPlatforms) return platforms;

    if (supportedAdPlatforms.FACEBOOK) platforms.push("FACEBOOK");
    if (supportedAdPlatforms.INSTAGRAM) platforms.push("INSTAGRAM");
    if (supportedAdPlatforms["GOOGLE ADS"]) platforms.push("GOOGLE ADS");
    return platforms;
  }, [supportedAdPlatforms]);
  return (
    <div className="flex gap-2 md:gap-3">
      {!isOnlyGoogle && (
        <button className="flex items-center gap-2 h-[40px] w-[115px] md:w-[134px] rounded-[39px]  justify-center bg-[#F0E6FB] border-[#D0B0F3] border ">
          {/* <MagicStarIcon />
           */}
          <img
            src={MagicStarIcon.src}
            alt="Magic Star"
            width={20}
            height={20}
          />
          <span className="text-sm font-medium">Mix</span>
        </button>
      )}
      {canUndo(highlightedProduct?.node?.id) && (
        <button
          onClick={() => generalUndo(highlightedProduct?.node?.id)}
          className="flex items-center gap-2 h-[40px] w-[115px] md:w-[134px] rounded-[39px] bg-[#F0E6FB] border-[#D0B0F3] border justify-center "
        >
          <img src={UndoIcon.src} alt="Undo" width={20} height={20} />
          <span className="text-sm font-medium">Undo</span>
        </button>
      )}

      <button
        disabled={loading}
        onClick={() =>
          generateCreatives(highlightedProduct?.node?.id, supportedPlatformArr)
        }
        className="flex items-center gap-2 h-[40px] w-[134px] rounded-[39px]  justify-center bg-[#F0E6FB] border-[#D0B0F3] border "
      >
        <img src={RegenerateIcon.src} alt="Generate" width={20} height={20} />
        <span className="text-sm font-medium">Generate</span>
      </button>
    </div>
  );
};

const productTypes = [
  {
    label: "Introducing our Fall 2025 Line",
    recommended: true,
  },
  {
    label: "Autumn Vibes 2025 Collection",
    recommended: true,
  },
  {
    label: "Harvest Chic 2025 Lineup",
    recommended: false,
  },
  {
    label: "Crisp Leaves 2025 Series",
    recommended: false,
  },
  {
    label: "Fall Fashion Fest 2025",
    recommended: false,
  },
  {
    label: "Autumn Essentials 2025 Range",
    recommended: false,
  },
];

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
  const { generateCreatives, loading } = useGenerateCreatives();

  // const [creatives, setCreatives] = useState<any | null>({

  // });
  const router = useRouter();

  // const adPlatforms: {
  //   title: "Instagram" | "Facebook" | "Google";
  //   image: string;
  //   settings: any;
  //   creatives: any[];
  // }[];

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
    Google,
  ]);

  const [campaignDetails, setCampaignDetails] = useState({
    campaignType: "Product Launch",
    campaignName: "",
    brandColor: "#000000",
    accentColor: "#FFFFFF",
    campaignDescription: "",
    campaignStartDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    campaignEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  });
  const [error, setError] = useState(false);

  const handleCampaignDetails = (key: string, value: string) => {
    setCampaignDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleProceed = () => {
    if (campaignDetails.campaignName.trim() === "") {
      setError(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        <div className="hidden lg:block">
          <ProductContainer
            highlightedProduct={highlightedProduct}
            products={products}
            handleSetHighlightedProduct={handleSetHighlightedProduct}
          />
        </div>
      )}
      <div className="w-full lg:w-[calc(100%-224px)]">
        <div className="flex flex-col lg:flex-row gap-3 justify-between">
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
          <div className="hidden lg:block">
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
        <ProductsForGeneration
          highlightedProductId={highlightedProduct?.node.id || "1"}
          setHighlightedProduct={setHighlightedProduct}
        />
        <div className="flex flex-row justify-end mt-6 lg:hidden">
          {highlightedProduct && (
            <MainActions
              isOnlyGoogle={isOnlyGoogle}
              canUndo={canUndo}
              highlightedProduct={highlightedProduct}
              generateCreatives={generateCreatives}
              loading={loading}
              supportedAdPlatforms={supportedAdPlatforms}
              generalUndo={generalUndo}
            />
          )}
        </div>
        <div className="mt-6">
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
        <div className="mt-5 flex flex-col md:flex-row gap-4 md:gap-14">
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
        <DateSelection
          setStartDate={(date: Date) =>
            handleCampaignDetails("campaignStartDate", date.toISOString())
          }
          setEndDate={(date: Date) =>
            handleCampaignDetails("campaignEndDate", date.toISOString())
          }
        />
        <div className="mt-10">
          <Preview
            adPlatforms={adPlatforms}
            highlightedProductId={highlightedProduct?.node.id || "1"}
            generateCreatives={generateCreatives}
            loading={loading}
          />
        </div>
        <div className="mt-5 md:mt-20 sm:max-w-[200px] mx-auto">
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
      {loading && <CircleLoaderModal text="Generating Ad Creatives..." />}
    </div>
  );
}
