"use client";
import { ArrowCircleRight2, ArrowDown2 } from "iconsax-react";
import MagicStarIcon from "@/public/magic-star.png";
import UndoIcon from "@/public/undo.png";
import RegenerateIcon from "@/public/magicpen.png";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useState } from "react";
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
  const { productSelection, supportedAdPlatforms } = useCreateCampaignStore(
    (state) => state
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
    }));

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
    router.push("/create-campaign/fund-campaign");
  };

  const products = productSelection.products;
  return (
    <div className="flex gap-6 mt-6 pb-12">
      {products.length > 0 && (
        <div className="w-[115px] flex flex-col gap-8 items-center px-3 py-4 bg-[#FBFAFC] rounded-3xl max-h-[503px]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Products</span>
            <span>
              <ArrowDown2 size={14} color="#000" />
            </span>
          </div>
          <div className="flex flex-col gap-5">
            {products.map((product) => (
              <div key={product.id}>
                <img
                  src={product.image}
                  alt={product.title}
                  width={80}
                  height={40}
                  className="rounded-lg h-[60px] object-cover object-center"
                />
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
          <Preview data={adPlatforms} />
        </div>
        <div className="mt-5 md:mt-12 sm:max-w-[200px] mx-auto">
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
