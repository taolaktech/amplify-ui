"use client";
import { ArrowCircleRight2, ArrowDown2 } from "iconsax-react";
import MagicStarIcon from "@/public/magic-star.png";
import { capitalize } from "lodash";
import UndoIcon from "@/public/undo.png";
import RegenerateIcon from "@/public/magicpen.png";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useEffect, useState } from "react";
import BrandColors from "@/app/ui/campaign-snapshots/BrandColors";
import DateSelection from "@/app/ui/campaign-snapshots/DateSelection";
import CampaignTypeInput from "@/app/ui/campaign-snapshots/CampaigtTypeInput";
import Preview from "@/app/ui/campaign-snapshots/Preview";
import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";

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

  const actions = useCreateCampaignStore((state) => state.actions);

  const [highlightedProduct, setHighlightedProduct] = useState<any>(
    productSelection.products[0] || null
  );
  const router = useRouter();

  const adPlatforms = Object.keys(supportedAdPlatforms)
    .filter(
      (platform) =>
        platform !== "complete" &&
        supportedAdPlatforms[platform as keyof typeof supportedAdPlatforms]
    )
    .map((platform) => ({
      title: platform as "Instagram" | "Facebook" | "Google",
      image: `/${platform.toLowerCase()}_logo.svg`,
      settings: {
        ...(platform === "Instagram"
          ? instagramSettings
          : platform === "Facebook"
          ? facebookSettings
          : googleSettings),
      },
    }))
    .sort((a, b) => {
      const order = { Google: 0, Instagram: 1, Facebook: 2 };
      return order[a.title] - order[b.title];
    });
  const [campaignDetails, setCampaignDetails] = useState({
    campaignType: "",
    campaignName: "",
    brandColor: "#000000",
    accentColor: "#FFFFFF",
    campaignDescription: "",
    campaignStartDate: new Date(),
    campaignEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  });

  const handleCampaignDetails = (key: string, value: string) => {
    console.log(key, value);
    setCampaignDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleProceed = () => {
    console.log("proceed");
    actions.storeCampaignSnapshots({
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
    if (!productSelection.complete) {
      router.push("/create-campaign/");
    }
  }, []);

  const handleSetHighlightedProduct = (product: any) => {
    setHighlightedProduct(product);
  };
  const products = productSelection.products;
  return (
    <div className="flex items-start gap-6 mt-6 pb-12">
      {products.length > 0 && (
        <div className="w-[224px] flex flex-col gap-6  p-6 bg-[#FBFAFC] rounded-3xl max-h-[calc(100vh-200px)]">
          <div className="flex justify-between gap-2">
            <span className="text-sm font-medium">Products</span>
            <span>
              <ArrowDown2 size={12} color="#000" />
            </span>
          </div>
          <div className="flex flex-col w-full gap-5 flex-1 overflow-y-auto">
            {products.map((product) => (
              <div
                key={product.node.id}
                className={`w-full flex-shrink-0 items-center flex gap-2 p-4 cursor-pointer
                   ${
                     highlightedProduct?.node.id === product.node.id
                       ? "border-[0.25px] border-[#A75fff] rounded-[24px] bg-[#F3EFF6]"
                       : ""
                   }
                  `}
                onClick={() => handleSetHighlightedProduct(product)}
              >
                <div className="flex-shrink-0">
                  <img
                    src={product.node.media.edges[0].node.preview.image.url}
                    alt={product.node.handle}
                    width={48}
                    height={48}
                    className="rounded-[14px] h-[48px] w-[48px] object-cover object-center"
                  />
                </div>
                <div
                  className={`text-xs tracking-100 ${
                    highlightedProduct?.node.id === product.node.id
                      ? "font-bold"
                      : ""
                  }`}
                >
                  {capitalize(
                    product.node.handle.length < 25
                      ? product.node.handle
                      : product.node.handle.slice(0, 20) + "..."
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex-1">
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
          <div className="flex gap-2 md:gap-3">
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
            <button className="flex items-center gap-2 h-[40px] w-[115px] md:w-[134px] rounded-[39px] bg-[#F0E6FB] border-[#D0B0F3] border justify-center ">
              <img src={UndoIcon.src} alt="Undo" width={20} height={20} />
              <span className="text-sm font-medium">Undo</span>
            </button>

            <button className="flex items-center gap-2 h-[40px] w-[134px] rounded-[39px]  justify-center bg-[#F0E6FB] border-[#D0B0F3] border ">
              <img
                src={RegenerateIcon.src}
                alt="Generate"
                width={20}
                height={20}
              />
              <span className="text-sm font-medium">Generate</span>
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-col md:flex-row gap-4 md:gap-14">
          <div className="flex-1">
            <div className="w-full">
              <CampaignTypeInput
                label="Campaign Type"
                placeholder="Product Launch"
                options={productTypes}
                selected={campaignDetails.campaignType}
                setSelected={(value: string) =>
                  handleCampaignDetails("campaignType", value)
                }
                large
                setError={() => {}}
              />
            </div>
          </div>
          <BrandColors
            brandColor={campaignDetails.brandColor}
            accentColor={campaignDetails.accentColor}
            setBrandColor={(key: "brandColor" | "accentColor", value: string) =>
              handleCampaignDetails(key, value)
            }
          />
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
          <Preview adPlatforms={adPlatforms} />
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
    </div>
  );
}
