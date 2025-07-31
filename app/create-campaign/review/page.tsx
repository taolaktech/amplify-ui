"use client";

import Product from "@/app/ui/select-products/Product";
import EditIcon from "@/public/edit.svg";
import Image from "next/image";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import Preview from "@/app/ui/campaign-snapshots/Preview";
import Button from "@/app/ui/Button";
import { ArrowCircleRight2 } from "iconsax-react";
export default function ReviewPage() {
  const {
    productSelection,
    supportedAdPlatforms,
    instagramSettings,
    facebookSettings,
    googleSettings,
    campaignSnapshots,
    fundCampaign,
  } = useCreateCampaignStore((state) => state);
  const [highlightedProduct, setHighlightedProduct] = useState(
    productSelection.products[0] ?? null
  );

  console.log(highlightedProduct);

  const formattedStartDate = format(
    parseISO(campaignSnapshots.campaignStartDate || new Date().toISOString()),
    "MMMM dd, yyyy"
  );
  const formattedEndDate = format(
    parseISO(campaignSnapshots.campaignEndDate || new Date().toISOString()),
    "MMMM dd, yyyy"
  );

  const handleSetHighlightedProduct = (product: any) => {
    setHighlightedProduct(product);
  };

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
      creatives: [{ title: platform }],
    }))
    .sort((a, b) => {
      const order = { Google: 0, Instagram: 1, Facebook: 2 };
      return order[a.title] - order[b.title];
    });
  return (
    <div>
      <div className="mt-6 pb-10">
        <div>
          <h1 className="text-xl tracking-40 font-medium md:text-2xl md:font-bold text-heading md:tracking-800">
            {/* <span className="num">5. </span> */}
            <span>Review & Launch</span>
          </h1>
          <p className="mt-[0.38rem] text-neutral-light tracking-40 text-xs md:text-sm">
            Take a final look at your campaign settings before going live.
          </p>
        </div>

        <section>
          <div className="mt-12 flex justify-between items-center pb-6 border-b-[0.5px] border-[#BFBFBF]">
            <h3 className="text-heading text-lg font-medium ">Summary</h3>
            <button className="w-[88px] h-[40px] border border-[#D0B0F3] rounded-[34px] flex items-center justify-center gap-2">
              <EditIcon width={16} height={16} />
              <span className="text-heading tracking-100 text-sm font-medium">
                Edit
              </span>
            </button>
          </div>
          <div className="mt-8">
            <p className="tracking-200 text-[#595959]">Campaign Location</p>
          </div>
          <div className="flex flex-row mt-5 items-center flex-wrap flex-shrink-0">
            {productSelection.products.map((product) => (
              <div
                key={product.node.id}
                className="w-[200px] h-[70px] cursor-pointer"
                onClick={() => handleSetHighlightedProduct(product)}
              >
                <Product
                  key={product.node.id}
                  productNode={product.node}
                  checked={productSelection.products.find(
                    (p) => p.node.id === product.node.id
                  )}
                  isReview
                  toggleChecked={() => {}}
                />
              </div>
            ))}
          </div>
          <div className="mt-5">
            <p className="tracking-200 text-[#595959]">Ad Platforms</p>

            <div className="mt-2 flex gap-8 items-center">
              {adPlatforms.map((platform) => (
                <div key={platform.title} className="flex items-center gap-1">
                  <Image
                    src={
                      platform.title === "Instagram"
                        ? "/instagram_logo.svg"
                        : platform.title === "Facebook"
                        ? "/facebook_logo.svg"
                        : "/google_ads-icon.svg"
                    }
                    alt={platform.title}
                    width={20}
                    height={20}
                  />
                  <span className="text-sm font-medium tracking-100">
                    {platform.title === "Google"
                      ? "Google Ads"
                      : platform.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section>
          <div className="mt-12 flex justify-between items-center pb-6 border-b-[0.5px] border-[#BFBFBF]">
            <h3 className="text-heading text-lg font-medium ">Ad Preview</h3>
            <button className="w-[88px] h-[40px] border border-[#D0B0F3] rounded-[34px] flex items-center justify-center gap-2">
              <EditIcon width={16} height={16} />
              <span className="text-heading tracking-100 text-sm font-medium">
                Edit
              </span>
            </button>
          </div>

          <div className="mt-8 flex gap-12 items-center flex-shrink-0 flex-wrap">
            <div>
              <p className="text-[#595959] text-sm tracking-200">
                Campaign Type
              </p>
              <p className="text-[#555456] font-medium tracking-250">
                {campaignSnapshots.campaignType || "Product Launch"}
              </p>
            </div>
            <div>
              <p className="text-[#595959] text-sm tracking-200">Start Date</p>
              <p className="text-[#555456] font-medium tracking-250">
                {formattedStartDate}
              </p>
            </div>
            <div>
              <p className="text-[#595959] text-sm tracking-200">End Date</p>
              <p className="text-[#555456] font-medium tracking-250">
                {formattedEndDate}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs tracking-200">Brand Colors</p>
              <div className="h-[48px] rounded-[50px] flex items-center flex-shrink-0 p-3 justify-center gap-2 bg-[rgba(232,232,232,0.5)]">
                <div className="cursor-pointer h-6 w-6 bg-[rgba(105,34,209,0.2)] rounded-full flex items-center justify-center">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: campaignSnapshots.brandColor }}
                  ></div>
                </div>
                <div className="cursor-pointer h-6 w-6 bg-[rgba(232,232,232,0.35)] rounded-full flex items-center justify-center">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: campaignSnapshots.accentColor }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <Preview adPlatforms={adPlatforms} isReview />
        </section>

        <section className="mt-14">
          <div className="mt-12 flex justify-between items-center pb-6 border-b-[0.5px] border-[#BFBFBF]">
            <h3 className="text-heading text-lg font-medium ">Campaign Fund</h3>
            <button className="w-[88px] h-[40px] border border-[#D0B0F3] rounded-[34px] flex items-center justify-center gap-2">
              <EditIcon width={16} height={16} />
              <span className="text-heading tracking-100 text-sm font-medium">
                Edit
              </span>
            </button>
          </div>

          <div className="py-8 border-b-[0.5px] border-[#BFBFBF]">
            <div>
              <p className="text-[#595959] text-sm tracking-200">
                Amount Funded
              </p>
              <p className="text-[#555456] font-medium tracking-250">
                ${fundCampaign.amount || "0"}
              </p>
            </div>
          </div>
        </section>
        <div className="mt-5 md:mt-20 sm:max-w-[242px] mx-auto">
          <Button
            text="Launch Campaign"
            action={() => {}}
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
