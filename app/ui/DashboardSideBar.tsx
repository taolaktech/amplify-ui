"use client";

import DashboardLogoIcon from "@/public/dashboard-logo.svg";
import ArrowLeftIcon from "@/public/arrow-left.svg";
import DefaultButton from "./Button";
import {
  Add,
  ArrowDown2,
  Building3,
  CalendarEdit,
  Data2,
  HomeTrendUp,
  LogoutCurve,
  Magicpen,
  MessageQuestion,
} from "iconsax-react";
import HomeTrendUpGrad from "@/public/home-trend-up.svg";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardSideBar() {
  const pathname = usePathname().trim().replace(/\/$/, "");
  const isDashboard = pathname === "/dashboard";
  const isInsights = pathname.includes("/dashboard/insights");
  const isCampaigns = pathname.includes("/dashboard/campaigns");
  const isCompany = pathname.includes("/dashboard/company");
  const isSupport = pathname.includes("/dashboard/support");
  const isIntegrations = pathname.includes("/dashboard/integrations");

  return (
    <div
      className={`custom-shadow-sidebar bg-white w-[279px] top-0 fixed h-screen hidden xl:flex flex-col z-20 px-8`}
    >
      <div className="flex items-center justify-between h-[81px]">
        <div className="flex items-center gap-2">
          <DashboardLogoIcon width={32} height={32} />
          <span className="font-medium text-xl">My Store</span>
        </div>
        <button className="bg-[#F3EFF6] rounded-full w-[28px] h-[28px] flex justify-center items-center">
          <ArrowLeftIcon width={12} height={12} />
        </button>
      </div>

      <div className="my-7">
        <DefaultButton
          text="Create Campaign"
          height={48}
          showShadow
          hasIconOrLoader
          iconSize={24}
          icon={<Add size="24" color="#ffffff" />}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center rounded-xl hover:bg-[#Fdfcfd] gap-2 w-full px-4 h-[48px] cursor-pointer ${
                isDashboard ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
              }`}
            >
              <span>
                {!isDashboard && <HomeTrendUp size="24" color="#BFBFBF" />}
                {isDashboard && <HomeTrendUpGrad width="24" height="24" />}
              </span>
              <span
                className={`text-sm font-medium ${
                  isDashboard ? "text-heading" : "text-gray-dark"
                }`}
              >
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/insights"
              className={`flex items-center rounded-xl hover:bg-[#fdfcfd] gap-2 w-full px-4 h-[48px] cursor-pointer ${
                isInsights ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
              }`}
            >
              <span>
                {!isInsights && <Magicpen size="24" color="#BFBFBF" />}
                {isInsights && <HomeTrendUpGrad width="24" height="24" />}
              </span>
              <span
                className={`text-sm font-medium ${
                  isInsights ? "text-heading" : "text-gray-dark"
                }`}
              >
                Insights
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/campaigns"
              className={`flex items-center rounded-xl hover:bg-[#fdfcfd] gap-2 w-full px-4 h-[48px] cursor-pointer ${
                isCampaigns ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
              }`}
            >
              <span>
                {!isCampaigns && <CalendarEdit size="24" color="#BFBFBF" />}
                {isCampaigns && <HomeTrendUpGrad width="24" height="24" />}
              </span>
              <span
                className={`text-sm font-medium ${
                  isCampaigns ? "text-heading" : "text-gray-dark"
                }`}
              >
                Campaigns
              </span>
            </Link>
          </li>
          <li>
            <span
              // href="/company"
              className={`flex items-center justify-between rounded-xl hover:bg-[#fdfcfd] gap-2 w-full px-4 h-[48px] cursor-pointer ${
                isCompany ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <span>
                  {!isCompany && <Building3 size="24" color="#BFBFBF" />}
                  {isCompany && <HomeTrendUpGrad width="24" height="24" />}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isCompany ? "text-heading" : "text-gray-dark"
                  }`}
                >
                  Company
                </span>
              </span>
              <ArrowDown2 size={20} color="#595959" />
            </span>
          </li>
          <li>
            <Link
              href="/integrations"
              className={`flex items-center rounded-xl hover:bg-[#fdfcfd] gap-2 w-full px-4 h-[48px] cursor-pointer ${
                isIntegrations ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
              }`}
            >
              <span>
                {!isIntegrations && <Data2 size="24" color="#BFBFBF" />}
                {isIntegrations && <HomeTrendUpGrad width="24" height="24" />}
              </span>
              <span
                className={`text-sm font-medium ${
                  isIntegrations ? "text-heading" : "text-gray-dark"
                }`}
              >
                Integrations
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/support"
              className={`flex items-center rounded-xl hover:bg-[#fdfcfd] gap-2 w-full px-4 h-[48px] cursor-pointer ${
                isSupport ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
              }`}
            >
              <span>
                {!isSupport && <MessageQuestion size="24" color="#BFBFBF" />}
                {isSupport && <HomeTrendUpGrad width="24" height="24" />}
              </span>
              <span
                className={`text-sm font-medium ${
                  isSupport ? "text-heading" : "text-gray-dark"
                }`}
              >
                Support
              </span>
            </Link>
          </li>
        </ul>
        <div className="flex-1 max-h-[200px] py-10 px-4 flex items-end">
          <button className="h-[48px] w-full flex items-center gap-2">
            <LogoutCurve size="24" color="#FF4949" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
