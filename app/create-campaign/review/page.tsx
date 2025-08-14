"use client";

import Product from "@/app/ui/select-products/Product";
import EditIcon from "@/public/edit.svg";
import Image from "next/image";
import { useCreateCampaignStore } from "@/app/lib/stores/createCampaignStore";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import Preview from "@/app/ui/campaign-snapshots/Preview";
import Button from "@/app/ui/Button";
import { ArrowCircleRight2 } from "iconsax-react";
import useCreativesStore from "@/app/lib/stores/creativesStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SuccessScreen from "@/app/ui/SuccessScreen";
import { brandIconMap } from "@/app/ui/checkout/CustomerCards";

const countries = {
  usa: "United States",
  canada: "Canada",
  mexico: "Mexico",
  gbr: "United Kingdom",
  aus: "Australia",
};
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
  const { getLocationCountries } = useCreateCampaignStore(
    (state) => state.actions
  );
  const [isLaunchCampaign, setIsLaunchCampaign] = useState(false);
  const router = useRouter();
  const { Google } = useCreativesStore((state) => state);
  const [highlightedProduct, setHighlightedProduct] = useState<any | null>(
    productSelection.products[0] ?? null
  );

  console.log("productSelection", productSelection);

  useEffect(() => {
    setHighlightedProduct(productSelection.products[0]);
  }, [productSelection]);

  useEffect(() => {
    if (!fundCampaign.complete) {
      router.push("/create-campaign/");
    }
  }, []);

  console.log("id:", highlightedProduct.node.id);

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
      creatives: platform === "Google" ? Google?.["1"] : [],
    }))
    .sort((a, b) => {
      const order = { Google: 0, Instagram: 1, Facebook: 2 };
      return order[a.title] - order[b.title];
    });

  const isOnlyGoogle =
    adPlatforms.length === 1 && adPlatforms[0].title === "Google";

  if (isLaunchCampaign) {
    return (
      <div className="fixed z-[100] top-[56px] w-full h-full bg-white left-0 right-0 ">
        <SuccessScreen
          headingText="Your Campaign is Live!"
          subText="Amplify AI is now optimizing your campaign for the best results."
          primaryActionText="View Campaigns"
          primaryButtonWidth={160}
          primaryAction={() => router.push("/campaigns")}
        />
      </div>
    );
  }

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
            <Link
              href="/create-campaign"
              className="w-[88px] h-[40px] border border-[#D0B0F3] rounded-[34px] flex items-center justify-center gap-2"
            >
              <EditIcon width={16} height={16} />
              <span className="text-heading tracking-100 text-sm font-medium">
                Edit
              </span>
            </Link>
          </div>
          <div className="mt-8">
            <p className="tracking-200 text-[#595959]">Campaign Location</p>
            <div className="mt-2 flex gap-6 items-center">
              {getLocationCountries().map((country, index) => (
                <div
                  key={index}
                  className="text-[#555456] flex items-center gap-1 font-medium tracking-250"
                >
                  <Image
                    src={`/${country.toLowerCase()}.png`}
                    alt={country}
                    width={32}
                    height={32}
                  />
                  <span>
                    {countries[country.toLowerCase() as keyof typeof countries]}{" "}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-row mt-5 gap-4 items-center flex-wrap flex-shrink-0">
            {productSelection.products.map((product) => (
              <div
                key={product.node.id}
                className="w-[200px] h-[70px] cursor-pointer"
                onClick={() => handleSetHighlightedProduct(product)}
              >
                <Product
                  key={product.node.id}
                  productNode={product.node}
                  checked={product.node.id === highlightedProduct.node.id}
                  isReview
                  toggleChecked={() => {}}
                />
              </div>
            ))}
          </div>
          <div className="mt-5">
            <p className="tracking-200 text-[#595959]">Ad Platforms</p>

            <div className="mt-2 mb-1 flex gap-8 items-center">
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
            <Link
              href={"/create-campaign/campaign-snapshots"}
              className="w-[88px] h-[40px] border border-[#D0B0F3] rounded-[34px] flex items-center justify-center gap-2"
            >
              <EditIcon width={16} height={16} />
              <span className="text-heading tracking-100 text-sm font-medium">
                Edit
              </span>
            </Link>
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
            {!isOnlyGoogle && (
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
            )}
          </div>
        </section>

        <section className="mt-8">
          <Preview adPlatforms={adPlatforms} isReview />
        </section>

        <section className="mt-14">
          <div className="mt-12 flex justify-between items-center pb-6 border-b-[0.5px] border-[#BFBFBF]">
            <h3 className="text-heading text-lg font-medium ">Campaign Fund</h3>
            <Link
              href={"/create-campaign/fund-campaign"}
              className="w-[88px] h-[40px] border border-[#D0B0F3] rounded-[34px] flex items-center justify-center gap-2"
            >
              <EditIcon width={16} height={16} />
              <span className="text-heading tracking-100 text-sm font-medium">
                Edit
              </span>
            </Link>
          </div>

          <div className="py-8 flex items-center gap-12 border-b-[0.5px] border-[#BFBFBF]">
            <div className="flex flex-col gap-1 h-[60px]">
              <p className="text-[#595959] text-sm tracking-200">
                Amount Funded
              </p>
              <p className="text-[#555456] font-medium tracking-250">
                ${fundCampaign.amount || "0"}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 h-[60px]">
              <div className="w-[48px] h-[48px] flex items-center justify-center md:w-[64px] md:h-[64px] rounded-full bg-[rgba(230,230,230,0.25)]">
                <Image
                  src={
                    brandIconMap[
                      fundCampaign.cardDetails?.cardBrand.toLowerCase() ||
                        "unknown"
                    ]
                  }
                  alt={fundCampaign.cardDetails?.cardBrand || ""}
                  width={48}
                  height={48}
                />
              </div>
              <div className="flex flex-col gap-1 justify-between">
                <div className="text-[#595959] text-sm tracking-200">
                  Credit Card
                </div>
                <div className="font-medium tracking-250 leading-tight text-sm ">
                  **** **** **** {fundCampaign.cardDetails?.last4Numbers}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-5 md:mt-20 sm:max-w-[242px] mx-auto">
          <Button
            text="Launch Campaign"
            action={() => setIsLaunchCampaign(true)}
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
