import useCampaignsStore from "@/app/lib/stores/campaignsStore";
import { ProductOptions } from "./Settings";
import Image from "next/image";
import { ArrowDown2, More } from "iconsax-react";
import CheckIcon from "@/public/custom-check.svg";
import { useMemo } from "react";
import Platforms from "./Platforms";
import Status from "./Status";
import { campaignStatus } from "@/app/lib/utils";

export default function TableData({
  campaign,
  index,
  moreOpen,
  dropdownPosition,
  handleMoreClick,
  toggleCampaignOpen,
  campaignOpen,
}: {
  campaign: any;
  index: number;
  moreRef: React.RefObject<HTMLButtonElement | null>;
  moreOpen: null | number;
  dropdownPosition: "top" | "bottom";
  handleMoreClick: (e: any, index: number) => void;
  toggleCampaignOpen: (e: React.MouseEvent, index: number) => void;
  campaignOpen: null | number;
}) {
  const excludeDataIds = useCampaignsStore((state) => state.excludeDataIds);
  const { toggleSelectedData } = useCampaignsStore((state) => state.actions);
  console.log("Rendering TableData for campaign:", campaign);

  const isOpen = useMemo(() => {
    return campaignOpen === index;
  }, [campaignOpen, index]);

  const isSelected = useMemo(() => {
    console.log(
      "Exclude Data Ids:",
      excludeDataIds,
      "Campaign ID:",
      campaign._id
    );
    return !excludeDataIds.includes(campaign._id);
  }, [excludeDataIds, campaign._id]);

  const isEven = useMemo(() => {
    return index % 2 === 0 || index === 0;
  }, [index]);

  return (
    <>
      <div
        key={index}
        className={`contents cursor-pointer
            ${!isEven ? "[&>*]:bg-[rgba(230,230,230,0.25)]" : ""}
            [&>*]:text-sm  [&>*]:text-[#5B5B5B] [&>*]:font-medium [&>*]:h-[76px] [&>*]:flex [&>*]:items-center [&>*]:justify-start`}
      >
        <div
          className={`border-l-4 flex items-center justify-between w-full  px-5 ${
            isSelected
              ? `border-[#A755FF] rounded-tl-[3px] ${
                  isOpen ? "rounded-bl-0" : "rounded-bl-[3px]"
                }`
              : "border-transparent"
          }`}
        >
          <button
            onClick={() => toggleSelectedData(campaign._id)}
            className={`${
              isSelected
                ? "bg-gradient"
                : "bg-transparent border-[#CFCFCF] border-[1.5px]"
            } w-[16px] h-[16px] rounded-[4px] flex items-center justify-center`}
          >
            {isSelected && <CheckIcon width={9} height={9} fill="#FFF" />}
          </button>
          <div
            className={`ml-auto cursor-pointer p-2 rounded-lg hover:bg-[rgba(167,127,255,0.1)] transition-all ${
              isOpen ? "transform rotate-180" : ""
            }`}
            onClick={(e) => toggleCampaignOpen(e, index)}
          >
            <ArrowDown2 size={20} color="#5B5B5B" />
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-2">
            <Image
              width={36}
              height={36}
              alt="Product Image"
              className="rounded-lg w-[36px] h-[36px] object-cover"
              src={campaign.products[0]?.imageLinks[0]}
            />
            <span
              title={campaign.name}
              className="max-w-[120px] truncate overflow-hidden whitespace-nowrap"
            >
              {campaign?.name}
            </span>
          </div>
        </div>
        <div>
          <Status status={campaignStatus[campaign?.status]?.toUpperCase()} />
        </div>
        <div>${campaign?.totalBudget}</div>
        <div
          style={{
            textAlign: campaign.metrics?.totalRevenue ? "left" : "center",
          }}
        >
          ${campaign.metrics?.totalCost ?? "0"}
        </div>
        <div
          style={{
            textAlign: campaign.metrics?.totalRevenue ? "left" : "center",
          }}
        >
          ${campaign.metrics?.totalRevenue ?? "0"}
        </div>
        <div>{campaign.metrics?.totalOrders ?? "0"}</div>
        <div style={{}}>{campaign.metrics?.totalClicks ?? "0"}</div>
        <div
          style={{
            textAlign: campaign.metrics?.totalRevenue ? "left" : "center",
          }}
        >
          {campaign.metrics?.roas ?? "0.0"}x
        </div>
        <div>
          <Platforms platform={campaign?.platforms} />
        </div>
        <div className="text-sm">
          {new Date(campaign?.startDate)?.toLocaleDateString()}
        </div>
        <div
          className="relative pr-2"
          onClick={(e) => handleMoreClick(e, index)}
        >
          <div className="hover:bg-[rgba(167,127,255,0.1)] more-dropdown rounded-lg transition-all h-[24px] w-[24px] flex items-center justify-center ">
            <button className="-rotate-90 cursor-pointer">
              <More size="16" color="#5B5B5B" />
            </button>
            {moreOpen === index && (
              <ProductOptions dropdownPosition={dropdownPosition} />
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ */}

      {isOpen && (
        <>
          {campaign?.products?.map((product: any, index: number) => (
            <ProductData
              campaign={campaign}
              product={product}
              key={product.shopifyId}
              isSelected={isSelected}
              index={index}
            />
          ))}
        </>
      )}
    </>
  );
}

function ProductData({
  campaign,
  product,
  isSelected,
  index,
}: {
  campaign: any;
  product: any;
  isSelected: boolean;
  index: number;
}) {
  return (
    <div className="contents cursor-pointer [&>*]:text-sm  [&>*]:text-[#5B5B5B] [&>*]:font-medium [&>*]:h-[76px] [&>*]:flex [&>*]:items-center [&>*]:justify-start">
      <div
        className={`border-l-4 flex items-center justify-between w-full  px-5 ${
          isSelected
            ? `border-[#A755FF] ${"rounded-tl-[0px]"} ${
                index === campaign?.products?.length - 1
                  ? "rounded-bl-[3px]"
                  : "rounded-bl-[0px]"
              }`
            : "border-transparent"
        }`}
      ></div>
      <div className="">
        <div className="flex items-center gap-2">
          <Image
            width={36}
            height={36}
            alt="Product Image"
            className="rounded-lg w-[36px] h-[36px] object-cover"
            src={product?.imageLinks[0]}
          />
          <span
            title={product?.title}
            className="max-w-[120px] truncate overflow-hidden whitespace-nowrap"
          >
            {product?.title}
          </span>
        </div>
      </div>
      <div>
        <Status status={campaignStatus[campaign?.status]?.toUpperCase()} />
      </div>
      <div>${campaign?.totalBudget ?? "0"}</div>
      <div
        style={{
          textAlign: campaign.metrics?.totalRevenue ? "left" : "center",
        }}
      >
        ${campaign.metrics?.totalCost ?? "0"}
      </div>
      <div
        style={{
          textAlign: campaign?.metrics?.totalRevenue ? "left" : "center",
        }}
      >
        ${campaign.metrics?.totalRevenue ?? "0"}
      </div>
      <div>{campaign?.metrics?.totalOrders ?? "0"}</div>
      <div style={{}}>{campaign?.metrics?.totalClicks ?? "0"}</div>
      <div
        style={{
          textAlign: campaign?.metrics?.totalRevenue ? "left" : "center",
        }}
      >
        {campaign.metrics?.roas ?? "0.0"}x
      </div>
      <div>
        <Platforms platform={campaign?.platforms} />
      </div>
      <div className="text-sm">
        {new Date(campaign?.startDate)?.toLocaleDateString()}
      </div>
      {/* <div className="relative" onClick={(e) => handleMoreClick(e, index)}> */}
      <div>
        {/* <button className="-rotate-90 cursor-pointer">
              <More size="16" color="#5B5B5B" />
            </button>
            {moreOpen === index && (
              <ProductOptions dropdownPosition={dropdownPosition} />
            )} */}
      </div>
    </div>
  );
}
