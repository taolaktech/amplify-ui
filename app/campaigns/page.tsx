"use client";
import { CalendarEdit } from "iconsax-react";
import Button from "../ui/Button";
import { useCampaignsActions } from "../lib/hooks/campaigns";
import Campaigns from "../ui/campaigns";
import useCampaignsStore from "../lib/stores/campaignsStore";
import { NoCampaigns } from "../ui/dashboard/metrics/Campaigns";
import { useMemo } from "react";
import MetricArrowUp from "@/public/metric-arrow-up.svg";
import MetricArrowDown from "@/public/metric-arrow-down.svg";
import CircleLoaderModal from "../ui/modals/CircleLoaderModal";

export default function CampaignsPage() {
  const { navigateToCreateCampaign } = useCampaignsActions();
  const data = useCampaignsStore((state) => state.data);
  const loading = useCampaignsStore((state) => state.showLoader);

  const hasCampaigns = useMemo(() => data && data.length > 0, [data]);

  return (
    <div className="min-h-[calc(100vh-56px)] relative flex flex-col flex-shrink-0 lg:gap-6">
      <div className="mb-3 lg:hidden font-semibold text-lg">Campaign</div>
      <div className="flex w-full flex-col-reverse gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="font-medium tracking-150 text-sm lg:text-base ">
          Overview
        </div>
        <div className=" max-w-[180px]">
          <Button
            text="Create Campaign"
            height={48}
            action={navigateToCreateCampaign}
            icon={<CalendarEdit size={16} color="#fff" />}
            hasIconOrLoader
          />
        </div>
      </div>
      <div className="lg:flex lg:h-[126px] lg:gap-4 mt-5 lg:mt-0">
        <div className="border h-[98px] lg:h-auto relative border-[#F3EFF6] rounded-2xl flex-1 py-3 px-4 lg:p-8 flex items-center">
          {!hasCampaigns && (
            <div className="absolute rounded-[20px] backdrop-blur-[5px] bg-transparent top-0 right-0 bottom-0 left-0 w-full"></div>
          )}
          <div className="flex items-center gap-4 justify-between w-full">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">
                Top Performing Product
              </div>
              <div className="flex items-center flex-shrink-0 gap-3">
                <div className="w-[36px] h-[36px] rounded-lg bg-gray-50"></div>
                <div className="font-medium text-sm lg:text-lg max-w-[140px] xl:max-w-[170px] truncate overflow-hidden whitespace-nowrap tracking-250">
                  Adiddas Sneakers
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">Revenue</div>
              <div className="flex items-center gap-[2px]">
                <MetricArrowUp />
                <div className="text-lg lg:text-2xl font-bold">$1.5k</div>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-2">
              <div className="text-xs text-[#595959]">Return on Ad Spend</div>
              <div className="flex items-center gap-[2px]">
                <MetricArrowDown />
                <div className="text-lg lg:text-2xl font-bold">$2.5x</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border relative border-[#F3EFF6] rounded-2xl flex-1 py-3 px-4 h-[98px] lg:h-auto mt-3 lg:mt-0  lg:p-8 flex items-center">
          {!hasCampaigns && (
            <div className="absolute rounded-[20px] backdrop-blur-[5px] bg-transparent top-0 right-0 bottom-0 left-0 w-full"></div>
          )}
          <div className="flex items-center gap-4 justify-between w-full">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">
                Top Performing Campaign
              </div>
              <div className="flex flex-shrink-0 items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-lg bg-gray-50"></div>
                <div className="font-medium text-sm lg:text-lg truncate overflow-hidden whitespace-nowrap tracking-250 max-w-[140px] xl:max-w-[170px]">
                  Summer Promo Sales
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">Revenue</div>
              <div className="flex items-center gap-[2px]">
                <MetricArrowUp />
                <div className="text-lg lg:text-2xl font-bold">$1.5k</div>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-2">
              <div className="text-xs text-[#595959]">Return on Ad Spend</div>
              <div className="flex items-center gap-[2px]">
                <MetricArrowDown />
                <div className="text-lg lg:text-2xl font-bold">$2.5x</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 lg:mt-0">
        <div className="border mb-4 relative border-[#F3EFF6] rounded-2xl flex-1 h-[98px] py-3 px-4 flex lg:hidden items-center">
          <div className="flex flex-col gap-2">
            <div className="text-xs text-[#595959]">Total Revenue</div>
            <div className="text-lg lg:text-2xl tracking-40 font-bold">
              $1,500
            </div>
          </div>
          {!hasCampaigns && (
            <div className="absolute rounded-[20px] backdrop-blur-[5px] bg-transparent top-0 right-0 bottom-0 left-0 w-full"></div>
          )}
        </div>
        <div className="flex lg:h-[126px] gap-4 ">
          <div className="border relative border-[#F3EFF6] rounded-2xl flex-1 px-4 py-3 lg:p-8 h-[98px] lg:h-auto hidden lg:flex items-center">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">Total Revenue</div>
              <div className="text-lg lg:text-2xl tracking-40 font-bold">
                $1,500
              </div>
            </div>
            {!hasCampaigns && (
              <div className="absolute rounded-[20px] backdrop-blur-[5px] bg-transparent top-0 right-0 bottom-0 left-0 w-full"></div>
            )}
          </div>
          <div className="border relative border-[#F3EFF6] rounded-2xl h-[98px] lg:h-auto flex-1 px-4 py-3 lg:p-8 flex items-center">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">Total AdSpend</div>
              <div className="text-lg lg:text-2xl tracking-40 font-bold">
                $4,200
              </div>
            </div>
            {!hasCampaigns && (
              <div className="absolute rounded-[20px] backdrop-blur-[5px] bg-transparent top-0 right-0 bottom-0 left-0 w-full"></div>
            )}
          </div>
          <div className="border relative border-[#F3EFF6] rounded-2xl flex-1 h-[98px] lg:h-auto px-4 py-3 lg:p-8 flex items-center">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">Total Orders</div>
              <div className="text-lg lg:text-2xl tracking-40 font-bold">
                320
              </div>
            </div>
            {!hasCampaigns && (
              <div className="absolute rounded-[20px] backdrop-blur-[5px] bg-transparent top-0 right-0 bottom-0 left-0 w-full"></div>
            )}
          </div>
        </div>
      </div>
      {!hasCampaigns ? (
        <div className="flex-1 min-h-[350px] mb-8 lg:min-h-[550px] bg-[#FBFAFC] flex flex-col">
          <NoCampaigns handleCreateCampaign={navigateToCreateCampaign} />
        </div>
      ) : (
        <div className="mt-4">
          <Campaigns />
        </div>
      )}
      {/* <div className="h-8"></div> */}
      {loading && <CircleLoaderModal text="Fetching Campaigns`..." />}
    </div>
  );
}
