"use client";

import DashboardLogoIcon from "@/public/dashboard-logo.svg";
import ArrowLeftIcon from "@/public/arrow-left.svg";
import DefaultButton from "../Button";
import BuildingGradient from "@/public/building-gradient.svg";
import {
  Add,
  AddSquare,
  Building3,
  CalendarEdit,
  // Data2,
  HomeTrendUp,
  LogoutCurve,
  // Magicpen,
  // MessageQuestion,
  Setting2,
} from "iconsax-react";
import HomeTrendUpGrad from "@/public/home-trend-up.svg";
// import { DashboardCompanyLinks } from "../DashboardCompanyLinks";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import CalenderEditGrad from "@/public/calendar-edit.svg";
import Feedback from "../Feedback";
import SettingsIcon from "@/public/setting-2.svg";
import { SettingsSideBar } from "../SettingsNav";
import SelectArrow from "../SelectArrow";
import { CompanySideBar } from "../CompanyNav";
type DesktopSideBarProps = {
  isSidebarOpen: boolean;
  handleToggleSidebar: () => void;
  handleLogout: () => void;
  isDashboard: boolean;
  isInsights: boolean;
  isCampaigns: boolean;
  isStoreDetails: boolean;
  isCompany: boolean;
  isSupport: boolean;
  isPricing: boolean;
  isBrandAssets: boolean;
  isIntegrations: boolean;
  isSettings: boolean;
  isSettingTabOpen: boolean;
  isCompanyTabOpen: boolean;
  toggleIsCompanyTabOpen: () => void;
  toggleIsSettingTabOpen: () => void;
  handleCreateCampaign: () => void;
};

export default function DesktopSideBar({
  isSidebarOpen,
  handleToggleSidebar,
  handleLogout,
  isDashboard,
  isCampaigns,
  isStoreDetails,
  isCompanyTabOpen,
  isBrandAssets,
  isCompany,
  isPricing,
  isIntegrations,
  isSettings,
  toggleIsSettingTabOpen,
  isSettingTabOpen,
  handleCreateCampaign,
  toggleIsCompanyTabOpen,
}: DesktopSideBarProps) {
  // const router = useRouter();
  return (
    <>
      <div
        className={`hidden xl:flex custom-shadow-sidebar bg-white ${
          isSidebarOpen ? "w-[279px]" : "w-[91px] "
        } top-0 fixed h-screen flex-col z-20 pb-5`}
      >
        <div
          className={`flex items-center ${
            isSidebarOpen ? "justify-between px-8" : "justify-center px-5"
          } h-[81px] py-7`}
        >
          <Link href="/" className="flex items-center gap-2">
            <DashboardLogoIcon width={32} height={32} />
            <span
              className={`font-medium text-xl ${
                isSidebarOpen ? "inline-block" : "hidden"
              } `}
            >
              My Store
            </span>
          </Link>
          {/* {isSidebarOpen && ( */}
          <button
            onClick={handleToggleSidebar}
            className={`flex bg-[#F3EFF6] rounded-full w-[28px] h-[28px] justify-center items-center ${
              !isSidebarOpen ? "absolute right-[-12px] z-10 rotate-180" : ""
            }`}
          >
            <ArrowLeftIcon width={12} height={12} />
          </button>
        </div>

        <div className={`my-7 h-[48px] ${isSidebarOpen ? "px-8" : "px-5"}`}>
          {isSidebarOpen && (
            <DefaultButton
              text="Create Campaign"
              height={48}
              showShadow
              action={handleCreateCampaign}
              hasIconOrLoader
              iconSize={24}
              icon={<Add size="24" color="#ffffff" />}
            />
          )}
          {!isSidebarOpen && (
            <button
              onClick={handleCreateCampaign}
              className="flex items-center cursor-pointer justify-center w-full"
            >
              <AddSquare size="36" color="#333" />
            </button>
          )}
        </div>
        <div
          className={`flex-1 flex flex-col overflow-y-auto ${
            isSidebarOpen ? "px-8" : "px-5"
          }`}
        >
          <ul className={`flex flex-col gap-2`}>
            <li>
              <Link
                href="/"
                className={`flex items-center rounded-xl hover:bg-[#Fdfcfd] px-2 gap-2 w-full ${
                  isSidebarOpen ? "px-4" : "justify-center"
                } h-[48px] cursor-pointer ${
                  isDashboard ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
                }`}
              >
                <span>
                  {!isDashboard && <HomeTrendUp size="24" color="#BFBFBF" />}
                  {isDashboard && <HomeTrendUpGrad width="24" height="24" />}
                </span>
                {isSidebarOpen && (
                  <span
                    className={`text-sm font-medium ${
                      isDashboard ? "text-heading" : "text-gray-dark"
                    }`}
                  >
                    Dashboard
                  </span>
                )}
              </Link>
            </li>

            <li>
              <Link
                href="/campaigns"
                className={`flex items-center rounded-xl  gap-2 w-full ${
                  isSidebarOpen ? "px-4" : "justify-center"
                } h-[48px] cursor-pointer ${
                  isCampaigns
                    ? "bg-[#F3EFF6] hover:bg-[#f3eff6]"
                    : "hover:bg-[#fdfcfd]"
                }`}
              >
                <span>
                  {!isCampaigns && <CalendarEdit size="24" color="#BFBFBF" />}
                  {isCampaigns && <CalenderEditGrad width="24" height="24" />}
                </span>
                {isSidebarOpen && (
                  <span
                    className={`text-sm font-medium ${
                      isCampaigns ? "text-heading" : "text-gray-dark"
                    }`}
                  >
                    Campaigns
                  </span>
                )}
              </Link>
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
                isSidebarOpen={isSidebarOpen}
                isIntegrations={isIntegrations}
                isPricing={isPricing}
              />
            </li>
            {/* <li className="">
              <Link
                href="/support"
                className={`flex items-center rounded-xl
                ${
                  isSidebarOpen ? "px-4" : "justify-center"
                } hover:bg-[#fdfcfd] gap-2 w-full px-4 h-[48px] cursor-pointer ${
                  isSupport ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
                }`}
              >
                <span>
                  {!isSupport && <MessageQuestion size="24" color="#BFBFBF" />}
                  {isSupport && <HomeTrendUpGrad width="24" height="24" />}
                </span>
                {isSidebarOpen && (
                  <span
                    className={`text-sm font-medium ${
                      isSupport ? "text-heading" : "text-gray-dark"
                    }`}
                  >
                    Support
                  </span>
                )}
              </Link>
            </li> */}
          </ul>
          <div
            className={`flex-1 pb-10 lg:py-5 flex gap-3 flex-col justify-end `}
          >
            <Feedback isSidebarOpen={isSidebarOpen} />
            <button
              onClick={handleLogout}
              className={`h-[48px] w-full flex items-center gap-2 rounded-xl hover:bg-[#Fdfcfd] ${
                isSidebarOpen ? "px-4" : "justify-center"
              } cursor-pointer`}
            >
              <LogoutCurve size="24" color="#FF4949" />
              {isSidebarOpen && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
