"use client";

import Image from "next/image";
import DefaultButton from "../Button";
import SettingsIcon from "@/public/setting-2.svg";
import {
  Add,
  // ArrowDown2,
  // ArrowUp2,
  Building3,
  CalendarEdit,
  // Data2,
  HomeTrendUp,
  LogoutCurve,
  Setting2,
  //  Magicpen,
  // MessageQuestion,
} from "iconsax-react";
import HomeTrendUpGrad from "@/public/home-trend-up.svg";
import { DashboardCompanyLinks } from "../DashboardCompanyLinks";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useModal } from "@/app/lib/hooks/useModal";
import XCloseIcon from "@/public/x-close.svg";
// import { useEffect, useState } from "react";
import Feedback from "../Feedback";
type MobileSideBarProps = {
  isSidebarOpen: boolean;
  handleToggleSidebar: () => void;
  handleLogout: () => void;
  isDashboard: boolean;
  isInsights: boolean;
  isCampaigns: boolean;
  isCompany: boolean;
  isSupport: boolean;
  isIntegrations: boolean;
  isSettings: boolean;
  isCompanyOpen: boolean;
  toggleIsCompanyOpen: () => void;
  handleCreateCampaign: () => void;
};

export default function MobileSideBar({
  isSidebarOpen,
  handleToggleSidebar,
  handleLogout,
  isDashboard,
  // isInsights,
  isCampaigns,
  isCompany,
  // isSupport,
  // isIntegrations,
  handleCreateCampaign,
  isSettings,
  isCompanyOpen,
  toggleIsCompanyOpen,
}: MobileSideBarProps) {
  // const router = useRouter();
  useModal(isSidebarOpen);
  console.log("isSidebarOpen from mobile", isSidebarOpen);

  console.log("isSidebarOpen from mobile", isSidebarOpen);
  return (
    <div className="xl:hidden">
      <div
        onClick={handleToggleSidebar}
        className={`bg-[rgb(0,0,0)] ${
          isSidebarOpen ? "opacity-[0.5]" : "opacity-0 pointer-events-none"
        }  xl:hidden fixed top-0 bottom-0 left-0 right-0 z-15 transition-opacity duration-500`}
      />
      <div
        className={`custom-shadow-sidebar w-[279px] px-8 bg-white ${
          isSidebarOpen ? "" : "-translate-x-[1000px] "
        } top-0 fixed h-screen flex flex-col z-20 transition-all duration-500`}
      >
        <div className={`flex items-center justify-between h-[81px] py-7`}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src={"/dashboard-logo.svg"}
              alt="logo"
              width={32}
              height={32}
            />
            <span className={`font-medium text-xl inline-block`}>My Store</span>
          </Link>
          <button
            onClick={handleToggleSidebar}
            className={`flex bg-[#F3EFF6] rounded-full w-[28px] h-[28px] justify-center items-center`}
          >
            <XCloseIcon width={12} height={12} />
          </button>
        </div>

        <div className="my-7 h-[48px]">
          <DefaultButton
            text="Create Campaign"
            height={48}
            showShadow
            action={handleCreateCampaign}
            hasIconOrLoader
            iconSize={24}
            icon={<Add size="24" color="#ffffff" />}
          />
        </div>
        <div className={`flex-1 flex flex-col overflow-y-auto`}>
          <ul className={`flex flex-col gap-2`}>
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center rounded-xl hover:bg-[#Fdfcfd] px-4 gap-2 w-full 
                 h-[48px] cursor-pointer ${
                   isDashboard ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
                 }`}
              >
                <span>
                  {!isDashboard && <HomeTrendUp size="24" color="#BFBFBF" />}
                  {/* {isDashboard && <HomeTrendUp size="24" color="#BFBFBF" />} */}
                  {isDashboard && (
                    <Image
                      src={"/home-trend-up.svg"}
                      alt="logo"
                      width={24}
                      height={24}
                    />
                  )}
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
            {/* <li>
              <Link
                href="/insights"
                className={`flex items-center rounded-xl hover:bg-[#fdfcfd] gap-2 w-full 
                px-4 h-[48px] cursor-pointer ${
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
            </li> */}
            <li>
              <Link
                href="/dashboard/campaigns"
                className={`flex items-center rounded-xl hover:bg-[#fdfcfd] gap-2 w-full 
                px-4 h-[48px] cursor-pointer ${
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
            <li onClick={toggleIsCompanyOpen}>
              <span
                // href="/company"
                className={`flex items-center rounded-xl gap-2 px-4 
                 h-[48px] cursor-pointer ${
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
                {/* {!isCompanyOpen && <ArrowDown2 size={20} color="#595959" />} */}
                {/* {isCompanyOpen && <ArrowUp2 size={20} color="#595959" />} */}
              </span>
              {isCompanyOpen && (
                <span
                  className={`flex flex-col gap-1 px-5 transition-all duration-300`}
                  style={{
                    height: isCompanyOpen ? 70 : 0,
                  }}
                >
                  <DashboardCompanyLinks />
                </span>
              )}
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-2 rounded-xl px-4 
                h-[48px] cursor-pointer ${
                  isSettings ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
                }`}
              >
                <span>
                  {!isSettings && <Setting2 size="24" color="#BFBFBF" />}
                  {isSettings && <SettingsIcon width="24" height="24" />}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isSettings ? "text-heading" : "text-gray-dark"
                  }`}
                >
                  Settings
                </span>
              </Link>
            </li>
            {/* <li className="">
              <Link
                href="/support"
                className={`flex items-center gap-2 rounded-xl px-4 
                h-[48px] cursor-pointer ${
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
            </li> */}
          </ul>
          <div
            className={`xl:max-h-[250px] flex-1 pb-20 px-4 lg:py-5 flex flex-col justify-end `}
          >
            <Feedback isSidebarOpen={isSidebarOpen} />

            <button
              onClick={handleLogout}
              className={`h-[48px] w-full flex items-center gap-2 rounded-xl 
               cursor-pointer`}
            >
              <LogoutCurve size="24" color="#FF4949" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
