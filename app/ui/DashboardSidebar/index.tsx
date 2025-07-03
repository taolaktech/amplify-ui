"use client";

import { useEffect, useState } from "react";
import useUIStore from "@/app/lib/stores/uiStore";
import { useAuthStore } from "@/app/lib/stores/authStore";
import { useSetupStore } from "@/app/lib/stores/setupStore";
import { useRouter } from "next/navigation";
import { useDashboardPath } from "@/app/lib/hooks/useDashboardPath";
import DesktopSideBar from "./desktop";
import MobileSideBar from "./mobile";

export default function DashboardSideBar() {
  const logout = useAuthStore((state) => state.logout);
  const reset = useSetupStore((state) => state.reset);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const { toggleSidebar } = useUIStore((state) => state.actions);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const router = useRouter();
  const {
    isDashboard,
    isInsights,
    isCampaigns,
    isCompany,
    isSupport,
    isSettings,
    isIntegrations,
  } = useDashboardPath();

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  console.log("isSidebarOpen", isSidebarOpen);

  useEffect(() => {
    console.log("useEffect");
    const handleResize = () => {
      console.log("handleResize");
      setIsSmallScreen(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleIsCompanyOpen = () => {
    setIsCompanyOpen((prev) => !prev);
  };

  const handleToggleSidebar = () => {
    // setIsCompanyOpen(false);
    toggleSidebar();
  };

  const handleLogout = () => {
    logout();
    reset();
    router.replace("/auth/login");
  };

  return (
    <>
      {!isSmallScreen && (
        <DesktopSideBar
          isSidebarOpen={isSidebarOpen}
          handleToggleSidebar={handleToggleSidebar}
          handleLogout={handleLogout}
          isDashboard={isDashboard}
          isInsights={isInsights}
          isCampaigns={isCampaigns}
          isCompany={isCompany}
          isSupport={isSupport}
          isSettings={isSettings}
          // isIntegrations={isIntegrations}
          isCompanyOpen={isCompanyOpen}
          toggleIsCompanyOpen={toggleIsCompanyOpen}
        />
      )}
      {isSmallScreen && (
        <MobileSideBar
          isSidebarOpen={isSidebarOpen}
          handleToggleSidebar={handleToggleSidebar}
          handleLogout={handleLogout}
          isDashboard={isDashboard}
          isInsights={isInsights}
          isCampaigns={isCampaigns}
          isCompany={isCompany}
          isSupport={isSupport}
          isSettings={isSettings}
          isIntegrations={isIntegrations}
          isCompanyOpen={isCompanyOpen}
          toggleIsCompanyOpen={toggleIsCompanyOpen}
        />
      )}
    </>
  );
}
