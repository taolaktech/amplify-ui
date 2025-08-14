"use client";
import { ArrowDown, ArrowUp, CalendarEdit } from "iconsax-react";
import Button from "../ui/Button";
import { NoCampaigns } from "../ui/dashboard/metrics/Campaigns";
import { useCampaignsActions } from "../lib/hooks/campaigns";

export default function CampaignsPage() {
  const { navigateToCreateCampaign } = useCampaignsActions();

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="font-medium tracking-150">Overview</div>
        <div className="max-w-[180px]">
          <Button
            text="Create Campaign"
            height={50}
            action={navigateToCreateCampaign}
            icon={<CalendarEdit size={16} color="#fff" />}
            hasIconOrLoader
          />
        </div>
      </div>
      <div className="flex h-[126px] gap-4 mt-6">
        <div className="border relative border-[#F3EFF6] rounded-2xl flex-1 p-8 flex items-center">
          {true && (
            <div className="absolute rounded-[20px] backdrop-blur-[5px] bg-transparent top-0 right-0 bottom-0 left-0 w-full"></div>
          )}
          <div className="flex items-center gap-4 justify-between w-full">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">
                Top Performing Product
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-lg bg-gray-50"></div>
                <div className="font-medium text-lg tracking-250">
                  Adiddas Sneakers
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">Revenue</div>
              <div className="flex items-center gap-1">
                <ArrowUp size={16} color="#27AE60" />
                <div className="text-2xl font-bold">$1.5k</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">Return on Ad Spend</div>
              <div className="flex items-center gap-1">
                <ArrowDown size={16} color="#FF4949" />
                <div className="text-2xl font-bold">$2.5x</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border relative border-[#F3EFF6] rounded-2xl flex-1 p-8 flex items-center">
          {true && (
            <div className="absolute rounded-[20px] backdrop-blur-[5px] bg-transparent top-0 right-0 bottom-0 left-0 w-full"></div>
          )}
          <div className="flex items-center gap-4 justify-between w-full">
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">
                Top Performing Campaign
              </div>
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-lg bg-gray-50"></div>
                <div className="font-medium text-lg tracking-250">
                  Summer Promo Sales
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">Revenue</div>
              <div className="flex items-center gap-1">
                <ArrowUp size={16} color="#27AE60" />
                <div className="text-2xl font-bold">$1.5k</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs text-[#595959]">Return on Ad Spend</div>
              <div className="flex items-center gap-1">
                <ArrowDown size={16} color="#FF4949" />
                <div className="text-2xl font-bold">$2.5x</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[126px] gap-4 mt-6">
        <div className="border relative border-[#F3EFF6] rounded-2xl flex-1 p-8 flex items-center">
          <div className="flex flex-col gap-2">
            <div className="text-xs text-[#595959]">Total Revenue</div>
            <div className="text-2xl tracking-40 font-bold">$4.5k</div>
          </div>
          {true && (
            <div className="absolute rounded-[20px] backdrop-blur-[5px] bg-transparent top-0 right-0 bottom-0 left-0 w-full"></div>
          )}
        </div>
        <div className="border relative border-[#F3EFF6] rounded-2xl flex-1 p-8 flex items-center">
          <div className="flex flex-col gap-2">
            <div className="text-xs text-[#595959]">Total AdSpend</div>
            <div className="text-2xl tracking-40 font-bold">$4.5k</div>
          </div>
          {true && (
            <div className="absolute rounded-[20px] backdrop-blur-[5px] bg-transparent top-0 right-0 bottom-0 left-0 w-full"></div>
          )}
        </div>
        <div className="border relative border-[#F3EFF6] rounded-2xl flex-1 p-8 flex items-center">
          <div className="flex flex-col gap-2">
            <div className="text-xs text-[#595959]">Total Orders</div>
            <div className="text-2xl tracking-40 font-bold">$4.5k</div>
          </div>
          {true && (
            <div className="absolute rounded-[20px] backdrop-blur-[5px] bg-transparent top-0 right-0 bottom-0 left-0 w-full"></div>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-[350px] mb-8 lg:min-h-[550px] bg-[#FBFAFC] flex flex-col">
        <NoCampaigns handleCreateCampaign={navigateToCreateCampaign} />
      </div>
      {/* <div className="h-8"></div> */}
    </div>
  );
}
