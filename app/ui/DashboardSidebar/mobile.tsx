"use client";

import Image from "next/image";
import DefaultButton from "../Button";
import SettingsIcon from "@/public/setting-2.svg";
import BuildingGradient from "@/public/building-gradient.svg";
import CalenderEditGrad from "@/public/calendar-edit.svg";
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
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useModal } from "@/app/lib/hooks/useModal";
import XCloseIcon from "@/public/x-close.svg";
// import { useEffect, useState } from "react";
import Feedback from "../Feedback";
import { SettingsSideBar } from "../SettingsNav";
import SelectArrow from "../SelectArrow";
import { CompanySideBar } from "../CompanyNav";
import useUIStore from "@/app/lib/stores/uiStore";
import { useCampaignPageActions } from "@/app/lib/hooks/campaigns";
type MobileSideBarProps = {
  isSidebarOpen: boolean;
  handleToggleSidebar: () => void;
  handleLogout: () => void;
  isDashboard: boolean;
  isInsights: boolean;
  isCampaigns: boolean;
  isCompany: boolean;
  isPricing: boolean;
  isBrandAssets: boolean;
  isCompanyTabOpen: boolean;
  isIntegrations: boolean;
  isSupport: boolean;
  isSettings: boolean;
  isSettingTabOpen: boolean;
  isStoreDetails: boolean;
  toggleIsSettingTabOpen: () => void;
  toggleIsCompanyTabOpen: () => void;
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
  isPricing,
  isBrandAssets,
  isCompanyTabOpen,
  toggleIsCompanyTabOpen,
  isIntegrations,
  isSettingTabOpen,
  toggleIsSettingTabOpen,
  isStoreDetails,
  // isSupport,
  // isIntegrations,
  handleCreateCampaign,
  isSettings,
}: MobileSideBarProps) {
  // const router = useRouter();
  useModal(isSidebarOpen);

  const { setSidebarOpen } = useUIStore((state) => state.actions);
  const { navigateToCampaignPage } = useCampaignPageActions();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="xl:hidden">
      <div
        onClick={handleToggleSidebar}
        className={`bg-[rgb(0,0,0)] ${
          isSidebarOpen ? "opacity-[0.5]" : "opacity-0 pointer-events-none"
        }  xl:hidden fixed top-0 bottom-0 left-0 right-0 z-15 transition-opacity duration-500`}
      />
      <div
        className={`custom-shadow-sidebar w-[279px]  bg-white ${
          isSidebarOpen ? "" : "-translate-x-[1000px] "
        } top-0 fixed h-screen flex flex-col z-20 transition-all duration-500`}
      >
        <div className={`flex items-center justify-between h-[81px] px-5 py-7`}>
          <Link
            onClick={closeSidebar}
            href="/"
            className="flex items-center gap-2"
          >
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

        <div className="my-7 h-[48px] px-5">
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
        <div className={`flex-1 flex flex-col overflow-y-auto px-5`}>
          <ul className={`flex flex-col gap-2`}>
            <li>
              <Link
                href="/"
                onClick={closeSidebar}
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
            <li>
              <button
                onClick={() => {
                  closeSidebar();
                  navigateToCampaignPage();
                }}
                className={`flex items-center rounded-xl hover:bg-[#fdfcfd] gap-2 w-full 
                px-4 h-[48px] cursor-pointer ${
                  isCampaigns ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
                }`}
              >
                <span>
                  {!isCampaigns && <CalendarEdit size="24" color="#BFBFBF" />}
                  {isCampaigns && <CalenderEditGrad width="24" height="24" />}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isCampaigns ? "text-heading" : "text-gray-dark"
                  }`}
                >
                  Campaigns
                </span>
              </button>
            </li>
            <li>
              <span
                onClick={toggleIsCompanyTabOpen}
                className={`flex items-center px-4 rounded-xl justify-between 
                ${
                  isCompany
                    ? "bg-[#F3EFF6] hover:bg-[#f3eff6]"
                    : "hover:bg-[#fdfcfd]"
                }
                `}
              >
                <span
                  className={`flex items-center
                ${
                  isSidebarOpen ? "" : "justify-center"
                }  gap-2 w-full  h-[48px] cursor-pointer `}
                >
                  <span>
                    {!isCompany && <Building3 size="24" color="#BFBFBF" />}
                    {isCompany && <BuildingGradient width="24" height="24" />}
                  </span>
                  {isSidebarOpen && (
                    <div className="flex items-center gap-2 justify-between">
                      <span
                        className={`text-sm font-medium ${
                          isCompany ? "text-heading" : "text-gray-dark"
                        }`}
                      >
                        Company
                      </span>
                    </div>
                  )}
                </span>
                {isSidebarOpen && <SelectArrow isOpen={isCompanyTabOpen} />}
              </span>
              <CompanySideBar
                on={isCompanyTabOpen}
                closeSidebar={closeSidebar}
                // setOn={toggleIsCompanyTabOpen}
                isSidebarOpen={isSidebarOpen}
                isBrandAssets={isBrandAssets}
                isCompany={isStoreDetails}
              />
            </li>
            <li>
              <span
                onClick={toggleIsSettingTabOpen}
                className={`flex items-center px-4 rounded-xl justify-between 
                ${
                  isSettings
                    ? "bg-[#F3EFF6] hover:bg-[#f3eff6]"
                    : "hover:bg-[#fdfcfd]"
                }
                `}
              >
                <span
                  className={`flex items-center
                ${
                  isSidebarOpen ? "" : "justify-center"
                }  gap-2 w-full  h-[48px] cursor-pointer `}
                >
                  <span>
                    {!isSettings && <Setting2 size="24" color="#BFBFBF" />}
                    {isSettings && <SettingsIcon width="24" height="24" />}
                  </span>
                  {isSidebarOpen && (
                    <div className="flex items-center gap-2 justify-between">
                      <span
                        className={`text-sm font-medium ${
                          isSettings ? "text-heading" : "text-gray-dark"
                        }`}
                      >
                        Settings
                      </span>
                    </div>
                  )}
                </span>
                {isSidebarOpen && <SelectArrow isOpen={isSettingTabOpen} />}
              </span>
              <SettingsSideBar
                on={isSettingTabOpen}
                // setOn={toggleIsSettingTabOpen}
                closeSidebar={closeSidebar}
                isSidebarOpen={isSidebarOpen}
                isIntegrations={isIntegrations}
                isPricing={isPricing}
              />
            </li>
          </ul>
          <div
            className={`xl:max-h-[250px] mt-5 md:mt-0 flex-1 pb-20 px-4 lg:py-5 flex flex-col justify-end `}
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
