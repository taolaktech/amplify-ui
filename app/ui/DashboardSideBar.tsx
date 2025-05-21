"use client";

import DashboardLogoIcon from "@/public/dashboard-logo.svg";
import ArrowLeftIcon from "@/public/arrow-left.svg";
import DefaultButton from "./Button";
import {
  Add,
  AddSquare,
  ArrowDown2,
  ArrowUp2,
  Building3,
  CalendarEdit,
  Data2,
  HomeTrendUp,
  LogoutCurve,
  Magicpen,
  MessageQuestion,
} from "iconsax-react";
import XCloseIcon from "@/public/x-close.svg";
import useUIStore from "@/app/lib/stores/uiStore";
import HomeTrendUpGrad from "@/public/home-trend-up.svg";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useEffect, useState } from "react";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardCompanyLinks } from "./DashboardCompanyLinks";

export default function DashboardSideBar() {
  const pathname = usePathname().trim().replace(/\/$/, "");
  const logout = useAuthStore((state) => state.logout);
  const reset = useSetupStore((state) => state.reset);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const { toggleSidebar } = useUIStore((state) => state.actions);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const router = useRouter();
  const isDashboard = pathname === "/dashboard";
  const isInsights = pathname.includes("/dashboard/insights");
  const isCampaigns = pathname.includes("/dashboard/campaigns");
  const isCompany = pathname.includes("/dashboard/company");
  const isSupport = pathname.includes("/dashboard/support");
  const isIntegrations = pathname.includes("/dashboard/integrations");
  const [maxCampaignHeight, setMaxCampaignHeight] = useState(0);

  useEffect(() => {
    const updateMaxHeight = () => {
      const height = typeof window !== "undefined" ? window.innerHeight : 0;

      let maxHeight = 60;

      if (height >= 1000) {
        maxHeight = 280;
      } else if (height >= 800) {
        maxHeight = 210;
      } else if (height >= 700) {
        maxHeight = 140;
      } else if (height >= 600) {
        maxHeight = 90;
      }

      setMaxCampaignHeight(maxHeight);
    };
    console.log("maxCampaignHeight", maxCampaignHeight);

    updateMaxHeight(); // Initial run
    window.addEventListener("resize", updateMaxHeight);

    return () => window.removeEventListener("resize", updateMaxHeight);
  }, []);

  console.log("maxCampaignHeight", maxCampaignHeight);

  const toggleIsCompanyOpen = () => {
    setIsCompanyOpen((prev) => !prev);
  };

  const handleToggleSidebar = () => {
    setIsCompanyOpen(false);
    toggleSidebar();
  };

  const handleLogout = () => {
    logout();
    reset();
    router.replace("/auth/login");
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={handleToggleSidebar}
          className="bg-[rgba(0,0,0,0.5)] xl:hidden fixed top-0 bottom-0 left-0 right-0 z-15"
        />
      )}
      <div
        className={`custom-shadow-sidebar bg-white duration-300 xl:duration-0 ${
          isSidebarOpen
            ? "w-[279px] px-8"
            : "translate-x-[-1000px] xl:translate-x-0 xl:w-[91px] px-5"
        } top-0 fixed h-screen flex flex-col z-20 `}
      >
        <div
          className={`flex items-center ${
            isSidebarOpen ? "justify-between" : "justify-center"
          } h-[81px] py-7`}
        >
          <div className="flex items-center gap-2">
            <DashboardLogoIcon width={32} height={32} />
            <span
              className={`font-medium text-xl ${
                isSidebarOpen ? "inline-block" : "hidden"
              } `}
            >
              My Store
            </span>
          </div>
          {/* {isSidebarOpen && ( */}
          <button
            onClick={handleToggleSidebar}
            className={`hidden xl:flex bg-[#F3EFF6] rounded-full w-[28px] h-[28px] justify-center items-center ${
              !isSidebarOpen ? "absolute right-[-12px] z-10 rotate-180" : ""
            }`}
          >
            <ArrowLeftIcon width={12} height={12} />
          </button>
          <button
            onClick={handleToggleSidebar}
            className={`flex xl:hidden bg-[#F3EFF6] rounded-full w-[28px] h-[28px] justify-center items-center`}
          >
            <XCloseIcon width={12} height={12} />
          </button>
          {/* )} */}
        </div>

        <div className="my-7 h-[48px]">
          {isSidebarOpen && (
            <DefaultButton
              text="Create Campaign"
              height={48}
              showShadow
              hasIconOrLoader
              iconSize={24}
              icon={<Add size="24" color="#ffffff" />}
            />
          )}
          {!isSidebarOpen && (
            <button className="flex items-center justify-center w-full">
              <AddSquare size="36" color="#333" />
            </button>
          )}
        </div>
        <div className={`flex-1 flex flex-col`}>
          <ul className={`flex flex-col gap-2`}>
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center rounded-xl hover:bg-[#Fdfcfd] gap-2 w-full ${
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
                href="/insights"
                className={`flex items-center rounded-xl hover:bg-[#fdfcfd] gap-2 w-full ${
                  isSidebarOpen ? "px-4" : "justify-center"
                } h-[48px] cursor-pointer ${
                  isInsights ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
                }`}
              >
                <span>
                  {!isInsights && <Magicpen size="24" color="#BFBFBF" />}
                  {isInsights && <HomeTrendUpGrad width="24" height="24" />}
                </span>
                {isSidebarOpen && (
                  <span
                    className={`text-sm font-medium ${
                      isInsights ? "text-heading" : "text-gray-dark"
                    }`}
                  >
                    Insights
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                href="/campaigns"
                className={`flex items-center rounded-xl hover:bg-[#fdfcfd] gap-2 w-full ${
                  isSidebarOpen ? "px-4" : "justify-center"
                } h-[48px] cursor-pointer ${
                  isCampaigns ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
                }`}
              >
                <span>
                  {!isCampaigns && <CalendarEdit size="24" color="#BFBFBF" />}
                  {isCampaigns && <HomeTrendUpGrad width="24" height="24" />}
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
            <li onClick={toggleIsCompanyOpen}>
              <span
                // href="/company"
                className={`flex items-center justify-between rounded-xl ${
                  isSidebarOpen ? "px-4" : "justify-center"
                } hover:bg-[#fdfcfd] gap-2 w-full px-4 h-[48px] cursor-pointer ${
                  isCompany ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>
                    {!isCompany && <Building3 size="24" color="#BFBFBF" />}
                    {isCompany && <HomeTrendUpGrad width="24" height="24" />}
                  </span>
                  {isSidebarOpen && (
                    <span
                      className={`text-sm font-medium ${
                        isCompany ? "text-heading" : "text-gray-dark"
                      }`}
                    >
                      Company
                    </span>
                  )}
                </span>
                {!isCompanyOpen && <ArrowDown2 size={20} color="#595959" />}
                {isCompanyOpen && <ArrowUp2 size={20} color="#595959" />}
              </span>
              {isCompanyOpen && (
                <span
                  className={`flex flex-col gap-1 px-5 overflow-y-auto transition-all duration-300`}
                  style={{
                    height: isCompanyOpen ? maxCampaignHeight : 0,
                  }}
                >
                  <DashboardCompanyLinks />
                </span>
              )}
            </li>
            <li>
              <Link
                href="/integrations"
                className={`flex items-center rounded-xl
                ${
                  isSidebarOpen ? "px-4" : "justify-center"
                } hover:bg-[#fdfcfd] gap-2 w-full px-4 h-[48px] cursor-pointer ${
                  isIntegrations ? "bg-[#F3EFF6] hover:bg-[#f3eff6]" : ""
                }`}
              >
                <span>
                  {!isIntegrations && <Data2 size="24" color="#BFBFBF" />}
                  {isIntegrations && <HomeTrendUpGrad width="24" height="24" />}
                </span>
                {isSidebarOpen && (
                  <span
                    className={`text-sm font-medium ${
                      isIntegrations ? "text-heading" : "text-gray-dark"
                    }`}
                  >
                    Integrations
                  </span>
                )}
              </Link>
            </li>
            <li className="">
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
            </li>
          </ul>
          <div
            className={`xl:max-h-[250px] flex-1 pb-10 lg:py-5 flex flex-col justify-end `}
          >
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
