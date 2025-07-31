"use client";
import { ArrowDown, ArrowUp, CalendarEdit } from "iconsax-react";
import Button from "../ui/Button";

export default function CampaignsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-medium tracking-150">Overview</div>
        <div className="max-w-[180px]">
          <Button
            text="Create Campaign"
            height={50}
            icon={<CalendarEdit size={16} color="#fff" />}
            hasIconOrLoader
          />
        </div>
      </div>
      <div className="flex h-[126px] gap-4 mt-6">
        <div className="border border-[#F3EFF6] rounded-2xl flex-1 p-8 flex items-center">
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
        <div className="border border-[#F3EFF6] rounded-2xl flex-1 p-8 flex items-center">
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
        <div className="border border-[#F3EFF6] rounded-2xl flex-1 p-8 flex items-center"></div>
        <div className="border border-[#F3EFF6] rounded-2xl flex-1 p-8 flex items-center"></div>
        <div className="border border-[#F3EFF6] rounded-2xl flex-1 p-8 flex items-center"></div>
      </div>
    </div>
  );
}
